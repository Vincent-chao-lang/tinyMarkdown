package com.tinymarkdown;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.content.SharedPreferences;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * MainActivity - 主活动，处理文件打开和系统关联
 */
public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    /**
     * 返回主组件名称
     */
    @Override
    protected String getMainComponentName() {
        return "tinyMarkdown";
    }

    /**
     * 处理新的 Intent（文件打开）
     */
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    /**
     * 处理应用启动时的 Intent
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    /**
     * 处理文件打开 Intent
     */
    private void handleIntent(Intent intent) {
        if (intent == null || intent.getAction() == null) {
            return;
        }

        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            if (uri != null) {
                handleFileUri(uri);
            }
        }
    }

    /**
     * 处理文件 URI
     */
    private void handleFileUri(Uri uri) {
        // 获取文件信息
        FileOpenerModule.FileInfo fileInfo = FileOpenerModule.getFileInfo(this, uri);

        // 存储到 SharedPreferences
        SharedPreferences prefs = getSharedPreferences("FileOpener", MODE_PRIVATE);
        prefs.edit()
                .putString("initialFileUri", uri.toString())
                .putString("initialFileName", fileInfo.name)
                .putLong("initialFileSize", fileInfo.size)
                .apply();

        android.util.Log.d(TAG, "File URI stored: " + uri + ", Name: " + fileInfo.name + ", Size: " + fileInfo.size);

        // 注意：不在MainActivity中直接发送事件到JS
        // 而是让React Native端通过FileOpenerModule主动查询
    }
}
