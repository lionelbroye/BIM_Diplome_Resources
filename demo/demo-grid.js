// _________________________________________________________________________
// Draw gas and timestamp representation of each smartcontract's transaction 
// _________________________________________________________________________

async function GridExample()
{
    // Initialize network 
    InitEthereumNetwork();
    InitTezosNetwork();
    
    // Connect to blockchain node 'Ghostnet'
    SwitchToTezosNetwork("ghostnet");
    
    // Load in memory a specific smartcontract
    await Network.LoadContract("KT1P8UqyTrbR6XJtWFkKNRLSMLezVHzMFKut")
    
    // Get all transaction data to this contract (only getting timestamp and gas)
    var alltransactions = await Network.GetContractTransactionHistory('timestamp,gasUsed')
    console.log(alltransactions)
    
    
    // For each transaction to this contract, monitor gas and date time using the grid template
    var px = 0
    var py = 0
    for ( var i = 0 ; i < alltransactions.length ; i++)
    {
        //Create a date from the very first transaction transaction timestamp
        var TransactionDate = new Date(alltransactions[i].timestamp)
        // Create my grid
        var grid = new VisualGrid()

        // Set my grid dimension: x y w h
        grid.SetGeneralDimension(px,py,500,500)

        //Add some row to monitor the transaction timestamp 
        grid.AddRow("year", 1990, 2030, 1, TransactionDate.getYear(), 20)
        grid.AddRow("month", 0, 12, 1, TransactionDate.getMonth(), 10)
        grid.AddRow("day", 0, 31, 1, TransactionDate.getDay(), 20)
        grid.AddRow("hour", 0, 24, 1, TransactionDate.getHours(), 20)
        grid.AddRow("minute", 0, 60, 1, TransactionDate.getMinutes(), 20)
        grid.AddRow("seconde", 0, 60, 1, TransactionDate.getSeconds(), 20)

        //Add a specific row to monitor the transaction gas [a range between 0 and 5000]
        grid.AddRow("gas", 0, 5000, 100, alltransactions[i].gasUsed, 20)
        
        
        px+=500
        if ( px+500>window.innerWidth)
        {
            px=0
            py+=500
        }
    }
    
}

// _________________________________________________________________________
// Draw date time representation using the grid template
// _________________________________________________________________________


var date;
var timeGrid;
function TimeExampleWithGridTemplate()
{
    timeGrid = new VisualGrid()
    timeGrid.SetGeneralDimension(0,0,500,500)
    // [41,12,31,24,60,60]
    timeGrid.AddRow("year", min=1990, max=2030, interval=1, value=1992, margin=20)
    timeGrid.AddRow("month", min=0, max=12, interval=1, value=2, margin=10)
    timeGrid.AddRow("day", 0, 31, 1, 5, 20)
    timeGrid.AddRow("hour", 0, 24, 1, 10, 20)
    timeGrid.AddRow("minute", 0, 60, 1, 50, 20)
    timeGrid.AddRow("seconde", 0, 60, 1, 10, 20)
    
    date = new Date('December 10, 1998 03:24:00');
    setInterval(function(){UpdateTimeGrid(1)},100)
}

function UpdateTimeGrid(secondToAdd)
{
    date.setSeconds(date.getSeconds() + secondToAdd);
    timeGrid.AssignDataToRow("year", date.getYear())
    timeGrid.AssignDataToRow("month", date.getMonth())
    timeGrid.AssignDataToRow("day", date.getDay())
    timeGrid.AssignDataToRow("hour", date.getHours())
    timeGrid.AssignDataToRow("minute", date.getMinutes())
    timeGrid.AssignDataToRow("seconde", date.getSeconds())
    timeGrid.Draw()
}