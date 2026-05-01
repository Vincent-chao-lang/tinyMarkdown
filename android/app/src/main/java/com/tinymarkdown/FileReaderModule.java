package com.tinymarkdown;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.net.Uri;
import android.util.Log;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.content.ContentResolver;

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * FileReaderModule - 文件读取模块
 */
@ReactModule(name = "MarkdownFileReaderModule")
public class FileReaderModule extends ReactContextBaseJavaModule {

    private static final String TAG = "FileReaderModule";
    private static final long MAX_FILE_SIZE = 1024 * 1024; // 1MB

    private ReactApplicationContext reactContext;

    public FileReaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FileReaderModule";
    }

    /**
     * 读取文件内容
     */
    @ReactMethod
    public void readFile(String fileUri, Promise promise) {
        try {
            Log.d(TAG, "Reading file: " + fileUri);

            Uri uri = Uri.parse(fileUri);
            String content;
            long fileSize;

            // 判断URI类型
            if ("file".equals(uri.getScheme())) {
                // 处理 file:// URI
                Log.d(TAG, "Handling file:// URI");
                String filePath = uri.getPath();
                if (filePath == null) {
                    promise.reject("INVALID_URI", "Invalid file path");
                    return;
                }

                java.io.File file = new java.io.File(filePath);
                if (!file.exists()) {
                    promise.reject("FILE_NOT_FOUND", "File not found: " + filePath);
                    return;
                }

                fileSize = file.length();
                if (fileSize > MAX_FILE_SIZE) {
                    promise.reject("FILE_TOO_LARGE", "File size exceeds 1MB limit");
                    return;
                }

                content = readRawFileContent(file);

            } else {
                // 处理 content:// URI
                Log.d(TAG, "Handling content:// URI");
                fileSize = getFileSize(uri);
                if (fileSize > MAX_FILE_SIZE) {
                    promise.reject("FILE_TOO_LARGE", "File size exceeds 1MB limit");
                    return;
                }

                content = readFileContent(uri);
            }

            WritableMap result = Arguments.createMap();
            result.putString("uri", fileUri);
            result.putString("content", content);
            result.putDouble("size", (double) fileSize);

            Log.d(TAG, "File read successfully, size: " + fileSize);
            promise.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Failed to read file", e);
            promise.reject("READ_ERROR", "Failed to read file: " + e.getMessage(), e);
        }
    }

    /**
     * 获取文件大小
     */
    private long getFileSize(Uri uri) throws Exception {
        Cursor cursor = reactContext.getContentResolver().query(
            uri,
            new String[]{OpenableColumns.SIZE},
            null,
            null,
            null
        );

        long size = 0;
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
     * 读取文件内容（用于 file:// URI）
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
}
