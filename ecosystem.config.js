module.exports = {
  apps : [{
    name   : "freecityhk-mc-dc-bot",
    script: 'run/app.js',
    watch: false,
    watch_delay: 1000,
    ignore_watch : ["node_modules"],
    //exec_mode: "cluster",
    //instances: 2,
    max_memory_restart: "2G",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "./logs/error.log",
    out_file: "./logs/out.log"
  }],
};
