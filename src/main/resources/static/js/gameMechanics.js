class GameMechanics {
    started = false;
    snapPoints = new Map();
    initShapeDistances = new Map();
    shapeDistances = new Map();
    marked = null;

    drag(evt) {
        this.started = true;
        this.mark(evt);
        evt.target.x = evt.stageX;
        evt.target.y = evt.stageY;
        this.snap(evt);
        this.snapPoints.set(evt.target.name, this.calculateShapeVerticles(evt.target.name, this.shapeDistances));
        stage.update();
    }

    snap(evt) {
        var distances = this.shapeDistances.get(evt.target.name);
        var snapDistance = 10;

        var flatSnapPoints = [];
        for(var shapeName of this.snapPoints.keys()) {
            flatSnapPoints = flatSnapPoints.concat(this.snapPoints.get(shapeName));
        }

        for(var i = 0; i < flatSnapPoints.length; i++) {
            for(var j = 0; j < distances.length; j++) {
                var diffX = Math.abs(evt.stageX+distances[j].x*SIZE - flatSnapPoints[i].x);
                var diffY = Math.abs(evt.stageY+distances[j].y*SIZE - flatSnapPoints[i].y);
                var d = Math.sqrt(diffX*diffX + diffY*diffY);

                var closest = (d < snapDistance);
                if (closest) {
                    evt.target.x = flatSnapPoints[i].x-distances[j].x*SIZE;
                    evt.target.y = flatSnapPoints[i].y-distances[j].y*SIZE;
                    break;
                }
            }
        }
    }

    mark(evt) {
        stage.setChildIndex(evt.target, stage.getNumChildren()-1);
        stage.update();
        this.marked = evt.target;
    }

    rotate(shape, angle) {
        shape.rotation += angle;
        this.updateShapeDistances(shape);
        this.snapPoints.set(shape.name, this.calculateShapeVerticles(shape.name, this.shapeDistances));
        stage.update();
    }

    flip(shape) {
        shape.scaleX = -1*shape.scaleX;
        this.updateShapeDistances(shape);
        this.snapPoints.set(shape.name, this.calculateShapeVerticles(shape.name, this.shapeDistances));
        stage.update();
    }

    calculateSnapPoints() {
        for(var shapeName of this.shapeDistances.keys()) {
            this.snapPoints.set(shapeName, this.calculateShapeVerticles(shapeName, this.shapeDistances));
        }
    }

    calculateShapeVerticles(shapeName, distDictionary) {
        var currVerticles = [];
        var distances = distDictionary.get(shapeName);
        for(var i = 0; i < distances.length; i++) {
            currVerticles[i] = p((stage.getChildByName(shapeName).x+distances[i].x*SIZE).toFixed(3), (stage.getChildByName(shapeName).y+distances[i].y*SIZE).toFixed(3));
        }
        return currVerticles;
    }

    updateShapeDistances(shape) {
        var distances = this.initShapeDistances.get(shape.name);
        var newDistances = []
        for(var i = 0; i < distances.length; i++) {
            var newX = (distances[i].x * shape.scaleX) * this.getCosinus(shape) + distances[i].y * this.getSinus(shape);
            var newY = distances[i].y * this.getCosinus(shape) - (distances[i].x * shape.scaleX) * this.getSinus(shape);
            newDistances[i] = p(newX, newY);
        }
        this.shapeDistances.set(shape.name, newDistances);
    }

    getSinus(shape) {
        return Math.sin(this.toRadians(-1*(shape.rotation)%360));
    }

    getCosinus(shape) {
        return Math.cos(this.toRadians(-1*(shape.rotation)%360));
    }

    toRadians(angle) {
        return angle*(Math.PI/180);
    }

    keyEvents() {
        const ARROW_KEY_LEFT = 37;
        const ARROW_KEY_RIGHT = 39;
        const ARROW_KEY_UP = 38;
        var localGameMechanics = this;
        document.onkeydown = function(evt) {
            if(localGameMechanics.marked==null) {
                return;
            }
            switch (evt.keyCode) {
                case ARROW_KEY_LEFT:
                    localGameMechanics.rotate(localGameMechanics.marked, -45);
                    break;
                case ARROW_KEY_RIGHT:
                    localGameMechanics.rotate(localGameMechanics.marked, 45);
                    break;
                case ARROW_KEY_UP:
                    localGameMechanics.flip(localGameMechanics.marked);
                    break;
                case 40:
                    debug();
            }
        }
    }

}

function debug() {
//    var localSnapPoints = userActions.gameManager.gameMechanics.snapPoints
//    var distMap = '';
//    for(var shapeName of localSnapPoints.keys()) {
//        distMap = distMap + shapeName + ': ' + localSnapPoints.get(shapeName) + '\n';
//    }
    var flatPiecePoints = userActions.gameManager.solutionChecker.flattenPiecePoints(userActions.gameManager.gameMechanics.shapeDistances.keys(), userActions.gameManager.gameMechanics.snapPoints);
    var allowedPoints = userActions.gameManager.solutionChecker.calculateAllowedVerticles(userActions.gameManager.taskName, userActions.gameManager.flatTaskVerticles);

    alert(
        //distMap
        allowedPoints + '\n\n' + flatPiecePoints
        //userActions.gameManager.calculateAllowedVerticles(userActions.gameManager.taskName)
        //userActions.gameManager.flatTaskVerticles //+ '\n\n' + flatPiecePoints
        //"Check user:\nid: " + userActions.userLocal.id + "\nusername: " + userActions.userLocal.username + "\nkeyword: " + userActions.userLocal.keyword + "\nsolvedTasks: " + Array.from(userActions.userLocal.solvedTasks)
    );
}
