'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database();
	const dbCmd = db.command;
	
	db.collection("student").where({studentID:event.studentID}).field({dormBuildingNo:true,dormRoomNo:true}).get().then(res=>{
		console.log(res)
	})
	
	return event
};
