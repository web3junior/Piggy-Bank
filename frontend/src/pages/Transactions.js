import { useState, useEffect } from 'react';
import { utils } from "ethers";
import { createClient } from "urql";
import {SUBGRAPH_URL,BANK_CONTRACT_ADDRESS} from "../config";
import {
  Box,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr, 
  Th, 
  Td, 
  Tbody,
  Link
} from "@chakra-ui/react";
import {
  ExternalLinkIcon
} from "@chakra-ui/icons";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    const listingsQuery = `
      query ListingsQuery {
        depositEntities {
          id
          customer
          amount
        }
      }
    `;

    const urqlClient = createClient({
      url: SUBGRAPH_URL,
    });
    const response = await urqlClient.query(listingsQuery).toPromise();
    const depositEntities = response.data.depositEntities;
    setTransactions(depositEntities);
  }

  const wei2Ether = (wei) => {
    return utils.formatEther(wei);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Box padding='50px 28px'>
        <Text fontSize='lg' textAlign='center'>Deposit history</Text>
        <TableContainer>
          <Table variant='striped'>
            <TableCaption>
              <Link href={'https://mumbai.polygonscan.com/address/' + BANK_CONTRACT_ADDRESS} isExternal>
                Chain Testnet Explorer <ExternalLinkIcon mx='2px' />
              </Link>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Customer address</Th>
                <Th>Amount (eth)</Th>
              </Tr>
            </Thead>
            <Tbody>
            {transactions.map((txn,idx) => 
              <Tr key={idx}>
                <Td>{txn.customer}</Td>
                <Td>{wei2Ether(txn.amount)}</Td>
              </Tr>
            )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Transactions;
