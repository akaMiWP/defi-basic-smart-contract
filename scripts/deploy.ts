import { ethers } from "hardhat";
import JSON from "../artifacts/contracts/DefiConsumerV3.sol/DefiConsumerV3.json";

async function main() {
  const provider = new ethers.AlchemyProvider(
    "sepolia",
    process.env.ALCHEMY_KEY
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

  console.log("Deploying a contract.....");
  const ContractFactory = new ethers.ContractFactory(
    JSON.abi,
    JSON.bytecode,
    wallet
  );

  const priceFeeds = [
    {
      ticker: "SBR/GDR",
      aggregatorAddress: process.env.SBR_GDR_TOKEN_ADDRESS,
    },
    {
      ticker: "SBR/SMY",
      aggregatorAddress: process.env.SBR_SMY_TOKEN_ADDRESS,
    },
    {
      ticker: "SBR/BDC",
      aggregatorAddress: process.env.SBR_BDC_TOKEN_ADDRESS,
    },
    {
      ticker: "GDR/SBR",
      aggregatorAddress: process.env.GDR_SBR_TOKEN_ADDRESS,
    },
    {
      ticker: "GDR/SMY",
      aggregatorAddress: process.env.GDR_SMY_TOKEN_ADDRESS,
    },
    {
      ticker: "GDR/BDC",
      aggregatorAddress: process.env.GDR_BDC_TOKEN_ADDRESS,
    },
    {
      ticker: "SMY/SBR",
      aggregatorAddress: process.env.SMY_SBR_TOKEN_ADDRESS,
    },
    {
      ticker: "SMY/GDR",
      aggregatorAddress: process.env.SMY_GDR_TOKEN_ADDRESS,
    },
    {
      ticker: "SMY/BDC",
      aggregatorAddress: process.env.SMY_BDC_TOKEN_ADDRESS,
    },
    {
      ticker: "BDC/SBR",
      aggregatorAddress: process.env.BDC_SBR_TOKEN_ADDRESS,
    },
    {
      ticker: "BDC/GDR",
      aggregatorAddress: process.env.BDC_GDR_TOKEN_ADDRESS,
    },
    {
      ticker: "BDC/SMY",
      aggregatorAddress: process.env.BDC_SMY_TOKEN_ADDRESS,
    },
  ];
  const contract = await ContractFactory.deploy(priceFeeds);
  console.log("The contract has been deployed", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
