import { useState, useEffect, useContext } from 'react';
import { ethers } from "ethers";
import abi from "../artifacts/contracts/Bank.sol/Bank.json";
import {BANK_CONTRACT_ADDRESS} from "../config";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import UserContext from "../UserContext";

const Admin = () => {
  const {user} = useContext(UserContext);
  const [currentBankName, setCurrentBankName] = useState("Bank Name");
  const [bankName, setBankNameInput] = useState("");
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

  const getBankName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let bankName = await bankContract.bankName();
        setCurrentBankName(bankName);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const setBankName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let _bankName = await bankContract.rename(bankName);
        setCurrentBankName(_bankName);
        notify();
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBankName();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Flex padding='50px 28px'>
        <Box flex='1' textAlign='center'>
          <Text fontSize='md'>The bank name:</Text>
          <Input 
            value={bankName ? bankName : currentBankName}
            name='bankName'
            size='lg'
            focusBorderColor='#385a64'
            onChange={(e) => setBankNameInput(e.target.value)}
          />
          <Button mt={2} onClick={setBankName} bg='#e296de' color='#fff'>Change bank name</Button>
        </Box>
      </Flex>
    </>
  );
}

export default Admin;
