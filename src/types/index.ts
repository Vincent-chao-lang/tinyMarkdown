/**
 * 类型定义
 */

export interface MarkdownFile {
  uri: string;
  name: string;
  size: number;
  content?: string;
}

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export const FONT_SIZES: Record<FontSize, number> = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
};

export interface PreviewError {
  type: 'file_too_large' | 'read_error' | 'invalid_file';
  message: string;
}

// FileOpener 相关类型
export interface FileOpenedEvent {
  uri: string;
  name: string;
  size: number;
}

export type FileOpenedCallback = (file: FileOpenedEvent) => void;
