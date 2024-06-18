'use strict';

module.exports = ({ strapi }) => {
  // register phase
  strapi.customFields.register({
    name: "slate-ed",
    plugin: "slate-ed",
    type: "json",
  });
};
