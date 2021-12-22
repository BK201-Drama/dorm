const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async addStudent() {
		const {
			studentID,
			password,
			name,
			role,
			degree,
			dormBuildingNo,
			dormRoomNo,
			status,
			gender
		} = this.ctx.data

		const result = await this.ctx.uniID.register({
			studentID,
			password,
			name,
			role,
			degree,
			dormBuildingNo,
			dormRoomNo,
			status
			gender
		})
		delete result.token
		delete result.tokenExpired

		return result
	}
	
	async resetPwd() {
		const {
			uid,
			password
		} = this.ctx.data
	
		const result = await this.ctx.uniID.resetPwd({
			uid,
			password
		})

		return result
	}
}