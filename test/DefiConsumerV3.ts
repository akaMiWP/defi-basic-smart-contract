import { ethers } from "hardhat";

import ERC20MockJSON from "../artifacts/contracts/Mocks/ERC20Mock.sol/ERC20Mock.json";
import AggregatorV3MockJSON from "../artifacts/contracts/Mocks/AggregatorV3Mock.sol/AggregatorV3Mock.json";

describe("DefiConsumerV3", () => {
  let owner, addr1, addr2;
  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock ERC20 tokens;
    const ERC20Mock = new ethers.ContractFactory(
      ERC20MockJSON.abi,
      ERC20MockJSON.bytecode,
      owner
    );
    ERC20Mock.deploy();
  });
});
