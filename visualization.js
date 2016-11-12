//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//If we ever add study conditions, make sure to update the numbers so these two variations remain independent.
var studyCondition = userId%3 == 0 ? 'difference' : (userId%3==1 ? 'both' : 'onlyNew');
var presentationOrder = ((userId%6) / 3) == 0 ? ['states', 'airline'] : ['airline', 'states'];
var amountErrorValues = ['1', '100', '200', '500', '1000'];

function addVisualization(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	//TODO: bounds check this, include a default message when nagivating back.
	var visualizationLookingAt = presentationOrder[currentSeen];
	var visRecord = newLog.child(label + 'Vis_' + visualizationLookingAt);
	newLog.child(label + "Seen").set(currentSeen);

	if (label == 'approximate') {
		var amountError = amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)];
		var sequenceNumber = amountError == '1' ? '0' : Math.ceil(Math.random()*20).toString();
		localStorage.setItem(visualizationLookingAt + 'AmountError', amountError);
		localStorage.setItem(visualizationLookingAt + 'SequenceNumber', sequenceNumber);

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
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + "_diff.png' width='600px'>");
			} else { //both
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_1_0.png' width='300px'>");
				$('#visualization').prepend("<img src='data/images/" + visualizationLookingAt + "_" + amountError + "_" + sequenceNumber + ".png' width='300px'>");
			}
		}
	}

	setTimeout(function() {
		currentSeen++; //increment the number we've seen
		localStorage.setItem(label + "Seen", currentSeen);
		newLog.child(label + "Seen").set(currentSeen);
		if(label == 'precise') {
			if(currentSeen >= presentationOrder.length) { //go to the next page after this visualization
				console.log('here');
				$("#form").attr("action", 'precise_questions.html');
			}
		}
		$('#nextCheckbox').css('visibility', 'visible');
	}, 10000);
}