"use strict";

//text popup for code link https://stackoverflow.com/questions/13897198/webgl-story-sphere-popups
//boilerplate
var canvas;
var gl;

var program;
var projection;
var transformation;
var vPosition;
var vColor;
var thetaLoc;

//block IDs
var blockID = ["var", "bool", "double", "const", "this", "if", "do",
                "else if", "else", "end if", "end else", "for", "while",
                "end loop", "function", "end function", "print", "return", "null","break", "trash"];


//block textures
var doubleButtonText, varButtonText, boolButtonText;
var constButtonText;
var returnButtonText, printButtonText, breakButtonText;
var forButtonText, whileButtonText;
var endLoopButtonText;
var ifButtonText, elseIfButtonText, elseButtonText, functionButtonText;
var endIfButtonText, endElseButtonText, endFunctionButtonText;
var thisButtonText, nButtonText, trashButtonText, doButtonText;


//block array declarations
var blockRoster = [];
var textRoster = [];
var workspace = [];

//pointers for double array of workspace
var workspacePt;
var workArrayPt;
var submitSpot;

//drag flags
let drag = false;
let drag2 = false;

//base values for individual blocks
var baseX = 111;
var baseY = 50;
let oldX;
let oldY;
let xDown, yDown, xUp, yUp;
let updateFlag = false;
let breakLoop = true;
let codeText = "";

//constructor for blocks
const blockPoints = [
    0, 0,
    0, baseY,
    baseX, baseY,

    0, 0,
    baseX, baseY,
    baseX, 0
];

//format for proper texture usage 
const textCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0)
];

//Texture Initializer
function configureTexture( image ) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);



    // gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);

    return texture;
}

//initializes all necessary textures
function textInit () {
    var varButton = document.getElementById("varButton");
    var boolButton = document.getElementById("boolButton");
    var doubleButton = document.getElementById("doubleButton");
    var constButton = document.getElementById("constButton");
    var thisButton = document.getElementById("thisButton");
    var ifButton = document.getElementById("ifButton");
    var elseIfButton = document.getElementById("elseIfButton");
    var elseButton = document.getElementById("elseButton");
    var endIfButton = document.getElementById("endIfButton");
    var endElseButton = document.getElementById("endElseButton");
    var forButton = document.getElementById("forButton");
    var whileButton = document.getElementById("whileButton");
    var endLoopButton = document.getElementById("endLoopButton");
    var functionButton = document.getElementById("functionButton");
    var endFunctionButton = document.getElementById("endFunction");
    var printButton = document.getElementById("printButton");
    var returnButton = document.getElementById("returnButton");
    var nButton = document.getElementById("nullButton");
    var trashButton = document.getElementById("trashbutton");
    var doButton = document.getElementById("doButton");
    var breakButton =  document.getElementById("breakButton");

    textRoster.push(varButtonText = configureTexture(varButton));
    textRoster.push(boolButtonText = configureTexture(boolButton));
    textRoster.push(doubleButtonText = configureTexture(doubleButton));
    textRoster.push(constButtonText = configureTexture(constButton));
    textRoster.push(thisButtonText = configureTexture(thisButton));
    textRoster.push(ifButtonText = configureTexture(ifButton));
    textRoster.push(doButtonText = configureTexture(doButton));
    textRoster.push(elseIfButtonText = configureTexture(elseIfButton));
    textRoster.push(elseButtonText = configureTexture(elseButton));
    textRoster.push(endIfButtonText = configureTexture(endIfButton));
    textRoster.push(endElseButtonText = configureTexture(endElseButton));
    textRoster.push(forButtonText = configureTexture(forButton));
    textRoster.push(whileButtonText = configureTexture(whileButton));
    textRoster.push(endLoopButtonText = configureTexture(endLoopButton));
    textRoster.push(functionButtonText = configureTexture(functionButton));
    textRoster.push(endFunctionButtonText = configureTexture(endFunctionButton));
    textRoster.push(printButtonText = configureTexture(printButton));
    textRoster.push(returnButtonText = configureTexture(returnButton));
    textRoster.push(nButtonText = configureTexture(nButton));
    textRoster.push(breakButtonText = configureTexture(breakButton));
    textRoster.push(trashButtonText = configureTexture(trashButton));

}

//Block Builder
function blockBuilder(x, y, texture, ide, editable) {
        this.points=[];
        for(let i=0; i<blockPoints.length/2; i++)
            this.points.push(vec2(blockPoints[2*i] + x, blockPoints[2*i + 1] + y))
    
        this.id = ide;
        this.edit = editable;
        this.vBuffer=0;
        this.cBuffer=0;
        this.tBuffer=0;
        this.positionLoc=0;
        this.texture = texture;
        this.xVal = x;
        this.yVal = y;
        this.xMax = this.xVal+111;
        this.yMax = this.yVal+50;
        this.data = "";
    
        this.OffsetX=0;
        this.OffsetY=0;
        this.Angle=0;

        this.updateData = function(input){
            this.data = input;
        }
    
        this.UpdateOffset = function(dx, dy) {  //key for moving blocks around
            this.OffsetX += dx;
            this.OffsetY += dy;
        }
    
        this.SetOffset = function(dx, dy) {
            this.OffsetX = dx;
            this.OffsetY = dy;
        }
    
        this.transform = function(x, y) {
            var theta = -Math.PI/180*this.Angle;	// in radians
            var x2 = this.points[0][0] + (x - this.points[0][0]-this.OffsetX) * Math.cos(theta) - (y - this.points[0][1]-this.OffsetY) * Math.sin(theta);
            var y2 = this.points[0][1] + (x - this.points[0][0]-this.OffsetX) * Math.sin(theta) + (y - this.points[0][1]-this.OffsetY) * Math.cos(theta);
            return vec2(x2, y2);
        }
    
        this.init = function() {    //initializes each block when drawing to screen
            this.vBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

            this.tBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(textCoord), gl.STATIC_DRAW);

        }

        this.isInside = function(x,y) {     //checks x,y values to confirm it was clicked
           if (x > this.xVal && x <= this.xMax){
              if(y >= this.yVal && y <= this.yMax){
                return true;
                }
            return false;
            }
        }
    
        this.draw = function() {        //function that actually displays block to screen
            var tm = translate(this.points[0][0]+this.OffsetX, this.points[0][1]+this.OffsetY, 0.0);
            tm=mult(tm, rotate(this.Angle, vec3(0, 0, 1)));
            tm = mult(tm, translate(-this.points[0][0], -this.points[0][1], 0.0));
            gl.uniformMatrix4fv( transformation, gl.FALSE, flatten(tm));
    
            gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
            gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );
            
            gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(textCoord), gl.STATIC_DRAW);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.drawArrays( gl.TRIANGLES, 0, this.points.length );
    
        }
    
}

//sorts all blocks of code by yMax
function workSort(a,b){
    if (a[0].yMax == b[0].yMax)
        return 0;
    else{
        return (a[0].yMax > b[0].yMax) ? -1 : 1;
    }
}

//calls worksort and other necessary functions
function sortCode(){
        workspace.sort(workSort);
}

//saves data when submit button is pushed
function Submit(){
   // console.log(submitSpot);
    submitSpot.data = document.getElementById("Box").value;
   // console.log(submitSpot.data);
    document.getElementById("Input").hidden = true;
    document.getElementById("Box").hidden = true;
    document.getElementById("Submit").hidden = true;
    document.getElementById("Data").hidden = true;
    document.getElementById("Output").hidden = true;
    document.getElementById('Box').textContent = "";

}

function varSet(text, block){   //var, double, bool, 
    text = text.concat("var ");
    text = text.concat(block.data);
    text = text.concat("; \n");
    return text;
}

function ifSet(text, block){    //if, else if
    text = text.concat(block.id);
    text = text.concat("(");
    text = text.concat(block.data);
    text = text.concat("){ \n");
    return text;
}

function elseSet(text, block){  //else
    text = text.concat(block.id);
    text = text.concat("{ \n");
    return text;
}

function endSet(text, block){   //end if, end else, end loop, end function
    text = text.concat("}\n");
    return text;
}

function returnSet(text, block){    //return
    text = text.concat(block.id);
    text = text.concat("(");
    text = text.concat(block.data);
    text = text.concat("); \n");
    return text;
}

function printSet(text, block){     //print
    text = text.concat("alert(");
    text = text.concat(block.data);
    text = text.concat(");\n");
    return text;
}

function loopSet(text, block){      //for, while
    text = text.concat(block.id);
    text = text.concat("(");
    text = text.concat(block.data);
    text = text.concat("){\n");
    return text;
}

function constSet(text, block){     //const
    text = text.concat(block.id);
    text = text.concat(" ");
    text = text.concat(block.data);
    text = text.concat("; \n");
    return text;
}

function thisSet(text, block){      //this
    text = text.concat("this.");
    text = text.concat(block.data);
    text = text.concat("; \n");
    return text;
}

function functionSet(text, block){
    text = text.concat(block.id);
    text = text.concat(" ");
    text = text.concat(block.data);
    text = text.concat("{ \n");
    return text;
}

function doSet(text, block){
    text = text.concat(block.data);
    text = text.concat("; \n");
    return text;
}

function breakSet(text, block){
    text = text.concat("break; \n");
    return text;
}


function translateBlocks(){
    sortCode();
    codeText = "";
    for (let a = 0; a < workspace.length; a++){
        for (let b = 0; b < workspace[a].length; b++)
        {
      //      console.log(workspace[a][b].id);
            switch(workspace[a][b].id){
                default:
                    codeText = varSet(codeText, workspace[a][b]);
         /*           codeText = codeText.concat(workspace[a][b].id);
                    codeText = codeText.concat(" ");
                    codeText = codeText.concat(workspace[a][b].data);
                    codeText = codeText.concat("; \n");*/
                    break;
                case "if":
                    codeText = ifSet(codeText, workspace[a][b]);
                    break;
                case "else if":
                    codeText = ifSet(codeText, workspace[a][b]);
                    break;
                case "else":
                    codeText = elseSet(codeText, workspace[a][b]);
                    break;
                case "end if":
                    codeText = endSet(codeText, workspace[a][b]);
                    break;
                case "end else":
                    codeText = endSet(codeText, workspace[a][b]);
                    break;
                case "end loop":
                    codeText = endSet(codeText, workspace[a][b]);
                    break;
                case "end function":
                    codeText = endSet(codeText, workspace[a][b]);
                    break;
                case "return":
                    codeText = returnSet(codeText, workspace[a][b]);
                    break;
                case "null":
                    codeText = codeText.concat("null \n");
                    break;
                case "while":
                    codeText = ifSet(codeText, workspace[a][b]);
                    break;
                case "print":
                    codeText = printSet(codeText, workspace[a][b]);
                    break;
                case "for":
                    codeText = loopSet(codeText, workspace[a][b]);
                    break;
                case "while":
                    codeText = loopSet(codeText, workspace[a][b]);
                    break;
                case "this":
                    codeText = thisSet(codeText, workspace[a][b]);
                    break;
                case "function":
                    codeText = functionSet(codeText, workspace[a][b]);
                    break;
                case "break":
                    codeText = breakSet(codeText, workspace[a][b]);
                    break;
                case "do":
                    codeText = doSet(codeText, workspace[a][b]);
                    break;
        
            }
        }
    }
    //console.log(codeText);
}

window.onload = function initialize()
{
    //boiler plate code
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if (!gl) alert( "WebGL 2.0 isn't available" );

    gl.viewport(0,0,canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);

    gl.enable(gl.DEPTH_TEST);

	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

    	//Detects click & hold
	canvas.addEventListener("mousedown", function(event){
            document.getElementById("Input").hidden = true;
            document.getElementById("Box").hidden = true;
            document.getElementById("Submit").hidden = true;
            document.getElementById("Data").hidden = true;
            document.getElementById("Output").hidden = true;
            document.getElementById('Box').textContent = "";
            console.log(workspace);

		let rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = rect.bottom - event.clientY;
        xDown = x;
        yDown = y;
		if (event.ctrlKey){ //delete
			for(let i = 0; i<workspace.length; i++){
                for (let l = 0; l < workspace[i].length; l++){
                    if(workspace[i][l].isInside(x,y)){
                        workspace[i].splice(l,1);
                        if (workspace[i].length == 0) {
                            workspace.splice(i,1);
                            render();
                            return;
                        }
                        if (workspace.length == 0) {
                            render();
                            return;
                        }
         //               console.log("workspace[i].length: ", workspace[i].length);
                        if (l != workspace[i].length && workspace[i].length != 1){
                            workspace.push(workspace[i].splice(l, workspace[i].length));
                         //   for (let j = workspace[i].length-1; j >= i; j--){

                         //   }
                        }
                        if (workspace[workspacePt].length == 0) workspace.splice(workspacePt,1);
                        render();
                        return;
                    }
            }
			}
		}

        if (event.shiftKey){
            for(let i = 0; i<workspace.length; i++){
                for (let l = 0; l < workspace[i].length; l++){
                    if(workspace[i][l].isInside(x,y)){
                        if(workspace[i][l].edit == true){
                            document.getElementById("Data").removeAttribute("hidden");
                            document.getElementById("Output").removeAttribute("hidden");
                            document.getElementById("Input").removeAttribute("hidden");
                            document.getElementById("Box").removeAttribute("hidden");
                            document.getElementById("Submit").removeAttribute("hidden");
                            submitSpot = workspace[i][l];
           //                 console.log("i: ", i," l: ", l);
                            if (workspace[i][l].data != null){
              //                  console.log(workspace[i][l].data);
                                document.getElementById("Output").textContent = workspace[i][l].data;
                        }
                        }
                    }
                }
            }
        }
		else{
			for(let j = 0; j < blockRoster.length-1; j++){
				if(blockRoster[j].isInside(x, y)){
					//copy function
					workspacePt = j;
					drag = true;
					oldX = x;
					oldY = y;
					render();
					break;
				}
			}

            for(let k = 0; k < workspace.length; k++){
                for (let l = 0; l < workspace[k].length; l++)
                {   //looks to see if any block is chosen
                    if(workspace[k][l].isInside(x, y)){
                        workspacePt = k;
                        workArrayPt = l;
                        workspace.unshift(workspace.splice(workspacePt, 1)[0]);
                        //workspace[k].unshift(workspace[k].splice(workArrayPt, 1)[0]);
                        workspacePt = 0;
                        //workArrayPt = 0;
                        drag2 = true;
                        oldX = x;
                        oldY = y;
                        render();
                        break;
                    }
                }
            }
		}
	});

    canvas.addEventListener("mouseup", function(event){
		drag = false;
        drag2 = false;
        console.log(workspace);

        if (updateFlag == true){

            let xDif = xUp - xDown;     //consistent math to update x
            let yDif = yUp - yDown;     //and y values
            for (let i = workArrayPt; i < workspace[workspacePt].length; i++){
            workspace[workspacePt][i].xVal = workspace[workspacePt][i].xVal+xDif;
            workspace[workspacePt][i].xMax = workspace[workspacePt][i].xMax+xDif;
            workspace[workspacePt][i].yVal = workspace[workspacePt][i].yVal+yDif;
            workspace[workspacePt][i].yMax = workspace[workspacePt][i].yMax+yDif;
            }

    //        console.log(blockRoster[blockRoster.length-1]);
            if(workspace[workspacePt][workArrayPt].isInside(blockRoster[blockRoster.length-1].xMax, blockRoster[blockRoster.length-1].yVal)){
         //       console.log("check it");
               workspace.splice(workspacePt,1);
               render();
               breakLoop = true;
           }

            for (let p = workspace.length-1; p >= 0; p--){  //looks to see if two blocks were dragged together
                if (p == workspacePt) continue;
                for (let q = workspace[p].length-1; q >= 0; q--){

                    if(workspace[workspacePt][workArrayPt].isInside(workspace[p][q].xMax, workspace[p][q].yVal)){
                        for (let z = workArrayPt; z < workspace[workspacePt].length; z++){
                            workspace[p].push(workspace[workspacePt][z]);
                           // workspace[workspacePt].splice(workArrayPt,1);
                        }
                        for (let z = workspace[workspacePt].length-1; z >= workArrayPt; z--){
           //                 console.log("z: ", z, " : workspace[workspacePt].length: ", workspace[workspacePt].length);
                           // workspace[p].push(workspace[workspacePt][workArrayPt]);
                            workspace[workspacePt].splice(workArrayPt,1);
                        }
                        breakLoop = true;
                        if (workspace[workspacePt].length == 0) workspace.splice(workspacePt,1);
                        break;
                    }
                }

                if (breakLoop == true) break;
            }



            
            if (breakLoop == false && workArrayPt > 0 && workspace[workspacePt].length > 1 ){   //looks to see if two blocks were dragged apart
                workspace.unshift([workspace[workspacePt][workArrayPt]]);   
                workspacePt++;
                //    console.log("workspacePt: ", workspacePt);
                for(let z = workArrayPt+1; z < workspace[workspacePt].length; z++){
           //         console.log("z: ", z);
            //        console.log("workArrayPt: ", workArrayPt, " workspace[workspacePt].length: ", workspace[workspacePt].length);
                    workspace[0].push(workspace[workspacePt][z]);   
   //                 workspacePt++;
   //                 workspace[workspacePt].splice(z,1);
                   // console.log(workspace[workspacePt]);
                }
                for (let z = workspace[workspacePt].length-1; z >= workArrayPt; z--){
                    workspace[workspacePt].splice(z,1);
                }
                if (workspace[workspacePt].length == 0) workspace.splice(workspacePt,1);
            }

            breakLoop = false;
            updateFlag = false;
        }
        //workspace.sort(workSort);
        //console.log(workspace);

	});

    
	canvas.addEventListener("mousemove", function(event){
        if (drag){  //checks if user is trying to make new block from templates
           workspace.unshift([new blockBuilder(oldX+1, oldY+1, blockRoster[workspacePt].texture, blockRoster[workspacePt].id, blockRoster[workspacePt].edit)]);
           workspacePt = 0;
           workArrayPt = 0;
               workspace[workspacePt][0].init();
               render();
               drag = false;
               drag2 = true;
           
       }

       if (drag2){  //function that actually works with moving blocks/updating positions
            updateFlag = true;
           let rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = rect.bottom - event.clientY;
            
            //console.log("workArrayPt: ", workArrayPt, " workspace")
            for (let i = workArrayPt; i < workspace[workspacePt].length; i++){
            workspace[workspacePt][i].UpdateOffset(x-oldX, y-oldY);
            }
            xUp = x;
            yUp = y;
            oldX = x;
            oldY = y;

            render();

       }

   });

    textInit();


//create building blocks
    var yTop = 900;
    var textCounter = 0;
    for (var i = 0; i < 11; i++)
    {
        let edit = true;    //makes only certain blocks editable by users
            if (blockID[textCounter] == "break" || blockID[textCounter] == "else" ||
             blockID[textCounter] == "end if" || blockID[textCounter] == "end else" ||
             blockID[textCounter] == "end loop" || blockID[textCounter] == "end function" ||
             blockID[textCounter] == "null" || blockID[textCounter] == "trash") edit = false;

        blockRoster.push(new blockBuilder(0, yTop, textRoster[textCounter], blockID[textCounter], edit));
        edit = true;
        textCounter++;
        if (textCounter <20){
            if (blockID[textCounter] == "break" || blockID[textCounter] == "else" ||
            blockID[textCounter] == "end if" || blockID[textCounter] == "end else" ||
            blockID[textCounter] == "end loop" || blockID[textCounter] == "end function" ||
            blockID[textCounter] == "null" || blockID[textCounter] == "trash") edit = false;

            blockRoster.push(new blockBuilder(131, yTop, textRoster[textCounter],  blockID[textCounter], edit));
            edit = true;
            textCounter++;
            yTop = yTop - 70;
        }
    }

    document.getElementById("RunButton").onclick = function()
    {
       translateBlocks();
       //eval(codeText);
       try {
        eval(codeText); 
    } catch (e) {
        if (e instanceof SyntaxError) {
            alert(e.message);
        }
        else {
            alert(e);
            //throw e;
        }
    
    }
    };

    document.getElementById("CodeButton").onclick = function()
    {
        translateBlocks();
        alert(codeText);
        //document.getElementById("Code").textContent = codeText;
       // document.getElementById("Code").removeAttribute("hidden");


    }





    for (var y = 0; y < blockRoster.length; y++)    //initializes all base blocks
        blockRoster[y].init();


    //more boilerplate
    projection = gl.getUniformLocation( program, "projection" );
    var pm = ortho( 0.0, canvas.width, 0.0, canvas.height, 1.0, -1.0 );
    gl.uniformMatrix4fv( projection, gl.FALSE, flatten(pm) );

    transformation = gl.getUniformLocation( program, "transformation" );

    vPosition = gl.getAttribLocation( program, "aPosition" );
    vColor = gl.getAttribLocation( program, "aColor" );

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);




    render();
    //render2();

};

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );

	for (var z =0; z < blockRoster.length; z++){
		blockRoster[z].draw();
    }

    for (var q = 0; q < workspace.length; q++){
        for(var w = 0; w < workspace[q].length; w++)
        workspace[q][w].draw();
    }

}

function render2() {

	gl.clear( gl.COLOR_BUFFER_BIT );

}
