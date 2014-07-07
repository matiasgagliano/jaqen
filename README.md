Jaqen
=====

Jaqen is a minimal server to which you can programmatically instruct what to
respond within the very request, allowing to locally test API dependant scripts.

**Quick example:**

```bash
$ curl 'http://localhost:9000/what/ever?foo=bar&data\[name\]=Jaqen&data\[version\]=0.0.1&dep\[\]=qs'
=> {"foo":"bar","data":{"name":"Jaqen","version":"0.0.1"},"dep":["qs"]}
```

Whatever you pass within the URL query will be parsed and returned as json.

The path is ignored and the response is the same for every request method
(GET, POST, PUT/PATCH, DELETE). There are plans to support other response
data types in the future (xml, html, txt, etc.).


Installation
------------

```bash
$ npm install jaqen
```


Use
---
To run Jaqen just type 'jaqen' in the console:

```bash
$ jaqen
=> Jaqen is listening on port 9000.
=> Press Ctl+C to stop the server.
```

Now Jaqen should be listening on port 9000, to test it's running visit this
address with your browser: *http://localhost:9000?message=Hello%20World!*

You should see this: *{"message":"Hello World!"}*


Options
-------
Jaqen accepts only one option, which is the port where it should be listening.
Use the '--port' or '-p' flags to set it, like this:

```bash
$ jaqen -p 5000
=> Jaqen is listening on port 5000.
=> Press Ctl+C to stop the server.
```


License
-------
Jaqen is dual licensed under the MIT or GPLv3 licenses.
* <http://opensource.org/licenses/MIT>
* <http://opensource.org/licenses/GPL-3.0>


Contributing
------------
If you find a bug or have good ideas on how to improve the current implementation
you are welcome to open an issue or make a pull request with a feauture branch.
