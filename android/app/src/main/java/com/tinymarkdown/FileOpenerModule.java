package com.tinymarkdown;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.content.Intent;
import android.net.Uri;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.content.Context;
import android.util.Log;

import java.io.File;

/**
 * FileOpenerModule - 处理系统文件打开事件
 */
@ReactModule(name = "FileOpenerModule")
public class FileOpenerModule extends ReactContextBaseJavaModule {

    private static final String TAG = "FileOpenerModule";
    private static final String EVENT_NAME = "FileOpened";

    private ReactApplicationContext reactContext;

    public FileOpenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FileOpenerModule";
    }

    /**
     * 发送文件打开事件到 JavaScript
     */
    public void sendFileOpenedEvent(String uri, String name, long size) {
        try {
            WritableMap params = Arguments.createMap();
            params.putString("uri", uri);
            params.putString("name", name);
            params.putDouble("size", (double) size);

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(EVENT_NAME, params);

            Log.d(TAG, "File opened event sent: " + name);
        } catch (Exception e) {
            Log.e(TAG, "Error sending file opened event", e);
        }
    }

    /**
     * 检查是否有初始文件（应用启动时）
     */
    @ReactMethod
    public void checkInitialFile(Promise promise) {
        try {
            // 从 SharedPreferences 获取
            android.content.SharedPreferences prefs =
                    reactContext.getSharedPreferences("FileOpener", Context.MODE_PRIVATE);

            String initialUri = prefs.getString("initialFileUri", null);

            if (initialUri != null) {
                String initialName = prefs.getString("initialFileName", null);
                long initialSize = prefs.getLong("initialFileSize", 0);

                // 清除存储
                prefs.edit()
                        .remove("initialFileUri")
                        .remove("initialFileName")
                        .remove("initialFileSize")
                        .apply();

                WritableMap result = Arguments.createMap();
                result.putString("uri", initialUri);
                result.putString("name", initialName);
                result.putDouble("size", (double) initialSize);

                promise.resolve(result);
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
            promise.reject("ERROR", "Error checking initial file", e);
        }
    }

    /**
     * 从 Uri 获取文件信息
     */
    public static FileInfo getFileInfo(Context context, Uri uri) {
        String name = null;
        long size = 0;

        try {
            // 尝试从 ContentResolver 获取文件名和大小
            Cursor cursor = context.getContentResolver().query(
                    uri,
                    null,
                    null,
                    null,
                    null
            );

            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);

                if (nameIndex != -1) {
                    name = cursor.getString(nameIndex);
                }
                if (sizeIndex != -1) {
                    size = cursor.getLong(sizeIndex);
                }

                cursor.close();
            }

            // 如果无法从 Cursor 获取，尝试从 Uri 获取
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

            // 如果获取不到文件名，使用默认名称
            if (name == null || name.isEmpty()) {
                name = "untitled.md";
            }

        } catch (Exception e) {
            Log.e(TAG, "Error getting file info", e);
            name = "untitled.md";
        }

        return new FileInfo(name, size);
    }

    /**
     * 文件信息类
     */
    public static class FileInfo {
        public String name;
        public long size;

        public FileInfo(String name, long size) {
            this.name = name;
            this.size = size;
        }
    }
}
