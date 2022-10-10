const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Bank", function () {
  async function deployBankFixture() {
    const bankName = "W3J Bank";

    const [owner, otherAccount] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy(bankName);

    return { bank, bankName, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      const { bank, bankName } = await loadFixture(deployBankFixture);

      expect(await bank.bankName()).to.equal(bankName);
    });

    it("Should set the right owner", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      expect(await bank.owner()).to.equal(owner.address);
    });

    it("Should fail if not owner get contract balance", async function () {
      const { bank, otherAccount } = await loadFixture(deployBankFixture);

      await expect(bank.connect(otherAccount).bankBalance()).to.be.revertedWith(
        "Only owner"
      );
    });
  });

  describe("Deposit", function () {
    it("Should increase bank balance", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      const bankBalancePrev = await bank.connect(owner).bankBalance();

      const amount =  ethers.utils.parseEther("1");

      await bank.deposit({value: amount});

      const bankBalance = await bank.connect(owner).bankBalance();

      expect(bankBalancePrev).to.equal(bankBalance-amount);
    });

    it("Should fail if amount equal zero", async function () {
      const { bank } = await loadFixture(deployBankFixture);
      
      await expect(bank.deposit({value: 0})).to.be.revertedWith(
        "Your deposit should > 0"
      );
    });

    it("Should emit an event on deposit", async function () {
      const { bank, otherAccount } = await loadFixture(
        deployBankFixture
      );

      const amount =  ethers.utils.parseEther("1");

      await expect(bank.connect(otherAccount).deposit({value: amount}))
        .to.emit(bank, "Deposit")
        .withArgs(otherAccount.address, amount);
    });
  });

  describe("Withdrawals", function () {
    it("Should decrease customer balance", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);
      
      const amount =  ethers.utils.parseEther("2");

      await bank.deposit({value: amount});

      const custommerBalancePrev = await bank.customers(owner.address);

      await bank.withdraw({value: amount});

      const custommerBalance = await bank.customers(owner.address);

      expect(custommerBalance).to.equal(custommerBalancePrev-amount);
    });

    it("Should fail if customer balance equal zero", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      const amount =  ethers.utils.parseEther("1");
      
      await expect(bank.withdraw({value: amount})).to.be.revertedWith(
        "You not enough balance in the bank"
      );
    });

    it("Should emit an event on withdraw", async function () {
      const { bank } = await loadFixture(deployBankFixture);
      
      const amount =  ethers.utils.parseEther("2");

      await bank.deposit({value: amount});

      const custommerBalance = await bank.bankBalance();

      await expect(bank.withdraw({value: amount}))
        .to.emit(bank, "Withdraw")
        .withArgs(amount, custommerBalance-amount);
    });
  });
});
