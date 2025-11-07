import 'dotenv/config';

const required = (name: string, val?: string) => {
  if (!val) throw new Error(`Missing required environment variable: ${name}. Please add it to your .env file.`);
  return val;
};

const getValidPort = (portEnv?: string): number => {
  const defaultPort = 8787;
  const port = Number(portEnv ?? defaultPort);
  
  if (isNaN(port) || port < 1 || port > 65535) {
    console.warn(`Invalid PORT value: ${portEnv}. Using default port: ${defaultPort}`);
    return defaultPort;
  }
  
  return port;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: getValidPort(process.env.PORT),
  PLACES_API_KEY: required('PLACES_API_KEY', process.env.PLACES_API_KEY),
  MAPS_EMBED_API_KEY: required('MAPS_EMBED_API_KEY', process.env.MAPS_EMBED_API_KEY),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
};
