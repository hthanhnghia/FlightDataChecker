/*
==================================
Global variables for styling
==================================
*/

var map;

var mapSaturation = 20;
var mapLightness = 20;
var lineOpacity = 50;
var lineWeight = 1;
var lineColor = "000000";

/*
==================================
Global variables for data
==================================
*/

var airports = [];
var airblocks = [];
var segments = [];
var fixes = [];
var sample_output;

// added
var fix_codes = [];
var airport_codes = [];

/*
==================================
Global variables for zooming
==================================
*/

var zoom = 3;

var airportZoomImageIcons = [
    null,
    "blue_pin_4.png",
    "blue_pin_8.png",
    "blue_pin_12.png",
    "blue_pin_16.png",
    "blue_pin_20.png",
    "blue_pin_24.png",
    "blue_pin_28.png",
    "blue_pin_32.png",
    "blue_pin_36.png",
    "blue_pin_40.png"
];

var fixZoomFontSizes = [null, 1, 3, 5, 7, 9, 9, 9, 9, 9]

/*
==================================
Initialize map
==================================
*/

function initMap() {

    zoom = 5;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: new google.maps.LatLng(12.290270, 122.851959)
    });
    updateMapStyling();

    airportInfoWindow = new google.maps.InfoWindow({});
    flightInfoWindow = new google.maps.InfoWindow({});
    flightLayer2InfoWindow = new google.maps.InfoWindow({});
    airblockInfoWindow = new google.maps.InfoWindow({});
    segmentInfoWindow = new google.maps.InfoWindow({});
    fixInfoWindow = new google.maps.InfoWindow({});

    $.getJSON("js/standard_all_airports.json", function(data) {
        loadStandardAllAirports(data);

        for (var i = 0; i < data.airports.length; i++) {
            var code = data.airports[i].code;
            airport_codes.push(code);
        }
    });

    $.getJSON("js/sectors.json", function(data) {
        loadSectors(data);
        showAirblocks();
    });
    $.getJSON("js/waypoints_airways_segments.json", function(data) {
        loadSegments(data);
    });
    $.getJSON("js/waypoints_airways_fixes.json", function(data) {
        loadFixes(data);

        for (var i = 0; i < data.fixes.length; i++) {
            var code = data.fixes[i].code;
            fix_codes.push(code);
        }
    });

    $.ajax({
        url : "output.txt",
        dataType: "text",
        success : function (data) {
            sample_output = data.split('\n');
        }
    });
}

/*
==================================
Styling
==================================
*/

function setMapSaturation(value) {
    mapSaturation = parseInt(value);
    $('#map-saturation').text(value);
    updateMapStyling();
}

function setMapLightness(value) {
    mapLightness = parseInt(value);
    $('#map-lightness').text(value);
    updateMapStyling();
}

function setLineOpacity(value) {
    lineOpacity = parseInt(value);
    $('#line-opacity').text(value);
    updateLineStyling();
}

function setLineWeight(value) {
    lineWeight = parseInt(value);
    $('#line-weight').text(value);
    updateLineStyling();
}

function setLineColor(value) {
    lineColor = value;
    updateLineStyling();
}

function updateMapStyling() {
    var mapStyles = [{
        stylers: [{
            saturation: mapSaturation
        }, {
            lightness: mapLightness
        }]
    }, ];
    map.setOptions({
        styles: mapStyles
    });
}

/*
==================================
Standard all airports
==================================
*/

function loadStandardAllAirports(results) {
    for (var i = 0; i < results.airports.length; i++) {
        var code = results.airports[i].code;
        var name = results.airports[i].name;
        var place = results.airports[i].place;
        var coords = results.airports[i].coordinates;

        var airport = new google.maps.Marker({
            position: {
                lat: coords[0],
                lng: coords[1]
            },
            icon: "img/" + airportZoomImageIcons[zoom],
            contentString: "<b>" + code + "</b>" + "<br>" + name + "<br>" + place
        });

        airports.push(airport);

        airport.addListener('mouseover', function() {
            airportInfoWindow.setContent(this.contentString);
            airportInfoWindow.open(map, this);
        });

        airport.addListener('mouseout', function() {
            airportInfoWindow.close();
        });
    }
}

/*
==================================
Airport utilities
==================================
*/

function setMapOnAllAirports(map) {
    for (var i = 0; i < airports.length; i++) {
        airports[i].setMap(map);
    }
}

function showAirports() {
    setMapOnAllAirports(map);
}

function clearAirports() {
    setMapOnAllAirports(null);
}

function deleteAirports() {
    clearAirports();
    airports = [];
}

/*
==================================
Sectors
==================================
*/

function loadSectors(results) {
    for (var i = 0; i < results.airblocks.length; i++) {
        var nbPoint = results.airblocks[i].nb_point;
        var name = results.airblocks[i].name;
        var coordinates = [];
        for (var j = 0; j < results.airblocks[i].coordinates.length; j++) {
            var latlng = results.airblocks[i].coordinates[j];
            coordinates.push({
                lat: latlng[0],
                lng: latlng[1]
            });
        }

        var contentString = "<b>" + results.airblocks[i].name + "</b>";

        var airblock = new google.maps.Polygon({
            path: coordinates,
            strokeColor: "#000000",
            strokeOpacity: 0.2,
            fillColor: "#000000",
            fillOpacity: 0,
            strokeWeight: 1,
            contentString: contentString
        });

        airblocks.push(airblock);

        airblock.addListener('mouseover', function(e) {
            this.setOptions({
                fillColor: "#000000",
                fillOpacity: 0.1
            });
            airblockInfoWindow.setContent(this.contentString);
            airblockInfoWindow.setPosition(e.latLng);
            airblockInfoWindow.open(map, this);
        });

        airblock.addListener('mouseout', function(e) {
            this.setOptions({
                fillColor: "#000000",
                fillOpacity: 0
            });
            airblockInfoWindow.close();
        });
    }
}

/*
==================================
Sector utilities
==================================
*/

function setMapOnAllAirblocks(map) {
    for (var i = 0; i < airblocks.length; i++) {
        airblocks[i].setMap(map);
    }
}

function showAirblocks() {
    setMapOnAllAirblocks(map);
}

function clearAirblocks() {
    setMapOnAllAirblocks(null);
}

function deleteAirblocks() {
    clearAirblocks();
    airblocks = [];
}

/*
==================================
Segments
==================================
*/

function loadSegments(results) {
    for (var i = 0; i < results.segments.length; i++) {
        var name = results.segments[i].name;
        var begin = results.segments[i].begin;
        var end = results.segments[i].end;
        var coordinates = [{
            lat: begin[0],
            lng: begin[1]
        }, {
            lat: end[0],
            lng: end[1]
        }];

        var segment = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 0.1,
            strokeWeight: 1,
            contentString: "Segment: <b>" + name + "</b>",
        });

        segments.push(segment);

        segment.addListener('click', function(e) {
            segmentInfoWindow.setContent(this.contentString);
            segmentInfoWindow.setPosition(e.latLng);
            segmentInfoWindow.open(map, this);
        });
    }
}

/*
==================================
Segment utilities
==================================
*/

function setMapOnAllSegments(map) {
    for (var i = 0; i < segments.length; i++) {
        segments[i].setMap(map);
    }
}

function showSegments() {
    setMapOnAllSegments(map);
}

function clearSegments() {
    setMapOnAllSegments(null);
}

function deleteSegments() {
    clearSegments();
    segments = [];
}

/*
==================================
Fixes
==================================
*/

function loadFixes(results) {
    var markerSize = {
        x: 22,
        y: 40
    };

    google.maps.Marker.prototype.setLabel = function(label) {
        this.label = new MarkerLabel({
            map: this.map,
            marker: this,
            text: label,
        });
        this.label.bindTo('position', this, 'position');
    };

    var MarkerLabel = function(options) {
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'map-marker-label';
    };

    MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
                google.maps.event.addListener(this, 'position_changed', function() {
                    self.draw();
                })
            ];
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 2) + 10 + 'px';
            this.span.style.top = (position.y - markerSize.y + 40) + 'px';
        }
    });

    for (var i = 0; i < results.fixes.length; i++) {
        var code = results.fixes[i].code;
        var coordinates = results.fixes[i].coordinates;

        var myLatLng = new google.maps.LatLng(coordinates[0], coordinates[1]);

        var fix = new google.maps.Marker({
            code: code,
            position: myLatLng,
            icon: {
                url: "img/gray_border_triangle.png",
                scaledSize: new google.maps.Size(8, 8)
            },
            label: code
        });

        fixes.push(fix);
    }
}

/*
==================================
Fix utilities
==================================
*/

function setMapOnAllFixes(map) {
    for (var i = 0; i < fixes.length; i++) {
        fixes[i].setMap(map);
    }
}

function updateFixes(allFixes, flightFixes) {
    loadFixes(allFixes);
    var markerSize = {
        x: 22,
        y: 40
    };

    google.maps.Marker.prototype.setLabel = function(label) {
        this.label = new MarkerLabel({
            map: this.map,
            marker: this,
            text: label
        });
        this.label.bindTo('position', this, 'position');
    };

    google.maps.Marker.prototype.setFlightLabel = function(label) {
        this.label = new FlightMarkerLabel({
            map: this.map,
            marker: this,
            text: label
        });
        this.label.bindTo('position', this, 'position');
    };

    var MarkerLabel = function(options) {
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'map-marker-label';
    };

    var FlightMarkerLabel = function(options) {
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'flight-marker-label';
    };

    MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
                google.maps.event.addListener(this, 'position_changed', function() {
                    self.draw();
                })
            ];
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 2) + 10 + 'px';
            this.span.style.top = (position.y - markerSize.y + 40) + 'px';
        }
    });

    FlightMarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
                google.maps.event.addListener(this, 'position_changed', function() {
                    self.draw();
                })
            ];
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 2) + 10 + 'px';
            this.span.style.top = (position.y - markerSize.y + 40) + 'px';
        }
    });

    for (var i = 0; i < allFixes.fixes.length; i++) {
        var code = allFixes.fixes[i].code;
        var coordinates = allFixes.fixes[i].coordinates;

        var myLatLng = new google.maps.LatLng(coordinates[0], coordinates[1]);

        var fix = new google.maps.Marker({
            code: code,
            position: myLatLng,
            icon: {
                url: "img/gray_border_triangle.png",
                scaledSize: new google.maps.Size(8, 8)
            },
            label: code
        });

        fix.setMap(map);
        var isFlightFix = false;
        for (var j = 0; j < flightFixes.fixes.length; j++)
        {
            if (flightFixes.fixes[j].code == code)
            {
                fix.setFlightLabel(code);
                isFlightFix = true;
                break;
            }
        }

        if (!isFlightFix)
            fix.setLabel(code);
    }
}

function showFixes() {
    var markerSize = {
        x: 22,
        y: 40
    };

    google.maps.Marker.prototype.setLabel = function(label) {
        this.label = new MarkerLabel({
            map: this.map,
            marker: this,
            text: label
        });
        this.label.bindTo('position', this, 'position');
    };

    var MarkerLabel = function(options) {
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'map-marker-label';
    };

    MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
                google.maps.event.addListener(this, 'position_changed', function() {
                    self.draw();
                })
            ];
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 2) + 10 + 'px';
            this.span.style.top = (position.y - markerSize.y + 40) + 'px';
        }
    });

    setMapOnAllFixes(map);
    for (var i = 0; i < fixes.length; i++) {
        fixes[i].setLabel(fixes[i].code);
    }
}

function clearFixes() {
    setMapOnAllFixes(null);
    for (var i = 0; i < fixes.length; i++) {
        fixes[i].label.span.remove();
    }
}

function deleteFixes() {
    clearFixes();
    fixes = [];
}

/*
==================================
Record play
==================================
*/

var recordCurrentlyPlaying = false;
var row_number;
var flight;
var cell_labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
"AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ"]

function deleteFlight() {
    if(flight)
        flight.setMap(null);
}

function clearFlightData() {
    deleteAirports();
    //deleteAirblocks();
    deleteSegments();
    deleteFixes();
}

function loadRowNumber() {
    clearFlightData();

    if (!localStorage.row_number)
        localStorage.row_number = 3;

    row_number = localStorage.getItem("row_number");
    document.getElementById("row_number").innerHTML = localStorage.getItem("row_number");
    document.getElementById("goto_row_number").value = localStorage.getItem("row_number");
    startRecordPlay();
}

function increaseRowNumber() {
    clearFlightData();

    if (localStorage.row_number)
        localStorage.row_number = parseInt(localStorage.row_number) + 1;

    row_number = localStorage.getItem("row_number");
    document.getElementById("row_number").innerHTML = localStorage.getItem("row_number");
    document.getElementById("goto_row_number").value = localStorage.getItem("row_number");
}

function decreaseRowNumber() {
    clearFlightData();

    if (localStorage.row_number && localStorage.row_number > 3)
        localStorage.row_number = parseInt(localStorage.row_number) - 1;

    row_number = localStorage.getItem("row_number");
    document.getElementById("row_number").innerHTML = localStorage.getItem("row_number");
    document.getElementById("goto_row_number").value = localStorage.getItem("row_number");
}

function resetRowNumber() {
    clearFlightData();

    localStorage.row_number = 3;
    row_number = 3;
    document.getElementById("row_number").innerHTML = 3;
    document.getElementById("goto_row_number").value = 3;
    startRecordPlay()
}

var all_airports = {};

$.ajax({
    dataType: "json",
    url: 'js/standard_all_airports(iaco).json',
    async: false,
    success: function(data) {
        all_airports = data;
    }
});

function go() {
    goto_row_number = document.getElementById("goto_row_number").value

    if(!isNaN(parseInt(goto_row_number, 10)) && parseInt(goto_row_number, 10) > 2)
    {
        row_number = goto_row_number
        document.getElementById("row_number").innerHTML = goto_row_number;
        localStorage.row_number = goto_row_number;
        startRecordPlay();
    }
}

function next() {
    increaseRowNumber();
    startRecordPlay();
}

function prev() {
    decreaseRowNumber();
    startRecordPlay();
}

error_list = [
    "Fix/Airport(s) name must be between 2 to 5 characters",
    "Fix/Airport(s) name contains forbidden characters",
    "Airport(s) found in the middle of fix list",
    "No field expected with blank value",
    "Point(s) was NOT found"
]

function dataCheck(path)
{
    errors = []
    for(var i=0; i<path.length; i++)
    {
        f = path[i];

        if(f.length < 2 || f.length > 5)
        {
            if(!(error_list[0] in errors))
                errors[error_list[0]] = [f]

            else
                errors.push(f)
        }

        if(/^[a-zA-Z0-9-]*$/.test(f) == false) {
            if(!(error_list[1] in errors))
                errors[error_list[1]] = [f]

            else
                errors.push(f)
        }

        for(var j = 0; j < all_airports.airports.length; j++)
        {
            if (f == all_airports.airports[j].code)
            {
                if(!(error_list[2] in errors))
                    errors[error_list[2]] = [f]

                else
                    errors.push(f)
                break;
            }
        }

    }
}

function startRecordPlay() {
    recordCurrentlyPlaying = true;

    deleteFlight();
    deleteAirports();
    deleteSegments();
    deleteFixes();

    //zoom = 6;
    //map.setOptions({
        //zoom: zoom,
        //center: new google.maps.LatLng(1.350189, 103.994433)
    //});

    var waypoints = {};

    $.getJSON('js/waypoints_airways_fixes.json', function(data) { 
        waypoints = data;
    });
    
    /* set up XMLHttpRequest */
    var url = "data.xlsx";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e) {
        var arraybuffer = oReq.response;

        /* convert data to binary string */
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        /* Call XLSX */
        var workbook = XLSX.read(bstr, {type:"binary"});

        /* Get worksheet */
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Get cell_data */
        var original_airport_cell = 'B' + row_number;
        var destination_airport_cell = 'C' + row_number;
        var first_entry_cell = 'G' + row_number;

        var original_airport = worksheet[original_airport_cell].v;
        var destination_airport = worksheet[destination_airport_cell].v;
        var first_entry = worksheet[first_entry_cell].v;
        var original_airport_name, destination_airport_name;

        for(var j = 0; j < all_airports.airports.length; j++)
        {
            if (all_airports.airports[j].code == original_airport)
            {
                original_airport_name = all_airports.airports[j].name;
                break;
            }
        }

        for(var j = 0; j < all_airports.airports.length; j++)
        {
            if (all_airports.airports[j].code == destination_airport)
            {
                destination_airport_name = all_airports.airports[j].name;
                break;
            }
        }

        var path = [original_airport, first_entry];

        index = 10
        
        while(true)
        {
            var next_fix_cell = cell_labels[index++] + row_number;

            if(!worksheet[next_fix_cell])
                break;

            else
            {
                var next_fix = worksheet[next_fix_cell].v;

                if (next_fix != '')
                    path.push(next_fix);
            }
        }

        path.push(destination_airport)
        //console.log(path)
        dataCheck(path)

        var flightCoordinates = []
        var flightFixes = []
        var flightAirports = []

        for(var i = 0; i < path.length; i++)
        {
            p = path[i];     

            for(var j = 0; j < waypoints.fixes.length; j++)
            {
                if (waypoints.fixes[j].code == p)
                {
                    flightCoordinates.push({
                        lat: waypoints.fixes[j].coordinates[0],
                        lng: waypoints.fixes[j].coordinates[1]
                    })
                    flightFixes.push(waypoints.fixes[j])
                    if (i == length/2)
                        map.setCenter({lat: waypoints.fixes[j].coordinates[0], lng: waypoints.fixes[j].coordinates[1]})
                    break;
                }
            }

            for(var j = 0; j < all_airports.airports.length; j++)
            {
                if (all_airports.airports[j].code == p)
                {
                    flightCoordinates.push({
                        lat: all_airports.airports[j].coordinates[0],
                        lng: all_airports.airports[j].coordinates[1]
                    })

                    flightAirports.push(all_airports.airports[j])
                    break;
                }
            }
        }

        deleteFlight();
        flight = new google.maps.Polyline({
            path: flightCoordinates,
            geodesic: true,
            strokeColor: 'red',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        }); 

        /* Fixes */
        flightFixes = {'fixes': flightFixes};
        loadFixes(flightFixes);
        showFixes();

        /* Airports */
        flightAirports = {'airports': flightAirports};
        loadStandardAllAirports(flightAirports);
        showAirports();

        /* Draw the route in canvas */
        var c=document.getElementById("route");
        var ctx=c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        
        centreX = 60;
        centreY = 30;
        radius = 5;
        ctx.font = "10px Arial";

        for(var i = 0; i < path.length - 1; i++)
        {
            ctx.beginPath();
            ctx.arc(centreX,centreY,radius,0,2*Math.PI);
            if(i == 0)
            {
                ctx.fillStyle = "red";
                base_image = new Image();
                base_image.src = 'img/red_pin.png';
                base_image.onload = function(){
                    ctx.drawImage(base_image, centreX, centreY - 15);
                    console.log(base_image)
                }

                ctx.fillText("(" + original_airport_name + ")",centreX - radius - original_airport_name.length*2.5,centreY + radius + 30);
            }
            else
                ctx.fillStyle = "blue";

            ctx.fill();
            ctx.stroke();

            ctx.fillText(path[i],centreX - radius - path[i].length*2.5,centreY + radius + 15);

            ctx.beginPath();
            centreX = centreX + radius;
            ctx.moveTo(centreX,centreY);
            ctx.lineTo(centreX + 40, centreY);
            centreX = centreX + 40;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(centreX,centreY,radius,0,2*Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
        ctx.fillText(path[path.length - 1],centreX - radius - path[i].length*2.5,centreY + radius + 15);
        ctx.fillText("(" + destination_airport_name + ")",centreX - radius - destination_airport_name.length*2.5,centreY + radius + 30);

        /* Write Status */
        line_id = 'Line: ' + row_number + ' ';
        var error = 'Row ' + row_number +' OK';
        for(var i = 0; i < sample_output.length; i++)
        {
            line = sample_output[i];
            if(line.indexOf(line_id) >= 0)
            {
                error = 'Row ' + row_number +' Error: ' + sample_output[i].split(line_id)[1];
                break;
            }
        }
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(error,30,80);
    }

    oReq.send();
}

var stepBut = document.getElementById("step_all_rows");
var timer = null;
stepBut.addEventListener("click", Start);

function Start(){
    console.log("Started");
    stepBut.removeEventListener("click", Start);
    stepBut.addEventListener("click", Stop);
    stepBut.value = "Pause";

    if (timer !== null) return;
    timer = setInterval(next, 900); 
}

function Stop(){
    console.log("Stopped");
    stepBut.removeEventListener("click", Stop);
    stepBut.addEventListener("click", Start);
    stepBut.value = "Run";
    clearInterval(timer);
    timer = null
}

$("#restore_zoom_level").click(function() {
    map.setZoom(5); 
    map.setCenter(new google.maps.LatLng(12.290270, 122.851959));
})

function stopRecordPlay() {
    recordCurrentlyPlaying = false;
}