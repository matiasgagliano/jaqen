/*
 *   _____
 *  /\___ \
 *  \/__/\ \     __       __      __    ___
 *     _\ \ \  /'__`\   /'__`\  /'__`\/' _ `\
 *    /\ \_\ \/\ \L\.\_/\ \L\ \/\  __//\ \/\ \
 *    \ \____/\ \__/.\_\ \___, \ \____\ \_\ \_\
 *     \/___/  \/__/\/_/\/___/\ \/____/\/_/\/_/
 *                           \ \_\
 *                            \/_/       v1.0.0
 *
 *  http://matiasgagliano.github.com/jaqen/
 *
 *  Copyright 2014, Matías Gagliano.
 *  Dual licensed under the MIT or GPLv3 licenses.
 *  http://opensource.org/licenses/MIT
 *  http://opensource.org/licenses/GPL-3.0
 *
 */

// ______________________________
//
//          Dependencies
// ______________________________
//
var createServer = require('http').createServer;
var Request = require('./request');
var version = '1.0.0';



// ______________________________
//
//            Server
// ______________________________
//
module.exports = function(port) {
  var port  = parseInt(port) || 9000;

  // Create server
  var server = createServer();

  // Handle requests
  server.on('request', function(req, res){ new Request(req, res); });

  // Catch error of address (port) already in use.
  server.on('error', function(error) {
    // Address in use
    if (error.code == 'EADDRINUSE') {
      console.log('Jaqen exited, the address is already in use.');
      console.log("Try setting a different port with the '--port' flag.");
    }
  });

  // Start server
  server.listen(port, function() {
    console.log('Jaqen v' + version + ' is listening on port ' + port + '.');
    console.log('Press Ctl+C to stop the server.\n');
  });
}
