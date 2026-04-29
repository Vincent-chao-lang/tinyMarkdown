/**
 * Markdown 解析和文件处理工具
 */

// 文件大小限制：1MB
export const MAX_FILE_SIZE = 1024 * 1024;

/**
 * 检查文件大小是否超过限制
 * @param fileSize 文件大小（字节）
 * @returns 是否超过限制
 */
export function isFileTooLarge(fileSize: number): boolean {
  return fileSize > MAX_FILE_SIZE;
}

/**
 * 获取文件大小的可读格式
 * @param fileSize 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(fileSize: number): string {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  } else if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  } else {
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * 清理 Markdown 内容的基础处理
 * 注意：这里只做基本的清理，实际的 Markdown 渲染由 react-native-markdown-display 处理
 * @param content 原始 Markdown 内容
 * @returns 清理后的内容
 */
export function sanitizeMarkdown(content: string): string {
  return content.trim();
}

/**
 * 验证 Markdown 文件扩展名
 * @param filename 文件名
 * @returns 是否是有效的 Markdown 文件
 */
export function isValidMarkdownFile(filename: string): boolean {
  const lowerName = filename.toLowerCase();
  return lowerName.endsWith('.md') || lowerName.endsWith('.markdown');
}
