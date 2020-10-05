const SIZE = 60; // gameLogic, gameMechanics, choiceField

const ARROW_KEY_LEFT = 37;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_UP = 38;

var marked;     // gameLogic, gameMechanics
//var started = false; // gameLogic, gameMechanics

var initShapeDistances = new Map(); // gameLogic, gameMechanics
var shapeDistances = new Map(); // gameLogic, gameMechanics
var snapPoints = new Map(); // gameLogic, gameMechanics

var stage; // gameLogic, gameMechanics, choiceField
