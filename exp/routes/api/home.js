let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");


router.get("/",(req,res,next)=>{
    let {_page,_limit,q,_sort,id} = req.query

    if(id){
        getById(res,id)
    }else{
        mgdb({
            dbName: 'shouji',
            collectionName: 'home'
          }, ({ collection, client, ObjectId }) => {
            collection.find(
              q ? {title: eval('/' + q +'/g') } : {}  
            ,{
              skip: _page * _limit,
              limit: _limit,
              sort: { [_sort]: -1 },
              projection:{}
            }).toArray((err,result)=>{
               //console.log(result)
                res.send({err:0, mess:'成功', data:result})
              client.close();
              
            })
          })
    }
})

router.get("/:id",(req,res,next)=>{
    console.log(3,req.params);
    let id = req.params.id
    if(!id) res.send({err:1,mess:'ID为必传参数'});
    //执行函数
    getById(res,id)
})

function getById(res,id){
   console.log("lianjie")
   mgdb({
    dbName: 'shouji',
    collectionName: 'home'
  }, ({ collection, client, ObjectId }) => {
    collection.find({
      _id:ObjectId(id)
    },{
      projection:{_id:0}
    }).toArray((err,result)=>{
      if(!err){
        if(result.length>0){
           
          res.send({err:0, mess:'成功', data:result[0]})
        }else{
          res.send({err:1,mess:'数据不存在'})
        }
        client.close();
      }else{
        
        res.send({err:1,mess:'库链接错误'})
        client.close();
      }
      
    })
  })
}


module.exports = router;