'use strict';

require('rootpath')();

/**
 * Migrate the loopback tables to api datasource
 * by default these tables are in db memory
 * **/
var server     = require('server/server'),
    events     = require('events'),
    dataSource = server.dataSources.mysql,
    log        = require('debug')('log'),
    models     = require('server/model-config.json');

events.EventEmitter.prototype._maxListeners = 50;
models = Object.keys(models);
models.pop();

dataSource.isActual( models, function(error, actual) {
  if( !actual ) {
    dataSource
      .autoupdate( models )
      .then(function() {
        log('[db]: Models : created or updated in ' + dataSource.adapter.name);
        dataSource.disconnect();
      })
      .catch(function(error) { log(error); });
  } else {
    log('[!]: Data models are updated');
  }
});
