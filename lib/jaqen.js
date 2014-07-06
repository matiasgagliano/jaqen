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

// Dependencies
var http     = require('http');
var urlParse = require('url').parse;
var qsParse  = require('qs').parse;

// Server
var server = http.createServer(function(req, res){
  var query = qsParse(urlParse(req.url).query);
  var body  = JSON.stringify(query);
  res.setHeader('Content-Type', 'application/json; charset="utf-8"');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

// Start server
server.listen(9000, function(){
  console.log("Jaqen is listening on port 9000.");
});
