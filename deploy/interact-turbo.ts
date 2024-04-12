import * as hre from "hardhat";
import { ethers } from "ethers";
import { Provider, Wallet } from "zksync-ethers";

// Address of the contract to interact with
const CONTRACT_ADDRESS = "0x088cB764D100F61400BC781a2860D02621138817";
if (!CONTRACT_ADDRESS) throw "⛔️ Provide address of the contract to interact with!";

// An example of a script to interact with the contract
export default async function () {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("HeroDemo");
  // hardcodes the Herodotus Turbo RPC URL
  const provider = new Provider("https://zksync-turbo.api.herodotus.cloud")
  const wallet  = new Wallet( process.env.WALLET_PRIVATE_KEY!, provider);

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    wallet // Interact with the contract on behalf of this wallet
  );

  // // Run contract write function
  // // Params: chainId, blockNumber, headerPropertyIndex
  // const transaction = await contract.proveHeaderProperty(300, 1607791, 3);
  // console.log(`Transaction hash: ${transaction.hash}`);

  // // Wait until transaction is processed
  // await transaction.wait();


  // Run contract write function
  // Params: chainId, blockNumber, account, fieldIndex (0 is nonce)
  const transaction = await contract.proveAccountField(11155111, 5681448, '0x466ff3c5C76445823b49dF047d72663B8eAe9272', 1, {gasLimit: 600000});
  console.log(`Transaction hash: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

}
