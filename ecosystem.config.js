module.exports = {
  apps: [
    {
      name: 'essind-web',
      script: './node_modules/.bin/next',
      args: 'start -p 5002',
      cwd: '/var/www/essindia',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5002,
      }
    }
  ]
};
