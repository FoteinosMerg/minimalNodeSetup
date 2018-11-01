"use strict";

const sha256 = require("crypto-js/sha256");
const { MINE_RATE } = require("../config");

function adjustDifficulty(difficulty, currentMoment, previousMoment) {
  return currentMoment < previousMoment + MINE_RATE
    ? difficulty + 1
    : difficulty - 1;
}

function validProof(previousProof, proof, difficulty) {
  return (
    sha256(`${previousProof}${proof}`)
      .toString()
      .substring(0, difficulty) === "0".repeat(difficulty)
  );
}

function proofOfWork(previousNonce, previousDifficulty, previousTimestamp) {
  const difficulty = adjustDifficulty(
    previousDifficulty,
    Date.now(),
    previousTimestamp
  );

  let nonce = 0;
  while (!validProof(previousNonce, nonce, difficulty)) nonce++;

  return { nonce: nonce, difficulty: difficulty };
}

module.exports = proofOfWork;
