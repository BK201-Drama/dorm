<template>
	<view>
	<h1 class="title_txt">个人信息</h1>
	<uni-row>
		<uni-col :span="12">
			<view v-if="$hasRole('student')" class="student_body">
				<view class="list">
					<uni-list class="ulist" :border="false">
						<uni-list-item title="姓名"  :showArrow="false"><span class="txt"  slot="footer">{{formatData.name}}</span></uni-list-item>
						<uni-list-item title="学号"  :showArrow="false"><span class="txt" slot="footer">{{formatData.studentID}}</span></uni-list-item>
						<uni-list-item title="性别" :showArrow="false"><span class="txt" slot="footer">{{gender}}</span></uni-list-item>
						<uni-list-item title="年级"  :showArrow="false"><span class="txt" slot="footer">{{formatData.degree}}</span></uni-list-item>
						<uni-list-item title="所住的宿舍楼"  :showArrow="false"><span class="txt" slot="footer">{{formatData.dormBuildingNo}}</span></uni-list-item>
						<uni-list-item title="所住的房间号" :showArrow="false"><span class="txt" slot="footer">{{formatData.dormRoomNo}}</span></uni-list-item>
						<uni-list-item title="当前状态":showArrow="false"><span class="txt" slot="footer">{{status}}</span></uni-list-item>
						<uni-list-item title="申请状态" :showArrow="false"><span class="txt" slot="footer">{{applyStatus}}</span></uni-list-item>
					</uni-list>
				</view>
			</view>
		</uni-col>
		<uni-col :span="9" offset="2">
			<view class="message">
				<h2 class="title_txt">公告</h2>
				<view class="messageBody"></view>
			</view>
			<uni-button class="uni-button button_style" type="primary" @click="visible=true">申请更换宿舍</uni-button>
		</uni-col>
	</uni-row>
		<e-modal :visible="visible" width="30%">
			<view class="title">请选择需要更换的宿舍楼</view>
			<uni-data-picker placeholder="更换的的宿舍楼" :localdata="dormArray" v-model ="dormBuildingNo" class="data-picker"></uni-data-picker>	
			<view class="btn">
				<view class="modal_btn"></view>
				<uni-button class="uni-button modal_btn"  type="primary" size="mini" @click="commit">确定</uni-button>
				<view class="modal_btn"></view>
				<uni-button class="uni-button modal_btn"  type="primary" size="mini" @click="visible=false">取消</uni-button>
				<view class="modal_btn"></view>
			</view>			
		</e-modal>
	</view>
		
</template>

<script>
	const db = uniCloud.database()
	const dbCmd = db.command
    export default {
        data() {
            return {
				dormArray:[
					{
						text:'A',
						value:'A'
					},
					{
						text:'B',
						value:'B'
					},
					{
						text:'C',
						value:'C'
					},
				],
				formatData:{
					name:"",
					studentID:"",
					gender:"",
					degree:"",
					dormBuildingNo:"",
					dormRoomNo:"",
					status:"",
					applyStatus:"",
					lastdormBuildingNo:""
				},
				u_id:"",
				username:'',
				applyStatus:'',
				status:'',
				gender:'',
				visible:false,
				dormBuildingNo:""
			}
        },
        onLoad() {
			var that = this;
			uni.getStorage({
				key:"role",
				success:res=>{
					// console.log(res.data[0])
					if(res.data[0]== "student"){
						uni.getStorage({
							key:"lastUsername",
							success:res=>{
								// console.log(res);
								db.collection("student").where({"studentID":res.data}).get().then(res=>{	
									console.log(res)												
									Object.keys(that.formatData).forEach(key=>{that.formatData[key] = res.result.data[0][key]})
									if(res.result.data[0].applyStatus == 0){
										uni.showToast({
														title: '换宿申请审核中',
														icon: 'none',
														duration:2000
													})
									}
									else if(res.result.data[0].applyStatus == 1){
										uni.showToast({
														title: '换宿申请通过，请联系宿管更换宿舍',
														icon: 'none',
														duration:2000
													})
									}
									else if(res.result.data[0].applyStatus == 2){
										uni.showToast({
														title: '换宿申请不通过,请联系学生工作处',
														icon: 'none',
														duration:2000
													})
									}				
									that.dormBuildingNo = res.result.data[0].dormBuildingNo
									that.u_id =  res.result.data[0]._id
									that.status = that.parseUserStatus(res.result.data[0].status)
									that.applyStatus = that.parseApplyStatus(res.result.data[0].applyStatus) 
									that.gender = res.result.data[0].gender ==0?"未知":res.result.data[0].gender == 1?"男":"女"
									
									
								})
							}
						})
					}	
				}
			})
		},
        methods:{
			parseApplyStatus(status) {
					if (status === 0) {
						return '审核中'
					} else if (status === 1) {
						return '审核通过'
					} else if (status === 2) {
						return '审核不通过'
					}
					else{
						return'无'
					}
				},
				parseUserStatus(status) {
					if (status === 0) {
						return '已入住'
					} else if (status === 1) {
						return '离校'
					}
				},
				commit(){				
					var that = this
					let data = this.formatData			
					this.formatData.lastdormBuildingNo = this.formatData.dormBuildingNo
					this.formatData.dormBuildingNo = this.dormBuildingNo
					this.formatData.applyStatus = 0;
					uni.showLoading({
					  mask: true
					})
					db.collection("confirmMessage").add(this.formatData).then(res=>{
						uni.showToast({
						  icon: 'none',
						  title: '提交申请成功'
						})
					db.collection("student").doc(that.u_id).update({applyStatus:this.formatData.applyStatus}).then(res=>{
						this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() => uni.navigateBack(), 500)
					})	
					}).catch((err) => {
						uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
						})
						}).finally(() => {
						uni.hideLoading()
						that.visible = false
						})
					}
				}		
		}
</script>

<style style="less">
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}
	/* #endif */
	.student_body{
		border:#e8e8e8 solid 5rpx;
		border-radius: 20rpx;
		border-left: 0rpx;
		margin-top: 20rpx;
		font-weight: bolder;
		height: 1300rpx;
		font-size: medium;
		padding: 10rpx;
	}
	.txt{
		font-size: 35rpx;
		font-weight: lighter;
		color: #555555;
		font-style: "微软雅黑";
	}
	.list{
		border-bottom: #c8c7cc solid 3rpx;
	}
	.ulist{
		font-size: 30rpx;
		margin-bottom: 5rpx;

	},
	.title_txt{
		padding-top: 10rpx;
		margin-top: 20rpx;
		margin-left: 30rpx;
	}
	.button_style{
		margin-top: 20rpx;
		height: 80rpx;
		font-size: 40rpx;
	}
	.btn{
		display: flex;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}
	.modal_btn{
		flex: 1;
		padding-left: 30rpx;
	}
	.title{
		margin-left: 10rpx;
		font-size: 40rpx;
		margin-bottom: 10rpx;
		margin-top: 20rpx;
	}
	.message{
		margin-top: 20rpx;
	}
	.messageBody{
		margin-top: 10rpx;
		padding: 20rpx;
		height: 500rpx;
		border:#e8e8e8 solid 5rpx;
		border-radius: 20rpx;
	}
</style>
