var config = {
    apiKey: "AIzaSyA1sf5JPIRkH9MEMjjZ0zcLvuYw3svfWps",
    authDomain: "bias-study.firebaseapp.com",
    databaseURL: "https://bias-study.firebaseio.com",
    storageBucket: "bias-study.appspot.com",
    messagingSenderId: "452394401835"
};

firebase.initializeApp(config);

// connect to db
var database = firebase.database();

if(!localStorage.getItem("userId")) {
	localStorage.setItem("userId", Math.floor(Math.random() * 10e7).toString()); //TODO: better way of setting a random string.
	localStorage.setItem("approximateSeen", 0);
	localStorage.setItem("preciseSeen", 0);
}

// user id defined namespace
// https://bias-study.firebaseio.com/logs/$userId
var userId = localStorage.getItem("userId");
var newLog = database.ref("logs").child(userId);

console.log(userId);

//Update the database with how many visualizations the client claims to have seen.
newLog.child("approximateSeen").set(parseInt(localStorage.getItem("approximateSeen")));
newLog.child("preciseSeen").set(parseInt(localStorage.getItem("preciseSeen")));

var numberVisualizations = 3;

$(function() {
	$('#approximateVisNum').text(parseInt(localStorage.getItem("approximateSeen")) + 1);
	$('#preciseVisNum').text(parseInt(localStorage.getItem("preciseSeen")) + 1);

	if(parseInt(localStorage.getItem("approximateSeen")) >= numberVisualizations - 1) { //go to the next page after this visualization
	    $("#approximateForm").attr("action", "precise.html");
	  }
	if(parseInt(localStorage.getItem("preciseSeen")) >= numberVisualizations - 1) { //go to the next page after this visualization
	    $("#preciseForm").attr("action", "questions.html");
	  }

  $('#approximateForm').submit(function(ev) {
		ev.preventDefault();
		var currentVis = parseInt(localStorage.getItem("approximateSeen")) + 1;
		localStorage.setItem("approximateSeen", currentVis);
		newLog.child("approximateSeen").set(currentVis);
		var visRecord = newLog.child('approximateVis' + currentVis);
		$.each($('#approximateForm').serializeArray(), function(i, field) {
    		visRecord.child(field.name).set(field.value);
		});
		this.submit();
	});

  $('#preciseForm').submit(function(ev) {
		ev.preventDefault();
		var currentVis = parseInt(localStorage.getItem("preciseSeen")) + 1;
		localStorage.setItem("preciseSeen", currentVis);
		newLog.child("preciseSeen").set(currentVis);
		var visRecord = newLog.child('preciseVis' + currentVis);
		$.each($('#preciseForm').serializeArray(), function(i, field) {
    		visRecord.child(field.name).set(field.value);
		});
		this.submit();
	});
});