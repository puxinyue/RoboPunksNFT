import React, { useEffect, useCallback } from "react";
import { Box, Button, Flex, Image, Link, Spacer, useToast } from "@chakra-ui/react";
import Facebook from "../assets/social-media-icons/facebook_32x32.png";
import Twitter from "../assets/social-media-icons/twitter_32x32.png";
import Email from "../assets/social-media-icons/email_32x32.png";

const NavBar = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);
  const toast = useToast();

  // 监听钱包事件
  useEffect(() => {
    if (window.ethereum) {
      // 监听账户变化
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // 监听链变化
      window.ethereum.on('chainChanged', handleChainChanged);
      // 监听连接
      window.ethereum.on('connect', handleConnect);
      // 监听断开连接
      window.ethereum.on('disconnect', handleDisconnect);
    }

    // 清理监听器
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  // 处理账户变化
  const handleAccountsChanged = useCallback((newAccounts) => {
    setAccounts(newAccounts);
    if (newAccounts.length === 0) {
      toast({
        title: "钱包已断开连接",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "钱包已切换",
        description: `当前账户: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [setAccounts, toast]);

  // 处理链变化
  const handleChainChanged = () => {
    window.location.reload();
  };

  // 处理连接
  const handleConnect = () => {
    toast({
      title: "钱包已连接",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // 处理断开连接
  const handleDisconnect = () => {
    toast({
      title: "钱包已断开连接",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // 连接钱包
  const connectAccount = async () => {
    if (!window.ethereum) {
      toast({
        title: "未检测到 MetaMask",
        description: "请安装 MetaMask 钱包",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    } catch (error) {
      toast({
        title: "连接失败",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 社交媒体链接配置
  const socialLinks = [
    { href: "https://www.facebook.com", icon: Facebook, alt: "Facebook" },
    { href: "https://www.twitter.com", icon: Twitter, alt: "Twitter" },
    { href: "https://www.gmail.com", icon: Email, alt: "Email" },
  ];

  // 导航菜单项配置
  const menuItems = ["About", "Mint", "Team"];

  return (
    <Flex justify="space-between" align="center" padding="30px">
      {/* Left Side - Social Media Icons */}
      <Flex justify="space-around" width="40%" padding="0 75px">
        {socialLinks.map((link, index) => (
          <Link href={link.href} key={index} isExternal>
            <Image 
              src={link.icon} 
              alt={link.alt}
              boxSize="42px" 
              margin="0 15px"
              _hover={{ transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
          </Link>
        ))}
      </Flex>

      {/* Right Side - Menu Items and Connect Button */}
      <Flex
        justify="space-around"
        align="center"
        width="40%"
        padding="30px"
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <Box 
              margin="0 15px"
              _hover={{ 
                color: "teal.200",
                cursor: "pointer" 
              }}
              transition="color 0.2s"
            >
              {item}
            </Box>
            {index < menuItems.length - 1 && <Spacer />}
          </React.Fragment>
        ))}
        <Spacer />

        {/* Connect Button */}
        {isConnected ? (
          <Box margin="0 15px">
            {`${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`}
          </Box>
        ) : (
          <Button
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
            _hover={{
              backgroundColor: "#e5648d",
              transform: "scale(1.05)"
            }}
            transition="all 0.2s"
          >
            connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;