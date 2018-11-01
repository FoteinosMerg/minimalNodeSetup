"use strict";

const Block = require("./block");
const proofOfWork = require("./proofTools");

class Blockchain {
  constructor(createGenesisBlock = true) {
    this.chain = [];
    this.pendingData = [];
    if (createGenesisBlock) this.chain.push(Block.genesis());
  }

  toString() {
    const stringList = [];
    this.chain.forEach(block => stringList.push(block.toString()));
    return stringList.join("");
  }

  createBlock() {
    let newBlock;

    if (this.chain !== []) {
      const lastBlock = this.chain[this.chain.length - 1];
      const { nonce, difficulty } = proofOfWork(
        lastBlock.nonce,
        lastBlock.difficulty,
        lastBlock.timestamp
      );
      newBlock = new Block(
        this.chain.length,
        nonce,
        lastBlock.hash,
        this.pendingData.join(""),
        difficulty
      );
    } else {
      newBlock = Block.genesis(this.pendingData.join(""));
    }
    this.chain.push(newBlock);
    this.pendingData = [];
    return newBlock;
  }

  storeTransactions(transactions) {
    this.pendingData.push(...transactions);
    return this.chain.length;
  }

  replaceChain(newChain) {
    if (Blockchain.isValid(newChain) && newChain.length > this.chain.length) {
      this.chain = newChain;
    }
  }

  /* ------------------------------ Static methods -------------------------- */

  static isValid(chain) {
    if (!this.chain) return true;
    if (!this.chain[0].isGenesisBlock()) return false;
    let currentBlock = chain[0];
    let index = 1;
    while (index < chain.length) {
      let nextBlock = chain[index];
      if (
        nextBlock.previousHash != currentBlock.hash ||
        nextBlock.hash !=
          Block.hash(
            nextBlock.index,
            nextBlock.nonce,
            nextBlock.previousHash,
            nextBlock.data,
            nextBlock.timestamp,
            nextBlock.difficulty
          )
      )
        return false;
      currentBlock = nextBlock;
      index++;
    }
    return true;
  }
}

module.exports = Blockchain;
