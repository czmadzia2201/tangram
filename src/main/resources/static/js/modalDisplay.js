class ModalDisplay {

    addButtons() {
        document.querySelectorAll(".textBtn").forEach(function(a) {
          a.remove()
        })
        for(var i = 0; i < userData.length; i++) {
            var btn = document.createElement("button");
            btn.innerHTML = userData[i].keyword;
            btn.classList.add("textBtn");
            btn.setAttribute("onclick", "chooseUser(" + i + ")");
            document.getElementById("chooseOfManyDiv").appendChild(btn);
        }
    }

    closeModalAndGreet(username) {
        document.getElementById("hello").innerHTML = "Hey, " + username + "!";
        document.getElementById("welcome").style.display = "none";
        this.resetForms();
        if(!document.getElementById("useProfileDiv").classList.contains("expand"))
            document.getElementById("useProfileDiv").classList.add("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.remove("expand");
        document.getElementById("useAnonDiv").classList.remove("expand");
        this.changeArrows();
    }

    resetForms() {
        document.getElementById("useProfileForm").reset();
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

    displayUseProfileForm() {
        document.getElementById("createProfileDiv").classList.remove("expand");
        this.changeArrow("useProfileArrow", "useProfileDiv");
        document.getElementById("useAnonDiv").classList.remove("expand");
        document.getElementById("useProfileDiv").classList.toggle("expand");
        this.changeArrows();
    }

    displayCreateProfileForm() {
        document.getElementById("useProfileDiv").classList.remove("expand");
        this.changeArrow("createProfileArrow", "createProfileDiv");
        document.getElementById("useAnonDiv").classList.remove("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.toggle("expand");
        this.changeArrows();
    }

    displayUseAnonButton() {
        document.getElementById("useProfileDiv").classList.remove("expand");
        document.getElementById("chooseOfManyDiv").classList.remove("expand");
        document.getElementById("createProfileDiv").classList.remove("expand");
        document.getElementById("useAnonDiv").classList.toggle("expand");
        this.changeArrows();
    }

    changeArrows() {
        this.changeArrow("useProfileArrow", "useProfileDiv");
        this.changeArrow("createProfileArrow", "createProfileDiv");
        this.changeArrow("useAnonArrow", "useAnonDiv");
    }

    changeArrow(arrowId, divId) {
        document.getElementById(arrowId).innerHTML = (document.getElementById(divId).classList.contains("expand"))? "&#9662; " : "&#9656; ";
    }

}
