class GameManager {
    constructor() {
        this.pieceStartX = 3*SIZE;
        this.pieceStartY = 3*SIZE;
        this.taskStartX = 12.5*SIZE;
        this.taskStartY = 6*SIZE;
        this.gameMechanics = new GameMechanics();
        this.choiceField = new ChoiceField();
        this.pieces = [
            new Piece("skyLeft", -1.25, -1.25, [[p(1.25,-0.75),p(-0.75,-0.75),p(-0.75,1.25)]], "blue"),
            new Piece("skyRight", 1.25, -1.25, [[p(-1.25,-0.75),p(0.75,-0.75),p(0.75,1.25)]], "blue"),
            new Piece("roofSmall", 1.5, 0.5, [[p(0.5,-0.5),p(-0.5,-1.5),p(-1.5,-0.5),p(0.5,1.5)]], "orange"),
            new Piece("roofBig", -1, 0, [[p(-1,-0),p(1,-2),p(2,-1),p(-1,2)]], "darkorange"),
            new Piece("house", 0, 1.5, [[p(0,-1.5),p(1,-0.5),p(1,1.5),p(-1,1.5),p(-1,-0.5)]], "red"),
            new Piece("bushLeft", -1.5, 2, [[p(-0.5,0),p(0.5,-1),p(0.5,1),p(-0.5,1)]], "green"),
            new Piece("bushRight", 1.5, 2, [[p(0.5,0),p(-0.5,-1),p(-0.5,1),p(0.5,1)]], "green"),
        ]
    }

    initGame() {
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = document.getElementById("container").clientWidth;
        canvas.height = document.getElementById("container").clientHeight;
        stage = new createjs.Stage("canvas");

        var reset = new createjs.DOMElement("reset");
        reset.x = 2*SIZE;
        reset.y = 8.5*SIZE;
        var solved = new createjs.DOMElement("solved");
        solved.x = 2*SIZE;
        solved.y = 9.5*SIZE;
        var save = new createjs.DOMElement("save");
        save.x = 2*SIZE;
        save.y = 10.5*SIZE;
        stage.addChild(reset, solved, save);

        var pieceField = new createjs.Shape();
        var taskField = new createjs.Shape();
        pieceField.graphics.beginStroke("black").drawRect(SIZE, SIZE, 4*SIZE, 5*SIZE);
        taskField.graphics.beginFill("lightGray").drawRect(6*SIZE, SIZE, 13*SIZE, 10*SIZE);
        stage.addChild(pieceField, taskField);

        this.choiceField.initChoiceField();

        for(var piece of this.pieces) {
            this.addPiece(piece);
            this.gameMechanics.initShapeDistances.set(piece.name, piece.distances[0]);
        }
        this.gameMechanics.shapeDistances = new Map(this.gameMechanics.initShapeDistances);
        this.gameMechanics.calculateSnapPoints();

        this.gameMechanics.keyEvents();

        this.addTextTips();
        stage.update();
    }

    addTextTips() {
         var text = new createjs.Text("Arrow left:  rotate left\nArrow right: rotate right\nArrow up:    flip", "14px Courier New", "black");
         text.x = SIZE;
         text.y = 7*SIZE;
         text.lineHeight = 24;
         stage.addChild(text);
    }

    addTaskShape(name) {
        var points = taskShapeDistances.get(name);
        var shape = GameManager.addShape(name, points, "black", "white");
        shape.x = this.taskStartX;
        shape.y = this.taskStartY;
        stage.addChild(shape);
    }

    addPiece(piece) {
        var localGameMechanics = this.gameMechanics;
        var shape = GameManager.addShape(piece.name, piece.distances, piece.color, piece.color);
        shape.x = this.pieceStartX + piece.x*SIZE;
        shape.y = this.pieceStartY + piece.y*SIZE;
        shape.on("pressmove", function(evt) { localGameMechanics.drag(evt) });
        shape.on("click", function(evt) { localGameMechanics.mark(evt) });
        stage.addChild(shape);
    }

    static addShape(name, points, strokeColor, fillColor) {
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

    resetBoard() {
        var doReset = true;
        if(this.gameMechanics.started)
            doReset = confirm("Are you sure you want to quit started puzzle?");
        if(doReset) {
            this.gameMechanics.started = false;
            if(taskName!=null)
                stage.removeChild(stage.getChildByName(taskName));
            for(var piece of this.pieces)
                this.resetPiece(piece);
            this.gameMechanics.shapeDistances.clear();
            this.gameMechanics.shapeDistances = new Map(this.gameMechanics.initShapeDistances);
            this.gameMechanics.snapPoints.clear();
            this.gameMechanics.calculateSnapPoints();
            taskName = null;
            marked = null;
            stage.update();
        }
        return doReset;
    }

    resetPiece(piece) {
        stage.removeChild(stage.getChildByName(piece.name));
        this.addPiece(piece);
    }

    markAsSolved() {
        if(taskName==null)
            return;
        this.gameMechanics.started = false;
        solvedTasks.add(taskName);
        this.colorThumbNailSolved(taskName);
        stage.update();
    }

    colorThumbNailSolved(taskName) {
        var thumbNail = this.choiceField.thumbContainer.getChildByName(taskName+"Thumb");
        this.choiceField.thumbContainer.removeChild(thumbNail);
        this.choiceField.addThumbNail(thumbNail.name, thumbNail.x, thumbNail.y, "darkGray");
    }

}

function chooseTask(evt) {
    if(gameManager.resetBoard()) {
        taskName = evt.target.name.replace("Thumb", "");
        gameManager.addTaskShape(taskName);
        gameManager.gameMechanics.snapPoints.set(taskName, gameManager.gameMechanics.calculateShapeVerticles(taskName, flattenTaskDistances(taskName)));
        stage.update();
    }
}

function flattenTaskDistances(key) {
    var flatTaskDistances = new Map();
    flatTaskDistances.set(key, concatDistanceArrays(taskShapeDistances.get(key)));
    return flatTaskDistances;
}

function concatDistanceArrays(inputArray) {
    return (inputArray.length == 2) ? inputArray[0].concat(inputArray[1]) : inputArray[0];
}