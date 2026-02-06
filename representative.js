function loadAPI(){
    return new Promise((resolve, reject) => {
        gapi.load("client", {
            callback: function() {
                gapi.client.setApiKey("AIzaSyD-OzrPVgxU-zjXEgWW3LA2xFhTXJJr2uc");
                gapi.client.load("https://civicinfo.googleapis.com/$discovery/rest?version=v2")
                    .then(function() {
                        console.log("GAPI client loaded for API");
                        // Verify civicinfo is actually available
                        if (gapi.client.civicinfo) {
                            console.log("Civicinfo API confirmed ready");
                            resolve();
                        } else {
                            console.error("Civicinfo API not available");
                            reject(new Error("Civicinfo API not loaded"));
                        }
                    }, function(err) {
                        console.error("Error loading GAPI client for API", err);
                        reject(err);
                    });
            },
            onerror: function() {
                reject(new Error("Failed to load GAPI"));
            },
            timeout: 5000,
            ontimeout: function() {
                reject(new Error("GAPI load timeout"));
            }
        });
    });
}

function loadClient() {
    if(!(localStorage.getItem("loggedIn")=="yes" || sessionStorage.getItem("guest")=="yes")){
        window.location.href = "index.html";
    }
    loadAPI().then(function() {
        // Wait a bit to ensure gapi.client.civicinfo is fully initialized
        return new Promise(resolve => setTimeout(resolve, 100));
    }).then(function() {
        if(sessionStorage.getItem("guest")!="yes"){
            //person has an account
            isUser = true
            document.getElementById("repDescription").style.display = "none"
            document.getElementById("dataInputWrapper").style.display = "none"
            document.getElementById("searchInput").style.display = "none"
            email = localStorage.getItem("user")
            user = email.replaceAll(".","").replaceAll("#","").replaceAll("$",'').replaceAll("[","").replaceAll("]","")
            user = user.substring(0,user.indexOf("@"))
            database.ref(user+'/status').once('value').then((snapshot)=>{ 
                if(snapshot.val().surveyed==false && window.location.href != "https://fyrebolt.github.io/everybodyvotes/setup.html"){
                    window.location.href= "setup.html"
                }
                if(snapshot.val().surveyed==true && window.location.href == "https://fyrebolt.github.io/everybodyvotes/setup.html"){
                    window.location.href= "profile.html"
                }
            })
        }
        if(sessionStorage.getItem("guest")=="yes"){
            //person is a guest
            document.getElementById("repDescription").style.display = "flex"
            document.getElementById("dataInputWrapper").style.display = "flex"
            document.getElementById("searchInput").style.display = "flex"
            isUser = false
        }
        resetAll()
        if(isUser){
            getInfoFromUser(user)
        }
    });
  }
    function getInfoFromUser(user){
        inputLine = ""
        database.ref(user+'/info').once('value').then((snapshot)=>{ 
            data = snapshot.val()
            address = data.address
            city = data.city
            zip = data.zip
            inputLine += address + ", " + city
            if(zip != ""){
                inputLine += ", " + zip
            }
            check(inputLine).then(results => {
                if(results == true){
                    
                
                    //users have data for all possible combos
                    document.getElementById("federalRepText").classList.remove("disabled")
                    document.getElementById("federalRepMore").classList.remove("disabled")
                    document.getElementById("hLine").classList.remove("disabled")
                    execute("country",inputLine,"headOfGovernment",["president"])
                    execute("country",inputLine,"deputyHeadOfGovernment",["vicePresident"])
                    //makes state rep header visible
                    document.getElementById("stateRepsText").classList.remove("disabled")
                    document.getElementById("stateRepsMore").classList.remove("disabled")
                    execute("administrativeArea1",inputLine,"headOfGovernment",["governor"])
                    execute("administrativeArea1",inputLine,"deputyHeadOfGovernment",["lieutenantGovernor"])
                    execute("administrativeArea1",inputLine,"legislatorUpperBody",["stateSenator"])
                    execute("administrativeArea1",inputLine,"legislatorLowerBody",["stateHouseRep"])
                    execute("country",inputLine,"legislatorUpperBody",["fedSenateOne","fedSenateTwo"])
                    execute("country",inputLine,"legislatorLowerBody",["fedHouseRep"])
                }
                else{
                    resetAll()
                    if (window.confirm('Error: Address Invalid\nPlease Click ok to edit Address Information on Profile'))
                    {
                        window.location.href = "profile.html";
                    };
                }
            });
        })
    }
  async function fetchImage(description, TAG){
      fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&format=json&piprop=original&titles=" + description)
                    .then(function(response){return response.json();})
                    .then(function(response) {
                    console.log(response);
                        var pages = response.query.pages;
                        var page = pages[Object.keys(pages)[0]];
                        if (page.original) {
                            var img = page.original.source;
                            document.getElementById(TAG).innerHTML = "<img  width =150px src=\"" + img + "\">" 
                        } else {
                            document.getElementById(TAG).innerHTML = "<img  width =150px src=images/nullPicture.png>" 
                        }
                        
                    })
                    .catch(function(error){console.log(error);});
    }
  async function fetchDescription(description,TAG,repName){
    fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exchars=600&explaintext&titles=" + description + "&format=json")
                  .then(function(response2){return response2.json();})
                  .then(function(response2) {
                    //gets description
                      
                      console.log(repName)
                      page = response2.query.pages;
                      page[Object.keys(page)[0]]
                      desc = page[Object.keys(page)[0]].extract;
                      descArray = desc.split(". ");
                      newDesc = "";
                      //console.log(newDesc)
                      for (i = 0; i < 4; i++) {
                        if (i < descArray.length){
                        newDesc += descArray[i] + ". "
                        }
                      }
                      document.getElementById(TAG + "Description").innerHTML =newDesc;
                  })
                  .catch(function(error){
                    console.log(error);
                    
                  });
  }
  

  // Make sure the client is loaded before calling this method.
  async function execute(level,inputLine, searchType, tagList) {
    return gapi.client.civicinfo.representatives.representativeInfoByAddress({
      "address": inputLine,
      "levels": [
        level
      ],
      "roles": [
        searchType
      ]
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
            for(let tag = 0; tag < tagList.length;tag++){
                
                repName = response.result.officials[tag].name;
                repParty = response.result.officials[tag].party;
                repGovLink = response.result.officials[tag].urls[0]
                descriptionLink = response.result.officials[tag].urls[1];
                if(descriptionLink != undefined){
                  //have wiki link
                  //gets image from wiki
                  description = descriptionLink.substring(30)
                  fetchImage(description, tagList[tag] + "Image")
                  fetchDescription(description,tagList[tag],repName)
                }
                else{
                  //place .gov info here
                    //sets photo to photo NA
                    document.getElementById(tagList[tag] +"Image").innerHTML = "<img  width =150px src=images/nullPicture.png>" 
                    //possibly change to api for description or image from name
                     
                }
                //basic stuff for every rep
                document.getElementById(tagList[tag]).innerHTML = repName;
                document.getElementById(tagList[tag]+"Contact").innerHTML ="Contact Link: <a href=" + repGovLink + " target=_blank>" + repGovLink + "</a>"
                document.getElementById(tagList[tag]+"Party").innerHTML = repParty;
                
                //makes visible if necessary
                document.getElementById(tagList[tag] + "Box").classList.remove("disabled")
            }
                
              },
              function(err) { console.error("Execute error", err); });
  }
function checkEmpty(tags){
    //does not run search if no input
    for(let i = 0; i < tags.length; i++){
        if(document.getElementById(tags[i]).value){
            return true
        }
    }
    return false
}
function notOnlyAddress(tags){
    //does not run search if only address
    for(let i = 1; i < tags.length; i++){
        if(document.getElementById(tags[i]).value){
            return true
        }
    }
    return false
}
function checkIfAll(tags){
    for(let i = 0; i < tags.length; i++){
        if(document.getElementById(tags[i]).value == false){
            return false
        }
    }
    return true
}
function checkIfAddressCityZip(){
    const tags = ["address", "city", "zipCode"]
    for(let i = 0; i < tags.length; i++){
        if(document.getElementById(tags[i]).value){
            return true
        }
    }
    return false
}
function checkIfAddressCity(){
    if(document.getElementById("address").value || document.getElementById("city").value){
        return true                                                                      
    }
    return false
}
function checkIfStateFederal(){
    if(document.getElementById("address").value && document.getElementById("zipCode").value){
        return true                                                                      
    }
    if(document.getElementById("address").value && document.getElementById("city").value){
        return true
    }
}
function resetAll(){
    //reset all disabled

    const tags = ["president","vicePresident","fedHouseRep","fedSenateOne","fedSenateTwo","governor","lieutenantGovernor","stateHouseRep","stateSenator"]
    for(let i = 0; i < tags.length; i++){
        document.getElementById(tags[i]).textContent = ""
        document.getElementById(tags[i] + "Contact").textContent = ""
        document.getElementById(tags[i] + "Image").textContent = ""
        document.getElementById(tags[i] + "Description").textContent = ""
        document.getElementById(tags[i] + "Party").textContent = ""
    }
    //disables text headers
    document.getElementById("federalRepText").classList.add("disabled")
    document.getElementById("federalRepMore").classList.add("disabled")
    document.getElementById("hLine").classList.add("disabled")
    document.getElementById("stateRepsText").classList.add("disabled")
    document.getElementById("stateRepsMore").classList.add("disabled")
    //disables div tags
    let repsTagArray = document.getElementsByClassName("rep")
    for(let i = 0; i < repsTagArray.length; i++){
        repsTagArray[i].classList.add("disabled")
    }
    
    
}
async function check(inputLine) {
    // returns promise
    //false = bad input
    //true = okay input
    return gapi.client.civicinfo.representatives.representativeInfoByAddress({
      "address": inputLine,
      "levels": [
        "country"
      ],
      "roles": [
        "headOfGovernment"
      ]
    })
        .then(function(response) {
                repName = response.result.offices[0].name;
                if(repName != "President of the United States"){
                    //might not be need. don't know if API is international
                    return false
                }
                else{
                    return true
                }
              },
              function(err) { return false });
  }

gapi.load("client");

searchInput = document.getElementById("searchInput")
searchInput.onclick = () => {
    resetAll()
    const tags = ["address", "city", "state", "zipCode"]
    if(checkEmpty(tags)){
        //at least one not empty
        if(notOnlyAddress(tags)){
            //input contains not only address
            
            let inputLine = ""
            for(let i = 0; i < tags.length; i++){
                if(document.getElementById(tags[i]).value){
                    inputLine += document.getElementById(tags[i]).value
                    inputLine+=","
                }
            }
            inputLine = inputLine.slice(0, -1)
            check(inputLine).then(results => {
                if(results == true){
                    //good input
                    //makes federal Rep header visible
                    document.getElementById("federalRepText").classList.remove("disabled")
                    document.getElementById("federalRepMore").classList.remove("disabled")
                    document.getElementById("hLine").classList.remove("disabled")
                    execute("country",inputLine,"headOfGovernment",["president"])
                    execute("country",inputLine,"deputyHeadOfGovernment",["vicePresident"])
                    //makes state rep header visible
                    document.getElementById("stateRepsText").classList.remove("disabled")
                    document.getElementById("stateRepsMore").classList.remove("disabled")
                    execute("administrativeArea1",inputLine,"headOfGovernment",["governor"])
                    execute("administrativeArea1",inputLine,"deputyHeadOfGovernment",["lieutenantGovernor"])
                    if(checkIfAll(tags) || checkIfStateFederal()){
                        //all input boxes full
                        
                        execute("administrativeArea1",inputLine,"legislatorUpperBody",["stateSenator"])
                        execute("administrativeArea1",inputLine,"legislatorLowerBody",["stateHouseRep"])
                    }
                    if(checkIfAddressCityZip()){
                        execute("country",inputLine,"legislatorUpperBody",["fedSenateOne","fedSenateTwo"])
                    }
                    if(checkIfAddressCity()){
                        execute("country",inputLine,"legislatorLowerBody",["fedHouseRep"])
                    }
                }
                else{
                    resetAll()
                    window.alert("Error: Address Invalid")
                }
            });
        }  
        else{
            window.alert("For Accurate Data Please use Input Beyond just Address")
        }
    }
    else{
        window.alert("Location Boxes Empty\nOne Location Input Required")
    }
}

//popup click
//once click - > midpopup stuff
let presidentBoxClick = document.getElementById("presidentBox")
let vicePresidentBoxClick = document.getElementById("vicePresidentBox")
let fedHouseRepBoxClick = document.getElementById("fedHouseRepBox")
let fedSenateOneBoxClick = document.getElementById("fedSenateOneBox")
let fedSenateTwoBoxClick = document.getElementById("fedSenateTwoBox")
let governorBoxClick = document.getElementById("governorBox")
let lieutenantGovernorBoxClick = document.getElementById("lieutenantGovernorBox")
let stateHouseRepBoxClick = document.getElementById("stateHouseRepBox")
let stateSenatorBoxClick = document.getElementById("stateSenatorBox")

const boxList = [presidentBoxClick,vicePresidentBoxClick,fedHouseRepBoxClick,fedSenateOneBoxClick,fedSenateTwoBoxClick,governorBoxClick,lieutenantGovernorBoxClick,stateHouseRepBoxClick,stateSenatorBoxClick]
const titleOfReps = ["President","Vice President", "Federal House Representative", "Federal Senator","Federal Senator", "State Governor", "Lieutenant State Governor","State House Representative","State Senator"]

for(let i = 0; i < boxList.length; i++){
    const element = boxList[i];
    element.onclick = function(event) {
        document.getElementById("repMiddle").style.display = "none"
        document.getElementById("repPopup").style.display = "flex"
        tagIdName = element.id.replace("Box", "")
        tagTitle = titleOfReps[i]
        document.getElementById("repPopupImage").innerHTML = document.getElementById(tagIdName + "Image").innerHTML
        document.getElementById("repPopupName").innerHTML = document.getElementById(tagIdName).innerHTML
        document.getElementById("repPopupTitle").innerHTML = tagTitle
        document.getElementById("repPopupDesc").innerHTML = document.getElementById(tagIdName + "Description").innerHTML
        document.getElementById("repPopupContact").innerHTML = document.getElementById(tagIdName + "Contact").innerHTML
        repParty = document.getElementById(tagIdName + "Party").innerHTML
        if(repParty == "Democratic Party"){
            document.getElementById('repPopup').style.backgroundImage = "url('images/bluebg.png')";
        }
        else if(repParty == "Republican Party"){
            document.getElementById('repPopup').style.backgroundImage = "url('images/redbg.png')";   
        }
        else{
            document.getElementById('repPopup').style.backgroundImage = "url('images/graybg.png')";
        }
        
    }
}
function closePopup(){
    document.getElementById("repMiddle").style.display = "flex"
    document.getElementById("repPopup").style.display = "none"
}
