// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入 OpenZeppelin 的标准合约
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 


/**
 * @title RoboPunksNFT
 * @dev 这是一个机器人朋克NFT合约，实现了ERC721标准
 * 包含了铸造限制、定价机制和提现功能
 */
contract RoboPunksNFT is ERC721, ERC721Burnable, ERC721Enumerable, ERC721URIStorage, Ownable {
    // 状态变量
    uint256 public mintPrice;        // 每个NFT的铸造价格
    uint256 public maxSupply;        // NFT的最大供应量
    uint256 public maxPerWallet;     // 每个钱包地址最多可以铸造的数量
    bool public isPublicMintEnabled; // 是否开启公开铸造的开关
    address payable public withdrawWallet; // 提现接收地址
    mapping(address => uint256) public walletMinted; // 记录每个钱包已铸造的数量
    string private METADATA_URI = "ipfs://QmatiLZoj7PZwU3gcqMwAhN5QmN1GoBuxjRWbk9DxQZtfB";
    /**
     * @dev 构造函数
     * 初始化NFT合约的基本参数
     * 设置名称为'RoboPunks'，符号为'RP'
     */
    constructor() ERC721('RoboPunks', 'RP') Ownable(msg.sender) {
        mintPrice = 0.02 ether;    // 设置铸造价格为0.02 ETH
        maxSupply = 1000;          // 设置最大供应量为1000
        maxPerWallet = 3;          // 设置每个钱包最多可铸造3个
        isPublicMintEnabled = false; // 初始化时关闭公开铸造
    }

    /**
     * @dev 设置是否开启公开铸造
     * @param _isPublicMintEnabled 是否启用公开铸造的布尔值
     */
    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    /**
     * @dev 设置铸造价格
     * @param _mintPrice 新的铸造价格
     */
    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }

    /**
     * @dev 增加最大供应量
     * @param _maxSupply 要增加的供应量
     */
    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply += _maxSupply;
    }
   
    

    /**
     * @dev 返回指定tokenId的URI
     * @param tokenId NFT的唯一标识符
     * @return 完整的token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function setMetadataURI(string memory _metadataURI) external onlyOwner {
        METADATA_URI = _metadataURI;
    }

    function getMetadataURI() external view returns (string memory) {
        return METADATA_URI;
    }

    /**
     * @dev 提取合约中的ETH到指定钱包
     * 只有合约拥有者可以调用
     */
    function withdraw() external onlyOwner {
        require(withdrawWallet != address(0), "Withdrawal address not set");
        (bool success, ) = withdrawWallet.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    //设置提现地址
    function setWithdrawWallet(address _withdrawWallet) external onlyOwner {
        withdrawWallet = payable(_withdrawWallet);
    }
    
    /**
     * @dev 铸造NFT的主要函数
     * @param quantity 要铸造的NFT数量
     * 要求：
     * 1. 不超过最大供应量
     * 2. 支付足够的ETH
     * 3. 公开铸造已开启或是合约拥有者
     * 4. 不超过每个钱包的最大限制
     */
    function mint(uint256 quantity) external payable {
        uint256 currentSupply = totalSupply();
        require(currentSupply + quantity <= maxSupply, "Max supply reached");
        require(msg.value >= mintPrice * quantity, "Insufficient funds");
        require(isPublicMintEnabled || msg.sender == owner(), "Public mint is not enabled");
        require(walletMinted[msg.sender] + quantity <= maxPerWallet, "Max per wallet reached");
        
        // 循环铸造指定数量的NFT
        //如果已经铸造了 5 个 NFT，则 totalSupply = 5
        //这 5 个 NFT 的 tokenId 分别为 0, 1, 2, 3, 4
        //所以这里totalSupply可以当tokenId使用
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = currentSupply + i;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, METADATA_URI);
        }
        // 更新该钱包的铸造数量
        walletMinted[msg.sender] += quantity;
    }
    // The following functions are overrides required by Solidity
    
     function _update(address to, uint256 tokenId, address auth)    
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}