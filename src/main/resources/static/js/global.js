const SIZE = 60;
var stage;

// Change into class user
var userData;
var id;
var username;
var keyword;
var solvedTasks = new Set();

function p(x,y) {
    return new createjs.Point(x,y);
}

class User {
    constructor(id, username, keyword, solvedTasks) {
        this.id = id;
        this.username = username;
        this.keyword = keyword;
        this.solvedTasks = solvedTasks;
    }
}
