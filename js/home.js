function loadShapes(startShapeUrl, objShapeUrl) {
    document.getElementById('startShape').setAttribute('src', startShapeUrl);
    document.getElementById('objShape').setAttribute('src', objShapeUrl);
}

window.onload = function() {
    // Randomize the start and objective shape urls and load them respectively into the shape divs.
    // The urls are respective to the html files.
    var availableShapes = ['./shapes/sphere.png', './shapes/square.png'];
    var startShapeIndex = Math.floor(Math.random() * availableShapes.length);
    var objShapeIndex = Math.floor(Math.random() * availableShapes.length);

    // Ensure that the objective shape is not the same as the start shape.
    while (objShapeIndex == startShapeIndex) {
        objShapeIndex = Math.floor(Math.random() * availableShapes.length);
    }

    loadShapes(availableShapes[startShapeIndex], availableShapes[objShapeIndex]);
}