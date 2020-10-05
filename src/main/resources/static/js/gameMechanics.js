class GameMechanics {
    constructor() {
        this.started = false;
    }

    drag(evt) {
        this.started = true;
        this.mark(evt);
        evt.target.x = evt.stageX;
        evt.target.y = evt.stageY;
        this.snap(evt);
        snapPoints.set(evt.target.name, this.calculateShapeVerticles(evt.target.name, shapeDistances));
        stage.update();
    }

    snap(evt) {
        var distances = shapeDistances.get(evt.target.name);
        var snapDistance = 10;

        var flatSnapPoints = [];
        for(var shapeName of snapPoints.keys()) {
            flatSnapPoints = flatSnapPoints.concat(snapPoints.get(shapeName));
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
        marked = evt.target;
    }

    rotate(shape, angle) {
        shape.rotation += angle;
        this.updateShapeDistances(shape);
        snapPoints.set(shape.name, this.calculateShapeVerticles(shape.name, shapeDistances));
        stage.update();
    }

    flip(shape) {
        shape.scaleX = -1*shape.scaleX;
        this.updateShapeDistances(shape);
        snapPoints.set(shape.name, this.calculateShapeVerticles(shape.name, shapeDistances));
        stage.update();
    }

    calculateSnapPoints() {
        for(var shapeName of shapeDistances.keys()) {
            snapPoints.set(shapeName, this.calculateShapeVerticles(shapeName, shapeDistances));
        }
    }

    calculateShapeVerticles(shapeName, distDictionary) {
        var currVerticles = [];
        var distances = distDictionary.get(shapeName);
        for(var i = 0; i < distances.length; i++) {
            currVerticles[i] = p(stage.getChildByName(shapeName).x+distances[i].x*SIZE, stage.getChildByName(shapeName).y+distances[i].y*SIZE);
        }
        return currVerticles;
    }

    updateShapeDistances(shape) {
        var distances = initShapeDistances.get(shape.name);
        var newDistances = []
        for(var i = 0; i < distances.length; i++) {
            var newX = (distances[i].x * shape.scaleX) * this.getCosinus(shape) + distances[i].y * this.getSinus(shape);
            var newY = distances[i].y * this.getCosinus(shape) - (distances[i].x * shape.scaleX) * this.getSinus(shape);
            newDistances[i] = p(newX, newY);
        }
        shapeDistances.set(shape.name, newDistances);
    }

    getSinus(shape) {
        return Math.sin(this.toRadians(-1*(shape.rotation)%360)).toFixed(4)
    }

    getCosinus(shape) {
        return Math.cos(this.toRadians(-1*(shape.rotation)%360)).toFixed(4)
    }

    toRadians(angle) {
        return angle*(Math.PI/180);
    }

}

var gameMechanics = new GameMechanics();
