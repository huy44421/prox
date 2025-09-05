const http = require("http");
const net = require("net");
const url = require("url");

// Proxy HTTP requests
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const options = {
    hostname: req.headers['host'],
    port: 80,
    path: parsedUrl.path,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on("error", (err) => {
    res.writeHead(500);
    res.end("Proxy error: " + err.message);
  });
});

// Proxy HTTPS requests (CONNECT method)
server.on("connect", (req, clientSocket, head) => {
  const { port, hostname } = url.parse(//${req.url}, false, true);

  const serverSocket = net.connect(port || 443, hostname, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on("error", () => {
    clientSocket.end("HTTP/1.1 500 Connection Error\r\n\r\n");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(✅ Public Proxy running on port ${PORT});
});
