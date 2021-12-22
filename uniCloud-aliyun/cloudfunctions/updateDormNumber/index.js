'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database();
	const dbCmd = db.command;
	// db.collection("dorm").where(dbCmd.and([
	// 	{
	// 		'dormBuildingNo':event.dormBuildingNo,	
	// 	},
	// 	{
	// 		 'dormRoomNo':event.dormRoomNo
	// 	}
	// ])).update({
	// 			  'number':dbCmd.inc(1)
	//  }).then(res=>{
	// 	console.log("更新成功")
	//  })
	 db.collection("dorm").where(
	 	{
	 		'dormBuildingNo':event.dormBuildingNo,
			'dormRoomNo':event.dormRoomNo
	 	}	 
	 ).update({
	 			  'number':dbCmd.inc(1)
	  }).then(res=>{
	 	console.log("更新成功")
	  })
	
	//返回数据给客户端
	return event
};
