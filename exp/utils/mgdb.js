let MongoClient  = require('mongodb').MongoClient;//链接对象
let ObjectId  = require('mongodb').ObjectID;
module.exports = ({url,dbName,collectionName},callback)=>{
	url = url || "mongodb://localhost:27017";
	dbName = dbName || "shouji";
	collectionName = collectionName || "user";

	MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
		if(err){
			 console.log('库链接错误');
		}else{
			const db = client.db(dbName);//db ==collectionsName 1903库
    		let collection = db.collection(collectionName);//collection==user集合（表) 
    		callback({collection,client,ObjectId});
		}
	});
}