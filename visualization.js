$(function(){

$('#visualization').each(function() {
	var visualizationLookingAt = presentationOrder[whichOne];
	var visRecord = newLog.child(label + 'Vis_' + visualizationLookingAt);

	var amountError = getError(visualizationLookingAt);
    var sequenceNumber = getSequence(visualizationLookingAt);

	if (label == 'approximate') {
		$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");

		//Store error, sequence number, question parameters in database.
		visRecord.child('amountError').set(amountError);
		visRecord.child('sequenceNumber').set(sequenceNumber);
		console.log("Error amount: " + amountError);
		console.log("Sequence number: " + sequenceNumber);	
	} else {
		if(studyCondition == 'onlyNew') {
			$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_1_0.png' width='600px'>");
		} else {
			if(studyCondition == 'difference') {
				$('#instructions').html("The <span class='orange'>orange</span> ticks show the approximate data you have seen previously. The <span class='blue'>blue</span> bars show precise data. If there is no orange tick, the bar was missing in the apprxoimate visualization.");
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + "_diff.png' width='600px'>");
			} else { //both
				$('#visualization').prepend("<div class='col-md-6'><img src='data/images/" + visualizationLookingAt + "_1_0.png' width='300px'></div><div class='col-md-6'><img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='300px'></div>");
				$('#visualization').prepend("<div class='col-md-6'><h2>Approximate</h2></div><div class='col-md-6'><h2>Precise</h2></div>")
			}
		}
	}
});

$('#nextCheckbox').each(function(_, el) {
	// timeout of 10 unless we are on localhost
	setTimeout(function() {
		$(el).find('input').prop('disabled', false);
	}, location.hostname === "localhost" || location.hostname === "127.0.0.1" ? 1000 : 10000);
});

});