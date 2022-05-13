var mymap,row=5,column=5,sec=0, min = 0, score = 0;
var map=document.getElementsByClassName('gamemap'),rows=Array(row),cell=Array(row);
var myscore=document.getElementById('score'),mytime=document.getElementById('time'),mybestscore=document.getElementById('bestscore');
var bestscore;

var randomEvent=0,randchance=0.5,eventType=0,eventCount=0,ex=-1,ey=-1;

var history,maxlength=0;

if(localStorage.getItem('mybest')===null) {
    bestscore=0;
    localStorage.setItem('mybest',JSON.parse(bestscore))
}
else 
    bestscore=parseInt(localStorage.mybest);


initialmap();


function myRand(limit) {
    return Math.floor(Math.random()*limit);
}

setInterval(function(){//计时器
    sec++;
    if (sec >= 60)
    {
        sec -= 60;
        min ++;
    }
    mytime.innerText= ("0" + min.toString()).slice(-2) + ':' + ("0" + sec.toString()).slice(-2);
},1000);

function initialmap(){//重绘地图
    initialsize();

    mymap=new Array(row);
    for(let i=0;i<row;i++) {
        mymap[i]=new Array(column);
        for(let j=0;j<column;j++)
            mymap[i][j]=0;
    }
    createmap();

    newCell();
    newCell();
    history=new Array(1000)
    
    drawmap();
    for(let i=0;i<1000;i++){
        history[i]=new Array(row);
        for(let j=0;j<row;j++){
            history[i][j]=new Array(column);
            for(let k=0;k<column;k++)
                history[i][j][k]=mymap[j][k];
        }
    }
    maxlength=1;

    score = 0;
    min = sec = 0;
    myscore.innerText= score.toString();
    console.log(score,bestscore)
    if(score>bestscore) {
        bestscore=score;
        localStorage.setItem('mybest',JSON.parse(bestscore));
    }
    mybestscore.innerText=bestscore.toString();
    mytime.innerText= ("0" + min.toString()).slice(-2) + ':' + ("0" + sec.toString()).slice(-2);
}

function initialsize() {
    row = document.getElementById('row').value;
    column = document.getElementById('column').value;

    if (row <= 1)
        row = 5;
    if (column <= 1)
        column = 5;
}

function newCell() { //产生新格子
    let x=myRand(row), y=myRand(column);
    if (mymap[x][y] === 0)
    {
        mymap[x][y] = 2;
        let piece = document.getElementById(x.toString() + y.toString() + 'piece');
        piece.style.animation = "new 0.3s linear";
        piece.addEventListener("animationend", function handler(){
            piece.style.animation = '';
        });
    }
    else
        newCell();
}

function createmap() {
    map[0].innerHTML = '';
    let w = document.getElementById('gamemap').offsetWidth / column;
    for(let i=0;i<row;i++) {
        rows[i]=document.createElement('div');
        rows[i].setAttribute('class','myrow');
        map[0].appendChild(rows[i]);
        cell[i]=Array(column);
        for(let j=0;j<column;j++) {
            cell[i][j]=document.createElement('span');
            cell[i][j].setAttribute('class','mycell')
            rows[i].appendChild(cell[i][j]);
            let piece = document.createElement('span');
            piece.setAttribute('class','mypiece')
            cell[i][j].setAttribute('id', i.toString() + j.toString() + 'cell');
            piece.setAttribute('id', i.toString() + j.toString() + 'piece');
            cell[i][j].appendChild(piece);
        }
    }
}

function withdraw() {
    if(maxlength<=1)
        return;
    maxlength-=1
    for(let i=0;i<row;i++)
        for(let j=0;j<column;j++)
            mymap[i][j]=history[maxlength-1][i][j];
    drawmap()
}


function drawmap() { //根据mymap中的值绘制不同颜色
    for (let i= 0; i < row; i ++) {
        for (let j = 0; j < column; j ++) {
            let cell = document.getElementById(i.toString() + j.toString() + 'piece');
            switch(mymap[i][j]) {
                case 0:
                    cell.style.backgroundColor='#FAF0E6';
                    cell.innerText='';
                    break;
                case 2:
                    cell.style.backgroundColor='#FFE4C4';
                    cell.innerText='2';
                    break;
                case 4:
                    cell.style.backgroundColor='#FFDEAD';
                    cell.innerText='4';
                    break;
                case 8:
                    cell.style.backgroundColor='#F4A460';
                    cell.innerText='8';
                    break;
                case 16:
                    cell.style.backgroundColor='#FF8C00';
                    cell.innerText='16';
                    break;
                case 32:
                    cell.style.backgroundColor='#FF7F50';
                    cell.innerText='32';
                    break;
                case 64:
                    cell.style.backgroundColor='#FF6347';
                    cell.innerText='64';
                    break;
                case 128:
                    cell.style.backgroundColor='#CD5C5C';
                    cell.innerText='128';
                    break;
                case 256:
                    cell.style.backgroundColor='#D2691E';
                    cell.innerText='256';
                    break;
                case 512:
                    cell.style.backgroundColor='#A0522D';
                    cell.style.color='white';
                    cell.innerText='512';
                    break;
                case 1024:
                    cell.style.backgroundColor='#8B4513';
                    cell.innerText='1024';
                    cell.style.color='white';
                    break;
                case 2048:
                    cell.style.backgroundColor='#8B3020';
                    cell.innerText='2048';
                    cell.style.color='white';
                    break;
                case -1:
                    cell.style.backgroundColor='black';
                    cell.innerText='';
                    break;
                case -2:
                    cell.style.backgroundColor='pink';
                    cell.innerText='';
                    break;
            }
        }
    }
    console.log('history',history,'len=',history.length)
    console.log('mymap',mymap);
}


function losecheck() {//在每步移动之后对整体情况检测
    if (!onRight(true) && !onLeft(true) && !onUp(true) && !onDown(true)) {
        return true;
    }
    return false;
}

document.onkeydown=function(event) {

    var e=event||window.event;
    //上
    if(e&&e.keyCode===87 || e&&e.keyCode===38) {
        onUp();
    }
    //下
    else if(e&&e.keyCode===83 || e&&e.keyCode===40){
        onDown();
    }
    //左
    else if(e&&e.keyCode===65 || e&&e.keyCode===37) {
        onLeft();
    }
    //右
    else if(e&&e.keyCode===68 || e&&e.keyCode===39) {
        onRight();
    }
    myscore.innerText= score.toString();
    if(score>bestscore) {
        bestscore=score;
        localStorage.setItem('mybest',JSON.parse(bestscore));
    }
    mybestscore.innerText=bestscore.toString();
    if (losecheck())
        alert("lost! No more valid move available");
    
    if(randomEvent===0 && randchance>Math.random()) {//生成随机事件
        randomEvent=1;
        ex=myRand(row),ey=myRand(column);
        while(mymap[ex][ey]!==0) {
            ex=myRand(row),ey=myRand(column);
        }
        if(Math.random()<0.5) {//生成黑色方块
            eventType=1;
            eventCount=3;
            mymap[ex][ey]=-1;
        }
        else { //生成白色方块
            eventType=2;
            eventCount=2;
            mymap[ex][ey]=-2;
        }
    }
    else {
        eventCount-=1;
        if(eventCount===0) {
            mymap[ex][ey]=0;
            randomEvent=0;
        }
    }
    drawmap();
    for(let i=0;i<row;i++)
        for (let j=0;j<column;j++)
            history[maxlength][i][j]=mymap[i][j];
    maxlength+=1;
}

function mergeanimation(x, y) {
    let piece = document.getElementById(x.toString() + y.toString() + 'piece');
    piece.style.animation = "merge 0.3s linear";
    piece.addEventListener("animationend", function handler(){
        piece.style.animation = '';
    });
}

function transferanimation(element,targete){
    clearInterval(element.timer1);

    let originl = element.offsetLeft;
    let origint = element.offsetTop;

    element.timer1=setInterval(function(){
        let currentl=element.offsetLeft;
        let targetl = targete.offsetLeft;

        let currentt=element.offsetTop;
        let targett = targete.offsetTop;
        let stepl = 15;
        let stept = 15;
        stepl=currentl<targetl?stepl:-stepl;
        stept=currentt<targett?stept:-stept;
        currentl += stepl;
        currentt += stept;
        if(Math.abs(targetl-currentl)>Math.abs(stepl)){
            element.style.left=currentl+"px";//移动
        }
        if(Math.abs(targett-currentt)>Math.abs(stept)){
            element.style.top=currentt+"px";//移动
        }
        if (Math.abs(targetl-currentl)<=Math.abs(stepl)){
            element.style.left=targetl+"px";
        }
        if (Math.abs(targett-currentt)<=Math.abs(stept)){
            element.style.top=targett+"px";
        }
        if (Math.abs(targetl-currentl)<=Math.abs(stepl) && Math.abs(targett-currentt)<=Math.abs(stept))
        {
            clearInterval(element.timer1);
            element.style.top = origint+"px";
            element.style.left = originl+"px";
        }
    },5);
}

function moveanimation(x1, y1, x2, y2){
    let piece = document.getElementById(x1.toString() + y1.toString() + 'piece');
    let target = document.getElementById(x2.toString() + y2.toString() + 'piece');
    transferanimation(piece, target);
}

function onUp(check) {
    let validMove = 0;
    for (let c = 0; c < column; c++) {
        let i = 0;
        let j = 1;
        while (j < row) {
            let top = mymap[i][c];
            let bottom = mymap[j][c];
            if(top===-1) {
                if(bottom>0) {
                    mymap[j][c]=0;
                    mymap[i+1][c]=bottom;
                    i+=1;
                    validMove=1;
                }
            }
            else if(bottom===-1||bottom===-2) {
                i=j;
            }
            else if(top===-2) {
                if(bottom>0) {
                    mymap[j][c]=0;
                    i+=1;
                    validMove=1;
                }
            }
            else {
                if (top === bottom && top !== 0) { //可以合并到i
                    if (check)
                        return true;
                    mymap[i][c] = top + bottom;
                    mymap[j][c] = 0;
                    moveanimation(j, c, i, c);
                    mergeanimation(i, c);
                    score += top + bottom;
                    validMove = 1;
                    i += 1;
                }
                else if (top !== bottom && top === 0) {//可以把j移动到i
                    if (check)
                        return true;
                    mymap[i][c] = bottom;
                    mymap[j][c] = 0;
                    moveanimation(j, c, i, c);
                    validMove = 1;
                }
                else if (top !== bottom && top !== 0 && bottom !== 0) {//可以把j放在i下面
                    if (j === i + 1)
                        i = j;
                    else{
                        if (check)
                            return true;
                        i += 1;
                        mymap[i][c] = bottom;
                        mymap[j][c] = 0;
                        moveanimation(j, c, i, c);
                        validMove = 1;
                    }
                }
            }
            
            j += 1;
        }
    }
    if (validMove) {
        newCell();
    }
}

function onDown(check) {
    let validMove = 0;
    for (let c = 0; c < column; c ++) {
        let i = row - 1;
        let j = row - 2;
        while (j >= 0) {
            let top = mymap[j][c];
            let bottom = mymap[i][c];
            if(bottom===-1) {
                if(top>0) {
                    mymap[j][c]=0;
                    mymap[i-1][c]=top;
                    i-=1;
                    validMove=1;
                }
            }
            else if(top===-1||top===-2) {
                i=j;
            }
            else if(bottom===-2) {
                if(top>0) {
                    mymap[j][c]=0;
                    i-=1;
                    validMove=1;
                }
            }
            else {
                if (top === bottom && bottom !== 0) {
                    if (check)
                        return true;
                    mymap[i][c] = top + bottom;
                    mymap[j][c] = 0;
                    moveanimation(j, c, i, c);
                    mergeanimation(i, c);
                    score += top + bottom;
                    validMove = 1;
                    i -= 1;
                }
                else if (top !== bottom && bottom === 0) {
                    if (check)
                        return true;
                    mymap[i][c] = top;
                    mymap[j][c] = 0;
                    moveanimation(j, c, i, c);
                    validMove = 1;
                }
                else if (top !== bottom && top !== 0 && bottom !== 0) {
                    if (j === i - 1)
                        i = j;
                    else{
                        if (check)
                            return true;
                        i -= 1;
                        mymap[i][c] = top;
                        mymap[j][c] = 0;
                        moveanimation(j, c, i, c);
                        validMove = 1;
                    }
                }
            }
            
            j -= 1;
        }
    }
    if (validMove) {
        newCell();
    }
}

function onLeft(check) {
    let validMove = 0;
    for (let r = 0; r < row; r++) {
        let i = 0;
        let j = 1;
        while (j < column) {
            let left = mymap[r][i];
            let right = mymap[r][j];
            if(left===-1) {
                if(right>0) {
                    mymap[r][j]=0;
                    mymap[r][i+1]=right;
                    i+=1;
                    validMove=1;
                }
            }
            else if(right===-1||right===-2) {
                i=j;
            }
            else if(left===-2) {
                if(right>0) {
                    mymap[r][j]=0;
                    i+=1;
                    validMove=1;
                }
            }
            else {
                if (left === right && left !== 0) {
                    if (check)
                        return true;
                    mymap[r][i] = left + right;
                    mymap[r][j] = 0;
                    moveanimation(r, j, r, i);
                    mergeanimation(r, i);
                    score += left + right;
                    validMove = 1;
                    i += 1;
                } else if (left !== right && left === 0) {
                    if (check)
                        return true;
                    moveanimation(r, j, r, i);
                    mymap[r][i] = right;
                    mymap[r][j] = 0;
                    validMove = 1;
                } else if (left !== right && right !== 0 && left !== 0) {
                    if (j === i + 1)
                        i = j;
                    else {
                        if (check)
                            return true;
                        i += 1;
                        mymap[r][i] = right;
                        mymap[r][j] = 0;
                        moveanimation(r, j, r, i);
                        validMove = 1;
                    }
                }
            }
            
            j += 1;
        }
    }
    if (validMove) {
        newCell();
    }
}

function onRight(check) {
    let validMove = 0;
    for (let r = 0; r < row; r++) {
        let i = column - 1;
        let j = column - 2;
        while (j >= 0) {
            let left = mymap[r][j];
            let right = mymap[r][i];
            if(right===-1) {
                if(left>0) {
                    mymap[r][j]=0;
                    mymap[r][i-1]=left;
                    i-=1;
                    validMove=1;
                }
            }
            else if(left===-1||left===-2) {
                i=j;
            }
            else if(right===-2) {
                if(left>0) {
                    mymap[r][j]=0;
                    i-=1;
                    validMove=1;
                }
            }
            else {
                if (left === right && right !== 0) {
                    if (check)
                        return true;
                    mymap[r][i] = left + right;
                    mymap[r][j] = 0;
                    moveanimation(r, j, r, i);
                    mergeanimation(r, i);
                    score += left + right;
                    validMove = 1;
                    i -= 1;
                } else if (left !== right && right === 0) {
                    if (check)
                        return true;
                    mymap[r][i] = left;
                    mymap[r][j] = 0;
                    moveanimation(r, j, r, i);
                    validMove = 1;
                } else if (left !== right && right !== 0 && left !== 0) {
                    if (i === j + 1)
                        i = j;
                    else {
                        if (check)
                            return true;
                        i -= 1;
                        mymap[r][i] = left;
                        mymap[r][j] = 0;
                        moveanimation(r, j, r, i);
                        validMove = 1;
                    }
                }
            }
            j -= 1;
        }
    }
    if (validMove) {
        newCell();
    }
}

var rowinput=document.getElementById('row'),columninput=document.getElementById('column'),rowtitle=document.getElementById('rtitle'),columntitle=document.getElementById('ctitle')
rowinput.onfocus=function(){
    rowtitle.setAttribute('class','inputtitle2');
}
rowinput.onblur=function(){
    rowtitle.setAttribute('class','inputtitle');
}
columninput.onfocus=function(){
    columntitle.setAttribute('class','inputtitle2');
}
columninput.onblur=function(){
    columntitle.setAttribute('class','inputtitle');
}