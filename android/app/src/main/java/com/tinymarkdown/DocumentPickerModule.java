package com.tinymarkdown;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.content.ContentResolver;
import android.webkit.MimeTypeMap;
import android.provider.DocumentsContract;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;

/**
 * DocumentPickerModule - 文档选择器模块
 */
@ReactModule(name = "DocumentPickerModule")
public class DocumentPickerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String TAG = "DocumentPickerModule";
    private static final int PICK_DOCUMENT_REQUEST = 1001;

    private ReactApplicationContext reactContext;
    private Promise documentPickerPromise;

    public DocumentPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "DocumentPickerModule";
    }

    /**
     * 打开文档选择器
     */
    @ReactMethod
    public void pickDocument(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist");
            return;
        }

        this.documentPickerPromise = promise;

        try {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);

            // 添加 MIME 类型过滤
            String[] mimeTypes = new String[]{
                "text/markdown",
                "text/x-markdown",
                "text/plain",
                "application/octet-stream"
            };
            intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);

            currentActivity.startActivityForResult(
                Intent.createChooser(intent, "选择 Markdown 文件"),
                PICK_DOCUMENT_REQUEST
            );
        } catch (Exception e) {
            documentPickerPromise.reject("ERROR", "Failed to open document picker", e);
            documentPickerPromise = null;
        }
    }

    /**
     * 处理文档选择结果
     */
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == PICK_DOCUMENT_REQUEST) {
            if (documentPickerPromise != null) {
                if (resultCode == Activity.RESULT_CANCELED) {
                    documentPickerPromise.reject("CANCELLED", "Document picker was cancelled");
                } else if (resultCode == Activity.RESULT_OK && data != null) {
                    Uri uri = data.getData();

                    if (uri != null) {
                        handleSelectedDocument(uri);
                    } else {
                        documentPickerPromise.reject("NO_URI", "No URI returned from document picker");
                    }
                }

                documentPickerPromise = null;
            }
        }
    }

    /**
     * 处理新的Intent（ActivityEventListener接口要求）
     */
    @Override
    public void onNewIntent(Intent intent) {
        // 可以在这里处理新的Intent，如果需要的话
    }

    /**
     * 处理选择的文档
     */
    private void handleSelectedDocument(Uri uri) {
        try {
            Log.d(TAG, "Selected document URI: " + uri);
            Log.d(TAG, "URI scheme: " + uri.getScheme());
            Log.d(TAG, "URI path: " + uri.getPath());

            String name;
            long size;
            String content;

            // 检查是否是BlueStacks文件管理器的URI
            if (uri.toString().startsWith("content://com.bluestacks.filemanager.provider")) {
                Log.d(TAG, "Handling BlueStacks file manager URI");

                String path = uri.getPath();
                Log.d(TAG, "BlueStacks URI path: " + path);

                // 首先尝试从ContentResolver获取真实的显示名称
                name = getFileName(uri);
                Log.d(TAG, "Filename from ContentResolver: " + name);

                // 如果ContentResolver返回的名称没有.md扩展名，尝试从路径提取
                if (name == null || name.isEmpty() || (!name.toLowerCase().endsWith(".md") && !name.toLowerCase().endsWith(".markdown"))) {
                    if (path != null && path.contains("/")) {
                        String extractedName = path.substring(path.lastIndexOf("/") + 1);
                        Log.d(TAG, "Extracted name from path: " + extractedName);

                        // 移除查询参数和特殊字符
                        int queryIndex = extractedName.indexOf("?");
                        if (queryIndex > 0) {
                            extractedName = extractedName.substring(0, queryIndex);
                        }
                        int bracketIndex = extractedName.indexOf("[");
                        if (bracketIndex > 0) {
                            extractedName = extractedName.substring(0, bracketIndex);
                        }

                        // 如果提取的名称没有扩展名，添加.md
                        if (!extractedName.toLowerCase().endsWith(".md") && !extractedName.toLowerCase().endsWith(".markdown")) {
                            extractedName = extractedName + ".md";
                        }

                        name = extractedName;
                    } else {
                        name = "document.md";
                    }
                }

                Log.d(TAG, "Final filename: " + name);

                // 对于BlueStacks共享文件夹，尝试多种方法读取
                content = null;
                size = 0;

                // 方法1：尝试使用ContentResolver读取
                try {
                    Log.d(TAG, "Trying ContentResolver to read file");
                    InputStream inputStream = reactContext.getContentResolver().openInputStream(uri);
                    if (inputStream != null) {
                        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                        StringBuilder contentBuilder = new StringBuilder();
                        String line;
                        while ((line = reader.readLine()) != null) {
                            contentBuilder.append(line).append("\n");
                        }
                        reader.close();
                        inputStream.close();
                        content = contentBuilder.toString();
                        size = content.length();
                        Log.d(TAG, "Successfully read file via ContentResolver, size: " + size);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "ContentResolver failed", e);
                }

                // 如果ContentResolver失败，返回提示信息
                if (content == null || content.isEmpty()) {
                    Log.w(TAG, "Could not read file content, providing placeholder");
                    content = "# " + name + "\n\n无法从文件管理器读取文件内容。\n\n请尝试：\n1. 将文件复制到BlueStacks的/sdcard/Documents/文件夹\n2. 然后通过文件App打开\n\n文件路径：\n" + path;
                    size = content.length();
                }

            } else if ("file".equals(uri.getScheme())) {
                // 处理 file:// URI（直接文件访问）
                Log.d(TAG, "Handling file:// URI");
                String filePath = uri.getPath();
                if (filePath != null) {
                    java.io.File file = new java.io.File(filePath);
                    if (file.exists()) {
                        name = file.getName();
                        size = file.length();
                        try {
                            content = readRawFileContent(file);
                        } catch (Exception e) {
                            Log.e(TAG, "Failed to read file content", e);
                            content = "# " + name + "\n\n无法读取文件内容。\n\n错误: " + e.getMessage();
                            size = content.length();
                        }
                    } else {
                        name = uri.getLastPathSegment();
                        if (name == null || name.isEmpty()) {
                            name = "document.md";
                        }
                        content = "# " + name + "\n\n文件不存在: " + filePath;
                        size = content.length();
                    }
                } else {
                    name = "document.md";
                    content = "# " + name + "\n\n无效的文件路径";
                    size = content.length();
                }
            } else {
                // 标准处理流程（content:// URI）
                Log.d(TAG, "Using standard content:// handling");
                name = getFileName(uri);
                size = getFileSize(uri);
                content = readFileContent(uri);
            }

            WritableMap result = Arguments.createMap();
            result.putString("uri", uri.toString());
            result.putString("name", name);
            result.putDouble("size", (double) size);
            result.putString("content", content);

            Log.d(TAG, "Document handled successfully: " + name + ", size: " + size);
            documentPickerPromise.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error handling selected document", e);
            documentPickerPromise.reject("ERROR", "Failed to handle selected document: " + e.getMessage(), e);
        }
    }

    /**
     * 获取文件名
     */
    private String getFileName(Uri uri) {
        String name = null;

        // 尝试从 ContentResolver 获取
        Cursor cursor = reactContext.getContentResolver().query(
            uri,
            new String[]{OpenableColumns.DISPLAY_NAME},
            null,
            null,
            null
        );

        if (cursor != null && cursor.moveToFirst()) {
            int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            if (nameIndex != -1) {
                name = cursor.getString(nameIndex);
            }
            cursor.close();
        }

        // 如果无法获取，使用 URI 的最后部分
        if (name == null) {
            name = uri.getLastPathSegment();
            if (name != null) {
                // 处理某些情况下路径包含文件名的情况
                int lastSlash = name.lastIndexOf('/');
                if (lastSlash >= 0) {
                    name = name.substring(lastSlash + 1);
                }
            }
        }

        if (name == null || name.isEmpty()) {
            name = "untitled.md";
        }

        return name;
    }

    /**
     * 获取文件大小
     */
    private long getFileSize(Uri uri) {
        long size = 0;

        Cursor cursor = reactContext.getContentResolver().query(
            uri,
            new String[]{OpenableColumns.SIZE},
            null,
            null,
            null
        );

        if (cursor != null && cursor.moveToFirst()) {
            int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);
            if (sizeIndex != -1) {
                size = cursor.getLong(sizeIndex);
            }
            cursor.close();
        }

        return size;
    }

    /**
     * 读取文件内容
     */
    private String readFileContent(Uri uri) throws Exception {
        StringBuilder content = new StringBuilder();

        InputStream inputStream = reactContext.getContentResolver().openInputStream(uri);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));

        String line;
        while ((line = reader.readLine()) != null) {
            content.append(line).append("\n");
        }

        reader.close();
        inputStream.close();

        return content.toString();
    }

    /**
     * 读取文件内容（用于直接文件访问）
     */
    private String readRawFileContent(java.io.File file) throws Exception {
        StringBuilder content = new StringBuilder();

        java.io.FileReader fileReader = new java.io.FileReader(file, java.nio.charset.StandardCharsets.UTF_8);
        BufferedReader reader = new BufferedReader(fileReader);

        String line;
        while ((line = reader.readLine()) != null) {
            content.append(line).append("\n");
        }

        reader.close();
        fileReader.close();

        return content.toString();
    }

    /**
     * 支持的新架构（如果启用）
     */
    @Override
    public void invalidate() {
        super.invalidate();
        reactContext.removeActivityEventListener(this);
    }
}
