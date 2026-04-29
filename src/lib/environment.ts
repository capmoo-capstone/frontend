const appEnvironment = String(import.meta.env.VITE_APP_ENV ?? 'development').toLowerCase();

export const isProductionApp = appEnvironment === 'production' || appEnvironment === 'prod';
