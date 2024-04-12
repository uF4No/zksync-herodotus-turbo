import { deployContract } from "./utils";

// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const contractArtifactName = "HeroDemo";
  const constructorArguments = ["0xf6D4087B1656DDa02ce8c01484D567D3f9FD76c0"];
  await deployContract(contractArtifactName, constructorArguments);
}
