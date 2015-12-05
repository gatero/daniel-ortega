'use strict';

require('rootpath')();
var log = require('debug')('log');

module.exports = function(app) {
  var user        = app.models.user,
      Role        = app.models.Role,
      RoleMapping = app.models.RoleMapping,
      userList    = require('common/seeds/test-users.json'),
      roleList    = require('common/seeds/user-roles.json');

  Role.count(function(error, count) {
    if(count > 0) return false;
    Role.create( roleList, function(error, roles) {
      log('[+]: Roles created');
    });
    user.create( userList, function(error, users) {
      RoleMapping.create({
        principalType : RoleMapping.USER,
        principalId   : users[0].id,
        roleId        : 1
      });
      RoleMapping.create({
        principalType : RoleMapping.USER,
        principalId   : users[0].id,
        roleId        : 2
      });
      log('[+]: Test User created');
    });
  });
};
