import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import {FontSize, FONT_SIZES} from '../types';

interface SimpleMarkdownProps {
  content: string;
  fontSize: FontSize;
}

export function SimpleMarkdown({content, fontSize}: SimpleMarkdownProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // 解析 Markdown 并渲染为可选择的内容
  const renderMarkdown = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;
    let inCodeBlock = false;
    let codeLines: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        const listText = listItems.map((item, _index) => `• ${item}`).join('\n');
        elements.push(
          <TextInput
            key={`list-${elements.length}`}
            editable={false}
            multiline={true}
            selectTextOnFocus={false}
            contextMenuHidden={false}
            style={[styles.listContainer, styles.selectableText, {fontSize: FONT_SIZES[fontSize]}]}
            value={listText}
          />
        );
        listItems = [];
      }
      inList = false;
    };

    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        const codeText = codeLines.join('\n');
        elements.push(
          <TextInput
            key={`code-${elements.length}`}
            editable={false}
            multiline={true}
            selectTextOnFocus={false}
            contextMenuHidden={false}
            style={[styles.codeBlock, styles.selectableText, {fontSize: FONT_SIZES[fontSize] * 0.9}]}
            value={codeText}
          />
        );
        codeLines = [];
      }
      inCodeBlock = false;
    };

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();

      // 空行
      if (!trimmedLine) {
        if (inCodeBlock) {
          codeLines.push('');
        } else if (inList) {
          // 列表中的空行结束列表
          flushList();
        }
        return;
      }

      // 代码块 ``` 或缩进
      if (trimmedLine.startsWith('```') || trimmedLine.startsWith('    ')) {
        if (trimmedLine.startsWith('```')) {
          if (inCodeBlock) {
            flushCodeBlock();
          } else {
            inCodeBlock = true;
          }
        } else {
          if (!inCodeBlock) {
            inCodeBlock = true;
          }
          codeLines.push(trimmedLine.replace(/^ {4}/, ''));
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(trimmedLine);
        return;
      }

      // 标题 # ## ### 等
      if (trimmedLine.startsWith('#')) {
        flushList();
        const match = trimmedLine.match(/^(#+)\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].replace(/\*\*([^*]+)\*\*/g, '$1'); // 移除粗体标记
          const headingStyle = [
            styles.heading,
            styles.selectableText,
            level === 1 && styles.heading1,
            level === 2 && styles.heading2,
            level === 3 && styles.heading3,
            level === 4 && styles.heading4,
            level === 5 && styles.heading5,
            level >= 6 && styles.heading6,
            {fontSize: level === 1 ? 32 : level === 2 ? 28 : level === 3 ? 24 : level === 4 ? 20 : level === 5 ? 18 : 16},
          ];
          elements.push(
            <TextInput
              key={`heading-${lineIndex}`}
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={false}
              style={headingStyle}
              value={text}
            />
          );
        }
        return;
      }

      // 图片 ![alt](url)
      const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        flushList();
        const alt = imageMatch[1];
        const url = imageMatch[2];
        console.log('[SimpleMarkdown] Rendering image:', url);

        // 检查是否是 SVG（不支持）
        if (url.toLowerCase().endsWith('.svg')) {
          elements.push(
            <View key={`image-${lineIndex}`} style={styles.imageContainer}>
              <Text style={styles.imageAlt}>{alt || '图片'}</Text>
              <Text style={styles.imageError}>SVG 格式暂不支持</Text>
            </View>
          );
          return;
        }

        elements.push(
          <View key={`image-${lineIndex}`} style={styles.imageContainer}>
            <Image
              source={{uri: url}}
              style={[styles.image, {width: '100%', height: 200}]}
              onLoad={() => {
                // Image loaded successfully
              }}
              onError={(error) => {
                console.log('[SimpleMarkdown] Image error:', url, error.nativeEvent);
                setImageErrors(prev => new Set(prev).add(url));
              }}
            />
            {imageErrors.has(url) && (
              <Text style={styles.imageError}>图片加载失败</Text>
            )}
          </View>
        );
        return;
      }

      // 引用 >
      if (trimmedLine.startsWith('>')) {
        flushList();
        const quoteText = trimmedLine.substring(1).trim();
        elements.push(
          <View key={`quote-${lineIndex}`} style={styles.blockquote}>
            <TextInput
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={false}
              style={[styles.blockquoteText, styles.selectableText, {fontSize: FONT_SIZES[fontSize]}]}
              value={quoteText}
            />
          </View>
        );
        return;
      }

      // 无序列表 - 或 *
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        const listItemText = trimmedLine.substring(1).trim();
        listItems.push(listItemText);
        inList = true;
        return;
      }

      // 有序列表 1.
      if (/^\d+\./.test(trimmedLine)) {
        if (!inList) {
          inList = true;
        }
        const match = trimmedLine.match(/^\d+\.\s+(.+)$/);
        if (match) {
          listItems.push(match[1]);
        }
        return;
      }

      // 普通段落
      flushList();
      // 移除 Markdown 格式标记，保留纯文本
      const plainText = trimmedLine
        .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体
        .replace(/\*([^*]+)\*/g, '$1') // 移除斜体
        .replace(/`([^`]+)`/g, '$1') // 移除代码标记
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // 移除链接，保留文本

      elements.push(
        <TextInput
          key={`para-${lineIndex}`}
          editable={false}
          multiline={true}
          selectTextOnFocus={false}
          contextMenuHidden={false}
          style={[styles.paragraph, styles.selectableText, {fontSize: FONT_SIZES[fontSize]}]}
          value={plainText}
        />
      );
    });

    // 处理最后的列表和代码块
    flushList();
    flushCodeBlock();

    return elements;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderMarkdown()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  selectableText: {
    color: '#333',
    lineHeight: 24,
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
  },
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 28,
  },
  heading3: {
    fontSize: 24,
  },
  heading4: {
    fontSize: 20,
  },
  heading5: {
    fontSize: 18,
  },
  heading6: {
    fontSize: 16,
  },
  paragraph: {
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 24,
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 24,
    marginLeft: 20,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    paddingLeft: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  blockquoteText: {
    color: '#666',
    fontStyle: 'italic',
  },
  codeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    resizeMode: 'contain' as const,
  },
  imageContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  imageAlt: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  imageError: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
