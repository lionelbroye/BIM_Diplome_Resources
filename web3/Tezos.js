
//@ main value
var Tezos;

class TezosNetWork
{

    constructor(rpcnodename)
    {
        this.SetRPCNode(rpcnodename);
        this.rpcnode = rpcnodename;
        // Set a default contract or a default block or a default transaction or a defautl wallet 
    }
    IsCurrentRPCEquals(rpcname)
    {
        return rpcname == this.rpcnode;
    }
    SetRPCNode(name)
    {

        name = name.toLowerCase();
        switch (name)
        {
            case "main": this.module = new taquito.TezosToolkit('https://mainnet.smartpy.io');break;
            case "ithacanet": this.module = new taquito.TezosToolkit('https://rpc.ghostnet.teztnets.xyz');  break;
            case "jakartanet": this.module = new taquito.TezosToolkit('https://rpc.jakartanet.teztnets.xyz');break;
            case "ghostnet": this.module = new taquito.TezosToolkit('https://ghostnet.smartpy.io');break;

        }
    }
    async AuthentificateFromFundRaiser(provider, mnemonic, password, mail)
    {
        /*
        var provider= "https://hangzhounet.smartpy.io/"
        var mnemonic= "twenty aware media quality beyond summer milk hurry library unknown hover permit conduct switch slogan"
        var password= "TUBtLEyYi5"
        var email= "hfezymib.ytwslmjd@tezos.example.org"
        */
        var sign = InMemorySigner.InMemorySigner.fromFundraiser(mail, password, mnemonic);
        await this.module.setProvider({
        signer: sign
        });
        console.log(sign)
        console.log(sign.publicKeyHash())
    }
    async AuthentificateFromSecretKey(secretKey)
    {
        // ma clé : edskRhu5ubPrB83qZkGgMZ77jfTMaKC4NnxsArenpxB5FrLQNHnja8r3m8FvP5HDAGJpqHq7FL2MbpqtwK7qNL6tCYg7RrPabD
        var sign= await InMemorySigner.InMemorySigner.fromSecretKey(secretKey)
        await this.module.setProvider({
        signer: sign
        });
        console.log(sign)
        console.log(sign.publicKeyHash())
    }
    // @ Call this to avoid error 
    async Init()
    {
        await this.LoadLatestBlock();
    }
    async Test()
    {
        // @ Get a balance at address 
        var balance = await this.module.tz.getBalance('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY');
        console.log(balance.toNumber() / 1000000  + 'tz');
        // @ Get Current block length 
        //var block = await this.module.rpc.getBlock(); 
        //console.log(block);
        // @ try get semi hack 
        var index = 8;
        var block = await this.module.rpc.getBlock({ block: index.toString() });
        console.log(block.hash);
    }
    
    async GetBlockchainLength()
    {
        var level = (await this.module.rpc.getBlockHeader()).level;
        this.chainlength = level;
        return level;
    }
    async LoadLatestBlock()
    {
        var latest = await this.module.rpc.getBlockHeader();
        this.block = latest;
        console.log(latest);
        this.chainlength = this.block.level;
        return this.block;
    }
    // @ this cannot be used if @taquito/rpc not loaded. See Html
    async LoadBlockAtIndex(index)
    {
        var block = await this.module.rpc.getBlock({ block: index.toString() });
        this.block = block;
        console.log(this.block);
        this.DebugBlockObject();
        return this.block;
    }
    SetInternalBlock(bloc)
    {
        this.block = bloc;
    }
    // @ int
    GetBlockIndex()
    {
        return this.block.header.level;
    }
    // @ string
    GetBlockHash()
    {
        // BLEoQGpV3sZ5At92LE8hMqzt5Jh3UtaaFhcZRD936Sc5yy7qfV1
        return this.block.hash;
    }
    GetBlockHexNonce() //wonky
    {
        // return an hex nonce
        // Get Object -> proof_of_work_nonce which is an Hex value
        return this.block.header[Object.keys(this.block.header)[10]];
    }
    GetBlockNonce()
    {
        // return an hex nonce
        // Get Object -> proof_of_work_nonce which is an Hex value
        return HexToDec(this.block.header[Object.keys(this.block.header)[10]]);
    }
    DebugBlockObject()
    {
        var blockl=  Object.keys(this.block.header).length;
        var i;
        for (i =0; i < blockl; i++)
        {
            console.log(i + " : " + this.block.header[Object.keys(this.block.header)[i]])
        }
    }
    // @ string
    GetBlockStringTimeStamp()
    {
        // eg : 2022-07-09T13:05:45Z
        return this.block.header.timestamp;
    }
    // @ Unix
    GetBlockTimeStamp()
    {
        // eg : 2022-07-09T13:05:45Z
        var date = new Date(this.block.header.timestamp);
        return Math.floor(date.getTime() / 1000);
    }
    GetBlockPreviousHash()
    {
        return this.block.header.predecessor;
    }
    // @ string
    GetBlockSignature()
    {
        // eg : sigqThvmbsgfBaPKo4HCp8SeTXG5MvPZL6nGxFK6Nb1XZG43JpaxYaVX2t9Qtvkeueqb4AuCvLLdFae4fGS4voHv3H5Mgogt
        return this.block.header.signature;
    }
  
    async LoadContract(contractaddr)
    {
        this.contract =  await this.module.contract.at(contractaddr);
        this.contract.storage = await this.contract.storage();
        console.log( this.contract.storage);
        console.log(this.contract);
        // Build storage map
        if ( typeof this.contract.storage.keyMap === 'undefined')
            return;
        this.storageMap = new Array();
        for (const [key, value] of this.contract.storage.keyMap.entries()) 
        {
            console.log("Adding key " + value);
            this.storageMap.push(value);
        }
    }
    async GetContractTransactionHistory(filter)
    {
        var url = 'https://api.ghostnet.tzkt.io/v1/operations/transactions/?target='+this.contract.address+'&micheline=3&select='+filter
        var response = await fetch(url);
        var json = await response.json()
        return json
    }
    // @ Get number of elements in contract storage 
    GetStorageLength()
    {
        return this.storageMap.length;
    }
    GetContractAddress()
    {
        return this.contract.address;
    }
    // @ This was working in any format until there
    GetStorageValueAtIndex(index)
    {
        if (typeof this.contractstorage.keyMap === 'undefined')
        {
            return this.contractstorage[Object.keys(this.contractstorage)[index]];
        }
        return this.contractstorage.get(this.storageMap[index]);
    }
    GetStorageKeyAtIndex(index)
    {
        
        if ( typeof this.contractstorage.keyMap === 'undefined')
        {
           return Object.keys(this.contractstorage)[index];
        }
        return this.storageMap[index];
    }
}

function InitTezosNetwork()
{
    Tezos = new TezosNetWork("ithacanet");
    Tezos.Test();
 
   
}