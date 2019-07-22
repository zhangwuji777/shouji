let express = require("express");
let router = express.Router();
let pathLib = require('path');
let fs = require('fs');
let mgdb = require('../../utils/mgdb')


router.post("/",(req,res,next)=>{
    console.log(req.body)
    let {username,password,nikename} = req.body;

    if(!username || !password )res.send({error:0,mess:"用户名密码为必传参数"});
    nikename = nikename || "dog";

    let follow =0;
    let fans =0;
    let time=Date.now();
    let icon;
    if(!req.files || req.files.length==0){
      icon = require('../../config/path').normal;//     /upload/xx.jpg
    }else{
        //改名
        fs.renameSync(
          req.files[0].path,
          req.files[0].path + pathLib.parse(req.files[0].originalname).ext
        )
        icon = require('../../config/path').user.uploadUrl + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
      }
      mgdb({
        collectionName: 'user'
      }, ({ collection, client, ObjectId }) => {
    
        collection.find({
          username
        }).toArray((err,result)=>{
          // console.log(2,result)
          if(!err){
            if(result.length>0){
              res.send({err:1,mess:'用户名已存在'})
              client.close();
            }else{
              //插入
              collection.insertOne({
                username,password,nikename,time,icon,follow,fans
              },{
                projection:{username:0,password:0}
              },(err,result)=>{
                if(!err){
                  if(result.result.ok>0){
                    res.send({err:0,mess:'注册成功'})
                  }else{
                    res.send({err:1,mess:'注册失败'})
                  }
                }else{
                  res.send({err:1,mess:'库链接错误'})
                }
                client.close();
              })
            }
          }else{
            res.send({err:1,mess:'库链接错误'})
            client.close();
          }
        })
      })
})


module.exports = router;