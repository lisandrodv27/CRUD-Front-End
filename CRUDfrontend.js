const profileOutput = document.getElementById("readProfile");
const createProfile = document.getElementById("createProfile");
const updateProfile = document.getElementById("updateProfile");

createProfile.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log(this.name);
    const data = {
        name: this.name.value,
        nationality: this.nationality.value,
        description: this.description.value,
    }
    fetch("http://localhost:8083/create", { 
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json" 
        }
    }).then(response => {
        return response.json();
    }).then(data => { 
        cardProfile();
        this.reset();
    }).catch(error => console.log(error));
});

function cardProfile() {
    fetch("http://localhost:8083/get") 
        .then(response => response.json())
        .then(profiles => {
            console.log("Historical Profiles: ", profiles);
            profileOutput.innerHTML = "";
            profiles.forEach(function(historicalProfile) {
                console.log(historicalProfile);

                const card = document.createElement("div");
                card.className = "card";
                profileOutput.appendChild(card);

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";
                card.appendChild(cardBody);

                const titleName = document.createElement("h4");
                titleName.className = "card-title";
                titleName.innerText = historicalProfile.name;
                cardBody.appendChild(titleName);

                const nationality = document.createElement("p");
                nationality.className = "card-body";
                nationality.innerText = "Nationality: " + historicalProfile.nationality;
                cardBody.appendChild(nationality);

                const description = document.createElement("p"); //perhaps use "a" and popover?
                description.className = "card-body";
                description.innerText = "Description: " + historicalProfile.description;
                cardBody.appendChild(description);

                const profileDeleteButton = document.createElement("a");
                profileDeleteButton.className = "card-link";
                profileDeleteButton.innerText = "Delete";
                profileDeleteButton.addEventListener("click", function() {
                    deleteProfile(historicalProfile.id);
                })
                cardBody.appendChild(profileDeleteButton);

                const updateProfileButton = document.createElement("a");
                updateProfileButton.className = "card-link";
                updateProfileButton.innerText = "Update";
                updateProfileButton.addEventListener("click", function (event) {
                    const updateData = {
                        name: prompt("Update the name:", historicalProfile.name),
                        nationality: prompt("Update the nationality:", historicalProfile.nationality),
                        description: prompt("Update the description:", historicalProfile.desciption),
                    }
                    profileUpdate(updateData, historicalProfile.id);
                })
                cardBody.appendChild(updateProfileButton);
            });
        }).catch(error => console.error(error));
}

cardProfile();

function deleteProfile(id) {
    fetch("http://localhost:8083/remove/" + id, {
        method: "DELETE",
    }).then(response => {
        console.log(response);
        cardProfile();
    }).catch(error => console.error(error));
}

function profileUpdate(data, id) {
    fetch("http://localhost:8083/update?id=" + id, { 
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
    }
    }).then(response => {   
        return response.json(); 
    }).then(data => {
        cardProfile();
    }).catch(error => console.error(error));
}