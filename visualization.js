//Generate all permutations of the visualization order, select by userID (which is effectively "random")
var permutations = Combinatorics.permutation(['A', 'B', 'C']).toArray();
var visualizationsArray = permutations[userId%permutations.length];

var nextPage = {'approximate':'precise.html', 'precise':'questions.html'};

function updateData(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(currentSeen);

	$('#visualization').prepend("<img src='assets/" + label + visualizationsArray[currentSeen] + ".png' width='500px'>");

	$('#visNum').text(currentSeen + 1); //1-indexted for showing to humans

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