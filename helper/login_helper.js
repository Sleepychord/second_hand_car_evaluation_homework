db = require('./db.js')
random = require('randomstring')
exports.check = (req, res, next)=>{
    console.log(req.cookies['session_id'])
    if(req.cookies['session_id']){
        db.client.exists([req.cookies['session_id']], (err, data)=>{
            console.log(data)
            if(data == '1')
                next()
            else res.redirect('/login')
            });
    }else{
        res.redirect('/login')
    }
}
exports.createSession = (email, callback)=>{
    var sid = random.generate()
    db.client.set(sid, email, (res)=>{
        db.client.expire([sid, '600'], ()=>{callback(sid)})
    })
}