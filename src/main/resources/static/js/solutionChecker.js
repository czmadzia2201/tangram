class SolutionChecker {

    checkSolution(taskName, flatTaskVerticles, pieces, snapPoints) {
        var flatPiecePoints = this.flattenPiecePoints(pieces, snapPoints);
        var allowedPoints = this.calculateAllowedVerticles(taskName, flatTaskVerticles);
        // condition 1 - all piece points must be included in allowed points
        for(var flatPiecePoint of flatPiecePoints) {
            if(!allowedPoints.some(allowedPoint => this.areEqual(allowedPoint, flatPiecePoint))) {
                alert("Bad solution :(");
                return false;
            }
        }
        // condition 2 - all task points must be covered by piece points
        for(var taskVerticle of flatTaskVerticles) {
            if (!flatPiecePoints.some(flatPiecePoint => this.areEqual(flatPiecePoint, taskVerticle))) {
                alert("Bad solution :(");
                return false;
            }
        }
        alert("Correct! :)");
        return true;
    }

    areEqual(p1, p2) {
        var delta = 0.002;
        if(Math.abs(p1.x - p2.x) < delta && Math.abs(p1.y - p2.y) < delta)
            return true;
        return false;
    }

    flattenPiecePoints(pieces, snapPoints) {
        var flatPiecePoints = [];
        for(var piece of pieces) {
            flatPiecePoints = flatPiecePoints.concat(snapPoints.get(piece));
        }
        return flatPiecePoints;
    }

    calculateAllowedVerticles(key, flatTaskVerticles) {
        var taskAllowedVerticles = [];
        var allowedPoints = taskAllowedPoints.get(key);
        for(var i = 0; i < allowedPoints.length; i++) {
            taskAllowedVerticles[i] = p((stage.getChildByName(key).x+allowedPoints[i].x*SIZE).toFixed(3), (stage.getChildByName(key).y+allowedPoints[i].y*SIZE).toFixed(3));
        }
        return taskAllowedVerticles.concat(flatTaskVerticles);
    }

}