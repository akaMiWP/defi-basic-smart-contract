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
  const contract = await ContractFactory.deploy();
  console.log("The contract has been deployed", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
