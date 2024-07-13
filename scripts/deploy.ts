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
      ticker: "BTC/ETH",
      aggregatorAddress: "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22",
    },
    {
      ticker: "BTC/USD",
      aggregatorAddress: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    },
    {
      ticker: "DAI/USD",
      aggregatorAddress: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
    },
    {
      ticker: "ETH/USD",
      aggregatorAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    {
      ticker: "LINK/ETH",
      aggregatorAddress: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
    },
    {
      ticker: "LINK/USD",
      aggregatorAddress: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
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
