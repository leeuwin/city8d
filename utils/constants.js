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

const HOT_CITY = [{
    code: '341881',
    name: '厦门',
    ename: 'ningguo',
  img_url: 'http://39.100.243.238/image/city/xiamen.jpg'
  },
  {
    code: '330100',
    name: '漳平',
    ename: 'hangzhou',
    img_url: 'http://39.100.243.238/image/city/zhangping.jpg'
  },
  {
    code: '320100',
    name: '泉州',
    ename: 'nanjing',
    img_url: 'http://39.100.243.238/image/city/quanzhou.jpg'
  },
  {
    code: '310100',
    name: '福州',
    ename: 'shanghai',
    img_url: 'http://39.100.243.238/image/city/fuzhou.jpg'
  },
  {
    code: '340100',
    name: '漳州',
    ename: 'hefei',
    img_url: 'http://39.100.243.238/image/city/zhangzhou.jpg'
  },
  {
    code: '340200',
    name: '龙岩',
    ename: 'wuhu',
    img_url: 'http://39.100.243.238/image/city/longyan.jpg'
  }
]

// 核心城市
// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/
const CORE_CITY = [{
    code: '341800',
    name: '宣城市'
  },
  {
    code: '341821',
    name: '郎溪县'
  },
  {
    code: '341822',
    name: '广德县'
  },
  {
    code: '341823',
    name: '泾县'
  },
  {
    code: '341824',
    name: '绩溪县'
  },
  {
    code: '341825',
    name: '旌德县'
  },
  {
    code: '341881',
    name: '宁国市'
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
  DRIVER_AUDIT_STATUS
}
