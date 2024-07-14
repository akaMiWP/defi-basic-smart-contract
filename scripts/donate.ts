import { ethers } from "hardhat";
import erc20JSON from "../artifacts/contracts/Mocks/ERC20Mock.sol/ERC20Mock.json";

const erc20TokenAddresses: string[] = [
  process.env.FIRST_ERC20_TOKEN_ADDRESS as string,
  process.env.SECOND_ERC20_TOKEN_ADDRESS as string,
  process.env.THIRD_ERC20_TOKEN_ADDRESS as string,
  process.env.FOURTH_ERC20_TOKEN_ADDRESS as string,
];

const donate = async (tokenAddress: string) => {
  const provider = new ethers.AlchemyProvider(
    "sepolia",
    process.env.ALCHEMY_KEY
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  const tokenContract = new ethers.Contract(
    tokenAddress,
    erc20JSON.abi,
    wallet
  );
  console.log("Transfering tokens....");
  const tx = await tokenContract.transfer(
    process.env.DEFI_CONTRACT_ADDRESS,
    ethers.parseEther("100")
  );
  console.log("Done", tx);
};

const donates = async () => {
  const promises = erc20TokenAddresses.map(async (address) => {
    const result = await donate(address);
    console.log(result);
    // Wait for 10 seconds (10000 milliseconds) before the next iteration
    return result;
  });

  const results = await Promise.all(promises);
  console.log("All items processed:", results);
};

donates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
