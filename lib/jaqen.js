/*
 *   _____
 *  /\___ \
 *  \/__/\ \     __       __      __    ___
 *     _\ \ \  /'__`\   /'__`\  /'__`\/' _ `\
 *    /\ \_\ \/\ \L\.\_/\ \L\ \/\  __//\ \/\ \
 *    \ \____/\ \__/.\_\ \___, \ \____\ \_\ \_\
 *     \/___/  \/__/\/_/\/___/\ \/____/\/_/\/_/
 *                           \ \_\
 *                            \/_/
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
var parseURL     = require('url').parse;
var parseQS      = require('qs').parse;
var resolvePath  = require('path').resolve;
var fs           = require('fs');



// ______________________________
//
//             Cache
// ______________________________
//
var responseCodes = {
  '400': 'Bad Request.',
  '404': 'Not Found.',
  '500': 'Internal Server Error.'
};

var root = null;



// ______________________________
//
//             Request
// ______________________________
//
var Request = function(req, res) {
  this.req = req;
  this.res = res;
  this.url = parseURL(this.req.url)
  var pathname = this.url.pathname.substr(1)           // Remove leading '/' !!!
  var regex = /^jaqen(\.|\/|$)/;

  if ( pathname.match(regex) ) { this.parseQuery(); }
  else {
    var path = resolvePath(root, pathname);
    if ( path.indexOf(root) !== 0 ) this.finish(400);  // Prevent dir traversal!
    else this.serve(path);
  }
};

Request.prototype.parseQuery = function() {
  var query = parseQS(this.url.query);
  var body  = JSON.stringify(query);
  this.res.setHeader('Content-Type', 'application/json; charset="utf-8"');
  this.res.setHeader('Content-Length', Buffer.byteLength(body));
  this.res.end(body);
};

Request.prototype.serve = function(path) {
  that = this
  fs.stat(path, function(error, stat) {
    if (error) error.code == 'ENOENT' ? that.finish(404) : that.finish(500);
    else if ( stat.isFile() )      that.stream(path, stat);
    else if ( stat.isDirectory() ) that.serve(path + '/index.html');
    else that.finish(400);
  });
};

Request.prototype.stream = function(path, stat) {
  that = this
  this.res.setHeader('Content-Length', stat.size);
  var stream = fs.createReadStream(path);
  stream.pipe(this.res);
  stream.on('error', function(error){ that.finish(500); });
};

Request.prototype.finish = function(statusCode) {
  this.res.statusCode = parseInt(statusCode) || 200;
  msg = responseCodes[statusCode + ''] || '';
  if (msg) this.res.setHeader('Content-Type', 'text/plain');
  this.res.end(msg);
};



// ______________________________
//
//            Server
// ______________________________
//
exports.start = function(port) {
  var port  = parseInt(port) || 9000;
  root  = resolvePath('.');

  // Create server
  var server = createServer();

  // Handle requests
  server.on('request', function(req, res){ new Request(req, res); });

  // Catch error of address (port) already in use.
  server.on('error', function(error) {
    // Address in use
    if (error.code == 'EADDRINUSE') {
      console.log('Jaqen exited, the address is already in use.');
      console.log("Try setting a different port with the '--port' flag.")
    }
  });

  // Start server
  server.listen(port, function() {
    console.log("Jaqen is listening on port " + port + ".");
    console.log("Press Ctl+C to stop the server.");
  });
}
