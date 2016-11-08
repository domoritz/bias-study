//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//TODO: selected these states because they were popular for particular airlines (Delta, Southwest, Alaska). But it's worth thinking more about which states we want.
var statesUsing = Combinatorics.permutation(['CA', 'TX', 'FL']).toArray();
var amountErrorValues = ['1', '100', '200', '500', '1000']; //TODO: should we oversample the control condition?
var visualizationsArray = statesUsing[userId%statesUsing.length];
var airlinesByState = {
	'GA': ['Delta', 'ExpressJet', 'Southwest', 'American', 'United'],
	'NV': ['Southwest', 'United', 'Spirit', 'Delta', 'American'],
	'WA': ['Alaska', 'United', 'Delta', 'Southwest', 'SkyWest'],
	'CA': ['American', 'Alaska', 'Delta', 'SkyWest', 'United', 'Virgin', 'Southwest'],
	'TX': ['Southwest', 'American', 'ExpressJet', 'United', 'SkyWest', 'Delta', 'Spirit'],
	'FL': ['Southwest', 'American', 'Delta', 'ExpressJet', 'United', 'Spirit', 'Frontier']
};
var stateAbbreviationMap = {'GA': 'Georgia', 'NV': 'Nevada', 'WA': 'Washington', 'TX': 'Texas', 'CA': 'California', 'FL': 'Florida'};

var nextPage = {'approximate':'precise_instructions.html', 'precise':'questions.html'};

function updateData(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	var statLookingAt = visualizationsArray[currentSeen];
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(currentSeen);

	var amountError = amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)];
	var sequenceNumber = amountError == '1' ? '0' : Math.ceil(Math.random()*20).toString();
	var howMany = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	var howManyMore0 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	var howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	while(howManyMore0 == howManyMore1) { //TODO: could make this deterministic, but I'm lazy.
		howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
	}

	//Store error, sequence number, question parameters in database.
	var visRecord = newLog.child(label + 'Vis' + (currentSeen+1)); //1-index for our own sanity
	visRecord.child('amountError').set(amountError);
	visRecord.child('sequenceNumber').set(sequenceNumber);
	visRecord.child('howMany').set(howMany);
	visRecord.child('howManyMore0').set(howManyMore0);
	visRecord.child('howManyMore1').set(howManyMore1);

	console.log("Error amount: " + amountError);
	console.log("Sequence number: " + sequenceNumber);

	if(label == 'approximate') { //Always use sequence number 1
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");
	} else { //Precise is always fraction 1, sequence number 0.
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_1_0.png' width='600px'>");
	}

	$('#howMany, small > #howMany').text(howMany);
	$('#howManyMore0, small > #howManyMore0').text(howManyMore0);
	$('#howManyMore1, small > #howManyMore1').text(howManyMore1);
	$('.template-visNum').text(currentSeen + 1);  //1-indexted for showing to humans
	$('.template-state').text(stateAbbreviationMap[visualizationsArray[currentSeen]]);

	if(label == 'approximate') {
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
	} else {
		setTimeout(function() {
			currentSeen++;
			localStorage.setItem(label + "Seen", currentSeen);
			newLog.child(label + "Seen").set(currentSeen);
			visRecord.child('whichVisualization').set(visualizationsArray[currentSeen-1]);
			if(currentSeen >= visualizationsArray.length) { //go to the next page after this visualization
				$("#nextPage").attr("href", nextPage[label]);
			}
			$("#nextPage").removeClass("disabled");
		}, 10000);
	}
}