<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="姓名">
  <uni-easyinput placeholder="请输入姓名号" v-model="formData.name" trim="both" />
</uni-forms-item>
<uni-forms-item name="studentID" label="学号">
  <uni-easyinput placeholder="请输入学号" v-model="formData.studentID" trim="both" />
</uni-forms-item>
<uni-forms-item name="gender" label="性别">
  <uni-data-checkbox v-model="formData.gender" :localdata="formOptions.gender_localdata" />
</uni-forms-item>
<uni-forms-item name="role" label="角色">
  <uni-data-checkbox disabled v-model="formData.role[0]" collection="uni-id-roles" field="role_id as value, role_name as text" />
</uni-forms-item>
<uni-forms-item name="degree" label="年级">
  <uni-easyinput placeholder="请输入年级" v-model="formData.degree" trim="both" />
</uni-forms-item>
<uni-forms-item name="dormBuildingNo" label="宿舍楼">
  <uni-data-picker placeholder="请选择入住的宿舍楼" :localdata="dormArray" v-model ="formData.dormBuildingNo"></uni-data-picker>	
</uni-forms-item>
<uni-forms-item name="dormRoomNo" label="宿舍号">
	<uni-data-picker placeholder="请选择入住的房间" collection="dorm" :where="`dormBuildingNo=='${formData.dormBuildingNo}'`"field="dormRoomNo as value, dormRoomNo as text" v-model ="formData.dormRoomNo" readonly></uni-data-picker>	
</uni-forms-item>
<uni-forms-item name="status" label="用户状态">
  <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata" />
</uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../../js_sdk/validator/student.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'student';

  function getValidator(fields) {
    let reuslt = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        reuslt[key] = validator[key]
      }
    }
    return reuslt
  }

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
	formData: {
	  "name": "",
	  "studentID": "",
	  "dormBuildingNo": "",
	  "gender": 0,
	  "role": ["student"],
	  "degree": "",
	  "dormRoomNo": "",
	  "status": 0,
	  "applyStatus":1
	},
        formOptions: {
  "gender_localdata": [
    {
      "text": "未知",
      "value": 0
    },
    {
      "text": "男",
      "value": 1
    },
    {
      "text": "女",
      "value": 2
    }
  ],
  "status_localdata": [
    {
      "text": "已入住",
      "value": 0
    },
    {
      "text": "离校",
      "value": 1
    }
  ]
},
        rules: {
          ...getValidator(["name","studentID","dormBuildingNo","gender","degree","dormRoomNo","status","role"])
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 触发表单提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.submit().then((res) => {
          this.submitForm(res)
        }).catch((errors) => {
          uni.hideLoading()
        })
      },

    async  submitForm(value) {
        // 使用 clientDB 提交数据
		var that = this;
		value.applyStatus = 1;
		db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '新增成功'
          })
		 //  uniCloud.callFunction({
		 //  	name:'updateDormNumber',
			// data:{
			// 	'dormBuildingNo':that.formData.dormBuildingNo,
			// 	'dormRoomNo':that.formData.dormRoomNo
			// },
			// success: (res) => {
			// 	console.log('调用云函数cloudFunctionName成功',res);
			// 	this.getOpenerEventChannel().emit('refreshData')
			// 	uni.navigateBack()
			// }
		 //  })
		 db.collection("allocateMessage").add(value).then((res)=>{
			 that.getOpenerEventChannel().emit('refreshData')
			 uni.navigateBack()
		 })		 
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  .uni-button {
    width: 184px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 1;
    margin: 0;
  }
</style>
