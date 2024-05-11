export const enum EnvEnum {
  DEV  = 'DEV',
  PROD = 'PROD',
}

export const ENV = EnvEnum.DEV

export const BACKEND_URL: Record<EnvEnum, String> = {
  [EnvEnum.DEV]:  'http://127.0.0.1:8787',
  [EnvEnum.PROD]: 'https://testing.javoavmystery.workers.dev',
}
