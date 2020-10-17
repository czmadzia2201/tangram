class UserActions {
    errorMessage = "Ups, something went wrong. Check network connection and try again. If error persists contact game admin.";
    gameManager = new GameManager();
    modalDisplay = new ModalDisplay();
    userData = null;
    userLocal = null;
    anonUsername = null;

    getUser(isValid) {
        var localUserActions = this;
        var localErrorMessage = this.errorMessage;
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
                isValid = localUserActions.onGetUserSuccess(data, isValid);
            },
            complete: function(xhr) {
                if(xhr.status==404) {
                    alert("User with this username was not found.");
                    isValid = false;
                } else if(xhr.status!=200) {
                    alert(localErrorMessage);
                    isValid = false;
                }
            },
            error: function(e) {
                console.log("ERROR : ", e);
            }
        });
        return isValid;
    }

    saveUser(user, isValid) {
        var localErrorMessage = this.errorMessage;
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
                this.userLocal = new User(data.id, data.username, data.keyword);
                solvedTasks = new Set(data.solvedTasks);
            },
            complete: function(xhr) {
                if(xhr.status==500 && xhr.responseJSON.message.includes("ConstraintViolationException")) {
                    alert("User with the same username and keyword already exists. Please choose other username or other keyword.");
                    isValid = false;
                } else if(xhr.status!=200) {
                    alert(localErrorMessage);
                    isValid = false;
                }
            },
            error: function(e) {
                console.log("ERROR : ", e);
            }
        });
        return isValid;
    }

    onGetUserSuccess(data, isValid) {
        this.userData = data;
        if(this.userData.length==1) {
            this.setUserValues(0);
        } else {
            isValid = false;
            document.getElementById("userList").innerHTML = "Which " + this.userData[0].username + " you are? Click on your keyword, to make the choice.";
            this.modalDisplay.addButtons(this.userData);
            document.getElementById("chooseOfManyDiv").classList.toggle("expand");
        }
        return isValid;
    }

    chooseUser(index) {
        this.setUserValues(index);
        this.modalDisplay.closeModalAndGreet(this.userLocal.username);
        this.gameManager.fillThumbContainer();
    }

    setUserValues(index) {
        var areSolved = (solvedTasks.size > 0) ? true : false;
        this.userLocal = new User(this.userData[index].id, this.userData[index].username, this.userData[index].keyword);
        solvedTasks = this.mergeSolved(new Set(this.userData[index].solvedTasks), solvedTasks);
        if(areSolved)
            this.updateUser(true);
    }

    mergeSolved(userSolved, sessionSolved) {
        sessionSolved.forEach(elem => userSolved.add(elem));
        return userSolved;
    }

    createUser(isValid) {
        var user = {};
        user["username"] = $("#createUname").val();
        user["keyword"] = $("#kword").val();
        user["solvedTasks"] = Array.from(solvedTasks);
        isValid = this.saveUser(user, isValid);
        return isValid;
    }

    updateUser(isValid) {
        var user = {};
        user["username"] = this.userLocal.username;
        user["keyword"] = this.userLocal.keyword;
        user["solvedTasks"] = Array.from(solvedTasks);
        user["id"] = this.userLocal.id;
        this.saveUser(user, isValid);
    }

    greetExistingUser(obj) {
        var isValid = true;
        isValid = this.validate(isValid, "useUname");
        if(isValid && this.confirmChoice(obj))
            isValid = this.getUser(isValid);
        if(isValid) {
            this.modalDisplay.closeModalAndGreet(this.userLocal.username);
            this.gameManager.fillThumbContainer();
        }
    }

    greetNewUser(obj) {
        var isValid = true;
        isValid = this.validate(isValid, "createUname");
        isValid = this.validate(isValid, "kword");
        if(isValid && this.confirmChoice(obj))
            isValid = this.createUser(isValid);
        if(isValid) {
            this.modalDisplay.closeModalAndGreet(this.userLocal.username);
            this.gameManager.fillThumbContainer();
        }
    }

    greetAnonUser(obj) {
        if(this.confirmChoice(obj)) {
            this.anonUsername = "Anonymous user";
            this.modalDisplay.closeModalAndGreet(this.anonUsername);
            this.gameManager.fillThumbContainer();
        }
    }

    validate(isValid, fieldId) {
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

    confirmChoice(obj) {
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

    markAsSolvedAndSave() {
        this.gameManager.markAsSolved();
        if(this.userLocal != null)
            this.updateUser(true);
    }

    changeUser() {
        if(this.gameManager.resetBoard()) {
            this.userLocal = null;
            this.anonUsername = null;
            solvedTasks = new Set();
            this.modalDisplay.displayWelcome();
        }
    }

    saveResults() {
        if(this.anonUsername!="Anonymous user") {
            alert("You currently use " + this.userLocal.username + " profile. Your results are being saved automatically. \nIf you want to use another profile click 'Use another profile' button at the top of the page.");
            return;
        }
        this.modalDisplay.displayWelcome(false);
    }

}
