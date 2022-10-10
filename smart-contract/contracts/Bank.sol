// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bank {
    string public bankName;
    address public owner;
    mapping(address => uint) public customers;

    event Deposit(address customer, uint amount);
    event Withdraw(uint amount, uint balance);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string memory _bankName) {
        owner = msg.sender;
        bankName = _bankName;
    }

    function rename(string memory _newName) external onlyOwner {
        bankName = _newName;
    }

    function deposit() public payable{
        require(msg.value > 0, "Your deposit should > 0");
        customers[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public payable{
        require(msg.value <= customers[msg.sender], "You not enough balance in the bank");
        customers[msg.sender] -= msg.value;
        (bool sent,) = payable(msg.sender).call{value: msg.value}("");
        require(sent, "Fail withdraw");
        emit Withdraw(msg.value, customers[msg.sender]);
    }

    function bankBalance() public view onlyOwner returns(uint){
        return address(this).balance;
    }

    function customerBalnace() public view returns(uint){
        return customers[msg.sender];
    }
}
