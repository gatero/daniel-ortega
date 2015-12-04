'use strict';
var loopback = require('loopback'),
    app      = loopback(),
    log      = require('debug')('user'),
    _        = require('lodash');

module.exports = function(user) {
  
  user.beforeRemote('create', function(context, user, next){
    var instance = context.req.body;
    instance.created = Date.now();
    instance.status  = 'active';;
    next();
  });

  user.afterRemote('create', function(context, user, next){
    if( _.isEmpty(user.realm) ) {
      return next(new Error('The realm is required'));
    }

    var RoleMapping = app.models.RoleMapping,
        roleId;

    switch(user.realm) {
      case 'admin':
        roleId = 1;
        break;
    }

    // Create rolemapping
    RoleMapping
      .create({
        principalType : RoleMapping.USER,
        principalId   : user.id,
        roleId        : roleId
      })
      .then(function(mapping) {
        console.log(mapping);
      })
      .catch(function(error) { 
        console.log(error);
      });
    next();
  });

  user.observe('before save', function(context, next) {
    if(!context.isNewInstance) {
      var instance = context.currentInstance;
      instance.lastUpdated = Date.now();
    }
    next();
  });
};
