const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const bankName = "W3J Bank";

  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy(bankName);

  await bank.deployed();

  console.log(
    `Bank with the name ${bankName} deployed to ${bank.address}`
  );

  fs.writeFileSync('../frontend/src/config.js', `
  export const BANK_CONTRACT_ADDRESS = "${bank.address}"
  `)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
