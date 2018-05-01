function describeMap(geocoder, map) {
    var placeName = "埼玉スタジアム";
    var info = "浦和レッズ vs 湘南ベルマーレ<br>5/10 19:00 kickoff";
    geocodeAddress(geocoder, placeName, info, map);
    // var placeName = "味の素スタジアム";
    // var info = "FC東京 vs 湘南ベルマーレ<br>5/10 19:00 kickoff";
    // geocodeAddress(geocoder, placeName, info, map);
}


function geocodeAddress(geocoder, placeName, info, resultsMap) {
    geocoder.geocode({
        'address': placeName
    }, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
            var infowindow = new google.maps.InfoWindow({
                content: "aaa" //info
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
            resultsMap.setCenter(results[0].geometry.location);
            
        }
    });
}