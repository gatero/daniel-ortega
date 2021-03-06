'use strict';

require('rootpath')();

var app    = require('server/server'),
    log    = require('debug')('log'),
    _      = require('lodash'),
    config = require('server/config.json'),
    path   = require('path');

module.exports = function(Model, options) {
  Model.getApp(function(err, app) {
    Model.email.attachTo(app.dataSources.mail);
  });

  Model.afterRemote('create', function(context, model, next){
    var RoleMapping = app.models.RoleMapping,
        options = {
          type: 'email',
          to: model.email,
          from: 'noreply@daniel-ortega.mx',
          subject: 'Thanks for registering.',
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          redirect: '/verified',
          user: model
        };

    model.verify(options, function(error, response) {
      if (error) return next(error);
      console.log('> verification email sent:', response);
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });

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
  
  //send password reset link when requested
  Model.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    Model.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return log('> error sending password reset email');
      log('> sending password reset email to:', info.email);
    });
  });
}
