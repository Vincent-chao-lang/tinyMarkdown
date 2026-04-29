package com.tinymarkdown;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.content.SharedPreferences;
import android.util.Log;

public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected String getMainComponentName() {
        return "TinyMarkdown";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 处理启动时的 Intent
        handleIntent(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
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
                Log.d(TAG, "File opened: " + uri.toString());

                // 获取文件信息
                FileOpenerModule.FileInfo fileInfo =
                        FileOpenerModule.getFileInfo(this, uri);

                // 存储到 SharedPreferences 供 JS 端获取
                SharedPreferences prefs =
                        getSharedPreferences("FileOpener", MODE_PRIVATE);
                prefs.edit()
                        .putString("initialFileUri", uri.toString())
                        .putString("initialFileName", fileInfo.name)
                        .putLong("initialFileSize", fileInfo.size)
                        .apply();

                // 延迟发送事件，确保 React Native 已准备好
                reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

                if (reactContext != null) {
                    sendFileEventToJS(reactContext, uri.toString(), fileInfo.name, fileInfo.size);
                } else {
                    // React Context 还未准备好，等待准备完成
                    getReactNativeHost().getReactInstanceManager().addReactInstanceEventListener(
                            new ReactInstanceEventListener() {
                                @Override
                                public void onReactContextInitialized(ReactContext context) {
                                    // 从 SharedPreferences 重新获取文件信息
                                    SharedPreferences prefs =
                                            getSharedPreferences("FileOpener", MODE_PRIVATE);
                                    String savedUri = prefs.getString("initialFileUri", null);
                                    String savedName = prefs.getString("initialFileName", null);
                                    long savedSize = prefs.getLong("initialFileSize", 0);

                                    if (savedUri != null) {
                                        sendFileEventToJS(context, savedUri, savedName, savedSize);
                                    }

                                    getReactNativeHost().getReactInstanceManager()
                                            .removeReactInstanceEventListener(this);
                                }
                            });
                }
            }
        }
    }

    /**
     * 发送文件事件到 JavaScript
     */
    private void sendFileEventToJS(ReactContext context, String uri, String name, long size) {
        try {
            WritableMap params = context.getNativeModule(WritableMap.class).getArguments().createMap();
            // 使用 Arguments.createMap() 创建
            com.facebook.react.bridge.WritableMap eventParams =
                    com.facebook.react.bridge.Arguments.createMap();
            eventParams.putString("uri", uri);
            eventParams.putString("name", name);
            eventParams.putDouble("size", (double) size);

            context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FileOpened", eventParams);

            Log.d(TAG, "File event sent: " + name);
        } catch (Exception e) {
            Log.e(TAG, "Error sending file event", e);
        }
    }

    // ReactInstanceEventListener 接口
    private interface ReactInstanceEventListener {
        void onReactContextInitialized(ReactContext context);
    }
}
