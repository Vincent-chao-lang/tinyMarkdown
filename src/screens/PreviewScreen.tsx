import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  Alert,
} from 'react-native';
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
import {SimpleMarkdown} from '../components/SimpleMarkdown';
import {FileOpener} from '../utils/FileOpener';

const FONT_SIZE_KEY = '@tiny_markdown_font_size';

interface PreviewScreenProps {
  fileUri: string;
  fileName: string;
  fileSize: number;
  onClose?: () => void;
  content?: string; // 可选：直接传入的文件内容
}

export function PreviewScreen({
  fileUri,
  fileName,
  fileSize,
  onClose,
  content: initialContent,
}: PreviewScreenProps) {
  const [content, setContent] = useState<string>('');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PreviewError | null>(null);
  const [copied, setCopied] = useState(false);

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
      console.log('[PreviewScreen] loadFileContent called, initialContent:', !!initialContent, 'fileUri:', fileUri);

      // 如果有直接传入的内容，使用它
      if (initialContent) {
        setContent(sanitizeMarkdown(initialContent));
        setLoading(false);
        return;
      }

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
      console.log('[PreviewScreen] Calling FileOpener.readFile with:', fileUri);
      const {content: fileContent} = await FileOpener.readFile(fileUri);
      console.log('[PreviewScreen] File read successfully, content length:', fileContent?.length);
      setContent(sanitizeMarkdown(fileContent));
      setLoading(false);
    } catch (err) {
      console.error('[PreviewScreen] Error loading file:', err);
      setError({
        type: 'read_error',
        message: `无法读取文件: ${err}`,
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

  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setString(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后重置状态
      Alert.alert('复制成功', '全部内容已复制到剪贴板\n\n💡 提示：长按文字可选择部分复制');
    } catch {
      Alert.alert('复制失败', '无法复制内容到剪贴板');
    }
  }, [content]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#34495E" />
          <Text style={styles.loadingText}>正在加载文件...</Text>
          <Text style={styles.loadingSubtext}>请稍候</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.errorIconContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>无法加载文件</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          {onClose && (
            <TouchableOpacity style={styles.errorButton} onPress={onClose}>
              <Text style={styles.errorButtonText}>返回</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.fileNameContainer}>
          <Text
            style={[styles.fileName, !onClose && styles.fileNameNoClose]}
            numberOfLines={1}>
            {fileName}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCopy}>
            <Text style={styles.iconButtonText}>{copied ? '✓' : '📋'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fontSizeButton}
            onPress={changeFontSize}>
            <Text style={styles.fontSizeText}>Aa</Text>
            <Text style={styles.fontSizeLabel}>{FONT_SIZES[fontSize]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Markdown 内容 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <SimpleMarkdown content={content} fontSize={fontSize} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34495E',
  },
  fileNameContainer: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  fileNameNoClose: {
    marginLeft: 44,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 18,
  },
  fontSizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
    color: '#1A1A1A',
  },
  fontSizeLabel: {
    fontSize: 13,
    color: '#8E8E93',
    minWidth: 24,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#8E8E93',
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
