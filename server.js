const http = require("http"),
  fs = require("fs");

http
  .createServer((req, res) => {
    let addr = req.url,
      url = new URL(addr, `https://${req.headers.host}`);

    fs.appendFile(
      "./log.txt",
      `IP: ${req.socket.remoteAddress}\nURL: ${url}\nTimestamp: ${new Date()}\n\n`,
      (err) => {
        if (err) console.log(err);
        else console.log("API call logged.");
      }
    );

    filePath = url.pathname.includes("documentation")
      ? __dirname + "/documentation.html"
      : "index.html";

    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  })
  .listen(8080);
console.log("Movie_api Server running on 8080");
