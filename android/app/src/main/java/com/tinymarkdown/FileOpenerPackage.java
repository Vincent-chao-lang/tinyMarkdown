package com.tinymarkdown;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * FileOpenerPackage - 注册所有文件相关的原生模块
 */
public class FileOpenerPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FileOpenerModule(reactContext));
        modules.add(new DocumentPickerModule(reactContext));
        modules.add(new FileReaderModule(reactContext));
        return modules;
    }
}
