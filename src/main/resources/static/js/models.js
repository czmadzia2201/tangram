class Piece {
    constructor(name, x, y, distances, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.distances = distances;
        this.color = color;
    }
}

class User {
    constructor(id, username, keyword, solvedTasks) {
        this.id = id;
        this.username = username;
        this.keyword = keyword;
        this.solvedTasks = solvedTasks;
    }
}
