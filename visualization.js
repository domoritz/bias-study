//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//TODO: selected these states because they were popular for particular airlines (Delta, Southwest, Alaska). But it's worth thinking more about which states we want.
var statesUsing = Combinatorics.permutation(['GA', 'NV', 'WA']).toArray();
var amountErrorValues = ['1', '100', '200', '500', '1000']; //TODO: should we oversample the control condition?
var visualizationsArray = statesUsing[userId%statesUsing.length];
var airlinesByState = {'GA': ['Delta', 'ExpressJet', 'Southwest', 'American', 'United'], 'NV': ['Southwest', 'United', 'Spirit', 'Delta', 'American'], 'WA': ['Alaska', 'United', 'Delta', 'Southwest', 'SkyWest']};
var stateAbbreviationMap = {'GA': 'Georgia', 'NV': 'Nevada', 'WA': 'Washington'};

var nextPage = {'approximate':'precise.html', 'precise':'questions.html'};

function updateData(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	var statLookingAt = visualizationsArray[currentSeen];
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(currentSeen);

	var amountError = amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)];
	var sequenceNumber = amountError == '1' ? '0' : Math.ceil(Math.random()*20).toString();
	var howMany1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	var howMany2 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	var percentage = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];

	//Store error, sequence number, question parameters in database.
	var visRecord = newLog.child(label + 'Vis' + (currentSeen+1)); //1-index for our own sanity
	visRecord.child('amountError').set(amountError);
	visRecord.child('sequenceNumber').set(sequenceNumber);
	visRecord.child('howMany1').set(howMany1);
	visRecord.child('howMany2').set(howMany2);
	visRecord.child('percentage').set(percentage);

	console.log("Error amount: " + amountError);
	console.log("Sequence number: " + sequenceNumber);

	if(label == 'approximate') { //Always use sequence number 1
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");
	} else { //Precise is always fraction 1, sequence number 0.
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_1_0.png' width='600px'>");
	}

	$('#howMany1, small > #howMany1').text(howMany1);
	$('#howMany2, small > #howMany2').text(howMany2);
	$('#percentage').text(percentage);
	$('.template-visNum').text(currentSeen + 1);  //1-indexted for showing to humans
	$('.template-state').text(stateAbbreviationMap[visualizationsArray[currentSeen]]);

	$('#form').submit(function(ev) {
		ev.preventDefault();
		currentSeen++; //increment the number we've seen
		/*TODO: some sort of sensible bounds checking?
		If someone revisits approximate.html after finishing the approximate vis's, for example, it'll try to find a 4th one.*/
		localStorage.setItem(label + "Seen", currentSeen);
		newLog.child(label + "Seen").set(currentSeen);
		$.each($('#form').serializeArray(), function(i, field) {
			visRecord.child(field.name).set(field.value);
		});
		visRecord.child('whichVisualization').set(visualizationsArray[currentSeen-1]);
		if(currentSeen >= visualizationsArray.length) { //go to the next page after this visualization
			window.location.href = nextPage[label];
		} else {
			window.location.href = label + '.html';
		}
	});
}