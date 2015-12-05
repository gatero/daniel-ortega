module.exports = function(Model, options) {

  Model.beforeRemote('create', function(context, model, next) {
    var instance = context.req.body;
    instance.created     = Date.now();
    instance.lastUpdated = Date.now();
    instance.modified    = Date.now();
    next();
  });

  Model.observe('before save', function(context, next) {
    if(!context.isNewInstance) {
      var instance = context.currentInstance;
      instance.lastUpdated = Date.now();
      instance.modified    = Date.now();
    }
    next();
  });

}
