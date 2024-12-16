export const AUTH_CONFIG = {
    GOOGLE: {
      WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
      OFFLINE_ACCESS: true,
      FORCE_CODE_FOR_REFRESH: true,
    }
  }