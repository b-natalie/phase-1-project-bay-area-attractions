// NEED TO ASK: Is it okay that featured gem has the same id as it's duplicate non-featured gem?

function init() {
    fetch("http://localhost:3000/attractions")
    .then(resp => resp.json())
    .then(data => {
        // will need access to this gem container across several functions
        const gemContainer = document.querySelector("#gem-container");

        // create a gem array to be able to sort gems on the page according to likes/hearts,
        // without directly manipulating/sorting items in the db.json to avoid any changes in IDs
        const gemArray = [];
        data.forEach(attraction => {
            gemArray.push(attraction);
        });
        sortAttractions(gemArray);

        // render cards according to our ranked "gems"
        gemArray.forEach(attraction => renderGemCard(attraction, gemContainer));

        // allow user to submit a gem
        addGem(gemContainer);

        // randomly select a gem for the user
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
        increaseLike(gem);
    })

    const heartsNum = document.createElement("h5");
    heartsNum.className = "heart-num";
    heartsNum.textContent = gem.likes;

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay-info"

    const activity = document.createElement("p");
    let currentActivityIndex = 0;
    activity.textContent = `Try: ${gem.activities[currentActivityIndex]}`;

    const anotherActivity = document.createElement("a");
    anotherActivity.textContent = "Something else";
    anotherActivity.addEventListener("click", event => {
        if (currentActivityIndex < gem.activities.length - 1) {
            currentActivityIndex += 1;
        } else {
            currentActivityIndex = 0;
        }
        activity.textContent = `Try: ${gem.activities[currentActivityIndex]}`;
    })

    gemContainer.appendChild(gemCard);
    gemCard.append(gemImg, overlayDiv);
    overlayDiv.append(gemName, heartButton, heartsNum, activity, anotherActivity);
}

function increaseLike(gem) {
    gem.likes += 1;

    // in case our gem is featured in the random section, we want to make sure like changes are reflected on both cards
    const gemArray = document.querySelectorAll(`#gem-${gem.id}`);
    gemArray.forEach(gemCard => {
        const gemHeartsNum = gemCard.querySelector(".heart-num");
        gemHeartsNum.textContent = gem.likes;
    })

    fetch(`http://localhost:3000/attractions/${gem.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({likes: gem.likes})
    })
}

function addGem(gemContainer) {
    const addGemForm = document.querySelector("#add-gem-form");

    addGemForm.addEventListener("submit", event => {
        event.preventDefault();

        let name = addGemForm.querySelector("#name-input").value;
        let location = addGemForm.querySelector("#location-input").value;
        let image = addGemForm.querySelector("#img-input").value;
        let userActivity1 = addGemForm.querySelector("#activity-input1").value;
        let userActivity2 = addGemForm.querySelector("#activity-input2").value;
        let userActivity3 = addGemForm.querySelector("#activity-input3").value;
        let activities = [userActivity1, userActivity2, userActivity3];

        let gem = {
            name,
            location,
            image,
            activities,
            likes: 0
        }

        addGemForm.reset();

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

function randomGem(gemArray) {
    const randomButton = document.querySelector("#random-container button");

    randomButton.addEventListener("click", event => {
        const randomCardDiv = document.querySelector("#random-gem")

        if (randomCardDiv.firstChild) {
            console.log(randomCardDiv.firstChild.id)
            randomCardDiv.removeChild(randomCardDiv.firstChild)
        }

        const randomGemIndex = Math.floor(Math.random() * gemArray.length);
        const randomGem = gemArray[randomGemIndex];

        renderGemCard(randomGem, randomCardDiv);

        document.body.scrollTo(0, document.body.scrollHeight);
    })
}

// function randomGem(gemArray) {
//     const randomButton = document.querySelector("#random-container button");

//     randomButton.addEventListener("click", event => {
//         const randomCardDiv = document.querySelector("#random-gem")
//         let currentRanId = "none";
//         let newRanIdNum = Math.floor(Math.random() * gemArray.length);

//         if (randomCardDiv.firstChild) {
//             currentRanId = randomCardDiv.firstChild.id;
//             console.log(currentRanId);
//             randomCardDiv.removeChild(randomCardDiv.firstChild);
//         }

//         while (currentRanId === `gem-${newRanIdNum}`) {
//             newRanIdNum = Math.floor(Math.random() * gemArray.length);
//         }

//         const randomGem = gemArray[newRanIdNum];

//         renderGemCard(randomGem, randomCardDiv);

//         document.body.scrollTo(0, document.body.scrollHeight);
//     })
// }

init()