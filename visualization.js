//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//TODO: selected these states because they were popular for particular airlines (Delta, Southwest, Alaska). But it's worth thinking more about which states we want.
var statesUsing = Combinatorics.permutation(['GA', 'NV', 'WA']).toArray();
var visualizationsArray = statesUsing[userId%statesUsing.length];
var airlinesByState = {'GA': ['Delta', 'ExpressJet', 'Southwest', 'American', 'United'], 'NV': ['Southwest', 'United', 'Spirit', 'Delta', 'American'], 'WA': ['Alaska', 'United', 'Delta', 'Southwest', 'SkyWest']};

var nextPage = {'approximate':'precise.html', 'precise':'questions.html'};

function updateData(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(currentSeen);

	if(label == 'approximate') { //Always use sequence number 1
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");
	} else { //Precise is always fraction 1, sequence number 0.
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_1_0.png' width='600px'>");
	}

	var howMany = airlinesByState[visualizationsArray[currentSeen]][Math.floor(Math.random()*airlinesByState[visualizationsArray[currentSeen]].length)];
	var percentage = airlinesByState[visualizationsArray[currentSeen]][Math.floor(Math.random()*airlinesByState[visualizationsArray[currentSeen]].length)];
	$('#howMany').text(howMany);
	$('#percentage').text(percentage);
	//TODO: store these values in the DB. Hopefully they don't influence results...

	$('.template-visNum').text(currentSeen + 1);  //1-indexted for showing to humans
	$('.template-state').text(visualizationsArray[currentSeen]);

	if(currentSeen >= visualizationsArray.length - 1) { //go to the next page after this visualization
	    $('#form').attr("action", nextPage[label]);
	  }

  $('#form').submit(function(ev) {
		ev.preventDefault();
		currentSeen++; //increment the number we've seen
		/*TODO: some sort of sensible bounds checking?
		If someone revisits approximate.html after finishing the approximate vis's, for example, it'll try to find a 4th one.*/
		localStorage.setItem(label + "Seen", currentSeen);
		newLog.child(label + "Seen").set(currentSeen);
		var visRecord = newLog.child(label + 'Vis' + currentSeen);
		$.each($('#form').serializeArray(), function(i, field) {
    		visRecord.child(field.name).set(field.value);
		});
		visRecord.child('whichVisualization').set(visualizationsArray[currentSeen-1]);
		this.submit();
	});
}