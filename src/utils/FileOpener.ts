/**
 * FileOpener - 原生文件打开模块桥接
 */

import {NativeModules, Platform} from 'react-native';

type FileOpenedEvent = {
  uri: string;
  name: string;
  size: number;
};

type PickedDocument = {
  uri: string;
  name: string;
  size: number;
  content: string;
};

// 获取原生模块
const LINKING_ERROR =
  'The package \'tiny-markdown\' doesn\'t seem to be linked. Make sure: \n\n' +
  Platform.select({ios: '- You have run \'pod install\'\n', default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const FileOpenerModule =
  NativeModules.FileOpenerModule
    ? NativeModules.FileOpenerModule
    : {
        checkInitialFile: () => {
          throw new Error(LINKING_ERROR);
        },
      };

const DocumentPickerModule =
  NativeModules.DocumentPickerModule
    ? NativeModules.DocumentPickerModule
    : {
        pickDocument: () => {
          throw new Error(LINKING_ERROR);
        },
      };

const FileReaderModule =
  NativeModules.MarkdownFileReaderModule
    ? NativeModules.MarkdownFileReaderModule
    : {
        readFile: () => {
          throw new Error(LINKING_ERROR);
        },
      };

// 调试：检查FileReaderModule是否可用
console.log('[FileOpener] NativeModules keys:', Object.keys(NativeModules).slice(0, 20));
console.log('[FileOpener] FileReaderModule:', FileReaderModule);
console.log('[FileOpener] FileReaderModule.readFile:', FileReaderModule?.readFile);

/**
 * FileOpener 类 - 处理文件打开操作
 */
export class FileOpener {
  /**
   * 检查应用启动时是否有初始文件
   */
  static async checkInitialFile(): Promise<FileOpenedEvent | null> {
    try {
      console.log('[FileOpener] checkInitialFile called');
      const result = await FileOpenerModule.checkInitialFile();
      console.log('[FileOpener] checkInitialFile result:', result);
      return result;
    } catch (error) {
      console.error('[FileOpener] Error checking initial file:', error);
      return null;
    }
  }

  /**
   * 打开文档选择器选择文件
   */
  static async pickDocument(): Promise<PickedDocument> {
    try {
      const result = await DocumentPickerModule.pickDocument();
      return result;
    } catch (error: any) {
      if (error.code === 'CANCELLED') {
        throw new Error('取消选择');
      }
      console.error('Error picking document:', error);
      throw error;
    }
  }

  /**
   * 读取文件内容（从 file:// URI）
   */
  static async readFile(fileUri: string): Promise<{uri: string; content: string; size: number}> {
    try {
      console.log('[FileOpener] readFile called with URI:', fileUri);
      const result = await FileReaderModule.readFile(fileUri);
      console.log('[FileOpener] readFile result, content length:', result.content?.length);
      return result;
    } catch (error: any) {
      console.error('[FileOpener] Error reading file:', error);
      throw error;
    }
  }
}

// 默认导出
export default FileOpenerModule;
