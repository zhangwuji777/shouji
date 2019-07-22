let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");

router.get("/",(req,res,next)=>{
    let _id = req.session["jl_username"];
    if(!_id)res.send({error:1,mess:"未登录"});
    
    mgdb({
        collectionName:"user"
    },({collection,client,ObjectId})=>{
        collection.find({_id:ObjectId(_id)},{
            //显示区域
            projection:{_id:0,password:0}
        }).toArray((err,result)=>{
            if(!err){
                console.log(result)
                if(result.length>0){
                    res.send({error:0,mess:"登录成功",data:result[0]});
                }else{
                    res.send({error:1,mess:"重新登陆"});
                }
            }else{
                res.send({error:1,mess:"库连接失败"})
            }
        })
    })

})


module.exports = router;