module.exports = {
  apps: [
    {
      name: 'aws-codedeploy',
      script: 'node index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
