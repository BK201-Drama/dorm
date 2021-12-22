<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="姓名">
  <uni-easyinput placeholder="请输入姓名号" v-model="formData.name" trim="both" disabled/>
</uni-forms-item>
<uni-forms-item name="studentID" label="学号">
  <uni-easyinput placeholder="请输入学号" v-model="formData.studentID" trim="both" disabled/>
</uni-forms-item>
<uni-forms-item name="gender" label="性别">
  <uni-data-checkbox v-model="formData.gender" :localdata="formOptions.gender_localdata" disabled/>
</uni-forms-item>
<uni-forms-item name="role" label="角色">
  <uni-data-checkbox v-model="formData.role[0]" collection="uni-id-roles" field="role_id as value, role_name as text" disabled/>
</uni-forms-item>
<uni-forms-item name="degree" label="年级">
  <uni-easyinput placeholder="请输入年级" v-model="formData.degree" trim="both" disabled />
</uni-forms-item>
<uni-forms-item name="dormBuildingNo" label="宿舍楼">
  <uni-data-picker  placeholder="请选择入住的宿舍楼" :localdata="dormArray" v-model ="formData.dormBuildingNo" readonly></uni-data-picker>	
</uni-forms-item>
<uni-forms-item name="dormRoomNo" label="房间号">
	<uni-data-picker placeholder="请选择入住的房间":preload="true" collection="dorm" :where="`dormBuildingNo=='${formData.dormBuildingNo}' && status ==0`"field="dormRoomNo as value, dormRoomNo as text" v-model ="formData.dormRoomNo" ></uni-data-picker>
</uni-forms-item>
<uni-forms-item name="status" label="用户状态">
  <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata" disabled/>
</uni-forms-item>
<uni-forms-item name="applyStatus" label="申请状态">
  <uni-data-checkbox v-model="formData.applyStatus" :localdata="formOptions.applyStatus_localdata"/>
</uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">确认</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../../js_sdk/validator/allocateMessage.js';

  const db = uniCloud.database();
  const dbCollectionName = 'allocateMessage';

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
		  lastdormBuildingNo:'',
		  lastdormRoomNo:'',
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
		"applyStatus": 3
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
  ],
  "applyStatus_localdata": [
    {
      "text": "通过",
      "value": 3
    }
  ]
},
        rules: {
          ...getValidator(["name","studentID","dormBuildingNo","gender","degree","dormRoomNo","status","applyStatus","role"])
        }
      }
    },
    onLoad(e) {
      const id = e.id
      this.formDataId = id
      this.getDetail(id)
	  
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 触发表单提交
       */
	  navigateTo(url, clear) { // clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
	  	uni.navigateTo({
	  		url,
	  		events: {
	  			refreshData: () => {
	  				this.loadData(clear)
	  			}
	  		}
	  	})
	  }, 
      submit() {
		if(this.formData.applyStatus == 3){
			uni.showLoading({
			  mask: true
			})		
			this.$refs.form.submit().then((res) => {
			  this.submitForm(res)
			}).catch((errors) => {
			  uni.hideLoading()
			})
		}
		else{
			uni.showToast({
				title:"请修改学生申请状态为通过",
				duration:500
			})
		}
		
       
      },

      submitForm(value) {
        // 使用 clientDB 提交数据
		var that = this;
		const data = db.collection("student").where({studentID:value.studentID}).field({dormBuildingNo:true,dormRoomNo:true}).get().then(res=>{
			that.lastdormBuildingNo = res.result.data[0].dormBuildingNo
			that.lastdormRoomNo = res.result.data[0].dormRoomNo
			console.log(that.lastdormBuildingNo);
			console.log(that.lastdormRoomNo);
			uniCloud.callFunction({
				name:"allocateMessage",
				data:{
					value:value,
					ID:this.formDataId,
					'lastdormBuildingNo':that.lastdormBuildingNo,
					'lastdormRoomNo':that.lastdormRoomNo
				},
				success: (res) => {
					uni.showToast({
					  icon: 'none',
					  title: '新增成功',
					  duration:2000
					})
					console.log('调用云函数cloudFunctionName成功',res)	
					that.navigateTo("./allocateMessage",true)
				}
			})
		}).finally(()=>{
			uni.hideLoading();			
		})
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
          }
		  this.formData.role = ["student"]
		  this.lastdormBuildingNo = data.dormBuildingNo;
		  this.lastdormRoomNo = data.dormRoomNo
		  this.formData.status = 0
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
