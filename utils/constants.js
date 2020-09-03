// 座位数量
const SEATS = [1, 2, 3, 4, 5];
const PRICE = [20,30,40,50,55,60,65,70,75,80,85,90,95,100];
// 人找车
const TRIP_TYPES = {
  1: {
    value: 1,
    label: '发车',
    checked: true
  },
  2: {
    value: 2,
    label: '乘车',
    checked: false
  },
  3: {
    value: 3,
    label: '寄货',
    checked: false
  }
};

// 权限
const ROLE_TYPES = {
  0: {
    name: 'WX_USER',
    desc: '微信登录用户'
  },
  1: {
    name: 'USER_ROLE_WITH_NICKNAME',
    desc: '微信授权基础信息用户'
  },
  2: {
    name: 'USER_ROLE_WITH_PHONE',
    desc: '绑定手机号'
  },
  3: {
    name: 'USER_ROLE_WITH_REALNAME',
    desc: '实名'
  },
  4: {
    name: 'USER_ROLE_DRIVER',
    desc: '车主'
  }
};

// 司机审核状态
const DRIVER_AUDIT_STATUS = {
  null: {
    name: 'unaudited',
    desc: '未审核'
  },
  0: {
    name: 'wait',
    desc: '等待审核'
  },
  1: {
    name: 'success',
    desc: '审核成功'
  },
  2: {
    name: 'failed',
    desc: '审核失败'
  }
};

// 周几
const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 排序类型
const SORT_TYPES = [{
    id: 0,
    name: 'AUTO',
    desc: '智能排序'
  },
  {
    id: 1,
    name: 'start_time',
    desc: '出发时间最早'
  },
  {
    id: 2,
    name: 'FROM',
    desc: '距离起点最近'
  }
]

// 地址信息
const LOCATION = {
  name: '名字',
  address: '详细地址',
  latitude: '维度',
  longitude: '经度'
}
const PASSENGER_AREA = [
  {
    name:'人找车'
  },
  {
    name:'车找我'
  }
]
const DRIVER_AREA = [
  {
    name: '发布行程'
  }
]
const CONSIGNOR_AREA = [
  {
    name: '货找车'
  },
  {
    name: '车找我'
  }
]
const HOT_CITY = [{
    code: '',
    province: '福建省',
    city:'厦门市',
    dist:'',
    name: '厦门',
    ename: 'xiamen',
  },
  {
    code: '',
    province: '福建省',
    city: '龙岩市',
    dist: '漳平市',
    name: '漳平',
    ename: 'zhangping',
  },
  {
    code: '',
    province: '福建省',
    city: '泉州市',
    dist: '',
    name: '泉州',
    ename: 'quanzhou',
  },
  {
    code: '',
    province: '福建省',
    city: '福州市',
    dist: '',
    name: '福州',
    ename: 'fuzhou',
  },
  {
    code: '',
    province: '福建省',
    city: '漳州市',
    dist: '',
    name: '漳州',
    ename: 'zhangzhou',
  },
  {
    code: '',
    province: '福建省',
    city: '龙岩市',
    dist: '',
    name: '龙岩',
    ename: 'longyan',
  },
  {
    code: '',
    province: '福建省',
    city: '莆田市',
    dist: '',
    name: '莆田',
    ename: 'putian',
  },
  {
    code: '',
    province: '福建省',
    city: '泉州市',
    dist: '安溪县',
    name: '安溪',
    ename: 'anxi',
  },
  {
    code: '',
    province: '福建省',
    city: '漳州市',
    dist: '龙海市',
    name: '龙海',
    ename: 'longhai',
  }
]

// 核心城市
const CORE_CITY = [{
    code: '361000',
    name: '厦门'
  },
  {
    code: '360000',
    name: '福州'
  },
  {
    code: '',
    name: ''
  },
  {
    code: '',
    name: ''
  },
  {
    code: '',
    name: ''
  },
  {
    code: '',
    name: ''
  },
  {
    code: '',
    name: ''
  }
];

const PAGESIZE = 20;

export {
  SEATS,
  PRICE,
  WEEK,
  TRIP_TYPES,
  SORT_TYPES,
  HOT_CITY,
  CORE_CITY,
  PAGESIZE,
  ROLE_TYPES,
  DRIVER_AUDIT_STATUS,
  PASSENGER_AREA,
  DRIVER_AREA,
  CONSIGNOR_AREA
}
