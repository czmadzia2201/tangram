class UserActions {
    errorMessage = "Ups, something went wrong. Check network connection and try again. If error persists contact game admin.";
    gameManager = new GameManager();
    modalDisplay = new ModalDisplay();
    userData = null;
    jsUser = null;
    anonUser = null;

    sendGetUser(isValid) {
        var localUserActions = this;
        var localErrorMessage = this.errorMessage;
        $.ajax({
            type: "POST",
            async: false,
            contentType: "application/json",
            url: "/getuser",
            data: $("#getUname").val(),
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

    sendCreateUser(formdata, isValid) {
        var localErrorMessage = this.errorMessage;
        var localUser;
        $.ajax({
            type: "POST",
            async: false,
            enctype: 'multipart/form-data',
            url: "/createuser",
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            timeout: 600000,
            success: function(data) {
                localUser = new User(data.id, data.username, data.filepath, new Set(data.solvedTasks));
            },
            complete: function(xhr) {
                if(xhr.status!=200) {
                    alert(localErrorMessage);
                    isValid = false;
                }
            },
            error: function(e) {
                console.log("ERROR : ", e);
            }
        });
        this.jsUser = localUser;
        return isValid;
    }

    sendUpdateUser(formdata) {
        var localErrorMessage = this.errorMessage;
        var localUser;
        $.ajax({
            type: "POST",
            async: false,
            enctype: 'multipart/form-data',
            url: "/updateuser",
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            timeout: 600000,
            success: function(data) {
                localUser = new User(data.id, data.username, data.filepath, new Set(data.solvedTasks));
            },
            complete: function(xhr) {
                if(xhr.status!=200) {
                    alert(localErrorMessage);
                    isValid = false;
                }
            },
            error: function(e) {
                console.log("ERROR : ", e);
            }
        });
        this.jsUser = localUser;
    }

    onGetUserSuccess(data, isValid) {
        this.userData = data;
        if(this.userData.length==1) {
            this.setUserValues(0);
        } else {
            isValid = false;
            document.getElementById("userList").innerHTML = "Which " + this.userData[0].username + " you are? Click on your user icon, to make the choice.";
            this.modalDisplay.showIcons(this.userData);
            document.getElementById("chooseOfManyDiv").classList.toggle("expand");
        }
        return isValid;
    }

    chooseUser(index) {
        this.setUserValues(index);
        this.modalDisplay.closeModalAndGreet(this.jsUser);
        this.gameManager.fillThumbContainer();
    }

    setUserValues(index) {
        var areSolved = (this.gameManager.solvedTasks.size > 0) ? true : false;
        this.gameManager.solvedTasks = this.mergeSolved(new Set(this.userData[index].solvedTasks), this.gameManager.solvedTasks);
        this.jsUser = new User(this.userData[index].id, this.userData[index].username, this.userData[index].filepath, this.gameManager.solvedTasks);
        if(areSolved)
            this.updateUser();
    }

    mergeSolved(userSolved, sessionSolved) {
        sessionSolved.forEach(elem => userSolved.add(elem));
        return userSolved;
    }

    createUser(isValid) {
        var form = $("#createProfileForm")[0];
        var formdata = new FormData(form);
        formdata.append("solvedTasks", Array.from(this.gameManager.solvedTasks));
        isValid = this.sendCreateUser(formdata, isValid);
        return isValid;
    }

    updateUser() {
        var formdata = new FormData();
        formdata.append("id", this.jsUser.id);
        formdata.append("solvedTasks", Array.from(this.gameManager.solvedTasks));
        this.sendUpdateUser(formdata);
    }

    greetExistingUser(obj) {
        var isValid = true;
        isValid = this.validate(isValid, "getUname");
        if(isValid && this.confirmChoice(obj))
            isValid = this.sendGetUser(isValid);
        if(isValid) {
            this.modalDisplay.closeModalAndGreet(this.jsUser);
            this.gameManager.fillThumbContainer();
        }
    }

    greetNewUser(obj) {
        var isValid = true;
        isValid = this.validate(isValid, "createUname");
        isValid = this.validateImg(isValid);
        if(isValid && this.confirmChoice(obj))
            isValid = this.createUser(isValid);
        if(isValid) {
            this.modalDisplay.closeModalAndGreet(this.jsUser);
            this.gameManager.fillThumbContainer();
        }
    }

    greetAnonUser(obj) {
        if(this.confirmChoice(obj)) {
            this.anonUser = new User(null, "Anonymous user", null, null, null);
            this.modalDisplay.closeModalAndGreet(this.anonUser);
            this.gameManager.fillThumbContainer();
        }
    }

    validate(isValid, fieldId) {
        if(isValid) {
            var checkString = document.getElementById(fieldId).value;
            if(checkString.length == 0) {
                alert("Username is empty.");
                return false;
            } else if(checkString.length < 3) {
                alert("Username is too short.");
                return false;
            } else if(!/^([0-9a-zA-Z]{3,})$/.test(checkString)) {
                alert("Username contains illegal characters.");
                return false;
            }
        }
        return isValid;
    }

    validateImg(isValid) {
        if(isValid) {
            if(document.getElementById("hidden-uicon").files.length == 0 || document.getElementById("hidden-uicon").files[0].size == 0) {
                alert("File cannot be empty.");
                return false;
            } else {
                var imgIn = document.getElementById("hidden-uicon").files[0];
                if(imgIn.type.indexOf("image") == -1) {
                    alert("File not supported.");
                    return false;
                }
                if(imgIn.size / 1000 > 200) {
                    alert("File size must not exceed 200Kb.");
                    return false;
                }
                var imgOut = document.getElementById("icon-to-be");
                if(imgOut.width > imgOut.height) {
                    alert("Image width should not be greater than height.");
                    return false;
                }
            }
        }
        return isValid;
    }

    confirmChoice(obj) {
        var formDivs = ["getProfileDiv", "createProfileDiv", "useAnonDiv"];
        for(var element of formDivs) {
            if(obj.parentElement.parentElement.id==element)
                continue;
            if(document.getElementById(element).getElementsByTagName("form").length > 0) {
                var pChildren = document.getElementById(element).getElementsByTagName("form")[0].getElementsByTagName("p");
                for(var pChild of pChildren) {
                    var inputChildren = pChild.getElementsByTagName('input');
                    for (var inputChild of inputChildren) {
                        if(inputChild.type!="button" && inputChild.value!="")
                            return confirm("Some fields of other choice options are not empty. \n Are you sure you want to choose this option?");
                    }
                }
            }
        }
        return true;
    }

    markAsSolvedAndSave() {
        this.gameManager.markAsSolved();
        if(this.jsUser != null)
            this.updateUser();
    }

    changeUser() {
        if(this.gameManager.resetBoard()) {
            this.jsUser = null;
            this.anonUser = null;
            this.gameManager.solvedTasks = new Set();
            this.modalDisplay.displayWelcome();
        }
    }

    saveResults() {
        if(this.anonUser!=null) {
            alert("You currently use " + this.userLocal.username + " profile. Your results are being saved automatically. \nIf you want to use another profile click 'Use another profile' button at the top of the page.");
            return;
        }
        this.modalDisplay.displayWelcome(false);
    }

    loadFile(event) {
        var imgOut = document.getElementById("icon-to-be");
        imgOut.src = URL.createObjectURL(event.target.files[0]);
    }

}
