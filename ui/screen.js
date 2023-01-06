// @ Class 
class Canvas 
{ 
    constructor(canvas, div, box ){
        this.general = canvas;
        this.div     = div;
        this.context = this.general.getContext('2d'); 
        this.mouseisover = false;
        this.mousepressed = false;
        this.hasdoubleclicked = false;
        this.box= box;
        this.focusPosition = 0;
        this.SetPositionAndDimension();
        this.bordersize = 0;
    }
    SetPosition()
    {
        this.div.style = "position:absolute; top:"+this.box.y+"px; left:"+this.box.x+"px; z-index:" + this.focusPosition; 
    }
    SetPositionAndDimension()
    {
        this.div.style = "position:absolute; top:"+this.box.y+"px; left:"+this.box.x+"px; z-index:" + this.focusPosition; 
        this.general.width = this.box.w;
        this.general.height = this.box.h;
    }
    
    // @ Draw parameters
    Blank()
    {
        this.ForceFill("rgb(255,255,255)");
    }
     ForceFill(color)
    {
         var _g = this.context;
         _g.fillStyle = color;
         _g.fillRect(0,0,this.box.w, this.box.h);
    }
    Fill(color)
    {
        this.FillRect(0,0,this.box.w, this.box.h,color);
    }
    
    // @ Basic HTML5 draw command
    FillRect(x,y,w,h,color)
    {
        var _g = this.context;
        x+= this.bordersize;
        y+= this.bordersize;
        _g.fillStyle = color;
        // lower w/h is above 
        if ( x+w > this.box.w-this.bordersize*2)
            w = this.box.w-this.bordersize - x ;
        if ( y+h> this.box.h-this.bordersize*2)
            h = this.box.h-this.bordersize - y ;

        _g.fillRect(x,y,w,h);
    }
    StrokeRect(x,y,w,h,color,linewidth)
    {
        var _g = this.context;
        x+= this.bordersize;
        y+= this.bordersize;
        _g.strokeStyle = color;
        _g.lineWidth = linewidth;
        // lower w/h is above 
        if ( x+w > this.box.w-this.bordersize*2)
            w = this.box.w-this.bordersize - x ;
        if ( y+h> this.box.h-this.bordersize*2)
            h = this.box.h-this.bordersize - y ;

        _g.strokeRect(x,y,w,h);
    }
    FillSquare(x,y,s, color)
    {
         var _g = this.context;

        x+= this.bordersize;
        y+= this.bordersize;
         _g.fillStyle = color;
        // lower w/h is above 
        if ( x+s > this.box.w-this.bordersize*2)
            s = this.box.w-this.bordersize - x ;
        if ( y+s> this.box.h-this.bordersize*2)
            s = this.box.h-this.bordersize - y ;

       _g.fillRect(x,y,s,s);
    }
    StrokeSquare(x,y,s,color,linewidth)
    {
        var _g = this.context;
        x+= this.bordersize;
        y+= this.bordersize;
         _g.strokeStyle = color;
        _g.lineWidth = linewidth;
        // lower w/h is above 
        if ( x+s > this.box.w-this.bordersize*2)
            s = this.box.w-this.bordersize - x ;
        if ( y+s> this.box.h-this.bordersize)
            s = this.box.h-this.bordersize - y ;

       _g.strokeRect(x,y,s,s);
    }
    
    DrawLine(x,y,x1,y1,color,linewidth)
    {
        var _g = this.context;
       _g.strokeStyle = color;
       _g.lineWidth = linewidth;
       _g.beginPath();
       _g.moveTo(x, y);
       _g.lineTo(x1,y1);
       _g.closePath();
       _g.stroke();
    }
    FillCircle(centerx, centery, rad, color)
    {
        var _g = this.context;
        _g.fillStyle = color;
        _g.beginPath();
        _g.arc(centerx, centery, rad, 0, 2* Math.PI, false);
        _g.fill();
        _g.closePath();
    }
    StrokeCircle(centerx, centery, rad,color,linewidth)
    {
        var _g = this.context;
        _g.strokeStyle = color;
        _g.lineWidth = linewidth;
        _g.beginPath();
        _g.arc(centerx, centery, rad, 0, 2* Math.PI, false);
        _g.stroke();
        _g.closePath();
    }

    FillTriangle(x0,y0,x1,y1,x2,y2, color)
    {
        var _g = this.context;
        _g.fillStyle = color;
        _g.beginPath()
        _g.moveTo(x0, y0);
        _g.lineTo(x1, y1);
        _g.lineTo(x2, y2);
        _g.lineTo(x0, y0);
        _g.fill();
        _g.closePath()
    }
    StrokeTriangle(x0,y0,x1,y1,x2,y2, color,linewidth)
    {
        var _g = this.context;
        _g.strokeStyle = color;
        _g.lineWidth = linewidth;
        _g.beginPath()
        _g.moveTo(x0, y0);
        _g.lineTo(x1, y1);
        _g.lineTo(x2, y2);
        _g.lineTo(x0, y0);
        _g.closePath()
        _g.stroke();
        
    }
    FillArc(centerx, centery, rad, anglestart, angleend, color)
    {
        var _g = this.context;
         _g.fillStyle = color;
        _g.beginPath();
        _g.arc(centerx, centery, rad, anglestart, angleend, false);
        _g.fill();
        _g.closePath();
    }
    StrokeArc(centerx, centery, rad, anglestart, angleend ,color,linewidth)
    {
        var _g = this.context;
        _g.strokeStyle = color;
        _g.lineWidth = linewidth;
        _g.beginPath();
        _g.arc(centerx, centery, rad, anglestart, angleend, false);
        _g.stroke();
        _g.closePath();
    }
    OpenLine(x,y, color, linewidth)
    {
        var _g = this.context;
        this.LastPathPosition = new Vector2(x,y);
        _g.strokeStyle = color;
        _g.lineWidth = linewidth;
    }
    MoveLine(x,y)
    {
        var _g = this.context;
        _g.beginPath();
        _g.moveTo(this.LastPathPosition.x, this.LastPathPosition.y);
        _g.lineTo(x,y)
        _g.stroke();
        _g.closePath();
        this.LastPathPosition.x = x;
        this.LastPathPosition.y = y;
    }
    MeasureText(text,fontname, fontsize, style)
    {
        var _g = this.context;
        _g.font = style + " "+fontsize+"px "+fontname;
        return _g.measureText(text).width;
    }
    FillText(text, x, y , color, fontname, fontsize, style)
    {
        var _g = this.context;
        _g.fillStyle = color;
        _g.font = style + " "+fontsize+"px "+fontname;
        _g.fillText(text, x, y);
    }
    StrokeText(text, x, y, color, fontname, fontsize, style)
    {
        var _g = this.context;
        _g.strokeStyle = color;
        _g.font = style + " "+fontsize+"px "+fontname;
        _g.strokeText(text, x, y);
    }
}

// Easy Function to create a canvas... 
var CanvasUniqueIdentifier = 0;
function CreateCanvas(x,y,w,h)
{
    // Update the HTML
    
    var form = document.getElementById('mainform');
    var newDiv = document.createElement("div");
    newDiv.id = "div"+CanvasUniqueIdentifier;
    var canv = document.createElement('canvas');
    canv.id = 'canv'+CanvasUniqueIdentifier;
    form.appendChild(newDiv);
    newDiv.appendChild(canv);
    
    // Update counter
    CanvasUniqueIdentifier++;
    
    // return
    return new Canvas(canv, newDiv,new Box(x,y,w,h));

}


