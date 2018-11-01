"use strict";

const Blockchain = require("./index");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain, blockchain2;
  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });
  it("starts with genesis block", () => {
    expect(blockchain.chain[0].previousHash).toEqual("--no previous hash--");
    expect(blockchain.chain[0].hash).toEqual("--no hash--");
  });
  it("adds a new block", () => {
    const newData = "...some new data...";
    blockchain.addBlock(newData);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
  it("validates a chain", () => {
    blockchain2.addBlock("foo");
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });
});
