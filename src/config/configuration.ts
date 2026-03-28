/**
 * This function exports a configuration object with environment variables for a Node.js application,
 * including app name, description, version, and database credentials.
 */
export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    isProduction: Boolean(process.env.APP_IS_PRODUCTION),
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    type: process.env.DB_TYPE,
    ssl: process.env.SSL,
    synchronize: Boolean(process.env.DB_SYNCHRONIZE_ENTITIES),
  },
  payment: {
    chapaSecretKey: process.env.CHAPA_SECRET_KEY,
    chapaVerifyUrl: process.env.CHAPA_SECRET_KEY,
    chapaPayUrl: process.env.CHAPA_PAY_URL
  },

  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtTokenAudeance: process.env.JWT_TOKEN_AUDIENCE,
    jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER,
    jwtAccessTokenTTL: process.env.JWT_ACCESS_TOKEN_TTL,
    jwtRefreshTokenTTL: process.env.JWT_REFRESH_TOKEN_TTL,
  }
});
