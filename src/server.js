const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/BodyParser');
const routes = require('./routes');

const server = http.createServer((Request, Response) => {
  const parsedUrl = new URL(`http://localhost:3333${Request.url}`);

  let { pathname, searchParams } = parsedUrl;

  let splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
  }

  const route = routes.find(currentRoute => pathname === currentRoute.endpoint && Request.method === currentRoute.method);

  if (route) {
    Request.query = Object.fromEntries(searchParams);
    Request.params = { id: splitEndpoint[1] }

    Response.send = (statusCode, body) => {
      Response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      Response.end(JSON.stringify(body));
    }

    if (['POST', 'PUT', 'PATCH'].includes(Request.method)) {
      bodyParser(Request, () => route.handler(Request, Response));
    } else {
      route.handler(Request, Response);
    }

  } else {
    Response.writeHead(404, { 'Content-Type': 'application/json' });
    Response.end(`Cannot ${Request.method} ${pathname}`);
  }

});

server.listen(3333, () => console.log(`🚀 Server running on http://localhost:3333/`));
