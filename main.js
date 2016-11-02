var config = {
    apiKey: "AIzaSyA1sf5JPIRkH9MEMjjZ0zcLvuYw3svfWps",
    authDomain: "bias-study.firebaseapp.com",
    databaseURL: "https://bias-study.firebaseio.com",
    storageBucket: "bias-study.appspot.com",
    messagingSenderId: "452394401835"
};

firebase.initializeApp(config);

// user id defined namespace
// https://bias-study.firebaseio.com/logs/$userId
var userId = "not-yet-set";

// connect to db
var database = firebase.database();
var newLog = database.ref("logs").child(userId);

// write some things in the users namespace
newLog.child("foo").set("Some value");
newLog.child("bar").set("Some other value");
newLog.child("baz").set(42);
