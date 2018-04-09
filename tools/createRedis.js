/**
 * Created by lihaipeng on 2017/11/30.
 * 封装redis的操作
 */
const redis = require("redis");
const conf = require('../conf');

class RDS {
    constructor(opts = {}) {
        this.options = Object.assign({}, conf.redis, opts);
        this.init();
    }

    createClient() { // 创建redis实例
        return redis.createClient(this.options);
    }

    init() { // 初始化
        const client = this.createClient();
        client.get('_seq', (err, result) => {
            console.log(`redis中_seq值为 --> `, result);
            if (err || !result) { // 如果出错或不存在该key，则设置
                this.set('_seq', 0);
            }
            client.quit();
        });
    }

    seqIncr() { // _seq自增
        const client = this.createClient();
        return new Promise((resolve, reject) => {
            client.incr('_seq', (err, seq) => {
              if (err) {
                reject(err);
              } else {
                resolve(seq);
                client.quit();
              }
            });
        });
    }

    get(key) {
        let client, self = this;
        return new Promise((resolve, reject) => {
            try {
                client = self.createClient();
                client.get(key, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result);
                    }
                });
            } catch (e) {
                reject(e);
            } finally {
                client && typeof client === 'function' ? client.quit() : "";
            }
        });
    }

    set(key, value, sec) { // sec  缓存时间sec秒
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        const client = this.createClient();
        if (parseInt(sec, 10) > 0) {
            client.set(key, value, 'EX', parseInt(sec, 10));
        } else {
            client.set(key, value);
        }
        client.quit();
    }

    del(key) {
        const client = this.createClient();
        return new Promise((resolve, reject) => {
            client.del(key, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
                client.quit();
            });
        });
    }
}

module.exports = new RDS();
