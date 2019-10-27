import { Base } from '../../utils/base.js';

class Phone extends Base {
  constructor() {
    super();
  }

  binding(data) {
    const params = {
      url: '/user/bind_phone.php',
      data
    };
    return this.ajax(params);
  }
}

export { Phone }
