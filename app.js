const dropDownCat = document.getElementById("catInput");
const dropDownDiff = document.getElementById("diffInput");
const dropDownMode = document.getElementById("modeInput");
const btnGenTriv = document.getElementById("btn-gen-triv");
const qText = document.getElementById("q-txt");
const btnAns1 = document.getElementById("btn-1");
const btnAns2 = document.getElementById("btn-2");
const btnAns3 = document.getElementById("btn-3");
const btnAns4 = document.getElementById("btn-4");
const btnAnsArr = [btnAns1, btnAns2, btnAns3, btnAns4]
const btnNext = document.getElementById("btn-next");
const scoreText = document.getElementById("score");
let score = 0;
const qNumText = document.getElementById("question-number");
const correctAnsText = document.getElementById("correct-ans");

var currentTrivia = [];
var currentQuestion = 0;

let correctAnsPos = 0;
let correctBoolAns = "False";

//Film = 11
//Books = 10
//videogames = 15
//Music = 12

btnNext.disabled = true;
btnNext.style.opacity = 0.5;
btnAnsArr.forEach(element => {
    element.disabled = "true";
    element.style.opacity = 0.5;
});

const getApi = (category, difficulty, mode) => {
    const API_URL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${mode}`;
    /*console.log(API_URL); */
    fetch(API_URL)
        .then(data => data.json())
        .then(dataInfo => {
            if (dataInfo) {
                console.log(dataInfo.results)
                currentTrivia = dataInfo.results;
                switchMode(mode);
                updateTrivia(mode);
            } else {
                console.log('404 NOT FOUND')
            }
        })
        .catch(error => console.log(error))
}

function generateTrivia() {
    btnGenTriv.disabled = true;
    btnGenTriv.style.opacity = 0.5;
    dropDownCat.disabled = true;
    dropDownCat.style.opacity = 0.5;
    dropDownDiff.disabled = true;
    dropDownDiff.style.opacity = 0.5;
    dropDownMode.disabled = true;
    dropDownMode.style.opacity = 0.5;

    let catVal = 0;
    if (dropDownCat.value == "film") {
        catVal = 11;
    }
    else if (dropDownCat.value == "books") {
        catVal = 10;
    }
    else if (dropDownCat.value == "videogames") {
        catVal = 15;
    }
    else if (dropDownCat.value == "music") {
        catVal = 12;
    }
    qNumText.innerHTML = (currentQuestion + 1) + "/10";
    getApi(catVal, dropDownDiff.value, dropDownMode.value);
}

function updateTrivia(qMode) {
    qText.innerHTML = currentTrivia[currentQuestion].question;
    qNumText.innerHTML = (currentQuestion + 1) + "/10";
    btnNext.disabled = true;
    btnNext.style.opacity = 0.5;
    btnAnsArr.forEach(element => {
        element.disabled = false;
        element.style.opacity = 1;
    });

    if (qMode == "multiple") {
        correctAnsPos = Math.floor(Math.random() * 4);
        console.log("Correct answer: " + (correctAnsPos + 1));
        let incAnsArr = currentTrivia[currentQuestion].incorrect_answers;
        let corrAns = currentTrivia[currentQuestion].correct_answer;
        incAnsArr.splice(correctAnsPos, 0, corrAns)
        for (i = 0; i < 4; i++) {
            btnAnsArr[i].innerHTML = incAnsArr[i];
        }
    }
    else {
        correctBoolAns = currentTrivia[currentQuestion].correct_answer;
        console.log(correctBoolAns + " correctBoolAns")
    }

}

function switchMode(qMode) {
    if (qMode == "boolean") {
        btnAns1.style.display = "none";
        btnAns2.style.maxWidth = "25%";
        btnAns3.style.maxWidth = "25%";
        btnAns4.style.display = "none";
        btnAns2.innerHTML = "True";
        btnAns3.innerHTML = "False";
    }
    else {
        btnAns1.style.display = "block";
        btnAns2.style.maxWidth = "100%";
        btnAns3.style.maxWidth = "100%";
        btnAns4.style.display = "block";
        btnAns2.innerHTML = "Button 2";
        btnAns3.innerHTML = "Button 3";
    }
}

function btnAnswer(num) {
    //MULTIPLE OPTION MODE
    if (dropDownMode.value == "multiple") {
        if (num == correctAnsPos) {
            score += 100;
            correctAnsText.style.color = "rgb(153, 255, 0)";
            scoreText.innerHTML = "Score: " + score;
        }
        else {
            score -= 100;
            correctAnsText.style.color = "red";
            scoreText.innerHTML = "Score: " + score;
        }
    }
    //TRUE OR FALSE MODE
    else {

        let numToBool = "False";
        if (num == 1) {
            numToBool = "True";
        }
        else {
            numToBool = "False"
        }

        if (numToBool == correctBoolAns) {
            score += 100;
            scoreText.innerHTML = "Score: " + score;
            correctAnsText.style.color = "rgb(153, 255, 0)";
        }
        else {
            score -= 100;
            scoreText.innerHTML = "Score: " + score;
            correctAnsText.style.color = "red";
        }
    }
    //UPDATE CORRECT ANSWER
    correctAnsText.innerHTML = currentTrivia[currentQuestion].correct_answer;
    //BUTTON RESETS
    btnAnsArr.forEach(element => {
        element.disabled = true;
        element.style.opacity = 0.5;
    });
    //END GAME
    if (currentQuestion == 9) {
        setTimeout(5000);
        btnGenTriv.disabled = false;
        btnGenTriv.style.opacity = 1;
        dropDownCat.disabled = false;
        dropDownCat.style.opacity = 1;
        dropDownDiff.disabled = false;
        dropDownDiff.style.opacity = 1;
        dropDownMode.disabled = false;
        dropDownMode.style.opacity = 1;
        currentQuestion = 0;
        qText.innerHTML = `Your score was ${score}. Try again.`
        scoreText.innerHTML = "Score: "
        score = 0;
        qNumText.innerHTML = "0/10"
        correctAnsText.style.color = "rgb(153, 255, 0)";
        correctAnsText.innerHTML = "Correct Answer"
    }
    //CONTINUE
    else {
        btnNext.disabled = false;
        btnNext.style.opacity = 1;
    }

}

function nextQuestion() {
    currentQuestion += 1;
    updateTrivia(dropDownMode.value);
    btnNext.disabled = true;
}