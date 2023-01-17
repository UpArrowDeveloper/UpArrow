/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: [
      'upload.wikimedia.org',
      'uparrow-images.s3.ap-northeast-2.amazonaws.com',
      'pbs.twimg.com',
    ],
  },
};
