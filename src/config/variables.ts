export enum EnvEnum {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION  = 'PRODUCTION',
};

export const env = EnvEnum.DEVELOPMENT as EnvEnum

export const base_storage_url = env == EnvEnum.DEVELOPMENT
  ? 'http://127.0.0.1:9199'
  : 'https://firebasestorage.googleapis.com'
