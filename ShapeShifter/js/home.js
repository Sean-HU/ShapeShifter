function loadShapes(availableShapes) {
    // Randomize the start and objective shape urls array and load them respectively into the shape divs.
    var shuffledShapes = shuffle(availableShapes);

    document.getElementById('startShape').setAttribute('src', shuffledShapes[0]);
    document.getElementById('objShape').setAttribute('src', shuffledShapes[1]);
}

function loadShapeRelations(shapeRelations) {
    // Shuffle the shapeRelations array first, fill in the shapeRelation divs, then change the displays of the
    // first and second ContainerDivs.
    var shuffledRelations = shuffle(shapeRelations);
    document.getElementById('firstShapeRelation').setAttribute('src', shuffledRelations[0]);
    document.getElementById('secondShapeRelation').setAttribute('src', shuffledRelations[1]);
    document.getElementById('thirdShapeRelation').setAttribute('src', shuffledRelations[2]);
    document.getElementById('fourthShapeRelation').setAttribute('src', shuffledRelations[3]);

    document.getElementById('firstContainerDiv').style.display = 'none';
    document.getElementById('secondContainerDiv').style.display = 'block';
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

window.onload = function() {
    // The urls are respective to the html files.
    var availableShapes = ['./shapes/sphere.png', './shapes/square.png'];

    // TODO: replace with actual shape relation sprites.
    var shapeRelations = ['./shapes/sprite.png', './shapes/sprite2.png', './shapes/sprite3.png', './shapes/sprite4.png'];

    loadShapes(availableShapes);
    window.setTimeout(function() {loadShapeRelations(shapeRelations)}, 3000);
}