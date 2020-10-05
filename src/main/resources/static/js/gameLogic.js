const pieceStartX = 3*SIZE;
const pieceStartY = 3*SIZE;

const taskStartX = 12.5*SIZE;
const taskStartY = 6*SIZE;

var taskName;

function initGame() {
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = document.getElementById("container").clientWidth;
    canvas.height = document.getElementById("container").clientHeight;
    stage = new createjs.Stage("canvas");

    var reset = new createjs.DOMElement("reset");
    reset.x = 2*SIZE;
    reset.y = 8.5*SIZE;
    reset.htmlElement.onclick = resetBoard;
    var solved = new createjs.DOMElement("solved");
    solved.x = 2*SIZE;
    solved.y = 9.5*SIZE;
    solved.htmlElement.onclick = markAsSolvedAndSave;
    var save = new createjs.DOMElement("save");
    save.x = 2*SIZE;
    save.y = 10.5*SIZE;
    save.htmlElement.onclick = saveResults;
    stage.addChild(reset, solved, save);

    var pieceField = new createjs.Shape();
    var taskField = new createjs.Shape();
    pieceField.graphics.beginStroke("black").drawRect(SIZE, SIZE, 4*SIZE, 5*SIZE);
    taskField.graphics.beginFill("lightGray").drawRect(6*SIZE, SIZE, 13*SIZE, 10*SIZE);
    stage.addChild(pieceField, taskField);

    choiceField.initChoiceField();

    pieces.forEach(addPiece);
    pieces.forEach(function(piece){
        initShapeDistances.set(piece.name, piece.distances[0])
    });
    shapeDistances = new Map(initShapeDistances);
    gameMechanics.calculateSnapPoints();

    addTextTips();
    stage.update();
}

function addTextTips() {
     var text = new createjs.Text("Arrow left:  rotate left\nArrow right: rotate right\nArrow up:    flip", "14px Courier New", "black");
     text.x = SIZE;
     text.y = 7*SIZE;
     text.lineHeight = 24;
     stage.addChild(text);
}

function addThumbNail(name, x, y, fill) {
    var points = taskShapeDistances.get(name.replace("Thumb", ""));
    var shape = addShape(name, points, "black", fill);
    shape.x = x;
    shape.y = y;
    shape.scaleX = 0.2;
    shape.scaleY = 0.2;
    shape.on("click",chooseTask);
    choiceField.thumbContainer.addChild(shape);
}

function addTaskShape(name) {
    var points = taskShapeDistances.get(name);
    var shape = addShape(name, points, "black", "white");
    shape.x = taskStartX;
    shape.y = taskStartY;
    stage.addChild(shape);
}

function addPiece(piece) {
    var shape = addShape(piece.name, piece.distances, piece.color, piece.color);
    shape.x = pieceStartX + piece.x*SIZE;
    shape.y = pieceStartY + piece.y*SIZE;
    shape.on("pressmove", function(evt) { gameMechanics.drag(evt) });
    shape.on("click", function(evt) { gameMechanics.mark(evt) });
    stage.addChild(shape);
}

function addShape(name, points, strokeColor, fillColor) {
    var shape = new createjs.Shape();
    shape.graphics.beginStroke(strokeColor).beginFill(fillColor);
    for(var i = 0; i < points.length; i++) {
        shape.graphics.moveTo(SIZE*points[i][0].x, SIZE*points[i][0].y);
        for(var j = 1; j < points[i].length; j++) {
            shape.graphics.lineTo(SIZE*points[i][j].x, SIZE*points[i][j].y);
        }
        shape.graphics.lineTo(SIZE*points[i][0].x, SIZE*points[i][0].y);
    }
    shape.name = name;
    return shape;
}

function resetBoard() {
    var doReset = true;
    if(gameMechanics.started)
        doReset = confirm("Are you sure you want to quit started puzzle?");
    if(doReset) {
        gameMechanics.started = false;
        if(taskName!=null)
            stage.removeChild(stage.getChildByName(taskName));
        pieces.forEach(resetPiece);
        shapeDistances.clear();
        shapeDistances = new Map(initShapeDistances);
        snapPoints.clear();
        gameMechanics.calculateSnapPoints();
        taskName = null;
        marked = null;
        stage.update();
    }
    return doReset;
}

function resetPiece(piece) {
    stage.removeChild(stage.getChildByName(piece.name));
    addPiece(piece);
}

function markAsSolved() {
    if(taskName==null)
        return;
    gameMechanics.started = false;
    solvedTasks.add(taskName);
    colorThumbNailSolved(taskName);
    stage.update();
}

function colorThumbNailSolved(taskName) {
    var thumbNail = choiceField.thumbContainer.getChildByName(taskName+"Thumb");
    choiceField.thumbContainer.removeChild(thumbNail);
    addThumbNail(thumbNail.name, thumbNail.x, thumbNail.y, "darkGray");
}

function chooseTask(evt) {
    if(resetBoard()) {
        taskName = evt.target.name.replace("Thumb", "");
        addTaskShape(taskName);
        snapPoints.set(taskName, gameMechanics.calculateShapeVerticles(taskName, flattenTaskDistances(taskName)));
        stage.update();
    }
}

document.onkeydown = function(evt) {
    if(marked==null) {
        return;
    }
    switch (evt.keyCode) {
        case ARROW_KEY_LEFT:
            gameMechanics.rotate(marked, -45);
            break;
        case ARROW_KEY_RIGHT:
            gameMechanics.rotate(marked, 45);
            break;
        case ARROW_KEY_UP:
            gameMechanics.flip(marked);
            break;
        case 40:
            debug();
    }
}

// Debug methods

function debug() {
    var sTIt = solvedTasks.values();
    alert(
        "Check user:\nid: " + id + "\nusername: " + username + "\nkeyword: " + keyword + "\nsolvedTasks: " + Array.from(solvedTasks)
    );
}
