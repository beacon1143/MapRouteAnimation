ymaps.ready(['AnimatedLine']).then(init);

function getMax(array2D, index) {
    var retValue = array2D[0][index];
    for (let i = 1; i < array2D.length; i++) {
        retValue = array2D[i][index] > retValue ? array2D[i][index] : retValue;
    }
    return retValue;
}

function getMin(array2D, index) {
    var retValue = array2D[0][index];
    for (let i = 1; i < array2D.length; i++) {
        retValue = array2D[i][index] < retValue ? array2D[i][index] : retValue;
    }
    return retValue;
}

function init(ymaps) {
    // creating and filling route points array
    var routePoints = [
        [58.296801, 41.871082],    // Barskoe
        [58.298507, 41.868475],    // Barskoe 2
        [58.313506, 41.874186],    // Tebza
        [58.319567, 41.881253],    // Tebza 2
        [58.332556, 41.908581],    // Kostoma
        [58.339298, 41.911761],    // Krasnovo
        [58.346886, 41.911970],    // Krasnovo 2
        [58.356666, 41.916120],    // Krasnovo 3
        [58.363479, 41.913427],    // Andronovo
        [58.370025, 41.919017],    // Andronovo 2
        [58.375263, 41.924217],    // Andronovo 3
        [58.376165, 41.929424],    // Andronovo 4
        [58.376165, 41.937295],    // Andronovo 5
        [58.377951, 41.943862],    // Kostomka
        [58.388571, 41.953728],    // Kostomka 2
        [58.388571, 41.953728],    // Kostomka 3
        [58.410829, 41.986291],    // Vypolzovo
        [58.418858, 42.007241],    // Nikitino
        [58.420760, 42.019083],    // Zavrazhye
        [58.423610, 42.027313],    // railroad
        [58.424267, 42.027243],    // Rossolovo
        [58.425412, 42.025409],    // Rossolovo 2
        [58.427638, 42.018525],    // Rossolovo 3
        [58.433101, 42.015217],    // Rossolovo 4
        [58.439553, 42.004290],    // Rossolovo 5
        [58.443178, 42.003583],    // Rossolovo 6
        [58.443895, 42.009869],    // Rossolovo 7
        [58.448248, 42.014267],    // Kuchumovka
        [58.449065, 42.023210],    // Kuchumovka 2
        [58.457600, 42.041151],    // Zarya
        [58.459471, 42.051818],    // Zarya 2
        [58.461764, 42.052825],    // Zarya 3
        [58.466288, 42.049263],    // Vyoksa
        [58.468239, 42.049740],    // Vyoksa 2
        [58.473657, 42.060614],    // Aviator
        [58.473975, 42.063109],    // Aviator 2
        [58.471803, 42.081344],    // Unorozh
        [58.472346, 42.084897]     // Unorozh2
    ];
    
    var centerCoords = [
        0.5 * (getMin(routePoints, 0) + getMax(routePoints, 0)),
        0.5 * (getMin(routePoints, 1) + getMax(routePoints, 1))
    ];
    
    // creating map
    var myMap = new ymaps.Map("map", {
        center: centerCoords,
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });
    
    // creating polyline
    var firstAnimatedLine = new ymaps.AnimatedLine(routePoints, {}, {
        // specifying a color
        strokeColor: "#1E98FF", //"#ED4543",
        // setting line width
        strokeWidth: 5,
        // setting duration of the animation
        animationTime: 4000
    });

    // adding the line to the map
    myMap.geoObjects.add(firstAnimatedLine);
    
    // smart map bounds
    myMap.setBounds(
        myMap.geoObjects.getBounds(),
        { 
            checkZoomRange: true,
            zoomMargin: 12
        }
    );
    
    // creating points
    var firstPoint = new ymaps.Placemark(routePoints[0], {
        iconContent: 'Барское',
    }, {
        preset: 'islands#blueStretchyIcon',
    });
    
    var secondPoint = new ymaps.Placemark(routePoints[routePoints.length - 1], {
        iconContent: 'Унорож',
    }, {
        preset: 'islands#blueStretchyIcon',
    });

    function playAnimation(cycle) {
        cycle1 = !cycle;
        // adding the first point to the map
        myMap.geoObjects.add(firstPoint)
        // animating the first line
        .then(firstAnimatedLine.animate()
            // after the end of the first line animation, adding the second point animation
        .then(function() {
            myMap.geoObjects.add(secondPoint);
        })
        .then(function() {
            // pause after the animation
            return ymaps.vow.delay(null, 1000);
        })
        // removing objects from the map
        .then(function() {
            // removing points from the map
            myMap.geoObjects.remove(firstPoint);
            myMap.geoObjects.remove(secondPoint);
            firstAnimatedLine.reset();
            /*if (cycle) {
                myMap.setCenter([centerCoords[0] * 0.99999999, centerCoords[1] * 0.99999999]);
            }
            else {
                myMap.setCenter([centerCoords[0] * 1.00000001, centerCoords[1] * 1.00000001]);
            }*/
            return ymaps.vow.delay(null, 3000);
        })
        .then(function() {
            // restarting animation
            playAnimation(cycle1);
        }) );
    }
    
    // surprisingly, play animation
    playAnimation(true);
}