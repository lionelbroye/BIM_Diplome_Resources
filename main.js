
async function Boot()
{
    // Initialiser les 2 réseaux (Ethereum, Tezos)
    InitEthereumNetwork()
    InitTezosNetwork()
    
    // Se connecter au réseau Tezos 'ghostnet'
    SwitchToTezosNetwork(nomdureseau='ghostnet')
    
    // Charger en mémoire son smartcontract
    await Network.LoadContract(adresse='KT1HLk6LmWmMxX8VA2kumNkgPqvjojgXyA29')
    
    // Je crée une nouvelle instance du smartdiplome à partir du contrat chargé en mémoire.
    // SmartDiplome est une interface plus simple pour intérargir/lire avec le contrat
    var mySmartDiplome = new SmartDiplome(Network.contract);

    // Je charge l'historique des transactions du SmartDiplome
    await mySmartDiplome.GetTransactionHistory()
    
    // Ne pas continuer si l'historique de transaction est vide
    if ( mySmartDiplome.history == null )
        return;
    
    // Pour chaque transaction dans l'historique ....
    var xCursor = 0
    for (var txNumber = 0 ; txNumber < mySmartDiplome.history.length; txNumber++ )
    {
        // J'appelle une fonction qui crée automatique une grille et imprime les informations déjà parsé de cette transaction
        mySmartDiplome.DebugCreateGridFromDiplomaTransaction( gridBox = new Box(xCursor,0,500,500), transactionNumber = txNumber)
        
        // J'augmente mon curseur de 550 pixel sur l'axe X pour éviter que les grilles se superposent
        xCursor += 550
    }
    
   
    
    
}








