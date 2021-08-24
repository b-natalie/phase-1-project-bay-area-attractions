function init() {
    fetch("http://localhost:3000/attractions")
    .then(resp => resp.json())
    .then(data => {
        const gemContainer = document.querySelector("#gem-container");
        data.forEach(attraction => {
            // console.log(attraction, gemContainer);
            renderGemCard(attraction, gemContainer);
        });
    })
}

function renderGemCard(gem, gemContainer) {

    // console.log(gem, gemContainer);

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
        gem.likes += 1;
        heartsNum.textContent = gem.likes;
    });

    const heartsNum = document.createElement("h5");
    heartsNum.className = "heart-num";
    heartsNum.textContent = gem.likes;

    gemCard.append(gemImg, gemName, heartButton, heartsNum);
    gemContainer.appendChild(gemCard);

    const overlayDiv = document.createElement("div");
    overlayDiv.textContent = gem.activities[0];
    overlayDiv.className = "overlay-info"

    gemCard.addEventListener("mouseover", event => {
        console.log("Mouse over!");
        gemCard.appendChild(overlayDiv);
    })
}

init()