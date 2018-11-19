function loadShapes() {
    // Randomize the start and objective shape urls array and load them respectively into the shape divs.
    // TODO: uncomment the randomization part and change the srcs.
    // var shuffledShapes = shuffle(availableShapes);

    let currShape = availableShapes[0];
    var currShapeName = currShape.substring(currShape.lastIndexOf('/')+1, currShape.lastIndexOf("."));
    startShape = currShapeName;
    currShapes = new Set([startShape]);
    document.getElementById('startShape').setAttribute('src', currShape);
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

    window.setTimeout(function() {loadAvailableInputs(availableShapes, duds)}, 100);
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

    var inputShapesContainer = document.getElementById('inputShapesContainer');

    // Fill top and bottom row of inputShapes evenly if length of array greater than 3.
    let shuffledInputsLength = shuffledInputs.length;
    if (shuffledInputsLength >= 3) {
        // Fill the topRow with half of the array elements.
        let inputShapesTopRow = document.createElement('div');
        inputShapesTopRow.setAttribute("class", "row topRow");
        for (var i = 0; i < Math.floor(shuffledInputsLength/2); ++i) {
            let inputShapeDiv = document.createElement('div');
            inputShapeDiv.setAttribute("class", "inputShapeDiv");

            let inputShape = document.createElement('img');
            inputShape.setAttribute("class", "inputShape");
            inputShape.setAttribute("src", shuffledInputs[i]);
            inputShape.onclick = function(event) {
                appendInput(event);
            };

            inputShapeDiv.appendChild(inputShape);
            inputShapesTopRow.appendChild(inputShapeDiv);
            inputShapesContainer.appendChild(inputShapesTopRow);
        }

        // Fill the bottom Row with the remaining half of the array elements.
        let inputShapesBotRow = document.createElement('div');
        inputShapesBotRow.setAttribute("class", "row");
        for (var i = Math.floor(shuffledInputsLength/2); i < shuffledInputsLength; ++i) {
            let inputShapeDiv = document.createElement('div');
            inputShapeDiv.setAttribute("class", "inputShapeDiv");

            let inputShape = document.createElement('img');
            inputShape.setAttribute("class", "inputShape");
            inputShape.setAttribute("src", shuffledInputs[i]);
            inputShape.onclick = function(event) {
                appendInput(event);
            };

            inputShapeDiv.appendChild(inputShape);
            inputShapesBotRow.appendChild(inputShapeDiv);
            inputShapesContainer.appendChild(inputShapesBotRow);
        }

    } else {
        // Fill all elements in a single row.
        let inputShapesRow = document.createElement('div');
        inputShapesRow.setAttribute("class", "row");
        for (var i = 0; i < shuffledInputsLength; ++i) {
            let inputShapeDiv = document.createElement('div');
            inputShapeDiv.setAttribute("class", "inputShapeDiv");

            let inputShape = document.createElement('img');
            inputShape.setAttribute("class", "inputShape");
            inputShape.setAttribute("src", shuffledInputs[i]);
            inputShape.onclick = function(event) {
                appendInput(event);
            };

            inputShapeDiv.appendChild(inputShape);
            inputShapesRow.appendChild(inputShapeDiv);
            inputShapesContainer.appendChild(inputShapesRow);
        }
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

    // Whenever the user enters a new input, reset the traversedPathsDiv.
    resetTraversedPathsDiv();

    // Boolean to check if at least one current state will produce a valid path with the current move.
    var validRelationExists = false;
    var inputShapeName = inputShapeSrc.substring(inputShapeSrc.lastIndexOf('/')+1, inputShapeSrc.lastIndexOf("."));
    let newCurrShapes = new Set();
    console.log(currShapes);

    // Append the traversed paths (relations) if they are valid.
    for (var currShape of currShapes) {
        var traversalSrc = './shapes/traversals/' + currShape + '_to_' + inputShapeName + '.png';
        if (shapeTraversals.includes(traversalSrc)) {
            // Means move is valid.
            validRelationExists = true;
            appendTraversedPath(traversalSrc);

            // TODO: parse shape name for more than 2 shapes input.
            if (!newCurrShapes.has(inputShapeName)) {
                newCurrShapes.add(inputShapeName);
            }
        }
    }
    currShapes = newCurrShapes;

    // After the loop, if there was no valid relation paths from all the current states, strike the user.
    if (!validRelationExists) {
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

function appendTraversedPath(traversalSrc) {
    let newTraversalPathDiv = document.createElement('div');
    newTraversalPathDiv.setAttribute("class", "traversalPathDiv");

    // Create a div to hold the icons.
    let traversalPath = document.createElement('img');
    traversalPath.setAttribute("class", "traversalPath");
    traversalPath.setAttribute("src", traversalSrc);
    newTraversalPathDiv.appendChild(traversalPath);

    let traversedPathsDiv = document.getElementById('traversedPathsDiv');
    traversedPathsDiv.appendChild(newTraversalPathDiv);
    traversedPathsDiv.scroll(traversedPathsDiv.scrollWidth, 0);
}

function resetInputHistory() {
    // Resets user input history.
    var pastInputDiv = document.getElementById('pastInputDiv');
    while (pastInputDiv.firstChild) {
        pastInputDiv.removeChild(pastInputDiv.firstChild);
    }
    inputSequence = [];

    // Resets inputShapesContainer div.
    var inputShapesContainer = document.getElementById('inputShapesContainer');
    while (inputShapesContainer.firstChild) {
        inputShapesContainer.removeChild(inputShapesContainer.firstChild);
    }

    // Resets traversedPathsDiv.
    resetTraversedPathsDiv();

    // Resets the currShapes to just hold the startShape.
    currShapes = [startShape];
}

function resetTraversedPathsDiv() {
    // Resets traversedPathsDiv.
    var traversedPathsDiv = document.getElementById('traversedPathsDiv');
    while (traversedPathsDiv.firstChild) {
        traversedPathsDiv.removeChild(traversedPathsDiv.firstChild);
    }
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
    window.setTimeout(function() {loadShapeRelations()}, 100);
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

var shapeTraversals = [
    './shapes/traversals/black_circle_to_black_square.png',
    './shapes/traversals/black_square_to_black_circle.png'];

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

// Set will only store names of current shapes eg. [./shapes/inputs/black_square.png] will be just [black_square].
var currShapes;

// For the case when user strikes, currShapes will be the startShape again.
var startShape;

window.onload = function() {
    loadShapes();
}