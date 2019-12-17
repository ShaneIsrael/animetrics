module.exports = {
  apps: [
    {
      name: 'animetrics',
      script: 'src/app.js',
      watch: true,
      env: {
        PORT: 3001,
        NODE_ENV: 'dev',
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: 'prod',
      },
    },
  ],
}
