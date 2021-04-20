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
    constructor(id, username, filepath, solvedTasks) {
        this.id = id;
        this.username = username;
        this.filepath = filepath;
        this.solvedTasks = solvedTasks;
    }
}
