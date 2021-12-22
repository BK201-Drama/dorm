<template>
	<view >
		<scroll-view style="padding: 20px;box-sizing: border-box;">
			<h1>欢迎进入宿舍信息管理系统!</h1>
			<!-- #ifndef H5 -->
			<fix-window />
			<!-- #endif -->
		</scroll-view>
	</view>
	

	
</template>

<script>
	import { version } from '../../package.json'
	const db = uniCloud.database()
	const dbCmd = db.command
    export default {
        data() {
            return {
				adminVersion: version,
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
		margin-left: 60rpx;
		margin-right: 50rpx;
		font-weight: bolder;
		width:95%;
		height: 1200rpx;
		font-size: medium;
	}
	.txt{
		font-size: 35rpx;
		font-weight: lighter;
		color: #555555;
		font-style: "微软雅黑";
	}
	.ulist{
		margin-top: 20rpx;
		font-size: 30rpx;
		margin-bottom: 5rpx;
	},
	.title_txt{
		margin-top: 20rpx;
		margin-left: 30rpx;
	}
	.button_style{
		height: 80rpx;
		font-size: 40rpx;
	}
	.btn{
		display: flex;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	.modal_btn{
		flex: 1;
		padding-left: 30rpx;
	}
	.title{
		margin-left: 10rpx;
		font-size: 40rpx;
		margin-bottom: 10rpx;
	}
</style>
