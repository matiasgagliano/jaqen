Jaqen
=====

Jaqen is a minimal server to which you can programmatically instruct what to
respond within the very request, allowing to easily test API dependant scripts.

**Quick example:**

```bash
# Console request to a Jaqen instance listening at localhost:9000
$ curl 'http://localhost:9000/echo.json?foo=bar&data\[name\]=Jaqen&data\[v\]=1.0.0'
=> {"foo":"bar","data":{"name":"Jaqen","v":"1.0.0"}}
```

With just */echo.json* we told Jaqen to return the request data
(the URL's query in this case) as JSON, not hard at all.


Features
--------

*   **Echo:** Returns the very data from the request converted accordingly
    (as JSON, text, etc.).

*   **RESTful API:** Rather than handling HTTP verbs, Jaqen responds the same
    independently of the verb, so you can simulate any kind of API.

*   **Build files on the fly:** Set the response body and it will return it
    untouched with the right MIME type.

*   **Serve static files:** If a request doesn't match any of the 'echo' types
    Jaqen will attempt to serve static files from the directory where it's running.

*   **MIME types:** For any request, Jaqen will set the *Content-Type* header
    according to the extension on the pathname (.json, .txt, .html, etc.).


Installation
------------

```bash
$ npm install -g jaqen
```


Running Jaqen
-------------
To run Jaqen just type **jaqen** in the console:

```bash
$ jaqen
=> Jaqen is listening on port 9000.
=> Press Ctl+C to stop the server.
```

Now Jaqen should be listening at port 9000, to test it's running visit this
address with your browser: *http://localhost:9000/echo.json?msg=Hello%20World!*.
You should see this: *{"msg":"Hello World!"}*

### Options

Jaqen accepts only one option, the port where it should be listening.
By default it uses port 9000, to change it use the *--port* or *-p* flags:

```bash
$ jaqen -p 5000
=> Jaqen is listening on port 5000.
=> Press Ctl+C to stop the server.
```

### Static files server

Jaqen also serves static files from the folder where you run it, useful to
load test pages and their assets. If you need some files, first move to
the folder where the files are located and then run Jaqen from there.

```bash
$ cd path/to/files_folder
$ jaqen
=> Jaqen is listening on port 9000.
=> Press Ctl+C to stop the server.
```

Now you can access any file in *files_folder*. For example, if you have
something like *tests/index.html* inside that folder, visit
*localhost:9000/tests* on your browser to see it.


API
---

Static files aside, there are three ways to programmatically instruct Jaqen
what to respond:

*   **Echo:**

    If the pathname in the request begins with **echo**  (/echo, /echo.json,
    /echo/something.json, etc.), Jaqen mirrors the data from both the request
    body (POST data) and the URL query (GET data). If there are conflicts the
    data from the URL query overrides the one from the request body (non-deep merge).

    ```bash
    # '-d' -> make a POST request with the specified data.
    $ curl 'http://localhost:9000/echo.json?id=3' -d 'id=null&title=Lorem%20ipsum'
    => {"id":"3","title":"Lorem ipsum"}
    ```

    Here the 'id' in the URL query overrides the 'id' of the POST data.

*   **Query:**

    If the pathname begins with **query** (/query, /query.json,
    /query/something.json, etc.). It's similar to the previous one but responds
    with just the data from the URL query ignoring the request body.

    ```bash
    $ curl 'http://localhost:9000/query.json?status=success&id=5'
    => {"status":"success","id":"5"}
    ```

    Specially useful to test POST request over AJAX that expect a response.


*   **Setting the response body:**

    If there's a *_responseBody* param (either on the URL query or in the request
    body) Jaqen will return the data from that parameter untouched and will set
    the right MIME type according to the extension on the pathname (e.g. .html)

    ```bash
    # '-i' -> include the headers in the output.
    # '-d' -> make a POST request with the specified data.
    $ curl 'http://localhost:9000/echo.html' -i \
            -d '_responseBody=<html><body><h1>Jaqen!<h1></body></html>'
    => HTTP/1.1 200 OK
    => Content-Type: text/html
    ...
    => <html><body><h1>Jaqen!<h1></body></html>
    ```

    It responds exactly the value of '_responseBody' and sets the
    right content type, it's like creating a file on the fly.


License
-------
Jaqen is dual licensed under the MIT or GPLv3 licenses.
* <http://opensource.org/licenses/MIT>
* <http://opensource.org/licenses/GPL-3.0>


Contributing
------------
If you find a bug or have good ideas about how to improve this implementation
you are welcome to open an issue or make a pull request with a feature branch.
