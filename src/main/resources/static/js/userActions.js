var userData;
var id;
var username;
var keyword;
var solvedTasks = new Set();
const errorMessage = "Ups, something went wrong. Check network connection and try again. If error persists contact game admin.";

var gameManager = new GameManager();
var modalDisplay = new ModalDisplay();

function getUser(isValid) {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        url: "/getuser",
        data: $("#useUname").val(),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function(data) {
            userData = data;
            isValid = onGetUserSuccess(data, isValid);
        },
        complete: function(xhr) {
            if(xhr.status==404) {
                alert("User with this username was not found.");
                isValid = false;
            } else if(xhr.status!=200) {
                alert(errorMessage);
                isValid = false;
            }
        },
        error: function(e) {
            console.log("ERROR : ", e);
        }
    });
    return isValid;
}

function saveUser(user, isValid) {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        url: "/saveuser",
        data: JSON.stringify(user),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function(data) {
            id = data.id;
            username = data.username;
            keyword = data.keyword;
            solvedTasks = new Set(data.solvedTasks);
        },
        complete: function(xhr) {
            if(xhr.status==500 && xhr.responseJSON.message.includes("ConstraintViolationException")) {
                alert("User with the same username and keyword already exists. Please choose other username or other keyword.");
                isValid = false;
            } else if(xhr.status!=200) {
                alert(errorMessage);
                isValid = false;
            }
        },
        error: function(e) {
            console.log("ERROR : ", e);
        }
    });
    return isValid;
}

function onGetUserSuccess(isValid) {
    if(userData.length==1) {
        setUserValues(0);
    } else {
        isValid = false;
        document.getElementById("userList").innerHTML = "Which " + userData[0].username + " you are? Click on your keyword, to make the choice.";
        modalDisplay.addButtons();
        document.getElementById("chooseOfManyDiv").classList.toggle("expand");
    }
    return isValid;
}

function chooseUser(index) {
    setUserValues(index);
    modalDisplay.closeModalAndGreet(username);
    gameManager.choiceField.fillThumbContainer();
}

function setUserValues(index) {
    areSolved = (solvedTasks.size > 0) ? true : false;
    id = userData[index].id;
    username = userData[index].username;
    keyword = userData[index].keyword;
    solvedTasks = mergeSolved(new Set(userData[index].solvedTasks), solvedTasks);
    if(areSolved)
        updateUser(true);
}

function mergeSolved(userSolved, sessionSolved) {
    sessionSolved.forEach(elem => userSolved.add(elem));
    return userSolved;
}

function createUser(isValid) {
    var user = {};
    user["username"] = $("#createUname").val();
    user["keyword"] = $("#kword").val();
    user["solvedTasks"] = Array.from(solvedTasks);
    isValid = saveUser(user, isValid);
    return isValid;
}

function updateUser(isValid) {
    var user = {};
    user["username"] = username;
    user["keyword"] = keyword;
    user["solvedTasks"] = Array.from(solvedTasks);
    user["id"] = id;
    saveUser(user, isValid);
}

function greetExistingUser(obj) {
    var isValid = true;
    isValid = validate(isValid, "useUname");
    if(isValid && confirmChoice(obj))
        isValid = getUser(isValid);
    if(isValid) {
        modalDisplay.closeModalAndGreet(username);
        gameManager.choiceField.fillThumbContainer();
    }
}

function greetNewUser(obj) {
    var isValid = true;
    isValid = validate(isValid, "createUname");
    isValid = validate(isValid, "kword");
    if(isValid && confirmChoice(obj))
        isValid = createUser(isValid);
    if(isValid) {
        modalDisplay.closeModalAndGreet(username);
        gameManager.choiceField.fillThumbContainer();
    }
}

function greetAnonUser(obj) {
    if(confirmChoice(obj)) {
        username = "Anonymous user";
        modalDisplay.closeModalAndGreet(username);
        gameManager.choiceField.fillThumbContainer();
    }
}

function validate(isValid, fieldId) {
    if(isValid) {
        var label = "Username";
        if(fieldId=="kword")
            label = "Keyword";
        var checkString = document.getElementById(fieldId).value;
        if(checkString.length == 0) {
            alert(label + " is empty.");
            isValid = false;
        } else if(checkString.length < 3) {
            alert(label + " is too short.");
            isValid = false;
        } else if(!/^([0-9a-zA-Z]{3,})$/.test(checkString)) {
            alert(label + " contains illegal characters.");
            isValid = false;
        }
    }
    return isValid;
}

function confirmChoice(obj) {
    var formDivs = ["useProfileDiv", "createProfileDiv", "useAnonDiv"];
    for(var element of formDivs) {
        if(obj.parentElement.parentElement.id==element)
            continue;
        if(document.getElementById(element).getElementsByTagName("form").length > 0) {
            var pChildren = document.getElementById(element).getElementsByTagName("form")[0].getElementsByTagName("p");
            for(var pChild of pChildren) {
                var inputChildren = pChild.getElementsByTagName('input');
                for (var inputChild of inputChildren) {
                    if(inputChild.value!="")
                        return confirm("Some fields of other choice options are not empty. \n Are you sure you want to choose this option?");
                }
            }
        }
    }
    return true;
}

function markAsSolvedAndSave() {
    gameManager.markAsSolved();
    if(id != null)
        updateUser(true);
}

function changeUser() {
    if(gameManager.resetBoard()) {
        username = null;
        keyword = null;
        id = null;
        solvedTasks = new Set();
        modalDisplay.displayWelcome();
    }
}

function saveResults() {
    if(username!="Anonymous user") {
        alert("You currently use " + username + " profile. Your results are being saved automatically. \nIf you want to use another profile click 'Use another profile' button at the top of the page.");
        return;
    }
    modalDisplay.displayWelcome(false);
}
