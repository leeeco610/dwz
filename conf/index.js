/**
 * 配置
 * @type {{webhost: string, db: {host: string, name: string}}}
 */
const config = {
    port: '9999',
    webhost: 'http://dwz.loobool.com/',
    redis: {
        host: "127.0.0.1",
        port: "6379",
        password: "redis-1234567890.",
        db: 1,
        socket_keepalive: false,
        no_ready_check: false
    }
};

module.exports = config;
