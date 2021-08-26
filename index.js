function init() {
    fetch("http://localhost:3000/attractions")
    .then(resp => resp.json())
    .then(data => {
        const gemContainer = document.querySelector("#gem-container");
        const gemArray = [];
        data.forEach(attraction => {
            gemArray.push(attraction);
        });
        sortAttractions(gemArray);
        gemArray.forEach(attraction => renderGemCard(attraction, gemContainer));
        addGem(gemContainer);
        randomGem(gemArray);
    })
}

function renderGemCard(gem, gemContainer) {

    const gemCard = document.createElement("div");
    gemCard.id = `gem-${gem.id}`;
    gemCard.className = "gem-card";

    const gemImg = document.createElement("img");
    gemImg.src = gem.image;
    gemImg.alt = `${gem.name} image`;
    gemImg.className = "gem-img"

    const gemName = document.createElement("h3");
    gemName.textContent = gem.name;

    const heartButton = document.createElement("button");
    heartButton.className = "heart-button";
    heartButton.textContent = "💙";
    heartButton.addEventListener("click", event => {
        increaseLike(gem, heartsNum);
    })

    const heartsNum = document.createElement("h5");
    heartsNum.className = "heart-num";
    heartsNum.textContent = gem.likes;

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay-info"

    const activity = document.createElement("p");
    activity.textContent = `Try: ${gem.activities[0]}`;
    console.log(activity);

    gemContainer.appendChild(gemCard);
    gemCard.append(gemImg, overlayDiv);
    overlayDiv.append(gemName, heartButton, heartsNum, activity);

}

function addGem(gemContainer) {
    const addGemForm = document.querySelector("#add-gem-form");

    addGemForm.addEventListener("submit", event => {
        event.preventDefault();

        let name = addGemForm.querySelector("#name-input").value;
        let location = addGemForm.querySelector("#location-input").value;
        let image = addGemForm.querySelector("#img-input").value;
        let userActivity = addGemForm.querySelector("#activity-input").value;
        let activities = [userActivity];

        let gem = {
            name,
            location,
            image,
            activities,
            likes: 0
        }

        fetch("http://localhost:3000/attractions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(gem)
        })
        .then(resp => resp.json())
        .then(newGem => renderGemCard(newGem, gemContainer))
    })
}

function sortAttractions(gemArray) {
    gemArray.sort((gemA, gemB) => (gemA.likes > gemB.likes) ? -1 : 1)
}

function increaseLike(gem, heartsNum) {
    gem.likes += 1;
    heartsNum.textContent = gem.likes;

    fetch(`http://localhost:3000/attractions/${gem.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({likes: gem.likes})
    })
}

function randomGem(gemArray) {
    const randomButton = document.querySelector("#random-container button");
    console.log(randomButton);

    randomButton.addEventListener("click", event => {
        const randomCardDiv = document.querySelector("#random-gem")

        if (randomCardDiv.firstChild) {
            randomCardDiv.removeChild(randomCardDiv.firstChild)
        }

        const randomGemIndex = Math.floor(Math.random() * gemArray.length);
        console.log(randomGemIndex)
        const randomGem = gemArray[randomGemIndex];

        renderGemCard(randomGem, randomCardDiv);
    })
}

init()