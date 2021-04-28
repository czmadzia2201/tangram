class ModalDisplay {

    addButtons(userData) {
        document.querySelectorAll(".textBtn").forEach(function(a) {
          a.remove()
        })
        for(var i = 0; i < userData.length; i++) {
            var btn = document.createElement("button");
            btn.innerHTML = userData[i].keyword;
            btn.classList.add("textBtn");
            btn.setAttribute("onclick", "userActions.chooseUser(" + i + ")");
            document.getElementById("chooseOfManyDiv").appendChild(btn);
        }
    }

    closeModalAndGreet(username) {
        document.getElementById("hello").innerHTML = "Hey, " + username + "!";
        document.getElementById("welcome").style.display = "none";
        this.resetForms();
        if(!document.getElementById("getProfileDiv").classList.contains("expand"))
            document.getElementById("getProfileDiv").classList.add("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.remove("expand");
        document.getElementById("useAnonDiv").classList.remove("expand");
        this.changeArrows();
    }

    resetForms() {
        document.getElementById("getProfileForm").reset();
        document.getElementById("createProfileForm").reset();
    }

    displayWelcome(welcome = true) {
        if(welcome==true) {
            document.getElementById("welcomeIntro").style.display = "block";
            document.getElementById("saveResultsIntro").style.display = "none";
            document.getElementById("displayUseAnonText").innerHTML = "Play as anonymous user"
        }
        if(welcome==false) {
            document.getElementById("welcomeIntro").style.display = "none";
            document.getElementById("saveResultsIntro").style.display = "block";
            document.getElementById("displayUseAnonText").innerHTML = "Continue as anonymous user"
        }
        document.getElementById("welcome").style.display = "block";
    }

    displayGetProfileForm() {
        document.getElementById("createProfileDiv").classList.remove("expand");
        this.changeArrow("getProfileArrow", "getProfileDiv");
        document.getElementById("useAnonDiv").classList.remove("expand");
        document.getElementById("getProfileDiv").classList.toggle("expand");
        this.changeArrows();
    }

    displayCreateProfileForm() {
        document.getElementById("getProfileDiv").classList.remove("expand");
        this.changeArrow("createProfileArrow", "createProfileDiv");
        document.getElementById("useAnonDiv").classList.remove("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.toggle("expand");
        this.changeArrows();
    }

    displayUseAnonButton() {
        document.getElementById("getProfileDiv").classList.remove("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.remove("expand");
        document.getElementById("useAnonDiv").classList.toggle("expand");
        this.changeArrows();
    }

    changeArrows() {
        this.changeArrow("getProfileArrow", "getProfileDiv");
        this.changeArrow("createProfileArrow", "createProfileDiv");
        this.changeArrow("useAnonArrow", "useAnonDiv");
    }

    changeArrow(arrowId, divId) {
        document.getElementById(arrowId).innerHTML = (document.getElementById(divId).classList.contains("expand"))? "&#9662; " : "&#9656; ";
    }

}
