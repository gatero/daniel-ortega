'use strict';

module.exports = function(app) {
  var User        = app.models.User,
      Role        = app.models.Role,
      RoleMapping = app.models.RoleMapping,
      userList    = [
        {
          name     : 'test',
          email    : 'test@test.mx',
          password : 'test',
          realm    : 'admin'
        }
      ],
      roleList    = [
        { name: 'professor' },
        { name: 'student' }
      ];

  Role
    .create( roleList )
    .then(function( roles ) {
      console.log('[+]: Roles: ' + roles + ' created');
    })
    .catch(function( error ) {
      console.log(error);
    });

  User
    .create( userList )
    .then(function( user ) {
      RoleMapping.create({
        principalType : RoleMapping.USER,
        principalId   : member[0].id,
        roleId        : 1
      });
      console.log('[+]: Test user created');
    })
    .catch(function(error) {
      console.log(error);
    });
};
