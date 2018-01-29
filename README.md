#短网址生成

安装完MongoDB后， 进入设置库（例如：use dwz），执行插入：

db.counters.insert({ _id: 'url_count', seq: 1 })  
