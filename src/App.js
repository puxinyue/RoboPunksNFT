import './App.css';
import NavBar from './components/NavBar';
import MainMint from './components/MainMint';
import { useState } from 'react';
import { ChakraProvider} from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/theme-utils';
function App() {
  const [accounts, setAccounts] = useState([]);
  // 创建主题配置
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: '#303030',
          color: 'white',
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          _hover: {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        },
      },
    },
  });
  return (
    <ChakraProvider theme={theme}>
    <div className="App">
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <MainMint accounts={accounts} setAccounts={setAccounts} />
      <div className="moving-background"></div>
    </div>
    </ChakraProvider>
  );
}

export default App;
