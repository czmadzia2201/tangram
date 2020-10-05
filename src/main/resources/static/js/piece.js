class Piece {
    constructor(name, x, y, distances, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.distances = distances;
        this.color = color;
    }

}

const pieces = [
    new Piece("skyLeft", -1.25, -1.25, [[p(1.25,-0.75),p(-0.75,-0.75),p(-0.75,1.25)]], "blue"),
    new Piece("skyRight", 1.25, -1.25, [[p(-1.25,-0.75),p(0.75,-0.75),p(0.75,1.25)]], "blue"),
    new Piece("roofSmall", 1.5, 0.5, [[p(0.5,-0.5),p(-0.5,-1.5),p(-1.5,-0.5),p(0.5,1.5)]], "orange"),
    new Piece("roofBig", -1, 0, [[p(-1,-0),p(1,-2),p(2,-1),p(-1,2)]], "darkorange"),
    new Piece("house", 0, 1.5, [[p(0,-1.5),p(1,-0.5),p(1,1.5),p(-1,1.5),p(-1,-0.5)]], "red"),
    new Piece("bushLeft", -1.5, 2, [[p(-0.5,0),p(0.5,-1),p(0.5,1),p(-0.5,1)]], "green"),
    new Piece("bushRight", 1.5, 2, [[p(0.5,0),p(-0.5,-1),p(-0.5,1),p(0.5,1)]], "green"),
]
