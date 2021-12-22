'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database()
	//event为客户端上传的参数
	
	db.collection("student").where({
		'studentID':event.value.studentID
	}).update({
		"dormBuildingNo":event.value.dormBuildingNo,
		"dormRoomNo":event.value.dormRoomNo,
		"applyStatus":3
	})
	uniCloud.callFunction({
		name:"changeDormNumber",
		data:{
			'lastdormBuildingNo':event.lastdormBuildingNo,
			'lastdormRoomNo':event.lastdormRoomNo,
			'dormBuildingNo':event.value.dormBuildingNo,
			'dormRoomNo':event.value.dormRoomNo
		}
	})	
	db.collection("allocateMessage").doc(event.ID).remove()
	
	//返回数据给客户端
	return event
}
