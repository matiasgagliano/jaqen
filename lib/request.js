// ______________________________
//
//          Dependencies
// ______________________________
//
var parser      = require('./parser');
var parseURL    = require('url').parse;
var parseQS     = require('qs').parse;
var resolvePath = require('path').resolve;
var fs          = require('fs');



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

var root  = resolvePath('.');



// ______________________________
//
//             Request
// ______________________________
//
var Request = function(req, res) {
  this.req = req;
  this.res = res;
  var url  = parseURL(req.url)
  var pathname = url.pathname.substr(1)                // Remove leading '/' !!!
  var isEcho   = req.method == 'POST' && !!pathname.match(/^echo(\.|\/|$)/);
  var isQuery  = !!pathname.match(/^jaqen(\.|\/|$)/);

  // Echo POST data (merge url query)
  if (isEcho) {
    var that = this
    var body = '';
    var query = parseQS(url.query);
    req.on('data', function(chunk){ body += chunk; });
    req.on('end', function(){
      body = parseQS(body);
      for (var k in query) { body[k] = query[k]; }     // Non-deep merge
      that.respond(body);
    });  }

  // Respond with url query
  else if (isQuery) {
    var body = parseQS(url.query);
    this.respond(body);  }

  // Serve static file
  else {
    var path = resolvePath(root, pathname);
    if ( path.indexOf(root) !== 0 ) this.finish(400);  // Prevent dir traversal!
    else this.serve(path);
  }
};

Request.prototype.respond = function(body) {
  body = parser['json'](body);
  this.res.setHeader('Content-Type', 'application/json; charset="utf-8"');
  this.res.setHeader('Content-Length', Buffer.byteLength(body));
  this.res.end(body);
};

Request.prototype.serve = function(path) {
  var that = this
  fs.stat(path, function(error, stat) {
    if (error) error.code == 'ENOENT' ? that.finish(404) : that.finish(500);
    else if ( stat.isFile() )      that.stream(path, stat);
    else if ( stat.isDirectory() ) that.serve(path + '/index.html');
    else that.finish(400);
  });
};

Request.prototype.stream = function(path, stat) {
  var that = this
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
//            Module
// ______________________________
//
module.exports = Request;
