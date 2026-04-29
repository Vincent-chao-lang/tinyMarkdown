/**
 * FileOpener - 原生文件打开模块桥接
 */

import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

type FileOpenedEvent = {
  uri: string;
  name: string;
  size: number;
};

type FileOpenedCallback = (file: FileOpenedEvent) => void;

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

// 创建事件发射器
let eventEmitter: NativeEventEmitter | null = null;

try {
  eventEmitter = new NativeEventEmitter(NativeModules.FileOpenerModule);
} catch (error) {
  console.warn('Failed to create FileOpener event emitter:', error);
}

/**
 * FileOpener 类 - 处理文件打开事件
 */
export class FileOpener {
  private listeners: FileOpenedCallback[] = [];
  private subscription: any | null = null;

  /**
   * 检查应用启动时是否有初始文件
   */
  static async checkInitialFile(): Promise<FileOpenedEvent | null> {
    try {
      const result = await FileOpenerModule.checkInitialFile();
      return result;
    } catch (error) {
      console.error('Error checking initial file:', error);
      return null;
    }
  }

  /**
   * 添加文件打开监听器
   */
  addListener(callback: FileOpenedCallback): () => void {
    this.listeners.push(callback);

    // 如果是第一个监听器，设置原生事件监听
    if (this.listeners.length === 1 && eventEmitter) {
      this.subscription = eventEmitter.addListener('FileOpened', (event: FileOpenedEvent) => {
        this.listeners.forEach(listener => {
          try {
            listener(event);
          } catch (error) {
            console.error('Error in file opened listener:', error);
          }
        });
      });
    }

    // 返回取消监听函数
    return () => {
      this.removeListener(callback);
    };
  }

  /**
   * 移除文件打开监听器
   */
  removeListener(callback: FileOpenedCallback): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }

    // 如果没有监听器了，移除原生事件监听
    if (this.listeners.length === 0 && this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners(): void {
    this.listeners = [];

    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

// 导出单例
export const fileOpener = new FileOpener();

// 默认导出
export default FileOpenerModule;
