{
  "apps": [
    {
      "name": "triagent-server",
      "script": "dist/index.js",
      "cwd": "./server",
      "instances": 1,
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
