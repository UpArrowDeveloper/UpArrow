module.exports = {
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  oauthClientId: process.env.GOOGLE_CLIENT_ID,
  oauthClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleOAuthRedirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
  bucketName: process.env.BUCKET_NAME,
  jwtTokenSecretKey: process.env.JWT_TOKEN_SECRET_KEY,
};
