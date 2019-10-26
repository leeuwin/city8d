import {
  Base
} from '../../utils/base.js'

class Realname extends Base {
  constructor() {
    super();
  }

  binding(data = {name: '', idCard: ''}) {
    const params = {
      url: '/user/bind.php',
      data
    }
    return this.ajax(params);
  }
}

export {
  Realname
}
