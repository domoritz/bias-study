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
	localStorage.setItem("userId", Math.floor(Math.random() * 10e7).toString());
}

// user id defined namespace
// https://bias-study.firebaseio.com/logs/$userId
var userId = localStorage.getItem("userId");
var newLog = database.ref("logs").child(userId);

console.log("ID: " + userId);

//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//If we ever add study conditions, make sure to update the numbers so these two variations remain independent.
var studyCondition = userId%3 == 0 ? 'difference' : (userId%3==1 ? 'both' : 'onlyNew');
var presentationOrder = ((userId%6) / 3) == 0 ? ['states', 'airline'] : ['airline', 'states'];
var amountErrorValues = ['1', '100', '200', '500', '1000'];

var selectOptions = {
    'airline': ['American', 'Delta', 'ExpressJet', 'Hawaiian', 'JetBlue', 'SkyWest', 'Spirit', 'Southwest', 'United', 'Virgin'],
    'states': ['Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'Illinois', 'Nevada', 'New York', 'Texas', 'Washington']
};

newLog.child('firstCondition').set(presentationOrder[0]);
newLog.child('secondCondition').set(presentationOrder[1]);
