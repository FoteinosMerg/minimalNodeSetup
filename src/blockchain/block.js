"use strict";

const sha256 = require("crypto-js/sha256");
const { DIFFICULTY } = require("../config");
//const { DIFFICULTY } = require("../config");

class Block {
  constructor(index, nonce, previousHash, data, difficulty) {
    this.index = index;
    this.nonce = nonce;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = Date.now();
    this.hash = Block.hash(
      index,
      this.nonce,
      previousHash,
      data,
      this.timestamp,
      difficulty
    );
    this.difficulty = difficulty;
  }

  isGenesisBlock() {
    return (
      this.hash ===
      Block.hash(
        0,
        0,
        "__there_is_no_previous_hash__",
        this.data,
        this.timestamp,
        0,
        DIFFICULTY
      )
    );
  }

  copy() {
    return Object.assign({}, this);
  }

  /* ------------------------- Representation formatting -------------------- */

  creationMoment() {
    const moment = new Date(this.timestamp);
    return `${moment.toTimeString()}, ${moment.toLocaleDateString()}`;
  }

  toString() {
    return `
      index         : ${this.index}
      nonce         : ${this.nonce}
      difficulty    : ${this.difficulty}
      previous hash : ${this.previousHash}
      hash          : ${this.hash}
      data          : ${this.data}
      timestamp     : ${this.timestamp} (${this.creationMoment()})`;
  }

  /* ------------------------------ Static methods -------------------------- */

  static genesis(data = "") {
    return new this(0, 0, "__there_is_no_previous_hash__", data, DIFFICULTY);
  }

  static hash(index, nonce, previousHash, data, timestamp, difficulty) {
    return sha256(
      `${index}${nonce}${previousHash}${data}${timestamp}${difficulty}`
    ).toString();
  }
}

module.exports = Block;
