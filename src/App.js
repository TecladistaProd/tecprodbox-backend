const express = require("express");
const mongoose = require("mongoose");
// mongodb+srv://<username>:<password>@tecladistacluster-hgpnb.mongodb.net/test?retryWrites=true&w=majority

class App {
  constructor(PORT) {
    this.app = express();
    this.server = require("http").Server(this.app);
    this.io = require("socket.io")(this.server);
    this.PORT = PORT;

    this.database();
    this.initSocket();
    this.middlewares();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      req.io = this.io;
      return next();
    });

    this.app.use(
      "/files",
      express.static(require("path").resolve(__dirname, "..", "tmp"))
    );
    this.app.use(require("./routes/"));

    this.server.listen(this.PORT, () =>
      console.log(`Listening on http://127.0.0.1:${this.PORT}`)
    );
  }

  database() {
    mongoose.connect(
      "mongodb+srv://tecprodbox:tecprodbox@tecladistacluster-hgpnb.mongodb.net/tecprodbox?retryWrites=true&w=majority",
      {
        useNewUrlParser: true
      }
    );
    this.app.use(require("cors")());
  }

  initSocket() {
    this.io.on("connection", socket => {
      // console.log(socket.id);
      socket.on("connect_room", box => {
        socket.join(box);
      });
    });
  }
}

module.exports = App;
