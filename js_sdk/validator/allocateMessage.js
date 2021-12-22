
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "姓名"
  },
  "studentID": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "学号"
  },
  "dormBuildingNo": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "宿舍楼"
  },
  "gender": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "defaultValue": 0,
    "label": "性别"
  },
  "role": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "角色"
  },
  "degree": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "年级"
  },
  "dormRoomNo": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "宿号"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "已入住",
            "value": 0
          },
          {
            "text": "未入住",
            "value": 1
          },
          {
            "text": "审核中",
            "value": 2
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "用户状态"
  },
  "applyStatus": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "审核中",
            "value": 0
          },
          {
            "text": "审核通过",
            "value": 1
          },
          {
            "text": "审核不通过",
            "value": 2
          },
          {
            "text": "无",
            "value": 3
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "用户状态"
  }
}

const enumConverter = {
  "gender_valuetotext": {
    "0": "未知",
    "1": "男",
    "2": "女"
  },
  "status_valuetotext": {
    "0": "已入住",
    "1": "未入住",
    "2": "审核中"
  },
  "applyStatus_valuetotext": {
    "0": "审核中",
    "1": "审核通过",
    "2": "审核不通过",
    "3": "无"
  }
}

export { validator, enumConverter }
