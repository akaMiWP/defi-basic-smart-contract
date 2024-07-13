import { ethers } from "hardhat";
import { expect } from "chai";

import ERC20MockJSON from "../artifacts/contracts/Mocks/ERC20Mock.sol/ERC20Mock.json";
import AggregatorV3MockJSON from "../artifacts/contracts/Mocks/AggregatorV3Mock.sol/AggregatorV3Mock.json";
import DefiConsumerV3JSON from "../artifacts/contracts/DefiConsumerV3.sol/DefiConsumerV3.json";

describe("DefiConsumerV3", () => {
  let owner, addr1;
  let token1, token2;
  let aggregatorV3, defiConsumerV3;
  const priceFeedRatio = "4";

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();

    // Deploy mock ERC20 tokens;
    const ERC20Mock = new ethers.ContractFactory(
      ERC20MockJSON.abi,
      ERC20MockJSON.bytecode,
      owner
    );

    token1 = await ERC20Mock.deploy("Token1", "TK1", 100);
    token2 = await ERC20Mock.deploy("Token2", "TK2", 200);

    console.log("Deployed Token 1", await token1.getAddress());
    console.log("Deployed Token 2", await token2.getAddress());

    // Deploy mock AggregatorV3 pricefeed;
    const AggregatorV3Mock = new ethers.ContractFactory(
      AggregatorV3MockJSON.abi,
      AggregatorV3MockJSON.bytecode,
      owner
    );
    aggregatorV3 = await AggregatorV3Mock.deploy(
      ethers.parseEther(priceFeedRatio)
    );
    console.log("Deployed Aggregator", await aggregatorV3.getAddress());

    // Deploy Defi contract
    const priceFeedPairs = [
      { ticker: "TK1/TK2", aggregatorAddress: await aggregatorV3.getAddress() },
    ];
    const DefiConsumerV3 = new ethers.ContractFactory(
      DefiConsumerV3JSON.abi,
      DefiConsumerV3JSON.bytecode,
      owner
    );

    defiConsumerV3 = await DefiConsumerV3.deploy(priceFeedPairs);
    console.log("Deployed DefiConsumerV3", await defiConsumerV3.getAddress());
  });

  describe("Test swap functionality", () => {
    let input;

    beforeEach(async () => {
      // Log addresses
      console.log("Before setting up....");
      console.log(
        "Owner's token1 balance",
        await token1.balanceOf(await owner.getAddress())
      );
      console.log(
        "Addr1's token1 balance",
        await token1.balanceOf(await addr1.getAddress())
      );
      console.log(
        "Owner's token2 balance",
        await token2.balanceOf(await owner.getAddress())
      );
      console.log(
        "DeFiConsumverV3's token2 balance",
        await token2.balanceOf(await defiConsumerV3.getAddress())
      );

      // Fund addr1 with token 1
      await token1
        .connect(owner)
        .transfer(await addr1.getAddress(), ethers.parseEther("30"));

      // Fund DeFi contract with token2 via abi
      await token2
        .connect(owner)
        .approve(await defiConsumerV3.getAddress(), ethers.parseEther("50"));
      await defiConsumerV3
        .connect(owner)
        .depositToken(await token2.getAddress(), ethers.parseEther("50"));

      // Log addresses
      console.log("After setting up....");
      console.log(
        "Owner's token1 balance",
        await token1.balanceOf(await owner.getAddress())
      );
      console.log(
        "Addr1's token1 balance",
        await token1.balanceOf(await addr1.getAddress())
      );
      console.log(
        "Owner's token2 balance",
        await token2.balanceOf(await owner.getAddress())
      );
      console.log(
        "DeFiConsumerV3's token2 balance",
        await token2.balanceOf(await defiConsumerV3.getAddress())
      );
    });

    it("Should swap Token 1 for Token 2 based on Oracle price when input is an integer", async () => {
      input = ethers.parseEther("10");
      await token1
        .connect(addr1)
        .approve(await defiConsumerV3.getAddress(), input);
      await defiConsumerV3
        .connect(addr1)
        .swapTokens(
          await token1.getAddress(),
          await token2.getAddress(),
          input
        );
      expect(await token1.balanceOf(await addr1.getAddress())).to.equal(
        ethers.parseEther("20")
      );
      expect(
        await token1.balanceOf(await defiConsumerV3.getAddress())
      ).to.equal(ethers.parseEther("10"));
      expect(await token2.balanceOf(await addr1.getAddress())).to.equal(
        ethers.parseEther("40")
      );
      expect(
        await token2.balanceOf(await defiConsumerV3.getAddress())
      ).to.equal(ethers.parseEther("10"));
    });

    it("Should swap Token 1 for Token 2 based on Oracle price when input is not an integer", async () => {
      input = ethers.parseEther("0.01");
      await token1
        .connect(addr1)
        .approve(await defiConsumerV3.getAddress(), input);
      await defiConsumerV3
        .connect(addr1)
        .swapTokens(
          await token1.getAddress(),
          await token2.getAddress(),
          input
        );
      expect(await token1.balanceOf(await addr1.getAddress())).to.equal(
        ethers.parseEther("29.99")
      );
      expect(
        await token1.balanceOf(await defiConsumerV3.getAddress())
      ).to.equal(ethers.parseEther("0.01"));
      expect(await token2.balanceOf(await addr1.getAddress())).to.equal(
        ethers.parseEther("0.04")
      );
      expect(
        await token2.balanceOf(await defiConsumerV3.getAddress())
      ).to.equal(ethers.parseEther("49.96"));
    });
  });
});
