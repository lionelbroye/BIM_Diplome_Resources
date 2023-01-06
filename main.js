 
async function Boot()
{
    InitEthereumNetwork()
    InitTezosNetwork()
    
    SwitchToTezosNetwork(nomdureseau='ghostnet')
    
    await Network.LoadContract(adresse='KT1HLk6LmWmMxX8VA2kumNkgPqvjojgXyA29')
    
    console.log("[0] " + Network.contractstorage.legalText01)
    
    var history = await Network.GetContractTransactionHistory('parameter,timestamp,gasUsed')
    console.log(history)
    var date = new Date(history[0].timestamp)
    console.log(date)
    
    var Grille = new VisualGrid()
    Grille.SetGeneralDimension(x=0,y=0,w=500,h=500)
    
    Grille.AddRow(
        name="Hour",
        rangeMin=0,
        rangeMax=24,
        granularity=1,
        value=date.getHours(),
        borderMargin=50
    )
     Grille.AddRow(
        name="Minute",
        rangeMin=0,
        rangeMax=60,
        granularity=1,
        value=date.getMinutes(),
        borderMargin=50
    )
    
    Grille.UpdateRowData(nomligne="Age", 50)
}








