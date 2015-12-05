'use strict';

require('rootpath')();

var app      = require('server/server'),
    log      = require('debug')('log'),
    _        = require('lodash');

module.exports = function(Model, options) {
  Model.beforeRemote('create', function(context, model, next){
    var instance = context.req.body;
    instance.status  = 'active';
    next();
  });

  Model.afterRemote('create', function(context, model, next){
    var RoleMapping = app.models.RoleMapping;

    // Create rolemapping
    RoleMapping
      .create({
        principalType : RoleMapping.USER,
        principalId   : model.id,
        roleId        : 2 // default Model is: guest
      })
      .then(function(mapping) {
        log(mapping);
      })
      .catch(function(error) { 
        log(error);
      });
    next();
  });
}
