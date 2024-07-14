import { ethers } from "hardhat";
import jsonERC20Mock from "../artifacts/contracts/Mocks/ERC20Mock.sol/ERC20Mock.json";
import jsonAggregatorV3Mock from "../artifacts/contracts/Mocks/AggregatorV3Mock.sol/AggregatorV3Mock.json";

const species = [
  { name: "Siberian husky", symbol: "SBR", totalSupply: 1000 },
  { name: "Golden Retriever", symbol: "GDR", totalSupply: 2000 },
  { name: "Samoyed", symbol: "SMY", totalSupply: 3000 },
  { name: "Border Collie", symbol: "BDC", totalSupply: 4000 },
];

// Given:
// 1 SBR = 10 USD
// 1 GDR = 20 USD
// 1 SMY = 30 USD
// 1 BDC = 40 USD

const prices = [
  { ticker: "SBR/GDR", priceFeed: ethers.parseEther("0.5") }, // 0.5 GDR per SBR
  { ticker: "SBR/SMY", priceFeed: ethers.parseEther("0.333") }, // 0.333 SMY per SBR
  { ticker: "SBR/BDC", priceFeed: ethers.parseEther("0.25") }, // 0.25 BDC per SBR
  { ticker: "GDR/SBR", priceFeed: ethers.parseEther("2") }, // 2 SBR per GDR
  { ticker: "GDR/SMY", priceFeed: ethers.parseEther("0.667") }, // 0.667 SMY per GDR
  { ticker: "GDR/BDC", priceFeed: ethers.parseEther("0.5") }, // 0.5 BDC per GDR
  { ticker: "SMY/SBR", priceFeed: ethers.parseEther("3") }, // 3 SBR per SMY
  { ticker: "SMY/GDR", priceFeed: ethers.parseEther("1.5") }, // 1.5 GDR per SMY
  { ticker: "SMY/BDC", priceFeed: ethers.parseEther("0.75") }, // 0.75 BDC per SMY
  { ticker: "BDC/SBR", priceFeed: ethers.parseEther("4") }, // 4 SBR per BDC
  { ticker: "BDC/GDR", priceFeed: ethers.parseEther("2") }, // 2 GDR per BDC
  { ticker: "BDC/SMY", priceFeed: ethers.parseEther("1.333") }, // 1.333 SMY per BDC
];

const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const deployERC20Token = async (
  name: string,
  symbol: string,
  totalSupply: number
) => {
  const ERC20Token = new ethers.ContractFactory(
    jsonERC20Mock.abi,
    jsonERC20Mock.bytecode,
    wallet
  );
  const erc20Token = await ERC20Token.deploy(name, symbol, totalSupply);
  console.log(name, "deployed to:", await erc20Token.getAddress());
};

const deployPriceFeed = async (pair: string, price: bigint) => {
  const AggregatorV3 = new ethers.ContractFactory(
    jsonAggregatorV3Mock.abi,
    jsonAggregatorV3Mock.bytecode,
    wallet
  );
  const aggregatorV3 = await AggregatorV3.deploy(price);
  console.log(pair, "price feed deployed to:", await aggregatorV3.getAddress());
};

species.forEach(({ name, symbol, totalSupply }) => {
  deployERC20Token(name, symbol, totalSupply)
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});

prices.forEach(({ ticker, priceFeed }) => {
  deployPriceFeed(ticker, priceFeed)
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});
