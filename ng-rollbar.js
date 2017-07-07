(function(angular){
  angular.module('pismo/ng-rollbar', []);

  angular.module('pismo/ng-rollbar').config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', '$window', function($delegate, $injector, $window) {
      return function (exception, cause) {
        if($window.Rollbar) {
          $window.Rollbar.error(exception, {cause: cause}, function(err, data) {
            var $rootScope = $injector.get('$rootScope');
            $rootScope.$emit('rollbar:exception', {
              exception: exception,
              err: err,
              data: data.result
            });
          });
        }
        $delegate(exception, cause);
      };
    }]);
  }]);

  angular.module('pismo/ng-rollbar').provider('Rollbar', function RollbarProvider() {
    var rollbarProvider = this;
    var rollbarActivated = true;

    this.init = function(config) {
      var _rollbarConfig = config;
      if (rollbarActivated) {
        /* jshint ignore:start */
        /* rollbar client lib start */
        // https://raw.githubusercontent.com/rollbar/rollbar.js/v2.0.1/dist/rollbar.snippet.js
        Element("script"),c=o.getElementsByTagName("script")[0],d=c.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,n||(s.async=!0),s.onload=s.onreadystatechange=e(function(){if(!(i||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{d.removeChild(s)}catch(r){}i=!0,l()}}),d.insertBefore(s,c)},t.prototype.wrap=function(r,o){try{var n;if(n="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(o){var e=o;throw"string"==typeof e&&(e=new String(e)),e._rollbarContext=n()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e,e}},r._wrapped._isWrap=!0;for(var e in r)r.hasOwnProperty(e)&&(r._wrapped[e]=r[e])}return r._wrapped}catch(t){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection".split(","),f=0;f<u.length;++f)t.prototype[u[f]]=l(u[f]);r.exports={setupShim:a,Rollbar:p}},function(r,o){"use strict";function n(r,o){if(r){var n;"function"==typeof o._rollbarOldOnError?n=o._rollbarOldOnError:r.onerror&&!r.onerror.belongsToRollbar&&(n=r.onerror,o._rollbarOldOnError=n);var t=function(){var t=Array.prototype.slice.call(arguments,0);e(r,o,n,t)};t.belongsToRollbar=!0,r.onerror=t}}function e(r,o,n,e){r._rollbarWrappedError&&(e[4]||(e[4]=r._rollbarWrappedError),e[5]||(e[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),o.handleUncaughtException.apply(o,e),n&&n.apply(r,e)}function t(r,o){if(r){"function"==typeof r._rollbarURH&&r.removeEventListener("unhandledrejection",r._rollbarURH);var n=function(r){var n=r.reason,e=r.promise,t=r.detail;!n&&t&&(n=t.reason,e=t.promise),o&&o.handleUnhandledRejection&&o.handleUnhandledRejection(n,e)};r._rollbarURH=n,r.addEventListener("unhandledrejection",n)}}function a(r,o){if(r){var n,e,t="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(n=0;n<t.length;++n)e=t[n],r[e]&&r[e].prototype&&l(o,r[e].prototype)}}function l(r,o){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){var n=o.addEventListener;n._rollbarOldAdd&&(n=n._rollbarOldAdd);var e=function(o,e,t){n.call(this,o,r.wrap(e),t)};e._rollbarOldAdd=n,o.addEventListener=e;var t=o.removeEventListener;t._rollbarOldRemove&&(t=t._rollbarOldRemove);var a=function(r,o,n){t.call(this,
        /* rollbar client lib end */
        /* jshint ignore:end */
      }
    };

    this.deinit = function () {
      rollbarActivated = false;
    };

    getter.$inject = ['$log', '$window'];
    function getter($log, $window) {

      function _bindRollbarMethod(methodName) {
        return function() {
          $window.Rollbar[methodName].apply($window.Rollbar, arguments);
        };
      }

      var service = {
        Rollbar: logInactiveMessage,

        configure: logInactiveMessage,

        critical: logInactiveMessage,
        error: logInactiveMessage,
        warning: logInactiveMessage,
        info: logInactiveMessage,
        debug: logInactiveMessage,

        scope: logInactiveMessage,

        verbose: logInactiveMessage,
        enable: logInactiveMessage,
        disable: logInactiveMessage
      };

      if (rollbarActivated) {
        service.Rollbar = $window.Rollbar;

        // bind the native Rollbar methods
        service.configure = _bindRollbarMethod('configure');
        service.critical = _bindRollbarMethod('critical');
        service.error = _bindRollbarMethod('error');
        service.warning = _bindRollbarMethod('warning');
        service.info = _bindRollbarMethod('info');
        service.debug = _bindRollbarMethod('debug');
        service.scope = _bindRollbarMethod('scope');

        service.verbose = function (boolean) {
          if (boolean === undefined) { boolean = true; }
          $window.Rollbar.configure({ verbose: boolean });
        };

        service.enable = function () {
          $window.Rollbar.configure({ enabled: true });
        };

        service.disable = function () {
          $window.Rollbar.configure({ enabled: false });
        };
      }

      function logInactiveMessage() {
        $log.warn("Rollbar is deactivated");
      }

      return service;
    }

    this.$get = getter;
  });

})
(angular);
