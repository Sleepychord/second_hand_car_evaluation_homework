var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
client.on("error", function(error) {
    console.log(error);
});
// client.hmset(['0','name', 'O. Willum', 'a', 'test'], redis.print)
// client.hgetall('0', (err, reply)=>{ console.log(reply)})
// client.lpush('te1', 'dfs', 'dfs1', 'dfs2')
// client.lrange(['te1', '0', '-1'], (err, reply)=>{
//     console.log(reply)
// })
// client.quit()

exports.client = client
