/**
 * tinyMarkdown App
 * 极简 Markdown 阅读器
 */

import React, {useState, useEffect, useCallback} from 'react';
import {StatusBar, StyleSheet, View, Text, AppState, TouchableOpacity, ActivityIndicator, Alert, Animated, Platform} from 'react-native';
import {PreviewScreen} from './screens/PreviewScreen';
import {FileOpener} from './utils/FileOpener';
import {isValidMarkdownFile} from './utils/markdownParser';
import type {FileOpenedEvent} from './types';

interface AppData {
  fileUri: string | null;
  fileName: string | null;
  fileSize: number | null;
  content?: string;
}

function App(): React.JSX.Element {
  const [appState, setAppState] = useState<AppData>({
    fileUri: null,
    fileName: null,
    fileSize: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  console.log('[App] App component rendered, appState:', appState);

  // 启动动画
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // 处理文件打开事件
  const handleFileOpened = useCallback((event: FileOpenedEvent) => {
    console.log('[App] File opened event:', event);

    // 验证文件扩展名
    if (!isValidMarkdownFile(event.name)) {
      console.warn('[App] Invalid markdown file:', event.name);
      return;
    }

    console.log('[App] Setting app state with file:', event);
    setAppState({
      fileUri: event.uri,
      fileName: event.name,
      fileSize: event.size,
    });
  }, []);

  // 清除当前文件（返回欢迎界面）
  const clearFile = useCallback(() => {
    setAppState({
      fileUri: null,
      fileName: null,
      fileSize: null,
    });
  }, []);

  // 打开文件选择器
  const handleOpenFile = useCallback(async () => {
    console.log('[App] Open file button pressed');
    try {
      setIsLoading(true);
      console.log('[App] Calling FileOpener.pickDocument...');
      const pickedDoc = await FileOpener.pickDocument();
      console.log('[App] Document picked:', pickedDoc);

      // 验证文件扩展名
      if (!isValidMarkdownFile(pickedDoc.name)) {
        Alert.alert('文件类型错误', '只支持 Markdown 文件');
        setIsLoading(false);
        return;
      }

      // 设置文件信息（使用临时 URI）
      setAppState({
        fileUri: pickedDoc.uri,
        fileName: pickedDoc.name,
        fileSize: pickedDoc.size,
        content: pickedDoc.content,
      });

      setIsLoading(false);
    } catch (error: any) {
      console.log('[App] Error in handleOpenFile:', error);
      setIsLoading(false);
      if (error.message !== '取消选择') {
        console.error('Error opening file:', error);
        Alert.alert('打开失败', error.message || '无法打开文件');
      }
    }
  }, []);

  // 初始化：检查是否有初始文件（应用启动时打开的文件）
  useEffect(() => {
    const checkInitialFile = async () => {
      try {
        console.log('[App] Checking for initial file...');
        const initialFile = await FileOpener.checkInitialFile();
        console.log('[App] Initial file result:', initialFile);
        if (initialFile) {
          handleFileOpened(initialFile);
        }
      } catch (error) {
        console.error('[App] Error checking initial file:', error);
      } finally {
        setIsInitializing(false);

        // 通知原生端React Native已加载完成
        if (Platform.OS === 'ios') {
          const {NativeModules} = require('react-native');
          if (NativeModules.NativeAppEventEmitter) {
            NativeModules.NativeAppEventEmitter.emit('appReady');
          }
        }
      }
    };

    checkInitialFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听应用状态变化（从后台恢复时）
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('[App] App state changed to:', nextAppState);
      if (nextAppState === 'active') {
        // 应用从后台恢复，延迟检查是否有新文件
        setTimeout(async () => {
          try {
            const initialFile = await FileOpener.checkInitialFile();
            console.log('[App] Initial file result on resume:', initialFile);
            if (initialFile) {
              handleFileOpened(initialFile);
            }
          } catch (error) {
            console.error('[App] Error checking initial file on resume:', error);
          }
        }, 1000);
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 显示初始化加载界面
  if (isInitializing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34495E" />
          <Text style={styles.loadingText}>正在启动...</Text>
        </View>
      </View>
    );
  }

  // 显示欢迎界面（没有文件时）
  if (!appState.fileUri) {
    console.log('[App] Rendering welcome screen');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.welcomeContainer, {opacity: fadeAnim}]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>📄</Text>
            <Text style={styles.title}>tinyMarkdown</Text>
          </View>
          <Text style={styles.subtitle}>极简 Markdown 阅读器</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>✨</Text>
              <Text style={styles.infoText}>完美渲染 Markdown</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>纯本地离线</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚡</Text>
              <Text style={styles.infoText}>小巧轻快</Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingButtonText}>正在打开...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.openFileButton}
                onPress={handleOpenFile}
                activeOpacity={0.8}>
                <Text style={styles.openFileButtonText}>📂 打开 Markdown 文件</Text>
              </TouchableOpacity>
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>或在文件 App 中</Text>
                <TouchableOpacity onPress={handleOpenFile}>
                  <Text style={styles.hintLink}>选择打开方式</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by Chao's lab</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  // 显示预览界面（有文件时）
  console.log('[App] Rendering preview screen for file:', appState.fileName);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <PreviewScreen
        fileUri={appState.fileUri}
        fileName={appState.fileName || 'unknown.md'}
        fileSize={appState.fileSize || 0}
        onClose={clearFile}
        content={appState.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    marginBottom: 48,
    fontWeight: '400',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  loadingWrapper: {
    alignItems: 'center',
  },
  loadingButtonText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  openFileButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#34495E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  openFileButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 4,
  },
  hintLink: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  footerText: {
    fontSize: 13,
    color: '#C7C7CC',
    fontWeight: '400',
  },
});

export default App;
