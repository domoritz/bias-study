var nextPage = {'approximate':'precise.html', 'precise':'questions.html'}

function updateData(label) {
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(parseInt(localStorage.getItem(label + "Seen")));

	$('#' + label + 'VisNum').text(parseInt(localStorage.getItem(label + "Seen")) + 1);

	if(parseInt(localStorage.getItem(label + "Seen")) >= numberVisualizations - 1) { //go to the next page after this visualization
	    $('#' + label + 'Form').attr("action", nextPage[label]);
	  }

  $('#' + label + 'Form').submit(function(ev) {
		ev.preventDefault();
		var currentVis = parseInt(localStorage.getItem(label + "Seen")) + 1;
		localStorage.setItem(label + "Seen", currentVis);
		newLog.child(label + "Seen").set(currentVis);
		var visRecord = newLog.child(label + 'Vis' + currentVis);
		$.each($('#' + label + 'Form').serializeArray(), function(i, field) {
    		visRecord.child(field.name).set(field.value);
		});
		this.submit();
	});
}
	