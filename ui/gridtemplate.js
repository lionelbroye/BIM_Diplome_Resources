class VisualGrid
{
    constructor ()
    {
        this.Canvas = CreateCanvas(0,0,0,0);
        this.Rows = new Array()
        this.borderWidth = 50;
        this.BackGroundColor = 'rgb(0,0,0)'
        this.LineColor = 'rgb(255,255,255)'
        this.MainLineWidth = 5
        this.GridLineWidth = 2
    }
    
    SetGeneralDimension(x,y,w,h)
    {
        this.Canvas.box = new Box(x,y,w,h)
        this.CanvasWidth = w;
        this.CanvasHeight = h;
        this.CanvasPosition = new Vector2(x,y)
        this.Canvas.SetPositionAndDimension()
        this.Draw();
        
    }
    SetHeightFromDesiredLineHeight(lineHeight)
    {
        if ( this.Rows.length == 0 )
            return;
        var h = this.Rows.length * lineHeight
        this.Canvas.box = new Box(this.CanvasPosition.x,this.CanvasPosition.y,this.CanvasWidth,h)
        this.CanvasHeight = h;
        this.Canvas.SetPositionAndDimension()
        this.Draw();
        
    }
    SetBackgroundColor(r,g,b)
    {
        this.BackGroundColor = 'rgb('+r+','+g+','+b+')'
    }
    SetLineColor(r,g,b)
    {
        this.LineColor = 'rgb('+r+','+g+','+b+')'
    }
    SetMainLineWidth(v){this.MainLineWidth =v}
    SetGridLineWidth(v){this.GridLineWidth =v}
    
    DrawBase()
    {
        // get width and height of the canvas
        var w = this.CanvasWidth;
        var h = this.CanvasHeight; 
        
        // get row boxes ' dimension
        var boxDim = new Vector2(w-this.borderWidth*2,(h-this.borderWidth*2)/this.Rows.length)
        
        // Stroke rectangle of canvas and margins
        
        this.Canvas.FillRect(0,0,w,h, this.BackGroundColor)
        this.Canvas.StrokeRect(0,0,w, this.borderWidth, this.LineColor,this.MainLineWidth)
        this.Canvas.StrokeRect(0,h-this.borderWidth,w, this.borderWidth, this.LineColor,this.MainLineWidth)
        this.Canvas.StrokeRect(0,0,this.borderWidth, h, this.LineColor,this.MainLineWidth)
        this.Canvas.StrokeRect(w-this.borderWidth,0,this.borderWidth, h, this.LineColor,this.MainLineWidth)
        
        // Draw grid lines
        var y = this.borderWidth;
        for (var i = 0 ; i < this.Rows.length; i++)
        {
            this.Canvas.StrokeRect(this.borderWidth,y,boxDim.x, boxDim.y, this.LineColor,this.MainLineWidth)
            
            var bx = this.borderWidth + this.Rows[i].borderWidth
            var lineCount = Math.abs(this.Rows[i].max-this.Rows[i].min)/this.Rows[i].granularity
            var bspacing = (w-(this.borderWidth*2)-(this.Rows[i].borderWidth*2))/lineCount
            for ( var b = 0 ; b < lineCount;b++)
            {
                this.Canvas.StrokeRect(bx,y,bspacing, boxDim.y, this.LineColor,this.GridLineWidth)
                bx+=bspacing
            }
            y+=boxDim.y
        } 
    }
    
    // Draw data in the grid as dot
    DrawDataRepresentation()
    {
        // get width and height of the canvas
        var w = this.CanvasWidth;
        var h = this.CanvasHeight;
        
        // get row boxes ' dimension
        var boxDim = new Vector2(w-this.borderWidth*2,(h-this.borderWidth*2)/this.Rows.length)
        
        // drow dots as value representation of each rows
        var y = this.borderWidth;
        for (var i = 0 ; i < this.Rows.length; i++)
        {
            var bx = this.borderWidth + this.Rows[i].borderWidth
            
            // Get number of vertical lines ( number of possible position in X-axis)
            var lineCount = Math.abs(this.Rows[i].max-this.Rows[i].min)/this.Rows[i].granularity
            
            // Get spacing between each of those lines
            var bspacing = (w-(this.borderWidth*2)-(this.Rows[i].borderWidth*2))/lineCount
            
            // Map row value to its specific vertical line position
            var v = Math.abs(this.Rows[i].min - this.Rows[i].value)/this.Rows[i].granularity
            
            // Compute the X-Axis position of the dot depeding of its line, including marging
            var dotPosX = this.borderWidth+this.Rows[i].borderWidth+(bspacing*(v))
            
            // Draw the dot with FillCircle method
            this.Canvas.FillCircle(dotPosX, y+boxDim.y/2, 20, this.LineColor )
            
            // Increment Y-Axis cursor
            y+=boxDim.y
        } 
        
        
    }
    Draw()
    {
        this.DrawBase()
        this.DrawDataRepresentation()
    }
   
    AddRow(title, rangeMin, rangeMax, granularity, defaultValue, innerMarginWidth)
    {
        this.Rows.push(
            {
             name: title, 
             min:rangeMin, 
             max:rangeMax, 
             granularity:granularity, 
             value:defaultValue, 
             borderWidth: innerMarginWidth
            
            })
        this.Draw()
        
    }
    GetRowIndexFromName(rowName)
    {
        for ( var i = 0 ; i < this.Rows.length; i++ )
        {
            if ( this.Rows[i].name == rowName)
                return i;
        }
        return -1
    }
    AssignDataToRow(rowName, value)
    {
        var rowIndex = this.GetRowIndexFromName(rowName);
        if ( rowIndex == -1)
            return;
        this.Rows[rowIndex].value = value;
    }
    UpdateRowData(rowName, value)
    {
        this.AssignDataToRow(rowName, value)
        this.Draw()
    }
}

