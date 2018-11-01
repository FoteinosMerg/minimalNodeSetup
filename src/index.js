"use strict";

// In production, read environmental variables from ../.env
if (process.env.NODE_ENV === "production") require("dotenv").config();

// Load pacakges
const express = require("express");
const bodyParser = require("body-parser");

// Load files
const Blockchain = require("./blockchain");
const { P2PServer } = require("./p2p-network");
const { HTTP_PORT } = require("./config");

// Initiatlize app, blockchain and p2p (web-socket) server
const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);

// Apply middlewares
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

// Routing
app.get("/chain", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/transactions", (req, res) => {
  res.json(blockchain.pendingData);
});

app.post("/transactions/new", (req, res) => {
  const index = blockchain.storeTransactions(req.body.data);
  res.redirect("/transactions");
});

app.post("/mine", (req, res) => {
  const block = blockchain.createBlock();
  console.log(`\n * New block created:\n ${block}`);

  p2pServer.synchronizeChains();

  res.redirect("/chain");
});

// Bind to HTTP port (default: 5000) for front- to back-end communication
app.listen(HTTP_PORT, () => {
  console.log(`\n * Server bound to port ${HTTP_PORT}`);
  // Bind ws-server to P2P_PORT (default: 8080) for peer to peer communication
  p2pServer.listen();
});
