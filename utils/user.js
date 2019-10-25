import { Base } from './base.js'

class User extends Base {
  constructor() {
    super()
  }

  update(data) {
    let params = {
      url: '/user/set_info.php',
      data
    };
    return this.ajax(params);
  }

  get() {
    let params = {
      url: '/user/get_info.php'
    };
    return this.ajax(params);
  }
}

export { User }
