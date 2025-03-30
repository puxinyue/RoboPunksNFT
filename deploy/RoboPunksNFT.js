

module.exports = async ({getNamedAccounts,deployments}) => {
    const { deploy } = deployments;
    const { firstAccount } = await getNamedAccounts();

    const robopunks = await deploy("RoboPunksNFT", {
        from: firstAccount,
        log: true,
        args: [],
    }); 

    console.log("RoboPunksNFT deployed to:", robopunks.address);
};

module.exports.tags = ["all", "robopunks"];
