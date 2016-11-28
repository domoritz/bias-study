function addBasicQuestions(visualizationLookingAt) {
	if(visualizationLookingAt === 'airline') {
		addQuestion(visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there on ' + CARRIER_NAMES[focusAirline] + '?');
		addCompareQuestions(visualizationLookingAt, focusAirline, 2);
	} else { //states
		addQuestion(visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there out of ' + STATE_NAMES[focusState] + '?');
		addCompareQuestions(visualizationLookingAt, focusState, 2);
	}
}

function addCompareQuestions(visualizationLookingAt, focus, comparisons) {
	var options = getSelectOptions(visualizationLookingAt);
	var focusAmount = options[focus];
	delete options[focus];
	for(var i=0;i<comparisons;i++) {
		var compareOption = Object.keys(options)[pseudo_random(visualizationLookingAt + 'count' + label + i) % Object.keys(options).length];
		var moreOrLess = focusAmount >= options[compareOption] ? 'more' : 'fewer';
		var compareText = visualizationLookingAt === 'airline' ? ('on ' + CARRIER_NAMES[focus] + ' than ' + CARRIER_NAMES[compareOption] + '?') : ('out of ' + STATE_NAMES[focus] + ' than ' + STATE_NAMES[compareOption] + '?');
		addQuestion(visualizationLookingAt, 'HowManyCompare_' + compareOption, 'number', 'About how many ' + moreOrLess + ' flights were there ' + compareText);
		delete options[compareOption];
	}
}

function addFormLogic(visualizationLookingAt, destination) {
	var btn = (DEBUG ? '<input type="submit" class="btn btn-secondary value="Ignore" formnovalidate>' : '') + '<input type="submit" class="btn btn-primary" value="Submit answers">';
	
	$('#form').append(btn).submit(function(ev) {
		ev.preventDefault();

		$.each($('#form').serializeArray(), function(j, field) { //Important assumption being utilized here: the confidence is always paired with each question.
			var actualName = field.name.split("_");
			var visRecord = newLog.child(label + 'Vis_' + visualizationLookingAt).child(Math.floor(j/2));
			if(j%2 == 0) { //The actual question
				visRecord.child("type").set(actualName[0]);
				if(actualName.length > 1) { //There's a data field to store
					visRecord.child("data").set(actualName[1])
				}
				visRecord.child("answer").set(field.value);
			} else { //The confidence slider
				visRecord.child("confidence").set(field.value);
			}
		});

		window.location.replace(destination);
	});
}

function addApproximateQuestions() {
	addBasicQuestions(presentationOrder[whichOne]);

	if(whichOne == 1) {
		addFormLogic(presentationOrder[whichOne], 'precise_instructions.html');
	} else {
		addFormLogic(presentationOrder[whichOne], 'approximate_second.html');
	}
}

function addPreciseQuestions() {
	function plural(singular) {
		return (singular === 'airline') ? 'airlines' : 'states';
	}
	addQuestion(presentationOrder[0], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[0] + '?');
	addBasicQuestions(presentationOrder[0]);
	addQuestion(presentationOrder[0], 'SelectAll', 'checkbox', 'Select all ' + plural(presentationOrder[0]) + ' with flights in the dataset.');
	addQuestion(presentationOrder[1], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[1] + '?');
	addBasicQuestions(presentationOrder[1]);
<<<<<<< HEAD
	addFormLogic('precise', 'demographics.html');
=======
	addQuestion(presentationOrder[1], 'SelectAll', 'checkbox', 'Select all ' + plural(presentationOrder[1]) + ' with flights in the dataset.');
	addFormLogic('thanks.html');
>>>>>>> a2bd0fc8041dd10d2a9511085826bdcd6697d666
}

function generateLikertString(questionName) {
	return "<div class='col-md-12 likert-group'><label>How confident are you of your answer?</label><ul class='likert'>\
       <li>\
        <input type='radio' name='" + questionName + "' value='strong_disagree' required>\
        <label>Not at All Confident</label>\
      </li>\
			<li>\
        <input type='radio' name='" + questionName + "' value='disagree' required>\
        <label>Somewhat Not Confident</label>\
      </li>\
			<li>\
        <input type='radio' name='" + questionName + "' value='weak_disagree' required>\
        <label>Slightly Not Confident</label>\
      </li>\
      <li>\
        <input type='radio' name='" + questionName + "' value='neutral' required>\
        <label>Neutral</label>\
      </li>\
      <li>\
        <input type='radio' name='" + questionName + "' value='weak_agree' required>\
        <label>Slightly Confident</label>\
      </li>\
			<li>\
        <input type='radio' name='" + questionName + "' value='agree' required>\
        <label>Somewhat Confident</label>\
      </li>\
			<li>\
        <input type='radio' name='" + questionName + "' value='strong_agree' required>\
        <label>Very Confident</label>\
      </li>\
    </ul></div>";
}

function addQuestion(visualizationLookingAt, questionName, questionType, questionText, data) {
	//questionName = visualizationLookingAt + '_' + questionName; //Ensure the question's name specifies which visualization it refers to.

	var preamble = "<div class='row questions'><div class='form-group col-md-12'>";
	var confidenceSlider = generateLikertString("confidence" + questionName);
	var postamble = "</div></div>";
	var question = "<label>" + questionText + "</label>";
	if(questionType == 'select') {
		var options = getAllOptions(visualizationLookingAt).sort();

		question += "<select class='form-control' name='" + questionName + "' required><option disabled selected value>--Select an option--</option>";
		question += options.map(function(m) {return "<option value=" + m + ">" + m + "</option>"}).join("\n");
		question += "</select>";
	} else if(questionType == 'number') { //TODO: consider bounds checking this.
		question += "<input type='number' class='form-control' min='0' name='" + questionName + "' required>";
	} else if(questionType == 'yesno') {
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='yes' name='" + questionName + "' required> Yes</label></div>";
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='no' name='" + questionName + "' required> No</label></div>";
	} else if(questionType == 'checkbox') {
		question += "<div class='form-check'>"
		var options = getAllOptions(visualizationLookingAt).sort();
		question += options.map(function(m) {return "<label class='form-check-label'><input type='checkbox' class='form-check-input' name='" + questionName + "' required value='" + m + "'> " + m + "</label>"}).join("<br>\n");
		question += "</div>"
	}
	$('#form').append(preamble + question + confidenceSlider + postamble);
}