$(function(){

$('#visualization').each(function() {
	var visualizationLookingAt = presentationOrder[whichOne];

	var amountError = getError(visualizationLookingAt);
    var sequenceNumber = getSequence(visualizationLookingAt);

	if (label == 'approximate') {
		$('#visualization').append("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");
	} else {
		if(studyCondition == 'onlyNew') {
			$('#visualization').append("<img src='data/images/" + visualizationLookingAt + "_1_0.png' width='600px'>");
		} else {
			if(studyCondition == 'difference') {
				$('#instructions').html("The <span class='orange'>orange</span> ticks show the approximate data you have seen previously. The <span class='blue'>blue</span> bars show precise data. If there is no orange tick, the bar was missing in the apprxoimate visualization.");
				$('#visualization').append("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + "_diff.png' width='600px'>");
			} else { //both
				$('#visualization').append("<div class='col-xs-6'><h2>Approximate</h2></div><div class='col-xs-6'><h2>Precise</h2></div>")
				$('#visualization').append("<div class='col-xs-6'><img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='445px'></div><div class='col-xs-6'><img src='data/images/" + visualizationLookingAt + "_1_0.png' width='445px'></div>");
			}
		}
	}
});

$('#nextCheckbox').each(function(_, el) {
	// timeout of 10 unless we are on localhost
	setTimeout(function() {
		$(el).find('input').prop('disabled', false);
	}, DEBUG ? 1000 : 10000);
});

});