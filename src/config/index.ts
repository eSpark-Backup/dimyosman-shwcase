import { config } from "dotenv";
import { NODE_ENVS } from "../constants";
config();
const getEnv = (key: string) => {
  if (!process.env[key]) throw new Error(`${key} NOT FOUND IN ENV`);
  return process.env[key];
};

export const configs = {
  NODE_ENV: process.env.NODE_ENV ?? NODE_ENVS.DEVELOPMENT,
  PORT: Number(getEnv("PORT")),

  // JWT Configs
  JWT_SECRET_KEY: <string>getEnv("JWT_SECRET"),
  EXPIRES_IN: <string>getEnv("EXPIRES_IN"),
};

// export const email = {
//   host: getEnv("SMTP_HOST"),
//   port: Number(getEnv("SMTP_PORT")),
//   secure: Boolean(getEnv("SMTP_SECURE")),
//   user: getEnv("SMTP_USER"),
//   pass: getEnv("SMTP_PASS"),
//   from: getEnv("SMTP_FROM"),
// };

export const bcryptConfig = {
  salt: Number(getEnv("SALT")),
};

export const CLOUD_CONFIG = {
  apiKey: getEnv("CLOUD_API_KEY"),
  apiSecret: getEnv("CLOUD_SECRET"),
  cloudName: getEnv("CLOUD_NAME"),
};
