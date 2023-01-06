
// Smartcontract par défault de smartpy : KT1P8UqyTrbR6XJtWFkKNRLSMLezVHzMFKut
async function Web3_ExampleA()
{
    InitEthereumNetwork();
    InitTezosNetwork();
    // J'initialise ma connexion au réseau ghostnet
    SwitchToTezosNetwork("ghostnet");
    // Ici je peux afficher le nombre de block qui existe dans le ghostnet
    var length = await Network.GetBlockchainLength()
    console.log("length of blockchain is " + length);
    // Je charge le contrat a son adresse
    await Network.LoadContract("KT1P8UqyTrbR6XJtWFkKNRLSMLezVHzMFKut")
    // J'imprime dans la console du navigateur le storage du smartcontract
    console.log(Network.contractstorage)
    // Je vois que je peux accéder a la valeur de mon storage par l'objet 'c'
    console.log("storage : " + Network.contractstorage.c); 
    
    // Je m'authentifie à l'aide de ma clé secrete (celle ci peut etre recupérer a partir du wallet)
    await Network.AuthentificateFromSecretKey('edskRhu5ubPrB83qZkGgMZ77jfTMaKC4NnxsArenpxB5FrLQNHnja8r3m8FvP5HDAGJpqHq7FL2MbpqtwK7qNL6tCYg7RrPabD')
    
    // J'appelle la methode divide pour diviser le nombre dans mon smartcontract
    // Network.contract.methods.divide(6).send();
    
    //J'apelle la methode replace pour changer le nombre de mon smartcontract par le nombre 15
    //Network.contract.methods.replace(15).send();
    
    // J'appelle la methode double. Lancer sans argument elle ne semble pas fonctionner. Pour voir le json des parametres, il faut plutot observer la structure de 
    // données d'un 'contract call' à partir d'un explorateur comme celui de smartpy
    var contractOperation = await Network.contract.methods.double({ "prim": "Unit" }).send();
    // l'objet de retour de la methode .send() nous permet d'avoir un suivi sur notre transaction. Voir https://tezostaquito.io/typedoc/classes/_taquito_taquito.operation.html
    console.log(contractOperation);
    
    // Ici j'attend que mon operation a été confirmé par au moins 3 noeuds.
    var confirmedBySomeNodes = await contractOperation.confirmation(3);
    console.log("Transaction confirmé:" + contractOperation.hash)
    
}

// Smartcontract HelloWorld : KT1NAiT2KhBbdbXxpGquzcA3hTpuvcfZ4vdb
async function  Web3_ExampleB()
{
    InitEthereumNetwork();
    InitTezosNetwork();
     // J'initialise ma connexion au réseau ghostnet
    SwitchToTezosNetwork("ghostnet");
    
    // Je me connecte a un wallet avec une clé secrete 
    await Network.AuthentificateFromSecretKey('edskRhu5ubPrB83qZkGgMZ77jfTMaKC4NnxsArenpxB5FrLQNHnja8r3m8FvP5HDAGJpqHq7FL2MbpqtwK7qNL6tCYg7RrPabD')
    
    // Je charge mon contrat à une adresse
    await Network.LoadContract("KT1NAiT2KhBbdbXxpGquzcA3hTpuvcfZ4vdb")
    
    // J'imprime dans la console du navigateur le storage du smartcontract
    console.log(Network.contractstorage)
    
    // J'imprime dans la console du navigateur l'object 'smartcontract' créé par la librairie taquito
    var contractOperation = await Network.contract.methods.default("hello").send()
}
// Smartcontract Incrementor : KT1SZQGXPZuC6c3JiLu1peSYMvKrL8m34ufZ. Ecrire dans le contrat par des clics dans la page web
async function Web3_ExampleC()
{
    InitEthereumNetwork();
    InitTezosNetwork();
    // J'initialise ma connexion au réseau ghostnet
    SwitchToTezosNetwork("ghostnet");
    // Je me connecte a un wallet avec une clé secrete 
    await Network.AuthentificateFromSecretKey('edskRhu5ubPrB83qZkGgMZ77jfTMaKC4NnxsArenpxB5FrLQNHnja8r3m8FvP5HDAGJpqHq7FL2MbpqtwK7qNL6tCYg7RrPabD')
    // Je charge mon contrat à une adresse
    await Network.LoadContract("KT1SZQGXPZuC6c3JiLu1peSYMvKrL8m34ufZ")
    console.log(Network.contract)
    console.log( Network.contract.methods)

    // Je crée une fonction contenant le code à déclencher : appelle la méthode par défault de mon smartcontract. Cette fonction sera dans la variable 'contractInteraction' 
    var contractInteraction = function(){Network.contract.methods.default({ "prim": "unit" }).send(); console.log("Calling increment to the smartcontract")}
    
    // J'attache cette fonction à l'activité du clic de souris du navigateur
    window.onmousedown = contractInteraction
}

// Get history of transactions of contract : KT1SZQGXPZuC6c3JiLu1peSYMvKrL8m34ufZ
// GET : https://api.ghostnet.tzkt.io/v1/operations/transactions/?target=KT1SZQGXPZuC6c3JiLu1peSYMvKrL8m34ufZ&micheline=3&select=storage,parameter,sender,target,timestamp,address,block,hash,status
async function Web3_GetHistoryOfTransaction()
{
    var url = 'https://api.ghostnet.tzkt.io/v1/operations/transactions/?target=KT1SZQGXPZuC6c3JiLu1peSYMvKrL8m34ufZ&micheline=3&select=storage,parameter,sender,target,timestamp,address,block,hash,status,gasUsed'
    const response = await fetch(url);
    var json = await response.json()
    console.log(json)
    for (var i = 0 ; i < json.length;i++)
    {
        
        var value = json[i].storage.split(':')[1]
        var storageNumber = parseInt(value.substr(1,value.length-3))
        console.log("storage number : " + storageNumber + " at " + json[i].timestamp)
        
    }
    
}

// Getting history for the HelloWorld contract : KT1NAiT2KhBbdbXxpGquzcA3hTpuvcfZ4vdb
async function Web3_GetHistoryOfTransactionB()
{
    
    var url = 'https://api.ghostnet.tzkt.io/v1/operations/transactions/?target=KT1NAiT2KhBbdbXxpGquzcA3hTpuvcfZ4vdb&micheline=3&select=storage,parameter,sender,target,timestamp,address,block,hash,status,gasUsed'
    const response = await fetch(url);
    var json = await response.json()
    console.log(json)
    for (var i = 0 ; i < json.length;i++)
    {
        var value = json[i].storage.split(':')[1]
        var phrase = value.substr(1,value.length-3)
        console.log("word written: " + phrase + " at " + json[i].timestamp)
        
    }
}
