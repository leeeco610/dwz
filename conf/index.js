/**
 * 配置
 * @type {{webhost: string, db: {host: string, name: string}}}
 */
const config = {
    port: '9999',
    webhost: 'http://dwz.loobool.com/',
    redis: {
        host: "jredis-gz1-prod-redis-3e8glyxyyu.jmiss.jcloud.com",
        port: "6379",
        password: "redis-3e8glyxyyu:Htkj1357",
        db: 13,
        socket_keepalive: false,
        no_ready_check: false
    }
};

module.exports = config;
