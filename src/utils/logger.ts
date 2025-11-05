/**
 * Logger utility for consistent logging across the application
 */
class Logger {
  static log(message: string, data?: any) {
    if (__DEV__) {
      console.log(`[LOG] ${message}`, data || '');
    }
  }

  static error(message: string, error?: any) {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }

  static info(message: string, data?: any) {
    if (__DEV__) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any) {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
}

export default Logger;