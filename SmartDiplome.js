class SmartDiplome
{
    constructor(contractObject)
    {
        this.contract = contractObject;
        this.history = null;
        this.legalTexts = this.GetLegalTextsAsArray()
    }
    
    async GetTransactionHistory()
    {
        var historyJSON = await Network.GetContractTransactionHistory('parameter,timestamp,gasUsed,block,hash,sender,target')
        //console.log(this.history)
        //console.log(this.history[1].parameter)
        //console.log(this.history[1].parameter.value)
       
        // Parse transaction parameters for each transaction and store information in a readable object 
        this.history = new Array();
        for ( var i = 0 ; i < historyJSON.length ;i ++ )
        {
            var txparams = await this.ParseTransactionParameters(historyJSON[i].parameter.value)
            var SmartDiplomeTransaction = 
                {
                  gas :   historyJSON[i].gasUsed,
                  timestamp : new Date(historyJSON[i].timestamp),
                  parameters : txparams,
                  block:historyJSON[i].block,
                  hash:historyJSON[i].hash,
                  from:historyJSON[i].sender.address,
                  to:historyJSON[i].target.address,
                };
            this.history.push(SmartDiplomeTransaction);
            
        }
        
    }
    
    GetLegalTextsAsArray()
    {
        var r = new Array()
        r.push("ecole Superieure d Art et de Design Orleans");
         r.push("Diplome Superieur de Recherche en Design");
         r.push("Vu la deliberation du Conseil d Administration de l eSAD Orleans du 5 mars 2020");
         r.push("Vu les pieces justificatives attestant de l inscription de PRENOM_candidat_e NOM_candidat_e ");
         r.push("Vu le proces-verbal du jury attestant que PRENOM_candidat_e NOM_candidat_e a soutenu le DATE_smartdiplome des travaux de recherche de niveau 3e cycle portant sur : SUJET_recherche , prepares au sein de l unite de recherche ECOLAB   ");
         r.push("Vu la deliberation du jury, compose de PRENOM_president_e NOM_president_e PRENOM_rapporteur_trice NOM_rapporteur_trice    PRENOM_membreA NOM_membreA    PRENOM_membreB NOM_membreB    PRENOM_membreC NOM_membreC    ");
         r.push("Le Diplome Superieur de Recherche en Design de l ecole Superieure d Art et de Design d Orleans est delivre a PRENOM_candidat_e NOM_candidat_e ");
         r.push( "ne-e le DATEDENAISSANCE_candidat_e ");
         r.push("a LIEUDENAISSANCE_candidat_e ");
         r.push("Au titre de l annee DEBUT_annee - FIN_annee ");
         r.push("Fait a Orleans le DATE_edition ");
         return r; 
        
    }
    
    async BuildDiplomaTextFromTransactionParameters(parameters)
    {
        var parsed = new Array()
        for (var i = 0 ; i < this.legalTexts.length;i++)
        {
            var pLine = this.legalTexts[i];
            for ( var b = 0 ; b < Object.keys(parameters).length ; b++ )
            {
                pLine = pLine.replace(' '+parameters[Object.keys(parameters)[b]].title,' '+parameters[Object.keys(parameters)[b]].value)
                
            }
            parsed.push(pLine)
            
        }  
        return parsed
    }
    async ParseTransactionParameters(rawParametersString)
    {
        var text2parse = rawParametersString
        var rawArguments = new Array();
        var argCtr = 0
        while ( true )
        {
            var keyword = '"string":"'
            var endtoken = '"'
            var index = text2parse.indexOf(keyword)
            if ( index == -1 )
                break;
            var cursorpos = index+keyword.length
            var val = ""
            while ( true )
            {
                if  ( text2parse[cursorpos] == endtoken)
                    break;
                val += text2parse[cursorpos]
                cursorpos++
            }
            rawArguments.push(val)
            console.log("argument #"+argCtr+": " + val)
            var fLine = text2parse.substr(0,index)
            var cursorLen = text2parse.length-cursorpos
            var eLine = text2parse.substr(cursorpos,cursorLen)
            text2parse = fLine+eLine
            argCtr++;
        }
        var transactionArgs = await this.BuildTransactionArgumentsFromRawData(rawArguments)
        console.log(transactionArgs.NOM_candidat_e.value +" " +Object.keys(transactionArgs).length)
        this.BuildDiplomaTextFromTransactionParameters(transactionArgs)
        return transactionArgs
    }
    async BuildTransactionArgumentsFromRawData(rawArgs)
    {
        var transactionArgument = 
            { 
             DATENAISSANCE_candidat_e: {title : 'DATEDENAISSANCE_candidat_e', value : rawArgs[0]}, 
             DATE_edition: {title : 'DATE_edition', value : rawArgs[1]}, 
             DATE_smartdiplome:{title : 'DATE_smartdiplome', value : rawArgs[2]}, 
             DEBUT_annee: {title : 'DEBUT_annee', value : rawArgs[3]}, 
             FIN_annee: {title : 'FIN_annee', value : rawArgs[4]}, 
             LIEUNAISSANCE_candidat_e: {title : 'LIEUDENAISSANCE_candidat_e', value : rawArgs[5]}, 
             NOM_candidat_e: {title : 'NOM_candidat_e', value : rawArgs[6]}, 
             NOM_membreA:{title : 'NOM_membreA', value : rawArgs[7]}, 
             NOM_membreB:{title : 'NOM_membreB', value : rawArgs[8]}, 
             NOM_membreC:{title : 'NOM_membreC', value : rawArgs[9]}, 
             NOM_president_e:{title : 'NOM_president_e', value : rawArgs[10]}, 
             NOM_rapporteur_trice: {title : 'NOM_rapporteur_trice', value : rawArgs[11]}, 
             PRENOM_rapporteur_trice: {title : 'PRENOM_rapporteur_trice', value : 'missing'}, 
             PRENOM_candidat_e: {title : 'PRENOM_candidat_e', value : rawArgs[12]}, 
             PRENOM_membreA:{title : 'PRENOM_membreA', value : rawArgs[13]}, 
             PRENOM_membreB:{title : 'PRENOM_membreB', value : rawArgs[14]}, 
             PRENOM_membreC:{title : 'PRENOM_membreC', value : rawArgs[15]}, 
             PRENOM_president_e:{title : 'PRENOM_president_e', value : rawArgs[16]}, 
             SUJET_recherche: {title : 'SUJET_recherche', value : rawArgs[17]}, 
            
            }
        return transactionArgument;
            
    }
    
    async DebugCreateGridFromDiplomaTransaction(gridGeneralBox, transactionNumber)
    {
        // Si il n'y a aucune transaction : retourner
        if ( this.history == null )
            return;
        
        // Si la transaction n'existe pas : retourner
        if ( this.history.length < transactionNumber +1 )
            return;
        
        // Obtenir la transaction dans le tableau 'history'
        var transaction = this.history[transactionNumber]
        
        // Crée une grille a l'emplacement demandé
        var grid = new VisualGrid()
        // Mettre a jour les dimensions de la grille 
        grid.SetGeneralDimension(gridGeneralBox.x,gridGeneralBox.y,gridGeneralBox.w,gridGeneralBox.h)
    
        // Créer quatre lignes pour l'heure, la minute, la seconde et le gas utilisé pour cette transaction de diplome
        grid.AddRow(
            "Hour",
            0,
            24,
            1,
            transaction.timestamp.getHours(),
            50
        )
        grid.AddRow(
            "Minute",
            0,
            60,
            1,
            transaction.timestamp.getMinutes(),
            50
        )
        grid.AddRow(
            "Seconds",
            0,
            60,
            1,
            transaction.timestamp.getSeconds(),
            50
        )
        grid.AddRow(
            "Gas",
            0,
            5000,
            50,
            parseInt(transaction.gas),
            50
        )
        // Crée rapidement un canvas en dessous de la grille pour débuger les informations de cette transaction 
        
        var canvas = CreateCanvas(gridGeneralBox.x,gridGeneralBox.y+gridGeneralBox.h,gridGeneralBox.w,gridGeneralBox.h)
        canvas.ForceFill('color(0,0,0)')
        
        // Obtenir le texte légal mis a jour avec les parametres de la transaction 
        var diplomeText = await this.BuildDiplomaTextFromTransactionParameters(transaction.parameters)
        
        // Ajouter des informations supplémentaires... push() rajoute simplement une ligne de texte au tableau
        diplomeText.push (" ")
        diplomeText.push('----- transaction information ----')
        diplomeText.push('hash : ' + transaction.hash)
        diplomeText.push('block adress : ' + transaction.block)
        diplomeText.push('from  : ' + transaction.from)
        diplomeText.push('gas used  : ' + transaction.gas + 'gas unit')
       
        // Dans mon nouveau canvas créé, imprimé ces informations
        canvas.FillTextArrayInsideBox(diplomeText, new Box(10,50,gridGeneralBox.w,gridGeneralBox.h) ,'rgb(0,0,255)', 'arial', 9, '')
       

    }
    
    
    
}