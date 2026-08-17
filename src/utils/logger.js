const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta = '') => {
    console.log(`[${getTimestamp()}] ℹ️ [INFO]: ${message}`, meta ? meta : '');
  },
  success: (message, meta = '') => {
    console.log(`[${getTimestamp()}] ✅ [SUCCESS]: ${message}`, meta ? meta : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[${getTimestamp()}] ⚠️ [WARN]: ${message}`, meta ? meta : '');
  },
  error: (message, error = '') => {
    console.error(`[${getTimestamp()}] ❌ [ERROR]: ${message}`, error ? error : '');
  }
};