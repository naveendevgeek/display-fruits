import { createProxyMiddleware } from 'http-proxy-middleware';
import { Application } from 'express';

module.exports = function(app: Application) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws',
      changeOrigin: true,
    })
  );
};
