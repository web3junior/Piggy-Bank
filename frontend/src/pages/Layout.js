import { useState, useEffect, useContext } from 'react';
import { Outlet, Link as ReactLink } from "react-router-dom";
import { ethers } from "ethers";
import abi from "../artifacts/contracts/Bank.sol/Bank.json";
import {BANK_CONTRACT_ADDRESS} from "../config";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Button,
  useDisclosure,
  Link,
  Spinner,
  Badge
} from "@chakra-ui/react";
import { 
  HamburgerIcon
} from "@chakra-ui/icons";
import { useToast } from '@chakra-ui/react'
import UserContext from "../UserContext";

const Layout = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isBankerOwner, setIsBankerOwner] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const {setUser} = useContext(UserContext);
  const toast = useToast();

  const contractAddress = BANK_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  const notify = (type='success', msg='Successful') => {
    toast({
      description: msg,
      status: type,
      duration: 9000,
      isClosable: true,
    });
  }

  const checkIfWalletIsConnected = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setUser(account);
        setIsWalletConnected(true);
        setCustomerAddress(account);
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const getOwner = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let owner = await bankContract.owner();

        if(customerAddress && customerAddress.toUpperCase() === owner.toUpperCase()){
          setIsBankerOwner(true);
        }
      } else {
        notify("error","Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getOwner();
  }, [isWalletConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loading ? 
      <div style={{ 
        background: "rgb(0 0 0 / 14%)",
        width: "100%", 
        height: "100vh",
        position: "absolute", 
        zIndex: "3"
      }}>
        <div style={{ 
          position: "absolute", 
          left: "0",
          right: "0", 
          top: "100px",
          textAlign: "center"
        }}>
          <Spinner color='#e296de' size='xl' label='Loading...'/>
          <p>Please wait for me</p>
        </div>
      </div> : ''}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={6}
      >
        <Flex align="center" mr={5}>
          <Heading size="lg" letterSpacing={"tighter"} color='#385a64' as={ReactLink} to='/home'>
            Piggy Bank
            <Badge ml='2' bg='#e296de' color='#fff' py='1' px='2' borderRadius='3'>
              Mumbai
            </Badge>
          </Heading>
        </Flex>

        <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
          <HamburgerIcon />
        </Box>

        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: isOpen ? "block" : "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          justify="center"
          flexGrow={1}
          spacing='40px'
          textTransform='uppercase'
          fontSize='13px'
          color='#385a64'
          mt={{ base: 4, md: 0 }}
        >
          <Link as={ReactLink} to='/home'>
            Home
          </Link>
          <Link as={ReactLink} to='/transactions'>
            Transactions
          </Link>
          {isBankerOwner ? 
          <Link as={ReactLink} to='/admin'>
            Admin
          </Link> : '' }
          <Link href='https://faucets.chain.link/mumbai' isExternal>
            Mumbai Faucet
          </Link>
        </Stack>

        <Box>
          <Button
            bg='#e296de' 
            color='#fff'
            isDisabled={isWalletConnected}
            onClick={checkIfWalletIsConnected}
          >
            {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </Button>
        </Box>
      </Flex>

      <Outlet />
    </>
  );
}

export default Layout;
