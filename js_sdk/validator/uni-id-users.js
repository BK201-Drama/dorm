
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "username": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "用户名"
  },
  "password_secret_version": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "passwordSecret"
  },
  "nickname": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "昵称"
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
            "text": "禁用",
            "value": 1
          },
          {
            "text": "审核中",
            "value": 2
          },
          {
            "text": "审核拒绝",
            "value": 3
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "用户状态"
  },
  "role": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "角色"
  },
}

const enumConverter = {
  "gender_valuetotext": {
    "0": "未知",
    "1": "男",
    "2": "女"
  },
  "status_valuetotext": {
    "0": "正常",
    "1": "禁用",
    "2": "审核中",
    "3": "审核拒绝"
  },
}

export { validator, enumConverter }
