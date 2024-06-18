'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('slate-ed')
      .service('myService')
      .getWelcomeMessage();
  },
});
