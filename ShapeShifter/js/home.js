function loadShapes(availableShapes) {
    // Randomize the start and objective shape urls array and load them respectively into the shape divs.
    var shuffledShapes = shuffle(availableShapes);

    document.getElementById('startShape').setAttribute('src', shuffledShapes[0]);
    document.getElementById('objShape').setAttribute('src', shuffledShapes[1]);
}

function nextButtonClicked() {
    loadShapeRelations(shapeRelations);
}

function loadShapeRelations(shapeRelations) {
    // Shuffle the shapeRelations array first, fill in the shapeRelation divs, then change the displays of the
    // first and second ContainerDivs.
    var shuffledRelations = shuffle(shapeRelations);
    for (var i = 1; i < 5; ++i) {
        document.getElementById('shapeRelation' + i).setAttribute('src', shuffledRelations[i - 1]);
    }

    document.getElementById('firstContainerDiv').style.display = 'none';
    document.getElementById('secondContainerDiv').style.display = 'flex';

    window.setTimeout(function() {loadAvailableInputs(availableShapes, duds)}, 5000);
}

function loadAvailableInputs(availableShapes, duds) {
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
    inputShape.setAttribute("src", event.target.src);
    inputShape.style.cursor = "unset";
    newInputDiv.appendChild(inputShape);

    let pastInputDiv = document.getElementById('pastInputDiv');
    pastInputDiv.appendChild(newInputDiv);
    pastInputDiv.scroll(pastInputDiv.scrollWidth, 0);
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

window.onload = function() {
    loadShapes(availableShapes);
}