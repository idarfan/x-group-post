module.exports = {
  apps: [
    {
      name: "x-groupbuy-api",
      cwd: "/home/idarfan/x-group-post/backend",
      script: "bundle",
      args: "exec rails server -p 3006 -b 0.0.0.0",
      interpreter: "none",
      env: {
        RAILS_ENV: "development",
        PORT: "3006",
      },
      autorestart: true,
      watch: false,
    },
    {
      name: "x-groupbuy-frontend",
      cwd: "/home/idarfan/x-group-post/frontend",
      script: "npm",
      args: "run dev -- --host --port 5175",
      interpreter: "none",
      env: {
        NODE_ENV: "development",
      },
      autorestart: true,
      watch: false,
    },
  ],
};
