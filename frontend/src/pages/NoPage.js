import {
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";
import background from "../assets/404.jpg";

const NoPage = () => {
  return (
    <Flex padding='50px 28px' alignContent='center'>
      <Box flex='1' p='6' rounded='md' bg='white'>
        <Image src={`${background}`} alt='Dan Abramov' htmlWidth='500' mx="auto"/>
      </Box>
    </Flex>
  );
}

export default NoPage;
