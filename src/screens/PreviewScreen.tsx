import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FontSize,
  FONT_SIZES,
  PreviewError,
} from '../types';
import {
  isFileTooLarge,
  formatFileSize,
  sanitizeMarkdown,
} from '../utils/markdownParser';

const FONT_SIZE_KEY = '@tiny_markdown_font_size';

interface PreviewScreenProps {
  fileUri: string;
  fileName: string;
  fileSize: number;
  onClose?: () => void;
}

export function PreviewScreen({
  fileUri,
  fileName,
  fileSize,
  onClose,
}: PreviewScreenProps) {
  const [content, setContent] = useState<string>('');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PreviewError | null>(null);

  // 加载字体大小设置
  useEffect(() => {
    AsyncStorage.getItem(FONT_SIZE_KEY).then(savedSize => {
      if (savedSize && isValidFontSize(savedSize)) {
        setFontSize(savedSize as FontSize);
      }
    });
  }, []);

  // 读取文件内容
  useEffect(() => {
    loadFileContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUri]);

  const loadFileContent = async () => {
    try {
      // 检查文件大小
      if (isFileTooLarge(fileSize)) {
        setError({
          type: 'file_too_large',
          message: `文件过大，无法预览\n(${formatFileSize(fileSize)} > 1MB)`,
        });
        setLoading(false);
        return;
      }

      // 读取文件内容
      const response = await fetch(fileUri);
      const text = await response.text();
      setContent(sanitizeMarkdown(text));
      setLoading(false);
    } catch (err) {
      setError({
        type: 'read_error',
        message: '无法读取文件',
      });
      setLoading(false);
    }
  };

  const isValidFontSize = (size: string): boolean => {
    return ['small', 'medium', 'large', 'xlarge'].includes(size);
  };

  const changeFontSize = useCallback(async () => {
    const sizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];

    setFontSize(nextSize);
    await AsyncStorage.setItem(FONT_SIZE_KEY, nextSize);
  }, [fontSize]);

  // Markdown 样式配置
  const markdownStyles = StyleSheet.create({
    body: {
      fontSize: FONT_SIZES[fontSize],
      lineHeight: FONT_SIZES[fontSize] * 1.6,
      color: '#333',
    },
    heading1: {
      fontSize: FONT_SIZES[fontSize] * 1.8,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: '#000',
    },
    heading2: {
      fontSize: FONT_SIZES[fontSize] * 1.5,
      fontWeight: 'bold',
      marginTop: 14,
      marginBottom: 7,
      color: '#000',
    },
    heading3: {
      fontSize: FONT_SIZES[fontSize] * 1.3,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 6,
      color: '#000',
    },
    heading4: {
      fontSize: FONT_SIZES[fontSize] * 1.15,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: '#000',
    },
    heading5: {
      fontSize: FONT_SIZES[fontSize] * 1.1,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
      color: '#000',
    },
    heading6: {
      fontSize: FONT_SIZES[fontSize],
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
      color: '#666',
    },
    strong: {
      fontWeight: 'bold',
      color: '#000',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: '#0066cc',
      textDecorationLine: 'underline',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#ddd',
      paddingLeft: 12,
      marginLeft: 0,
      marginTop: 8,
      marginBottom: 8,
      color: '#666',
    },
    code_inline: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: FONT_SIZES[fontSize] * 0.9,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
    },
    code_block: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: FONT_SIZES[fontSize] * 0.9,
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 6,
      marginVertical: 8,
      overflow: 'hidden',
    },
    fence: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: FONT_SIZES[fontSize] * 0.9,
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 6,
      marginVertical: 8,
    },
    hr: {
      backgroundColor: '#ddd',
      height: 1,
      marginVertical: 12,
    },
    list_item: {
      marginTop: 4,
      marginBottom: 4,
    },
    bullet_list: {
      marginLeft: 20,
    },
    ordered_list: {
      marginLeft: 20,
    },
    table: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      marginVertical: 8,
    },
    th: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
    },
    td: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
    },
    paragraph: {
      marginTop: 8,
      marginBottom: 8,
    },
    softbreak: {
      width: '100%',
      height: 0,
    },
    hardbreak: {
      width: '100%',
      height: 8,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
        <Text
          style={[styles.fileName, !onClose && styles.fileNameNoClose]}
          numberOfLines={1}>
          {fileName}
        </Text>
        <TouchableOpacity
          style={styles.fontSizeButton}
          onPress={changeFontSize}>
          <Text style={styles.fontSizeText}>Aa</Text>
          <Text style={styles.fontSizeLabel}>{FONT_SIZES[fontSize]}</Text>
        </TouchableOpacity>
      </View>

      {/* Markdown 内容 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
    marginRight: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  fileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  fileNameNoClose: {
    marginLeft: 0,
  },
  fontSizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  fontSizeLabel: {
    fontSize: 12,
    color: '#666',
    minWidth: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
