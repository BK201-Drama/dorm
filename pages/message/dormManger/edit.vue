<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="姓名">
  <uni-easyinput placeholder="请输入姓名" v-model="formData.name" trim="both" />
</uni-forms-item>
<uni-forms-item name="dormMangerID" label="楼管编号">
  <uni-easyinput disabled placeholder="请输入楼管编号" v-model="formData.dormMangerID" trim="both" />
</uni-forms-item>
<uni-forms-item name="gender" label="性别">
  <uni-data-checkbox v-model="formData.gender" :localdata="formOptions.gender_localdata" />
</uni-forms-item>
<uni-forms-item name="role" label="角色">
  <uni-data-checkbox disabled v-model="formData.role[0]" collection="uni-id-roles" field="role_id as value, role_name as text" />
</uni-forms-item>
<uni-forms-item name="mobile" label="手机号码">
  <uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
</uni-forms-item>
<uni-forms-item name="dormBuildingNo" label="管理的宿舍楼">
	<uni-data-picker placeholder="请选择管理的宿舍楼" :localdata="dormArray" v-model ="formData.dormBuildingNo"></uni-data-picker>		
</uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../../js_sdk/validator/dormManger.js';

  const db = uniCloud.database();
  const dbCollectionName = 'dormManger';

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
		  "dormMangerID": "",
		  "gender": 0,
		  "role": ["dormManger"],
		  "mobile": "",
		  "dormBuildingNo": ""
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
		]
	},
        rules: {
          ...getValidator(["name","dormMangerID","gender","mobile","dormBuildingNo","role"])
        }
      }
    },
    onLoad(e) {
	 console.log(e.id)
     const id = e.id
	 this.formDataId = id	
	 this.getDetail(id) 
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
		bindPickerChange(e){
			console.log(this.formData.dormBuildingNo);
		},
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

      submitForm(value) {
        // 使用 clientDB 提交数据
		console.log(value)
        db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateTo({url:"./list"}), 1000)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
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
