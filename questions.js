function addBasicQuestions(form, visualizationLookingAt, comparisons) {
	if(visualizationLookingAt === 'airline') {
		addQuestion(form, visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there on ' + CARRIER_NAMES[focusAirline] + '?');
		addCompareQuestions(form, visualizationLookingAt, focusAirline, comparisons);
	} else { //states
		addQuestion(form, visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there out of ' + STATE_NAMES[focusState] + '?');
		addCompareQuestions(form, visualizationLookingAt, focusState, comparisons);
	}
}

function addCompareQuestions(form, visualizationLookingAt, focus, comparisons) {
	var options = getSelectOptions(visualizationLookingAt);
	var focusAmount = options[focus];
	delete options[focus];
	for(var i=0;i<comparisons;i++) {
		var compareOption = Object.keys(options)[pseudo_random(visualizationLookingAt + 'count' + label + i) % Object.keys(options).length];
		var compareText = visualizationLookingAt === 'airline' ? ('on ' + CARRIER_NAMES[focus] + ' than ' + CARRIER_NAMES[compareOption] + '?') : ('out of ' + STATE_NAMES[focus] + ' than ' + STATE_NAMES[compareOption] + '?');
		var subText = "<br><small>If there were fewer flights " + (visualizationLookingAt === 'airline' ? ('on ' + CARRIER_NAMES[focus]) : ('out of ' + STATE_NAMES[focus])) + ", enter the difference as a negative number.</small>";
		addQuestion(form, visualizationLookingAt, 'HowManyCompare_' + compareOption, 'number', 'About how many more flights were there ' + compareText + subText);
		delete options[compareOption];
	}
}

const promises = [];

function saveData(form, visualizationLookingAt) {
	$.each($(form).serializeArray(), function(j, field) { //Important assumption being utilized here: the confidence is always paired with each question.
		var confidenceName = field.name.split("+");
		var actualName = confidenceName[0].split("_");
		var visRecord = newLog.child(label + 'Vis_' + visualizationLookingAt).child(confidenceName[0]);
		if(confidenceName.length == 1) { //The actual question
			var type = actualName[0];
			promises.push(visRecord.child("type").set(type));
			if (actualName.length > 1) { //There's a data field to store
				promises.push(visRecord.child("data").set(actualName[1]));
			}
			if (type === "SelectAll") {
				promises.push(visRecord.child(field.value).set(true));
			} else {
				promises.push(visRecord.child("answer").set(field.value));
			}
		} else { //The confidence slider
			promises.push(visRecord.child("confidence").set(field.value));
		}
	});
}

function addFormLogic(visualizationLookingAt, destination) {
	var btn = (DEBUG ? '<input type="submit" class="btn btn-secondary value="Ignore" formnovalidate>' : '') + '<input type="submit" class="btn btn-primary" value="Submit answers">';
	
	if(visualizationLookingAt === 'precise') {
		$('.form1').submit(function(ev) {
			ev.preventDefault();
			newLog.child(label + 'Vis_' + presentationOrder[0]).remove();
			saveData('.form1', presentationOrder[0]);
		});
		$('.form2').append(btn).submit(function(ev) {
			ev.preventDefault();
			$('.form1').submit();

			newLog.child(label + 'Vis_' + presentationOrder[1]).remove();
			saveData('.form2', presentationOrder[1]);

			Promise.all(promises).then(function() {
				window.location.replace(destination);
			}).catch(function(err) {
				console.log('One or more sets failed:', err);
				visRecord.child("errors").push().set(err.toString());
				window.location.replace(destination);
			});
		});
	} else {
		$('.form').append(btn).submit(function(ev) {
			ev.preventDefault();
			newLog.child(label + 'Vis_' + visualizationLookingAt).remove();
			saveData('.form', visualizationLookingAt);

			Promise.all(promises).then(function() {
				window.location.replace(destination);
			}).catch(function(err) {
				console.log('One or more sets failed:', err);
				visRecord.child("errors").push().set(err.toString());
				window.location.replace(destination);
			});
		});
	}
}

function addApproximateQuestions() {
	addBasicQuestions('.form', presentationOrder[whichOne], 2);

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
	addQuestion('.form1', presentationOrder[0], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[0] + '?');
	addBasicQuestions('.form1', presentationOrder[0], 3);
	addQuestion('.form1', presentationOrder[0], 'SelectAll', 'checkbox', 'Select all ' + plural(presentationOrder[0]) + ' with flights in the dataset.');
	addQuestion('.form2', presentationOrder[1], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[1] + '?');
	addBasicQuestions('.form2', presentationOrder[1], 3);
	addQuestion('.form2', presentationOrder[1], 'SelectAll', 'checkbox', 'Select all ' + plural(presentationOrder[1]) + ' with flights in the dataset.');

	addFormLogic('precise', 'demographics.html');
}

function generateLikertString(questionName) {
	return "<div class='col-xs-12 likert-group'><label>How confident are you of your answer?</label><ul class='likert'>\
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

function addQuestion(form, visualizationLookingAt, questionName, questionType, questionText, data) {
	//questionName = visualizationLookingAt + '_' + questionName; //Ensure the question's name specifies which visualization it refers to.

	var preamble = "<div class='row questions'><div class='form-group col-xs-12'>";
	var confidenceSlider = generateLikertString(questionName + "+confidence");
	var postamble = "</div></div>";
	var question = "<label>" + questionText + "</label>";
	if(questionType == 'select') {
		var options = getAllOptions(visualizationLookingAt).sort();

		question += "<select class='form-control' name='" + questionName + "' required><option disabled selected value>--Select an option--</option>";
		question += options.map(function(m) {return "<option value=" + m + ">" + m + "</option>"}).join("\n");
		question += "</select>";
	} else if(questionType == 'number') {
		question += "<input type='number' class='form-control' name='" + questionName + "' required>";
	} else if(questionType == 'yesno') {
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='yes' name='" + questionName + "' required> Yes</label></div>";
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='no' name='" + questionName + "' required> No</label></div>";
	} else if(questionType == 'checkbox') {
		question += "<div class='form-check'>"
		var options = getAllOptions(visualizationLookingAt).sort(function(a, b) {return a.long.localeCompare(b.long)});
		question += options.map(function(m) {return "<label class='form-check-label'><input type='checkbox' class='form-check-input' name='" + questionName + "' value='" + m.short + "'> " + m.long + "</label>"}).join("<br>\n");
		question += "</div>"
	}
	$(form).append(preamble + question + confidenceSlider + postamble);
}