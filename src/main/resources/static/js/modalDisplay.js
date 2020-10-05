function addButtons() {
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

function closeModalAndGreet(username) {
    document.getElementById("hello").innerHTML = "Hey, " + username + "!";
    document.getElementById("welcome").style.display = "none";
    resetForms();
    if(!document.getElementById("useProfileDiv").classList.contains("expand"))
        document.getElementById("useProfileDiv").classList.add("expand");
    document.getElementById("chooseOfManyDiv").classList.remove("expand");
    document.getElementById("createProfileDiv").classList.remove("expand");
    document.getElementById("useAnonDiv").classList.remove("expand");
    changeArrows();
    choiceField.fillThumbContainer(); // maybe could be removed from here?
}

function resetForms() {
    document.getElementById("useProfileForm").reset();
    document.getElementById("createProfileForm").reset();
}

function displayWelcome(welcome = true) {
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

function displayUseProfileForm() {
    document.getElementById("createProfileDiv").classList.remove("expand");
    changeArrow("useProfileArrow", "useProfileDiv");
    document.getElementById("useAnonDiv").classList.remove("expand");
    document.getElementById("useProfileDiv").classList.toggle("expand");
    changeArrows();
}

function displayCreateProfileForm() {
    document.getElementById("useProfileDiv").classList.remove("expand");
    changeArrow("createProfileArrow", "createProfileDiv");
    document.getElementById("useAnonDiv").classList.remove("expand");
    document.getElementById("chooseOfManyDiv").classList.remove("expand");
    document.getElementById("createProfileDiv").classList.toggle("expand");
    changeArrows();
}

function displayUseAnonButton() {
    document.getElementById("useProfileDiv").classList.remove("expand");
    document.getElementById("chooseOfManyDiv").classList.remove("expand");
    document.getElementById("createProfileDiv").classList.remove("expand");
    document.getElementById("useAnonDiv").classList.toggle("expand");
    changeArrows();
}

function changeArrows() {
    changeArrow("useProfileArrow", "useProfileDiv");
    changeArrow("createProfileArrow", "createProfileDiv");
    changeArrow("useAnonArrow", "useAnonDiv");
}

function changeArrow(arrowId, divId) {
    document.getElementById(arrowId).innerHTML = (document.getElementById(divId).classList.contains("expand"))? "&#9662; " : "&#9656; ";
}
