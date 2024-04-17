import * as hre from "hardhat";
import { ethers } from "ethers";
import { Provider, Wallet } from "zksync-ethers";

// Address of the contract to interact with
// TODO: update this with the address of *your* deployed contract
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xD02B3cbB09766f888babc4046962bab4Aa620882";
if (!CONTRACT_ADDRESS)
  throw "⛔️ Provide address of the contract to interact with!";

// An example of a script to interact with the contract
export default async function () {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("HeroDemo");
  // hardcodes the Herodotus Turbo RPC URL
  const provider = new Provider("https://zksync-turbo.api.herodotus.cloud");
  const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!, provider);

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    wallet // Interact with the contract on behalf of this wallet
  );

  const transaction = {
    from: wallet.address,
    to: CONTRACT_ADDRESS,
    value: "0",
    nonce: await provider.getTransactionCount(wallet.address),
    chainId: 300,
    type: 2,
    data: contract.interface.encodeFunctionData("proveAccountField", [
      11155111, // Origin chain ID
      // TODO: modify the following block number with recent block number from the origin chain
      "5710899", // Block number to prove on origin chain
      "0x466ff3c5C76445823b49dF047d72663B8eAe9272", // Address to prove on origin chain
      1, // Field index to prove (0 is nonce, 1 is balance etc.)
    ]),
    gasLimit: "0x30D40", // 200k gas is enough
  };

  const signer = wallet.connect(provider);

  // Sign the transaction
  const signedTransaction = await signer.signTransaction(transaction);

  // Send the transaction
  const txHash = await provider.send("eth_sendRawTransaction", [
    signedTransaction,
  ]);

  console.log("Expected tx hash ->", txHash);
  console.log(
    "Waiting for proving... (this may take a while, ETA is ~5-10 min depending on the block number distance on the origin chain)"
  );

  // Wait for the transaction to be included in a block
  const receipt = await provider.waitForTransaction(txHash);
  console.log(receipt);
}
