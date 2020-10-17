class GameManager {
    pieceStartX = 3*SIZE;
    pieceStartY = 3*SIZE;
    taskStartX = 12.5*SIZE;
    taskStartY = 6*SIZE;

    solvedTasks = new Set();
    taskName = null;

    pieces = [
        new Piece("skyLeft", -1.25, -1.25, [[p(1.25,-0.75),p(-0.75,-0.75),p(-0.75,1.25)]], "blue"),
        new Piece("skyRight", 1.25, -1.25, [[p(-1.25,-0.75),p(0.75,-0.75),p(0.75,1.25)]], "blue"),
        new Piece("roofSmall", 1.5, 0.5, [[p(0.5,-0.5),p(-0.5,-1.5),p(-1.5,-0.5),p(0.5,1.5)]], "orange"),
        new Piece("roofBig", -1, 0, [[p(-1,-0),p(1,-2),p(2,-1),p(-1,2)]], "darkorange"),
        new Piece("house", 0, 1.5, [[p(0,-1.5),p(1,-0.5),p(1,1.5),p(-1,1.5),p(-1,-0.5)]], "red"),
        new Piece("bushLeft", -1.5, 2, [[p(-0.5,0),p(0.5,-1),p(0.5,1),p(-0.5,1)]], "green"),
        new Piece("bushRight", 1.5, 2, [[p(0.5,0),p(-0.5,-1),p(-0.5,1),p(0.5,1)]], "green"),
    ]

    thumbContainer = new Container();
    thumbRowWidth = 10;
    choiceFieldWidth = 18*SIZE;
    choiceFieldHeight = 4*SIZE;
    taskKeys = Array.from(taskShapeDistances.keys());
    rowCount = Math.ceil(this.taskKeys.length/this.thumbRowWidth);
    scrolledHeight = this.choiceFieldHeight*(this.rowCount/2);

    gameMechanics = new GameMechanics();

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

        this.initChoiceField();

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
        var shape = this.addShape(name, points, "black", "white");
        shape.x = this.taskStartX;
        shape.y = this.taskStartY;
        stage.addChild(shape);
    }

    addPiece(piece) {
        var localGameMechanics = this.gameMechanics;
        var shape = this.addShape(piece.name, piece.distances, piece.color, piece.color);
        shape.x = this.pieceStartX + piece.x*SIZE;
        shape.y = this.pieceStartY + piece.y*SIZE;
        shape.on("pressmove", function(evt) { localGameMechanics.drag(evt) });
        shape.on("click", function(evt) { localGameMechanics.mark(evt) });
        stage.addChild(shape);
    }

    addThumbNail(name, x, y, fill) {
        var localGameManager = this;
        var points = taskShapeDistances.get(name.replace("Thumb", ""));
        var shape = this.addShape(name, points, "black", fill);
        shape.x = x;
        shape.y = y;
        shape.scaleX = 0.2;
        shape.scaleY = 0.2;
        shape.on("click", function(evt) { localGameManager.chooseTask(evt) }); //chooseTask);
        this.thumbContainer.addChild(shape);
    }

    addShape(name, points, strokeColor, fillColor) {
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

    initChoiceField() {
        const scrollBarWidth = 15;
        const choiceFieldX = SIZE;
        const choiceFieldY = 12*SIZE;

        var localThumbContainer = this.thumbContainer;
        var frame = new Rectangle(this.choiceFieldWidth, this.choiceFieldHeight).addTo(stage).pos(choiceFieldX/2, choiceFieldY/2);
        localThumbContainer.addTo(stage).pos(choiceFieldX/2, choiceFieldY/2);
        localThumbContainer.setMask(frame);

        var button = new Button({
            width:scrollBarWidth,
            height:this.choiceFieldHeight/(this.rowCount/2),
            label:"",
            borderColor:"lightGray",
            borderWidth:1.5,
            backgroundColor:"darkGray",
            corner:scrollBarWidth*0.5
        }).expand(); // helps on mobile

        var scrollbar = new Slider({
            min:0,
            max:this.scrolledHeight-this.choiceFieldHeight,
            step:0,
            button:button,
            barLength:this.choiceFieldHeight,
            barWidth:scrollBarWidth,
            barColor:"darkGray",
            vertical:true,
            keyArrows:false,
            inside:true,
            currentValue:this.scrolledHeight-this.choiceFieldHeight
        })
            .addTo(stage)
            .pos(this.choiceFieldWidth-scrollBarWidth, choiceFieldY/2);

        scrollbar.on("change", function() {
            localThumbContainer.y = frame.y + scrollbar.currentValue - scrollbar.max;
        });

        this.fillThumbContainer();
    }

    fillThumbContainer() {
        this.thumbContainer.removeAllChildren();

        var backGround = new Rectangle(this.choiceFieldWidth, this.scrolledHeight, "lightGray").addTo(this.thumbContainer);

        var thumbStartX = 1;
        var thumbStartY = 1;

        for(var i = 0; i < this.taskKeys.length; i++) {
            var fill = (this.solvedTasks.has(this.taskKeys[i])) ? "darkGray" : "white"
            this.addThumbNail(this.taskKeys[i]+"Thumb", thumbStartX*SIZE, thumbStartY*SIZE, fill);
            thumbStartX += 1.75;
            if((i+1)%this.thumbRowWidth==0) {
                thumbStartY += 2;
                thumbStartX = 1;
            }
        }
        stage.update();
    }

    resetBoard() {
        var doReset = true;
        if(this.gameMechanics.started)
            doReset = confirm("Are you sure you want to quit started puzzle?");
        if(doReset) {
            this.gameMechanics.started = false;
            if(this.taskName!=null)
                stage.removeChild(stage.getChildByName(this.taskName));
            for(var piece of this.pieces)
                this.resetPiece(piece);
            this.gameMechanics.shapeDistances.clear();
            this.gameMechanics.shapeDistances = new Map(this.gameMechanics.initShapeDistances);
            this.gameMechanics.snapPoints.clear();
            this.gameMechanics.calculateSnapPoints();
            this.taskName = null;
            this.gameMechanics.marked = null;
            stage.update();
        }
        return doReset;
    }

    resetPiece(piece) {
        stage.removeChild(stage.getChildByName(piece.name));
        this.addPiece(piece);
    }

    markAsSolved() {
        if(this.taskName==null)
            return;
        this.gameMechanics.started = false;
        this.solvedTasks.add(this.taskName);
        this.colorThumbNailSolved(this.taskName);
        stage.update();
    }

    colorThumbNailSolved(taskName) {
        var thumbNail = this.thumbContainer.getChildByName(taskName+"Thumb");
        this.thumbContainer.removeChild(thumbNail);
        this.addThumbNail(thumbNail.name, thumbNail.x, thumbNail.y, "darkGray");
    }

    chooseTask(evt) {
        if(this.resetBoard()) {
            this.taskName = evt.target.name.replace("Thumb", "");
            this.addTaskShape(this.taskName);
            this.gameMechanics.snapPoints.set(this.taskName, this.gameMechanics.calculateShapeVerticles(this.taskName, this.flattenTaskDistances(this.taskName)));
            stage.update();
        }
    }

    flattenTaskDistances(key) {
        var flatTaskDistances = new Map();
        flatTaskDistances.set(key, this.concatDistanceArrays(taskShapeDistances.get(key)));
        return flatTaskDistances;
    }

    concatDistanceArrays(inputArray) {
        return (inputArray.length == 2) ? inputArray[0].concat(inputArray[1]) : inputArray[0];
    }

}