
jQuery(function($) {
    var script = document.createElement('script');
    script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});
function initialize() {
    var dateForGoogleMaps = document.getElementById("dateForGoogleMaps").getElementsByTagName("span");
    var markers = [];
    for (numberOfTransition = 0; numberOfTransition < dateForGoogleMaps.length; numberOfTransition++) { 
        var thisTransition = []
        var amount = dateForGoogleMaps[numberOfTransition].getElementsByClassName("amount");
        for (var i = 0; i < amount.length; i++) {
            var price = amount[i].innerText;
            thisTransition["amount"] = price;
        }
        var latitude = dateForGoogleMaps[numberOfTransition].getElementsByClassName("latitude");
        for (var i = 0; i < latitude.length; i++) {
            var latitudine = latitude[i].innerText;
            thisTransition["latitude"] = latitudine;
        } 
        var longitude = dateForGoogleMaps[numberOfTransition].getElementsByClassName("longitude");
        for (var i = 0; i < longitude.length; i++) {
            var longitudine = longitude[i].innerText;
            thisTransition["longitude"] = longitudine;
        }
        var position = dateForGoogleMaps[numberOfTransition].getElementsByClassName("position");
        for (var i = 0; i < position.length; i++) {
            var pos = position[i].innerText;
            thisTransition["position"] = pos;
        }
        markers[numberOfTransition] = thisTransition;
    }
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat:1.4408474 , lng:1.3155151},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    contentPopup = [];
    for( i = 0; i < markers.length; i++ ) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng( Number(markers[i]['latitude']), Number(markers[i]['longitude']) ),
            map: map,
            title: markers[i]['position']
        });
        contentPopup[i] = "Position:"+markers[i]['position']+"<br />Amount:"+markers[i]['amount'];                    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(contentPopup[i]);
                infowindow.open(map, marker);
            }
        })(marker, i));
            
    } 
}

jQuery(document).ready(function(){
    jQuery(".toggle-track").on("click",function(){
        displayType = jQuery("#untracked").css("display");
        if(displayType === "none"){
            jQuery(this).html("Hide untracked")
        }else{
            jQuery(this).html("Show untracked")
        }
        jQuery("#untracked").toggle();
    })
})
