"use strict";
module.exports = {
  HTTP_PORT: process.env.HTTP_PORT || 5000,
  P2P_PORT: process.env.P2P_PORT || 8080,
  DIFFICULTY: process.env.DIFFICULTY || 4,
  MINE_RATE: process.env.MINE_RATE || 3000 //msecs
};
