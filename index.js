var repeat = require('repeat-string');
var getPort = require('get-port');
var getOptions = require('./lib/options');

var LOG_LEVEL_NONE = 0;
var LOG_LEVEL_ERROR = 1;
var LOG_LEVEL_WARN = 2;
var LOG_LEVEL_INFO = 3;

module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;
  var options = Object.assign(getOptions(argv), {
    workerController: __dirname + '/lib/worker.js',
    allowClientPublish: false
  });
  var port = options.port;
  var logLevel = options.logLevel === undefined ? LOG_LEVEL_INFO : options.logLevel;

  // Check if port already used
  return getPort({ port: port })
    .then(function(p) {
      if (port !== p) {
        if (logLevel >= LOG_LEVEL_WARN) {
          console.log('[RemoteDev] Server port ' + port + ' is already used.');
        }
        return { portAlreadyUsed: true, on: function(status, cb) { cb(); } };
      }
      if (logLevel >= LOG_LEVEL_INFO) {
        console.log('[RemoteDev] Start server...');
        console.log(repeat('-', 80) + '\n');
      }
      return new SocketCluster(options);
    })
    .catch(function(error) {
      if (logLevel >= LOG_LEVEL_ERROR) {
        console.error(error);
      }
    });
};
