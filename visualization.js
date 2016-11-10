//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//If we ever add study conditions, make sure to update the numbers so these two variations remain independent.
var studyCondition = userId%3 == 0 ? 'difference' : (userId%3==1 ? 'both' : 'onlyNew');
var presentationOrder = ((userId%6) / 3) == 0 ? ['states', 'airline'] : ['airline', 'states'];
var amountErrorValues = ['1', '100', '200', '500', '1000'];

function addVisualization(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	//TODO: bounds check this, include a default message when nagivating back.
	var visualizationLookingAt = presentationOrder[currentSeen];
	var visRecord = newLog.child(label + 'Vis' + (currentSeen+1)); //1-index for our own sanity
	newLog.child(label + "Seen").set(currentSeen);

	if(label == 'approximate') {
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
		if(label == 'precise') {
			currentSeen++; //increment the number we've seen
			localStorage.setItem(label + "Seen", currentSeen);
			newLog.child(label + "Seen").set(currentSeen);
			if(currentSeen >= presentationOrder.length) { //go to the next page after this visualization
				$("#nextPage").attr("href", 'precise_questions.html');
			}
		}
		$("#nextPage").removeClass("disabled");
	}, 1000);
}

function addQuestions(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));

	$('#form').submit(function(ev) {
		ev.preventDefault();

		currentSeen++; //increment the number we've seen
		localStorage.setItem(label + "Seen", currentSeen);
		newLog.child(label + "Seen").set(currentSeen);

		$.each($('#form').serializeArray(), function(j, field) {
			/*
			//var visIndex = field.name[field.name.length-1];
			var name = field.name;//.substring(0, field.name.length-1);
			var visRecord = newLog.child('preciseVis' + visIndex);
			visRecord.child(name).set(field.value);
			*/

		});

		if(currentSeen >= presentationOrder.length) {
			if(label == 'approximate') {
				window.location.href = 'precise.html';
			} else {
				window.location.href = 'thanks.html';
			}
		} else {
			window.location.href = label + '.html';
		}
	});
}
/*
function updateData(label) {
	var currentSeen = parseInt(localStorage.getItem(label + "Seen"));
	var statLookingAt = visualizationsArray[currentSeen];
	var visRecord = newLog.child(label + 'Vis' + (currentSeen+1)); //1-index for our own sanity
	$('.template-state').text(stateAbbreviationMap[visualizationsArray[currentSeen]]);
	//Update the database with how many visualizations the client claims to have seen.
	newLog.child(label + "Seen").set(currentSeen);

	// state image
	$('.image-state').attr('src', stateImages[statLookingAt])

	if(label == 'approximate') {
		var amountError = amountErrorValues[Math.floor(Math.random() * amountErrorValues.length)];
		var sequenceNumber = amountError == '1' ? '0' : Math.ceil(Math.random()*20).toString();

		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_" + amountError + "_" + sequenceNumber + ".png' width='600px'>");

		//Store error, sequence number, question parameters in database.
		visRecord.child('amountError').set(amountError);
		visRecord.child('sequenceNumber').set(sequenceNumber);
		console.log("Error amount: " + amountError);
		console.log("Sequence number: " + sequenceNumber);

		//Update questions
		var howMany = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		var howManyMore0 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		var howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		while(howManyMore0 == howManyMore1) { //TODO: could make this deterministic, but I'm lazy.
			howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		}
		//Store specific questions
		visRecord.child('howMany').set(howMany);
		visRecord.child('howManyMore0').set(howManyMore0);
		visRecord.child('howManyMore1').set(howManyMore1);
		//Update labels for questions
		$('#howMany, small > #howMany').text(howMany);
		$('#howManyMore0, small > #howManyMore0').text(howManyMore0);
		$('#howManyMore1, small > #howManyMore1').text(howManyMore1);

		$('#form').submit(function(ev) {
			ev.preventDefault();
			currentSeen++; //increment the number we've seen
			//TODO: some sort of sensible bounds checking?
			//If someone revisits approximate.html after finishing the approximate vis's, for example, it'll try to find a 4th one.
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
		//Precise is always fraction 1, sequence number 0.
		$('#visualization').prepend("<img src='data/images/" + visualizationsArray[currentSeen] + "_1_0.png' width='600px'>");

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

function generatePreciseQuestions() {
	for(var i = 1; i <= visualizationsArray.length; i++) {
		var statLookingAt = visualizationsArray[i-1];
		$('.template-state' + i).text(stateAbbreviationMap[statLookingAt]);

		var howMany = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		var howManyMore0 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		var howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		while(howManyMore0 == howManyMore1) { //TODO: could make this deterministic, but I'm lazy.
			howManyMore1 = airlinesByState[statLookingAt][Math.floor(Math.random()*airlinesByState[statLookingAt].length)];
		}
		var visRecord = newLog.child('preciseVis' + i);
		//Store specific questions
		visRecord.child('howMany' + i).set(howMany);
		visRecord.child('howManyMore0' + i).set(howManyMore0);
		visRecord.child('howManyMore1' + i).set(howManyMore1);
		//Update labels for questions
		$('#howMany' + i + ', small > #howMany' + i).text(howMany);
		$('#howManyMore0' + i + ', small > #howManyMore0' + i).text(howManyMore0);
		$('#howManyMore1' + i + ', small > #howManyMore1' + i).text(howManyMore1);
	}

	$('#form').submit(function(ev) {
		ev.preventDefault();

		//TODO: some sort of sensible bounds checking?
		//If someone revisits approximate.html after finishing the approximate vis's, for example, it'll try to find a 4th one.
		$.each($('#form').serializeArray(), function(j, field) {
			var visIndex = field.name[field.name.length-1];
			var name = field.name.substring(0, field.name.length-1);
			var visRecord = newLog.child('preciseVis' + visIndex);
			visRecord.child(name).set(field.value);
		});
	});
}
*/