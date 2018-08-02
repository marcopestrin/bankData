const   express     = require("express"),
        geocoder    = require("geocoder"),
        router      = express.Router({mergeParams: true}),
        Transition  = require("../models/transition");

var middleware = require("../middleware");
var { isLoggedIn } = middleware;
var date = new Date();

function renderListOfTransition(req,res){
    queryToSelectUser = {
        "author.username":req.user.username,
    }; //questo è il filtro transizione-utente nella home

    Transition.find(queryToSelectUser, function(err, allTransitions){

        var listMarker = []; 
        var counter = 1;
        var pos;
        for (pos of Object.values(allTransitions)){ //con questo mi creo l'array per i dati di google maps nella view
            var thisMarker = []; 
            thisMarker["latitude"]= pos.position.latitude;
            thisMarker["longitude"]= pos.position.longitude;
            thisMarker["position"]= pos.position.location;
            thisMarker["amount"]= pos.amount;
            listMarker[counter]= thisMarker;
            counter++;
        }
        var numberOfTransitions = allTransitions.length;
        console.log(typeof numberOfTransitions);
        if(err){
            console.log(err);
        } else {
            if(req.xhr) {
                res.json(allTransitions);
            } else {
                res.render("transition/index",{transitions: allTransitions, page: 'index', markers:listMarker, numberOfTransitions: numberOfTransitions });
            }
        }
    });
}

router.get("/", isLoggedIn, function(req, res){
    console.log(date+" Get all transitions from database")
    console.log(req.user); //qui mi trovo 1 isadmin...da rivedere
    renderListOfTransition(req, res);
});

router.get("/new", isLoggedIn, function(req, res){
    console.log(date+" Request new transition");
    res.render("transition/new");
})

router.post("/addTransition", function(req, res){

    // la prima è da rivedere perchè è sempre vuota

    console.log(req.user);
    console.log(date+" Adding transition...");

    geocoder.geocode(req.body.location, function(err, data) {
        if (err) throw err;
        console.log("#######################");
        console.log(data.results[0]) //a volte undefined
        console.log("#######################");
        var trans = {
            description: req.body.description,
            category: req.body.category,
            positive: req.body.positive,
            track: req.body.track,
            amount: req.body.amount,
            date: req.body.date,
            position: {
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
                location: req.body.location,
            },
            author : {
                id: req.user._id,
                username:req.user.username
            }
        };
        Transition.create(trans, function(err, transition){
            console.log(transition);
            console.log(date+" Created a transition!")
            req.flash('success', 'Created a transition!');
        })
    });
 })

router.delete("/delete/:id", isLoggedIn, function(req, res) {
    Transition.deleteOne({
        _id: req.params.id
    }, function(err) {
        if(err) {
            req.flash('error', err.message);
        } else {
            req.flash('success', 'transition deleted!');
        }
        res.redirect('/transition');
    })
});

router.get("/edit/:id", isLoggedIn, function(req, res){
    console.log(date+" Request update transition");
    Transition.find({_id:req.params.id}, function(err, transitionSelected){
        if(err){
            console.log(date+" Transition not found...redirect to homepage");
            req.flash('error', err.message);
            res.redirect('/transition');
        }else{
            res.render("transition/edit",{currentTransition: transitionSelected, page: 'edit'}); 
        }
    })
});

router.post("/editTransition", isLoggedIn, function(req, res){
    console.log(date+" Editing transition...");
    geocoder.geocode(req.body.location, function(err, data) {
        if (err) throw err;

        var trans = {
            description: req.body.description,
            category: req.body.category,
            positive: req.body.positive,
            track: req.body.track,
            position: {
                location: req.body.location,
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
            },
            date: req.body.date,
            amount: req.body.amount 
        };
        Transition.findByIdAndUpdate(req.body.idTransition, trans, function(err, transition){
            console.log(date+" Edited a transition!")
            if(err) {
                req.flash('error', err.message);
            }else{
                req.flash('success', 'Edited a transition!');
            }
            res.redirect("/transition/");
        })
    })

});

module.exports = router;
