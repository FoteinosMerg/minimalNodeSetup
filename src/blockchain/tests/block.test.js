const Block = require("./block");

describe("Block", () => {
  let data, previousBlock, block;
  beforeEach(() => {
    data = "...some data...";
    previousBlock = Block.genesis();
    block = Block.mineBlock(previousBlock, data);
  });
  it("sets the `data` to much the input", () => {
    expect(block.data).toEqual(data);
  });
  it("sets the `previousHash` to match the hash of the last block", () => {
    expect(block.previousHash).toEqual(previousBlock.hash);
  });
});
