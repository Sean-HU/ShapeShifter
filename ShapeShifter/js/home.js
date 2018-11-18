function loadShapes() {
    // Randomize the start and objective shape urls array and load them respectively into the shape divs.
    // TODO: uncomment the randomization part and change the srcs.
    // var shuffledShapes = shuffle(availableShapes);

    document.getElementById('startShape').setAttribute('src', availableShapes[0]);
    document.getElementById('objShape').setAttribute('src', availableShapes[1]);
}

function loadShapeRelations() {
    // Shuffle the shapeRelations array first, fill in the shapeRelation divs, then change the displays of the
    // first and second ContainerDivs.
    var shuffledRelations = shuffle(shapeRelations);
    for (var i = 1; i < 5; ++i) {
        document.getElementById('shapeRelation' + i).setAttribute('src', shuffledRelations[i - 1]);
    }

    // ThirdContainerDiv also needs to be set to none for the case when the user strikes.
    document.getElementById('firstContainerDiv').style.display = 'none';
    document.getElementById('thirdContainerDiv').style.display = 'none';
    document.getElementById('secondContainerDiv').style.display = 'flex';

    window.setTimeout(function() {loadAvailableInputs(availableShapes, duds)}, 5000);
}

function loadAvailableInputs() {
    // Whenever this page is loaded, reset the input history as well as the NUM_ENTRIES, since the page will only be
    // loaded for the following scenarios:
    // 1). The page is normally loaded for the first time.
    // 2). The user strike, either by inputting an invalid alphabet or by using up all entries, hence the page reload.
    resetInputHistory();
    NUM_ENTRIES = 10;
    document.getElementById('numStrikes').innerHTML = NUM_STRIKES;
    document.getElementById('numEntries').innerHTML = NUM_ENTRIES;

    // Shuffle the input array and load the available shapes into the inputShapeDivs.
    var shuffledInputs = shuffle(availableShapes.concat(duds));
    for (var i = 1; i < 7; ++i) {
        document.getElementById('inputShape' + i).setAttribute('src', shuffledInputs[i - 1]);
        document.getElementById('inputShape' + i).onclick = function(event) {
            appendInput(event);
        };
    }

    document.getElementById('secondContainerDiv').style.display = 'none';
    document.getElementById('thirdContainerDiv').style.display = 'flex';
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function appendInput(event) {
    // Stop event propagation from bubbling to parent.
    event.stopPropagation();

    let newInputDiv = document.createElement('div');
    newInputDiv.setAttribute("class", "inputShapeDiv");

    // Create a div to hold the icons.
    let inputShape = document.createElement('img');
    inputShape.setAttribute("class", "inputShape");
    let inputShapeSrc = event.target.getAttribute('src');
    inputShape.setAttribute("src", inputShapeSrc);
    inputShape.style.cursor = "unset";
    newInputDiv.appendChild(inputShape);

    let pastInputDiv = document.getElementById('pastInputDiv');
    pastInputDiv.appendChild(newInputDiv);
    pastInputDiv.scroll(pastInputDiv.scrollWidth, 0);

    inputSequence.push(inputShapeSrc);
    validateInput(inputShapeSrc);
}

// Check if input is valid, then make necessary updates to user stats.
function validateInput(inputShapeSrc) {
    // User strikes if the input is not part of the language or if the NUM_ENTRIES reaches 0.
    // Show the user the relations again and reset all elements of gameplay page except the stats, if user still has not
    // lost yet.
    if (!availableShapes.includes(inputShapeSrc)) {
        updateStrikesAndCheckLose();
        return false;
    }

    // Else, update the stats display and check if user input sequence is accepted by the Finite State Machine.
    // If not, check if NUM_ENTRIES is 0, in which case the user strikes.
    NUM_ENTRIES -= 1;
    document.getElementById('numEntries').innerHTML = NUM_ENTRIES;
    if (checkAcceptState()) {
        // document.getElementById('winScreen').style.display = 'flex';
        alert("You Won!");
        return true;
    }

    if (NUM_ENTRIES == 0) {
        updateStrikesAndCheckLose();
        return false;
    }
}

function resetInputHistory() {
    // Resets user input history.
    var pastInputDiv = document.getElementById('pastInputDiv');
    while (pastInputDiv.firstChild) {
        pastInputDiv.removeChild(pastInputDiv.firstChild);
    }
    inputSequence = [];
}

function checkAcceptState() {
    // Check if inputSequence thus far is in list of acceptedSequences.
    for (acceptedSequence of acceptedSequences) {
        if (arraysEqual(inputSequence, acceptedSequence)) return true;
    }
    return false;
}

function updateStrikesAndCheckLose() {
    NUM_STRIKES += 1;
    document.getElementById('numStrikes').innerHTML = NUM_STRIKES;

    // Show user the lose screen if NUM_STRIKES reaches 3.
    if (NUM_STRIKES == 3) {
        // document.getElementById('loseScreen').style.display = 'flex';
        alert("You lose!");
        return true;
    }

    // Show user countdown screen and call the loadShapeRelations() function which also randomizes the input shapes
    // locations.
    // document.getElementById('countDownScreen').style.display = 'flex';
    window.setTimeout(function() {loadShapeRelations()}, 3000);
    alert("Strike! Shape Relations will show in 3 seconds...");
    return false;
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

// The urls are respective to the html files.
var availableShapes = [
    './shapes/inputs/black_circle.png',
    './shapes/inputs/black_square.png',
    './shapes/inputs/blue_circle.png',
    './shapes/inputs/blue_square.png'];

var shapeRelations = [
    './shapes/relations/sprite.png',
    './shapes/relations/sprite2.png',
    './shapes/relations/sprite3.png',
    './shapes/relations/sprite4.png'];

var duds = [
    './shapes/inputs/duds/black_triangle.png',
    './shapes/inputs/duds/blue_triangle.png'];

// TODO: will be taken care of by the translated NFA code.
var inputSequence = [];
var acceptedSequences = [
    ['./shapes/inputs/black_square.png'],
    ['./shapes/inputs/blue_circle.png', './shapes/inputs/black_square.png'],
    ['./shapes/inputs/blue_circle.png', './shapes/inputs/blue_square.png', './shapes/inputs/black_square.png', './shapes/inputs/blue_circle.png', './shapes/inputs/black_square.png']];

// Initialize user stats.
var NUM_STRIKES = 0;
var NUM_ENTRIES = 10;

window.onload = function() {
    loadShapes();
}