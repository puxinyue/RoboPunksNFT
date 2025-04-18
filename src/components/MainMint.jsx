import { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import RoboPunksNFTAbi from "../abi/RoboPunksNFT.json";
import { contractAddress } from "./comm";

const MainMint = ({ accounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = Boolean(accounts[0]);
  const toast = useToast();

  async function handleMint() {
    if (window.ethereum) {
      setIsLoading(true);
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, RoboPunksNFTAbi, signer);

        const response = await contract.mint(mintAmount, {
          value: parseEther((0.02 * mintAmount).toString()),
        });
        
        // 等待交易确认
        toast({
          title: "Transaction Submitted",
          description: "Please wait for confirmation...",
          status: "info",
          duration: null,
          isClosable: true,
        });
        
        await response.wait();
        
        toast({
          title: "Mint Successful!",
          description: `Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

      } catch (err) {
        console.log("error", err);
        toast({
          title: "Mint Failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <Text fontSize="48px" textShadow="0 5px #000000">
          RoboPunks
        </Text>
        <Text
          fontSize="30px"
          letterSpacing="-5.5%"
          fontFamily="VT323"
          textShadow="0 2px 2px #000000"
        >
          It's 2078. Can the RoboPunks NFT save humans from destructive rampant
          NFT speculation? Mint Robopunks to find out!
        </Text>
        {isConnected ? (
          <div>
            <Flex justify="center" align="center">
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                marginRight="10px"
                onClick={handleDecrement}
                isDisabled={isLoading || mintAmount <= 1}
                isLoading={isLoading}
              >
                -
              </Button>
              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                marginLeft="10px"
                onClick={handleIncrement}
                isDisabled={isLoading || mintAmount >= 3}
                isLoading={isLoading}
              >
                +
              </Button>
            </Flex>
            <Button
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
              onClick={handleMint}
              isLoading={isLoading}
              loadingText="Minting..."
            >
              Mint Now
            </Button>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#D6517D"
          >
            You must be connected to Mint.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MainMint;