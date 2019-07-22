let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");

router.post("/",(req,res,next)=>{
    let {username,password,save} = req.body;
    if(!username || !password)res.send({error:1,mess:"用户名或者密码没传"})
    mgdb({
        collectionName:"user"
    },({collection,client})=>{
        collection.find({username,password},{
            //显示区域
        }).toArray((err,result)=>{
            if(!err){
                if(result.length>0){
                    if(save){
                        console.log("save")
                        
                        req.session["jl_username"] = result[0]._id;
                    }
                    res.send({error:0,mess:"登录成功",data:result});
                }else{
                    res.send({error:1,mess:"账号密码错误"});
                }
            }else{
                res.send({error:1,mess:"库连接失败"})
            }
        })
    })
    
})



module.exports = router;