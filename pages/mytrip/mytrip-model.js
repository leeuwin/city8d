import { Base } from '../../utils/base'

class Mytrip extends Base {
  constructor() {
    super();
  }

  query(data) {
    const params = {
      url: '/trip/get_my.php',
      data
    }
    return this.ajax(params);
  }
}

export { Mytrip }
