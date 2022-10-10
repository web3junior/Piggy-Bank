require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: `${process.env.POKT_MUMBAI_URL}`,
      accounts: [`${process.env.MUMBAI_PRIVATE_KEY}`],
    }
  },
  paths: {
    artifacts: '../frontend/src/artifacts',
  }
};
