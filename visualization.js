$(function(){

$('#visualization').each(function() {
	var visualizationLookingAt = presentationOrder[whichOne];
	var visRecord = newLog.child(label + 'Vis_' + visualizationLookingAt);

	if (label == 'approximate') {
		var amountError = localStorage.getItem(visualizationLookingAt + 'AmountError');
		var sequenceNumber = localStorage.getItem(visualizationLookingAt + 'SequenceNumber');

		if (!amountError) {
			amountError = amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)];
			localStorage.setItem(visualizationLookingAt + 'AmountError', amountError);
		}

		if (!sequenceNumber) {
			sequenceNumber = amountError == '1' ? '0' : Math.ceil(Math.random()*20).toString();
			localStorage.setItem(visualizationLookingAt + 'SequenceNumber', sequenceNumber);
		}
		
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
			var amountError = localStorage.getItem(visualizationLookingAt + 'AmountError');
			var sequenceNumber = localStorage.getItem(visualizationLookingAt + 'SequenceNumber');
			if(studyCondition == 'difference') {
				$('#instructions').html("The <span class='orange'>orange</span> ticks show the approximate data you have seen previously. The <span class='blue'>blue</span> bars show precise data. If there is no orange tick, the bar was missing in the apprxoimate visualization.");
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + "_diff.png' width='600px'>");
			} else { //both
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_1_0.png' width='300px'>");
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='300px'>");
			}
		}
	}
});

$('#nextCheckbox').each(function(_, el) {
	setTimeout(function() {
		$(el).find('input').prop('disabled', false);
	}, 1000);
});

});