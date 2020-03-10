window.onload = setup;

function setup() {
  document.getElementById("play").addEventListener("click", game);
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/xt712HLF/";

let model, webcam, labelContainer, maxPredictions;

let counter = 5;
let toCount = false;
let start = false;
let pScore = 0;
let cScore = 0;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}
let hand;
// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    if (counter == 0) {
      if (prediction[i].probability.toFixed(2) > 0.7) {
        hand = prediction[i].className;
        toCount = false;
        counter = 5;
        start = true;
        document.getElementById("count").innerHTML = counter;
        console.log("This is the player choce", hand);
        game2();
      }
    }
  }
}

//GAME ROCK-PAPER-SCISSORS:
function game() {
  toCount = true;
  setInterval(count, 1000);
  function count() {
    if (toCount === true) {
      if (counter > 0) {
        counter--;
        document.getElementById("count").innerHTML = counter;
      }
    }
  }
}
function game2() {
  console.log("usa!");
  if (start == true) {
    console.log("usa!");

    playMatch();
  }
}

function playMatch() {
  console.log("playmatch funkcija");
  const computerOptions = ["paper", "scissors", "rock"];
  const computerNumber = Math.floor(Math.random() * 3);
  let name = hand;
  const computerChoice = computerOptions[computerNumber];
  compareHands(name.toLowerCase(), computerChoice);
}

function compareHands(playerChoice, computerChoice) {
  const winner = document.querySelector(".winner");
  document.getElementById("choice-computer").innerHTML = computerChoice;
  document.getElementById("choice-player").innerHTML = playerChoice;
  console.log("Computer: ", computerChoice);
  console.log("Player: ", playerChoice);
  if (playerChoice === computerChoice) {
    winner.textContent = "It is a tie!";
    console.log("jednako");
  } else if (playerChoice === "rock") {
    console.log("player==rock");
    if (computerChoice === "scissors") {
      winner.textContent = "Player wins!";
      pScore++;
      updateScore();
      return;
    } else {
      winner.textContent = "Computer wins!";
      cScore++;
      updateScore();
      return;
    }
  } else if (playerChoice === "paper") {
    console.log("player==paper");
    if (computerChoice === "scissors") {
      winner.textContent = "Computer wins!";
      cScore++;
      updateScore();
      return;
    } else {
      winner.textContent = "Player wins!";
      pScore++;
      updateScore();
      return;
    }
  } else if (playerChoice === "scissors") {
    console.log("player==scissors");
    if (computerChoice === "paper") {
      winner.textContent = "Player wins!";
      pScore++;
      updateScore();
      return;
    } else {
      winner.textContent = "Computer wins!";
      cScore++;
      updateScore();
      return;
    }
  }
}
function updateScore() {
  const playerScore = document.querySelector(".player-score");
  const computerScore = document.querySelector(".computer-score");
  console.log("updateScore");
  playerScore.textContent = pScore;
  computerScore.textContent = cScore;
  start = false;
}
