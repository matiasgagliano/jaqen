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
var mime        = require('mime');



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
  this.url = parseURL(req.url)
  var pathname = this.url.pathname.substr(1)           // Remove leading '/' !!!
  var isQuery  = /^query(\.|\/|$)/.test(pathname);
  var isEcho   = /^echo(\.|\/|$)/.test(pathname);

  // Respond just with url query
  if (isQuery) {
    var body = parseQS(this.url.query);
    this.respond(body);  }

  // Echo POST and url query data (merged)
  else if (isEcho) {
    var that = this
    var body = '';
    var query = parseQS(this.url.query);
    req.on('data', function(chunk){ body += chunk; });
    req.on('end', function(){
      body = parseQS(body);
      for (var k in query) { body[k] = query[k]; }     // Non-deep merge
      that.respond(body);
    });  }

  // Serve static file
  else {
    var path = resolvePath(root, pathname);
    if ( path.indexOf(root) !== 0 ) this.finish(400);  // Prevent dir traversal!
    else this.serve(path);
  }
};

Request.prototype.respond = function(body) {
  var mimeType = mime.lookup(this.url.pathname);
  var type = mime.extension(mimeType);
  if (typeof body._responseBody != 'undefined') {
    if (mimeType == mime.default_type) { type = 'txt'; mimeType = 'text/plain'; }
    body = body._responseBody;  }
  else {
    if (!parser[type]) { type = 'txt'; mimeType = 'text/plain'; }
    body = parser[type](body);  }
  this.res.setHeader('Content-Type', mimeType);
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
  this.res.setHeader('Content-Type', mime.lookup(path));
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
