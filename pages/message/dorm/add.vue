<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="dormBuildingNo" label="宿舍楼号" required>
		<uni-data-picker placeholder="请选择房间的宿舍楼" :localdata="dormArray" v-model ="formData.dormBuildingNo"></uni-data-picker>		
	</uni-forms-item>
	<uni-forms-item name="dormRoomNo" label="宿舍号" required>
	  <uni-easyinput placeholder="请输入宿舍号" v-model="formData.dormRoomNo" trim="both" />
	</uni-forms-item>
	<uni-forms-item name="status" label="用户状态">
	  <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata" />
	</uni-forms-item>
	<uni-forms-item name="number" label="入住人数">
	  <uni-easyinput placeholder="每个宿舍入住的人数" type="number" v-model="formData.number" />
	</uni-forms-item>
		  <view class="uni-button-group">
			<button type="primary" class="uni-button" @click="submit">提交</button>
		  </view>
	</uni-forms>
</view>
</template>

<script>
  import { validator } from '../../../js_sdk/validator/dorm.js';

  const db = uniCloud.database();
  const dbCollectionName = 'dorm';

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
  "dormBuildingNo": "",
  "dormRoomNo": "",
  "status": 0,
  "number": "0"
},
        formOptions: {
	  "status_localdata": [
		{
		  "text": "正常",
		  "value": 0
		},
		{
		  "text": "已满",
		  "value": 1
		},
		{
		  "text": "闲置",
		  "value": 2
		},
		{
		  "text": "维修",
		  "value": 3
		}
	  ]
	},
     rules: {
          ...getValidator(["dormBuildingNo","dormRoomNo","status","number"])
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

      submitForm(value) {
        // 使用 clientDB 提交数据
        db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
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
