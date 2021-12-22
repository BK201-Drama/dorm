'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database();
	db.collection("student").where({
		studentID:event.studentID
	}).update({
		"applyStatus":2
	})
	db.collection("confirmMessage").doc(event.Id).remove();
	//返回数据给客户端
	return event
};
