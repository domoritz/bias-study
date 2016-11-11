//Generate all permutations of the visualization order, select by userID (which is effectively "random")
//If we ever add study conditions, make sure to update the numbers so these two variations remain independent.
var studyCondition = userId%3 == 0 ? 'difference' : (userId%3==1 ? 'both' : 'onlyNew');
var presentationOrder = ((userId%6) / 3) == 0 ? ['states', 'airline'] : ['airline', 'states'];
var selectOptions = {'airline': ['American', 'Delta', 'ExpressJet', 'Hawaiian', 'JetBlue', 'SkyWest', 'Spirit', 'Southwest', 'United', 'Virgin'], 'states': ['Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'Illinois', 'Nevada', 'New York', 'Texas', 'Washington']};

function addBasicQuestions(visualizationLookingAt) {
	var howManyOption = selectOptions[visualizationLookingAt][Math.floor(Math.random()*selectOptions[visualizationLookingAt].length)];

	if(visualizationLookingAt == 'airline') {
		addQuestion(visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there on ' + howManyOption + '?');
		addQuestion(visualizationLookingAt, 'MostPopular', 'select', 'Which airline had the most flights in the dataset?');
	} else { //states
		addQuestion(visualizationLookingAt, 'HowMany', 'number', 'About how many flights were there out of ' + howManyOption + '?');
		addQuestion(visualizationLookingAt, 'MostPopular', 'select', 'Which state had the most flights in the dataset?');
	}
}

function addFormLogic(label, destination) {
	$('#form').submit(function(ev) {
		ev.preventDefault();

		$.each($('#form').serializeArray(), function(j, field) {
			var questionName = field.name.split("_");
			var visRecord = newLog.child(label + 'Vis_' + questionName[0]);
			visRecord.child(questionName[1]).set(field.value);
		});

		window.location.href = destination;
	});
}

function addApproximateQuestions() {
	var currentSeen = parseInt(localStorage.getItem("approximateSeen")) - 1;
	addBasicQuestions(presentationOrder[currentSeen]);

	if(currentSeen>=presentationOrder.length - 1) {
		addFormLogic('precise.html');
	} else {
		addFormLogic('approximate', 'approximate.html');
	}
}

function addPreciseQuestions() {
	//TODO: figure out what order to put these questions in? Currently reverse order because prepending, but that's a hack.
	addBasicQuestions(presentationOrder[1]);
	addQuestion(presentationOrder[1], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[1] + '?');
	addBasicQuestions(presentationOrder[0]);
	addQuestion(presentationOrder[0], 'DidYouNotice', 'yesno', 'Was there a difference between the precise and approximate visualization for ' + presentationOrder[0] + '?');
	addFormLogic('precise', 'thanks.html');
}

function addQuestion(visualizationLookingAt, questionName, questionType, questionText) {
	questionName = visualizationLookingAt + '_' + questionName; //Ensure the question's name specifies which visualization it refers to.

	var preamble = "<div class='row'><div class='form-group col-md-12'>";
	var confidenceSlider = "<div class='form-group col-md-12'><label>How confident are you?<br/><small>I don't remember</small><input type='range' name='confidence" + questionName + "' min='0' max='100' value='50'/><small>I'm certain</small></label></div>";
	var postamble = "</div></div>";
	var question = "<label>" + questionText + "</label>";
	if(questionType == 'select') {
		question += "<select class='form-control' name='" + questionName + "' required><option disabled selected value>--Select an option--</option>";
		question += selectOptions[visualizationLookingAt].map(function(m) {return "<option value=" + m + ">" + m + "</option>"}).join("\n");
		question += "</select>";
	} else if(questionType == 'number') { //TODO: consider bounds checking this.
		question += "<input type='number' class='form-control' name='" + questionName + "' required>";
	} else if(questionType == 'yesno') {
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='yes' name='" + questionName + "' required>Yes</label></div>";
		question += "<div class='form-check'><label class='form-check-label'><input type='radio' class='form-check-input' value='no' name='" + questionName + "' required>No</label></div>";
	}
	$('#form').prepend(preamble + question + confidenceSlider + postamble);
}