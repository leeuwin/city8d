import { Base } from '../../utils/base.js'

class Publish extends Base {
  constructor() {
    super();
  }

  createTrip(data) {
    const params = {
      url: '/trip/publish.php',
      data
    }
    return this.ajax(params);
  }
}

export {
  Publish
}
