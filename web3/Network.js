var Network;

function SwitchToTezosNetwork(rpcnode)
{
    if (!Tezos.IsCurrentRPCEquals(rpcnode))
        Tezos.SetRPCNode(rpcnode);
    Network = Tezos;
}
function SwitchToEthereumNetwork(rpcnode)
{
    if (!Ethereum.IsCurrentRPCEquals(rpcnode))
        Ethereum.SetRPCNode(rpcnode);
    Network = Ethereum;
    
}