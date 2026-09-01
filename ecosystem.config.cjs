// PM2 process config. Run from the project root on the VPS:
//   pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "konsulin",
      script: ".output/server/index.mjs",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: "3001", // 3000 is already taken by the "d3o" app on this VPS
        HOST: "127.0.0.1",
      },
    },
  ],
};
