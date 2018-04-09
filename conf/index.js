/**
 * 配置
 * @type {{webhost: string, db: {host: string, name: string}}}
 */
const config = {
    port: '8666',
    webhost: 'http://dwz.loobool.com/',
    db: {
        host: '127.0.0.1',
        name: 'dwz'
    },
    redis: {
      host: "jredis-gz1-prod-redis-9ycerxf6f1.jmiss.jcloud.com",
      port: "6379",
      password: "redis-9ycerxf6f1:Loobool2017",
      db: 1,
      socket_keepalive: false,
      no_ready_check: false
    }
};

module.exports = config;
