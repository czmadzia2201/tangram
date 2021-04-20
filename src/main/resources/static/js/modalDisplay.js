class ModalDisplay {

    showIcons(userData) {
        document.querySelectorAll(".clickableIcon").forEach(function(a) {
          a.remove()
        })
        for(var i = 0; i < userData.length; i++) {
            var icon = document.createElement("img");
            icon.setAttribute("src", userData[i].filepath);
            icon.classList.add("clickableIcon");
            icon.style.height="120px";
            icon.style.margin="10px";
            icon.setAttribute("onclick", "userActions.chooseUser(" + i + ")");
            icon.addEventListener("mouseover", function(event) {
                event.target.style.cursor = "pointer";
            });
            document.getElementById("chooseOfManyDiv").appendChild(icon);
        }
    }

    closeModalAndGreet(user) {
        document.getElementById("hello").innerHTML = "Hey, " + user.username + "!";
        document.getElementById("icon").innerHTML = (user.filepath==null) ? "" : "<img height=60px style='margin-left: 20px; vertical-align: middle;' src=" + user.filepath + ">";
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
        document.getElementById("icon-to-be").removeAttribute("src");
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
