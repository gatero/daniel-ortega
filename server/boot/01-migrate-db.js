'use strict';

require('rootpath')();

/**
 * Migrate the loopback tables to api datasource
 * by default these tables are in db memory
 * **/
var server     = require('server/server'),
    events     = require('events'),
    dataSource = server.dataSources.mysql,
    models     = [
      'User',
      'Role'
      'ACL',
      'RoleMapping',
      'AccessToken'
    ];

events.EventEmitter.prototype._maxListeners = 50;

dataSource.isActual( models, function(error, actual) {
  if( !actual ) {
    dataSource
      .autoupdate( models )
      .then(function() {
        console.log('[db]: Models : [' + models + '] created in ' + dataSource.adapter.name);
        dataSource.disconnect();
      })
      .catch(function(error) { console.log(error); });
  } else {
    console.log('[!]: Data models are updated');
  }
});
