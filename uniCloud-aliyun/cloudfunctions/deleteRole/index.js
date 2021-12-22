'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database();
	db.collection("uni-id-users").where({
		'username':event.username
	}).remove().then(res=>{
		console.log("删除成功")
	})
	//返回数据给客户端
	return event
};
