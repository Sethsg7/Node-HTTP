//import http from "http";
const http = require("http");
const port = 3000;

const reqHandler = (req, res) => {
  const chunks = [];

  // Listen and collect req body chunks.
  req.on("data", (chunk) => chunks.push(chunk));

  // Handle the response after all the req chunks have arrived.
  req.on("end", () => {
    const { method, url } = req;
    let reqBody;

    try {
      const reqBody = JSON.parse(Buffer.concat(chunks).toString());
    } catch (err) {
      console.error("Request body cannot be parsed to JSON");
      reqBody = null;
    }

    //determine route info
    const { statusCode, contentType, content } = getRouteInfo(
      method,
      url,
      reqBody
    );

    res.writeHead(statusCode, { "content-type": contentType });
    res.write(content);
    res.end();
  });
};

const getRouteInfo = (method, url, reqBody) => {
  const info = {
    statusCode: 200,
    contentType: "text/html",
    content: "",
  };

  switch (true) {
    case url == "/" && method == "GET":
      info.content = "<h1>Home</h1>";
      break;
    case url == "/about" && method == "GET":
      info.contentType = "application/json";
      info.content = JSON.stringify({ name: "Seth", city: "New Orleans" });
      break;
    case url == "/echo" && method == "POST":
      info.contentType = "application/json";
      info.content = JSON.stringify({ url, method, ...reqBody });
      break;

    default:
      // 404
      info.statusCode = 404;
      info.content = "<h1>404 Not Found</h1>";
  }
  return info;
};

const server = http.createServer(reqHandler);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
