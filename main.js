var config = {
    apiKey: "AIzaSyA1sf5JPIRkH9MEMjjZ0zcLvuYw3svfWps",
    authDomain: "bias-study.firebaseapp.com",
    databaseURL: "https://bias-study.firebaseio.com",
    storageBucket: "bias-study.appspot.com",
    messagingSenderId: "452394401835"
};

// FIXME: we are clearning local storage on every page. That seems wrong.
localStorage.clear();

firebase.initializeApp(config);

var amountErrorValues = ['1', '100', '200', '500', '1000']; //TODO: should we oversample the control condition?

// connect to db
var database = firebase.database();

if(!localStorage.getItem("userId")) {
	localStorage.setItem("userId", Math.floor(Math.random() * 10e7).toString()); //TODO: better way of setting a random string.
	localStorage.setItem("amountError", amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)]);
	localStorage.setItem("sequenceNumber", localStorage.getItem("amountError") == '1' ? '0' : Math.ceil(Math.random()*20).toString());
	localStorage.setItem("approximateSeen", 0);
	localStorage.setItem("preciseSeen", 0);
}

// user id defined namespace
// https://bias-study.firebaseio.com/logs/$userId
var userId = localStorage.getItem("userId");
var amountError = parseInt(localStorage.getItem("amountError"));
var sequenceNumber = parseInt(localStorage.getItem("sequenceNumber"));
var newLog = database.ref("logs").child(userId);
//TODO: if excessive DB calls are a concern, don't do this every page.
newLog.child("amountError").set(amountError);
newLog.child("sequenceNumber").set(sequenceNumber);

console.log("ID: " + userId);
console.log("Error amount: " + amountError);
console.log("Sequence number: " + sequenceNumber);
