// import socketIO from "socket.io";
// import express from "express"
// import http from "http"

// const app = express();
// const port = process.env.PORT || 3000;

// const path = require('path')


// var server = new http.Server(app);
// var io = new socketIO.Server;


// src/server.ts
import express from "express";

console.log('Hello');

const app = express();
app.set("port", process.env.PORT || 3000);

var http = require("http").Server(app);

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

// start our simple server up on localhost:3000
const server = http.listen(3000, function() {
  console.log("listening on *:3000");
});

//---------------------------

// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io").listen(server);

// io.on("connection", function(socket) {
//     console.log("a user connected");
//     socket.on("disconnect", function() {
//         console.log("user disconnected");
//     });
// });

// app.set("port", 8080);
// server.listen(app.get("port"), function() {
//     console.log(`Listening on ${server.address().port}`);
// });