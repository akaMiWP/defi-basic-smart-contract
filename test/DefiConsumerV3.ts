import { ethers } from "hardhat";

import ERC20MockJSON from "../artifacts/contracts/Mocks/ERC20Mock.sol/ERC20Mock.json";
import AggregatorV3MockJSON from "../artifacts/contracts/Mocks/AggregatorV3Mock.sol/AggregatorV3Mock.json";
import DefiConsumerV3JSON from "../artifacts/contracts/DefiConsumerV3.sol/DefiConsumerV3.json";

describe("DefiConsumerV3", () => {
  let owner, addr1, addr2;
  let token1, token2;
  let aggregatorV3;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock ERC20 tokens;
    const ERC20Mock = new ethers.ContractFactory(
      ERC20MockJSON.abi,
      ERC20MockJSON.bytecode,
      owner
    );

    token1 = await ERC20Mock.deploy("Token1", "TK1", 100);
    token2 = await ERC20Mock.deploy("Token2", "TK2", 200);

    // Deploy mock AggregatorV3 pricefeed;
    const AggregatorV3Mock = new ethers.ContractFactory(
      AggregatorV3MockJSON.abi,
      AggregatorV3MockJSON.bytecode,
      owner
    );
    aggregatorV3 = await AggregatorV3Mock.deploy(0.01 * (10 ^ 18));

    // Deploy Defi contract
    const priceFeedPairs = [
      { ticker: "TK1/TK2", aggregatorAddress: await aggregatorV3.getAddress() },
    ];
    const DefiConsumerV3 = new ethers.ContractFactory(
      DefiConsumerV3JSON.abi,
      DefiConsumerV3JSON.bytecode,
      owner
    );

    const defiConsumerV3 = await DefiConsumerV3.deploy(priceFeedPairs);

    // Log addresses
    console.log("Deployed Token 1", await token1.getAddress());
    console.log("Deployed Token 2", await token2.getAddress());
    console.log("Deployed Aggregator", await aggregatorV3.getAddress());
    console.log("Deployed DefiConsumverV3", await defiConsumerV3.getAddress());

    // Fund DeFi contract with token2
    token2.connect(owner).approve(await defiConsumerV3.getAddress(), 50);
    defiConsumerV3
      .connect(owner)
      .transferFrom(owner, await defiConsumerV3.getAddress(), 50);
  });

  describe("Test swap functionality", () => {
    it("Hello World", () => {
      //   console.log("Hello World");
    });
  });
});
