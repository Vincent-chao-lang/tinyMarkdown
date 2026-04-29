import React, {useState, useEffect, useCallback} from 'react';
import {StatusBar, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PreviewScreen} from './screens/PreviewScreen';
import {fileOpener} from './utils/FileOpener';
import {isValidMarkdownFile} from './utils/markdownParser';
import type {FileOpenedEvent} from './types';

interface AppState {
  fileUri: string | null;
  fileName: string | null;
  fileSize: number | null;
}

function App(): React.JSX.Element {
  const [appState, setAppState] = useState<AppState>({
    fileUri: null,
    fileName: null,
    fileSize: null,
  });

  // 处理文件打开事件
  const handleFileOpened = useCallback((event: FileOpenedEvent) => {
    console.log('File opened:', event);

    // 验证文件扩展名
    if (!isValidMarkdownFile(event.name)) {
      console.warn('Invalid markdown file:', event.name);
      return;
    }

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

  // 初始化：检查是否有初始文件（应用启动时打开的文件）
  useEffect(() => {
    const checkInitialFile = async () => {
      try {
        const initialFile = await fileOpener.checkInitialFile();
        if (initialFile) {
          handleFileOpened(initialFile);
        }
      } catch (error) {
        console.error('Error checking initial file:', error);
      }
    };

    checkInitialFile();
  }, [handleFileOpened]);

  // 监听文件打开事件
  useEffect(() => {
    const unsubscribe = fileOpener.addListener(handleFileOpened);

    return () => {
      unsubscribe();
    };
  }, [handleFileOpened]);

  // 显示欢迎界面（没有文件时）
  if (!appState.fileUri) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>tinyMarkdown</Text>
            <Text style={styles.subtitle}>极简 Markdown 阅读器</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>📄 支持打开 .md 文件</Text>
              <Text style={styles.infoText}>📏 文件限制 1MB</Text>
              <Text style={styles.infoText}>🔒 纯本地离线</Text>
            </View>
            <Text style={styles.hintText}>
              在文件 App 中点击 .md 文件即可打开
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 显示预览界面（有文件时）
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PreviewScreen
        fileUri={appState.fileUri}
        fileName={appState.fileName || 'unknown.md'}
        fileSize={appState.fileSize || 0}
        onClose={clearFile}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'left',
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default App;
