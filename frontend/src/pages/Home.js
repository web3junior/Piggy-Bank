import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "../artifacts/contracts/Bank.sol/Bank.json";
import {BANK_CONTRACT_ADDRESS} from "../config";
import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  ArrowUpIcon,
  ArrowDownIcon
} from "@chakra-ui/icons";
import { useToast } from '@chakra-ui/react'
import background from "../assets/bg.jpg";

const Home = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ withdraw: "", deposit: "", bankName: "" });
  const [customerTotalBalance, setCustomerTotalBalance] = useState(0);
  const [currentBankName, setCurrentBankName] = useState("Bank Name");
  const [customerAddress, setCustomerAddress] = useState(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const toast = useToast();

  const contractAddress = BANK_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const notify = (type='success', msg='Successful') => {
    toast({
      description: msg,
      status: type,
      duration: 9000,
      isClosable: true,
    });
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getBankName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let bankName = await bankContract.bankName();
        setCurrentBankName(bankName);
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const customerBalanceHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
        let balance = await bankContract.customerBalnace();
        setCustomerTotalBalance(utils.formatEther(balance));
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deposityMoneyHandler = async (event) => {
    setDepositLoading(true);
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await bankContract.deposit({ value: ethers.utils.parseEther(inputValue.deposit) });
        await txn.wait();

        customerBalanceHandler();
        notify();
        
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
    setDepositLoading(false);
  }

  const withDrawMoneyHandler = async (event) => {
    setWithdrawLoading(true);
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await bankContract.withdraw({ value: ethers.utils.parseEther(inputValue.withdraw) });
        await txn.wait();

        customerBalanceHandler();
        notify();

      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
    setWithdrawLoading(false);
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getBankName();
    customerBalanceHandler();
  }, [isWalletConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Flex padding='50px 28px'>
        <Box flex='1' bgImage={`url(${background})`}
          bgRepeat="no-repeat"
          bgSize="contain">
        </Box>
        <Box flex='1' padding='120px 0px'>
          <Stack spacing={3}>
            <Text fontSize='5xl' color='#385a64'>{currentBankName}</Text>
            
            <Text fontSize='md'>Bank Contract Address: {BANK_CONTRACT_ADDRESS} </Text>
            <Text fontSize='md'>Your Wallet Address: {customerAddress}</Text>
            <Text fontSize='md'>Balance: {customerTotalBalance} eth</Text>

            <InputGroup size='md'>
              <InputLeftElement
                pointerEvents='none'
                children={<ArrowUpIcon color='gray.300' />}
              />
              <Input
                name='deposit'
                pr='4.5rem'
                type='number'
                placeholder='Enter amount'
                focusBorderColor='#385a64'
                onChange={handleInputChange}
              />
              <InputRightElement width='6rem'>
                <Button w='6rem' size='md' onClick={deposityMoneyHandler} bg='#e296de' color='#fff'>
                  {depositLoading ? 'Saving...' : 'Saving'}
                </Button>
              </InputRightElement>
            </InputGroup>

            <InputGroup size='md'>
              <InputLeftElement
                pointerEvents='none'
                children={<ArrowDownIcon color='gray.300' />}
              />
              <Input
                name='withdraw'
                pr='4.5rem'
                type='number'
                placeholder='Enter amount'
                focusBorderColor='#385a64'
                onChange={handleInputChange}
              />
              <InputRightElement width='6rem'>
                <Button w='6rem' size='md' onClick={withDrawMoneyHandler} bg='#e296de' color='#fff'>
                  {withdrawLoading ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

export default Home;
