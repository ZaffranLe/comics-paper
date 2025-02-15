module.exports = {
  apps: [
    {
      name: 'comics_paper',
      script: 'npm',
      args: 'run build',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
