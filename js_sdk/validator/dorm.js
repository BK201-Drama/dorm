
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "dormBuildingNo": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "宿舍楼号"
  },
  "dormRoomNo": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "宿舍号"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "defaultValue": 0,
    "label": "用户状态"
  },
  "number": {
    "rules": [
      {
        "format": "int"
      },
      {
        "minimum": 0,
        "maximum": 4
      }
    ],
    "defaultValue": "0",
    "label": "入住人数"
  }
}

const enumConverter = {
  "status_valuetotext": {
    "0": "正常",
    "1": "已满",
    "2": "闲置",
    "3": "维修"
  }
}

export { validator, enumConverter }
