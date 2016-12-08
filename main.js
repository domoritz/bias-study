var config = {
    apiKey: "AIzaSyA1sf5JPIRkH9MEMjjZ0zcLvuYw3svfWps",
    authDomain: "bias-study.firebaseapp.com",
    databaseURL: "https://bias-study.firebaseio.com",
    storageBucket: "bias-study.appspot.com",
    messagingSenderId: "452394401835"
};

firebase.initializeApp(config);

// connect to db
var database = firebase.database();

if(!localStorage.getItem("userId")) {
	localStorage.setItem("userId", Math.floor(Math.random() * 10e7).toString());
}

// user id defined namespace
// https://bias-study.firebaseio.com/logs/$userId
var userId = localStorage.getItem("userId");
var newLog = database.ref("logs").child(userId);

var DEBUG = location.hostname === "localhost" || location.hostname === "127.0.0.1";

if(!DEBUG) { //Disable console output when running on server
    console.log = function() {};
}

var amountErrorValues = [1, 100, 200, 500, 1000];
var stateOptions = ['NY', 'FL', 'MA'];
var airlineOptions = ['DL', 'B6', 'AA'];

//Generate all permutations of the visualization order, select by userID (which is effectively "random")
var cond = pseudo_random('condition') % 3;
var studyCondition = cond === 0 ? 'difference' : (cond === 1 ? 'both' : 'onlyNew');
var presentationOrder = pseudo_random('presentation_order') % 2 == 0 ? ['states', 'airline'] : ['airline', 'states'];
var focusState = stateOptions[pseudo_random('focus_state') % 3];
var focusAirline = airlineOptions[pseudo_random('focus_airline') % 3];

function getError(visualizationLookingAt) {
    return amountErrorValues[pseudo_random(visualizationLookingAt + 'AmountError') % amountErrorValues.length];
}

function getSequence(visualizationLookingAt) {
    if(getError(visualizationLookingAt) == 1) {
        return 1;
    }
    return 2 + pseudo_random(visualizationLookingAt + 'SequenceNumber') % 19;
}

function addFocusStateAndAirline() {
    $('.airline').html(CARRIER_NAMES[focusAirline]);
    $('.state').html(STATE_NAMES[focusState]);
}

console.log("ID:", userId);
console.log("condition:", studyCondition);
console.log("order:", presentationOrder);
console.log("focus state:", focusState);
console.log("focus airline:", focusAirline);
console.log("error airline:", getError('airline'));
console.log("error states:", getError('states'));
console.log("seq airline:", getSequence('airline'));
console.log("seq states:", getSequence('states'));

newLog.child('userAgent').set(window.navigator.userAgent);

var condition = newLog.child("cond").set({
    studyCondition: studyCondition,
    firstCondition: presentationOrder[0],
    secondCondition: presentationOrder[1],
    focusState: focusState,
    focusAirline: focusAirline,
    errorAirline: getError('airline'),
    errorStates: getError('states'),
    seqAirline: getSequence('airline'),
    seqStates: getSequence('states'),
});

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

newLog.child('isMobile').set(window.mobilecheck());

// all airlines or states
var allOptions = {
    'airline': ['DL','B6','AA','WN','EV','UA','VX','OO', 'AS'],
    'states': ['NY','FL','MA','CA','VA','PR','NJ','TX','GA','IL']
};

// the actual data
var airlinesData = {"1000_20": {"AA": 2000, "UA": 2000, "DL": 4000, "B6": 5000, "EV": 3000, "WN": 3000}, "10_18": {"AA": 4070, "UA": 580, "DL": 5260, "B6": 5330, "EV": 1800, "WN": 2080, "VX": 130}, "100_21": {"AA": 4300, "UA": 600, "DL": 4900, "B6": 5100, "EV": 1900, "WN": 2300, "VX": 200}, "200_11": {"AA": 4400, "UA": 400, "DL": 6000, "B6": 4800, "EV": 2600, "WN": 800, "VX": 200}, "1000_4": {"AA": 5000, "UA": 1000, "DL": 4000, "B6": 4000, "EV": 2000, "WN": 2000, "VX": 1000}, "200_2": {"AA": 4600, "UA": 600, "DL": 5800, "B6": 5000, "EV": 1200, "WN": 2000}, "100_2": {"AA": 4900, "UA": 700, "DL": 5100, "B6": 4100, "EV": 2200, "WN": 2100, "VX": 200}, "200_19": {"AA": 3200, "UA": 800, "DL": 4400, "B6": 7200, "EV": 2000, "WN": 1400, "VX": 200}, "10_6": {"AA": 4110, "UA": 570, "DL": 4970, "B6": 5270, "EV": 1840, "WN": 2360, "VX": 130}, "1000_21": {"AA": 6000, "UA": 1000, "DL": 1000, "B6": 5000, "EV": 1000, "WN": 5000}, "10_9": {"AA": 4340, "UA": 570, "DL": 5210, "B6": 4880, "EV": 2000, "WN": 2060, "VX": 190}, "500_3": {"AA": 5000, "UA": 1000, "DL": 4500, "B6": 5000, "EV": 2500, "WN": 1000, "VX": 500}, "10_21": {"AA": 4270, "UA": 690, "DL": 5070, "B6": 4940, "EV": 1950, "WN": 2160, "VX": 170}, "200_13": {"AA": 5000, "UA": 800, "DL": 5000, "B6": 4800, "EV": 1000, "WN": 2400, "VX": 200}, "10_10": {"AA": 4120, "UA": 530, "DL": 5190, "B6": 5140, "EV": 2020, "WN": 2170, "VX": 80}, "10_14": {"AA": 3980, "UA": 640, "DL": 5050, "B6": 5100, "EV": 2120, "WN": 2190, "VX": 170}, "500_20": {"AA": 6000, "DL": 3000, "B6": 7500, "EV": 1000, "WN": 2000}, "200_10": {"AA": 2800, "UA": 800, "DL": 4200, "B6": 5800, "EV": 2400, "WN": 3200}, "500_10": {"AA": 5000, "UA": 1000, "DL": 5500, "B6": 4500, "EV": 2000, "WN": 1500}, "1000_11": {"AA": 2000, "UA": 1000, "DL": 5000, "B6": 3000, "EV": 4000, "WN": 3000, "VX": 1000}, "100_4": {"AA": 4100, "UA": 400, "DL": 5700, "B6": 4500, "EV": 2100, "WN": 2400, "VX": 100}, "1000_16": {"AA": 2000, "UA": 1000, "DL": 3000, "B6": 5000, "EV": 4000, "WN": 4000}, "500_2": {"AA": 5000, "UA": 1500, "DL": 6000, "B6": 3500, "EV": 2500, "WN": 1000}, "10_15": {"AA": 4150, "UA": 590, "DL": 5100, "B6": 5000, "EV": 2120, "WN": 2070, "VX": 220}, "1000_10": {"AA": 4000, "UA": 4000, "DL": 3000, "B6": 5000, "EV": 1000, "WN": 2000}, "10_7": {"AA": 3960, "UA": 550, "DL": 5040, "B6": 5300, "EV": 2150, "WN": 2050, "VX": 200}, "10_5": {"AA": 4020, "UA": 520, "DL": 5270, "B6": 5470, "EV": 1990, "WN": 1870, "VX": 110}, "200_20": {"AA": 4600, "UA": 600, "DL": 4400, "B6": 6000, "EV": 1400, "WN": 2200}, "500_6": {"AA": 5000, "UA": 1500, "DL": 5000, "B6": 5000, "EV": 2000, "WN": 500, "VX": 500}, "1000_17": {"AA": 5000, "UA": 1000, "DL": 5000, "B6": 5000, "EV": 2000, "WN": 1000}, "500_15": {"AA": 5500, "UA": 1000, "DL": 6500, "B6": 4000, "EV": 1500, "WN": 1000}, "500_14": {"AA": 3500, "DL": 5500, "B6": 5500, "EV": 2000, "WN": 2500, "VX": 500}, "10_8": {"AA": 4180, "UA": 620, "DL": 4920, "B6": 5210, "EV": 2120, "WN": 2070, "VX": 130}, "200_12": {"AA": 4800, "UA": 200, "DL": 4800, "B6": 4200, "EV": 2600, "WN": 2400, "VX": 200}, "200_4": {"AA": 5200, "UA": 600, "DL": 5200, "B6": 4400, "EV": 2200, "WN": 1600}, "1000_13": {"AA": 4000, "DL": 4000, "B6": 6000, "EV": 1000, "WN": 4000}, "500_17": {"AA": 6000, "UA": 1500, "DL": 4500, "B6": 3000, "EV": 2000, "WN": 2500}, "500_9": {"AA": 4000, "DL": 4500, "B6": 7500, "EV": 1000, "WN": 2000, "VX": 500}, "1000_2": {"AA": 3000, "DL": 9000, "B6": 3000, "EV": 2000, "WN": 2000}, "100_10": {"AA": 4300, "UA": 300, "DL": 4700, "B6": 6200, "EV": 1600, "WN": 2100, "VX": 100}, "500_8": {"AA": 3500, "DL": 4500, "B6": 8000, "EV": 2000, "WN": 1500}, "10_12": {"AA": 4450, "UA": 570, "DL": 5230, "B6": 4800, "EV": 1990, "WN": 2030, "VX": 180}, "100_5": {"AA": 5500, "UA": 700, "DL": 4500, "B6": 4000, "EV": 1900, "WN": 2500, "VX": 200}, "200_14": {"AA": 3600, "UA": 200, "DL": 5600, "B6": 5200, "EV": 2600, "WN": 1800, "VX": 200}, "500_13": {"AA": 4500, "UA": 1500, "DL": 5000, "B6": 3000, "EV": 3000, "WN": 2000, "VX": 500}, "200_3": {"AA": 4600, "UA": 400, "DL": 5000, "B6": 4000, "EV": 2200, "WN": 3000}, "10_17": {"AA": 3830, "UA": 580, "DL": 5420, "B6": 4990, "EV": 1900, "WN": 2410, "VX": 120}, "1_0": {"AA": 4088, "UA": 583, "DL": 5163, "B6": 5113, "EV": 1998, "WN": 2155, "VX": 153}, "100_17": {"AA": 3800, "UA": 500, "DL": 4700, "B6": 4600, "EV": 2000, "WN": 3600, "VX": 100}, "500_5": {"AA": 4000, "UA": 1000, "DL": 2500, "B6": 6500, "EV": 2000, "WN": 3500}, "100_15": {"AA": 3600, "UA": 300, "DL": 4800, "B6": 5700, "EV": 2300, "WN": 2300, "VX": 300}, "1_1": {"AA": 4088, "UA": 583, "DL": 5163, "B6": 5113, "EV": 1998, "WN": 2155, "VX": 153}, "100_12": {"AA": 5300, "UA": 800, "DL": 5000, "B6": 4700, "EV": 1600, "WN": 1900}, "10_11": {"AA": 4040, "UA": 570, "DL": 5060, "B6": 5350, "EV": 2010, "WN": 2060, "VX": 160}, "100_3": {"AA": 4900, "UA": 600, "DL": 5100, "B6": 4300, "EV": 2200, "WN": 1800, "VX": 400}, "200_21": {"AA": 4400, "UA": 400, "DL": 5200, "B6": 5200, "EV": 2200, "WN": 1800}, "200_5": {"AA": 4000, "UA": 800, "DL": 4600, "B6": 5000, "EV": 2400, "WN": 2400}, "200_18": {"AA": 4400, "UA": 200, "DL": 5600, "B6": 5000, "EV": 2200, "WN": 1800}, "10_20": {"AA": 4080, "UA": 640, "DL": 5160, "B6": 5320, "EV": 1830, "WN": 2140, "VX": 80}, "200_17": {"AA": 4000, "UA": 600, "DL": 4000, "B6": 6800, "EV": 2400, "WN": 1400}, "100_7": {"AA": 3800, "UA": 600, "DL": 4700, "B6": 5800, "EV": 1500, "WN": 2800, "VX": 100}, "200_9": {"AA": 3600, "UA": 600, "DL": 6000, "B6": 5800, "EV": 1800, "WN": 1400}, "500_16": {"AA": 4500, "UA": 1500, "DL": 4500, "B6": 5500, "EV": 2000, "WN": 1500}, "200_6": {"AA": 4000, "UA": 400, "DL": 5000, "B6": 4200, "EV": 2800, "WN": 2600, "VX": 200}, "100_16": {"AA": 3600, "UA": 800, "DL": 5800, "B6": 5300, "EV": 1900, "WN": 1800, "VX": 100}, "200_16": {"AA": 5600, "UA": 800, "DL": 3800, "B6": 4400, "EV": 1800, "WN": 2600, "VX": 200}, "1000_19": {"AA": 1000, "DL": 4000, "B6": 9000, "EV": 3000, "WN": 2000}, "10_19": {"AA": 4230, "UA": 590, "DL": 4650, "B6": 5270, "EV": 2000, "WN": 2340, "VX": 170}, "1000_3": {"AA": 1000, "UA": 1000, "DL": 11000, "B6": 2000, "EV": 3000, "WN": 1000}, "100_18": {"AA": 3800, "UA": 700, "DL": 4800, "B6": 5200, "EV": 2400, "WN": 2300, "VX": 100}, "500_4": {"AA": 2500, "UA": 1000, "DL": 5500, "B6": 5000, "EV": 1500, "WN": 4000}, "10_16": {"AA": 3960, "UA": 510, "DL": 5400, "B6": 4880, "EV": 2000, "WN": 2340, "VX": 160}, "1000_7": {"AA": 5000, "DL": 4000, "B6": 3000, "EV": 3000, "WN": 4000}, "100_14": {"AA": 4100, "UA": 600, "DL": 5200, "B6": 5500, "EV": 1900, "WN": 1900, "VX": 100}, "500_11": {"AA": 5500, "DL": 4500, "B6": 6000, "EV": 1000, "WN": 2000, "VX": 500}, "10_2": {"AA": 4210, "UA": 600, "DL": 5250, "B6": 4820, "EV": 2140, "WN": 2040, "VX": 190}, "1000_9": {"AA": 4000, "UA": 2000, "DL": 6000, "B6": 4000, "EV": 2000, "WN": 1000}, "200_15": {"AA": 3800, "UA": 600, "DL": 5400, "B6": 4000, "EV": 2400, "WN": 3000}, "1000_14": {"AA": 5000, "DL": 1000, "B6": 8000, "WN": 5000}, "100_13": {"AA": 3600, "UA": 800, "DL": 5100, "B6": 5500, "EV": 2600, "WN": 1600, "VX": 100}, "100_11": {"AA": 4400, "UA": 500, "DL": 4600, "B6": 5400, "EV": 2500, "WN": 1700, "VX": 200}, "100_19": {"AA": 4400, "UA": 400, "DL": 5200, "B6": 5600, "EV": 1800, "WN": 1900}, "10_4": {"AA": 4400, "UA": 570, "DL": 4860, "B6": 5370, "EV": 1800, "WN": 2040, "VX": 210}, "200_7": {"AA": 2600, "UA": 400, "DL": 5200, "B6": 5400, "EV": 3600, "WN": 2000}, "1000_15": {"AA": 3000, "DL": 9000, "B6": 4000, "EV": 1000, "WN": 2000}, "500_19": {"AA": 5000, "UA": 500, "DL": 3500, "B6": 7000, "EV": 1500, "WN": 2000}, "500_21": {"AA": 7500, "UA": 1000, "DL": 3000, "B6": 5000, "EV": 1500, "WN": 1000, "VX": 500}, "1000_12": {"AA": 5000, "UA": 1000, "DL": 6000, "B6": 7000}, "100_20": {"AA": 4000, "UA": 700, "DL": 4900, "B6": 4400, "EV": 2900, "WN": 2300, "VX": 100}, "100_6": {"AA": 4300, "UA": 400, "DL": 5400, "B6": 5200, "EV": 1700, "WN": 2200, "VX": 100}, "10_3": {"AA": 4030, "UA": 620, "DL": 5070, "B6": 5260, "EV": 1980, "WN": 2120, "VX": 170}, "1000_18": {"AA": 3000, "DL": 2000, "B6": 10000, "EV": 2000, "WN": 1000, "VX": 1000}, "500_7": {"AA": 1000, "UA": 500, "DL": 7000, "B6": 6000, "EV": 2000, "WN": 2500, "VX": 500}, "100_9": {"AA": 4000, "UA": 100, "DL": 5000, "B6": 5700, "EV": 2100, "WN": 2300, "VX": 100}, "1000_6": {"AA": 1000, "UA": 2000, "DL": 6000, "B6": 5000, "EV": 3000, "WN": 2000}, "200_8": {"AA": 4200, "UA": 200, "DL": 5600, "B6": 4800, "EV": 2200, "WN": 2000, "VX": 200}, "1000_8": {"AA": 6000, "UA": 1000, "DL": 4000, "B6": 3000, "EV": 3000, "WN": 1000, "VX": 1000}, "1000_5": {"AA": 6000, "UA": 2000, "DL": 5000, "B6": 3000, "EV": 1000, "WN": 2000}, "500_12": {"AA": 3500, "DL": 7500, "B6": 5500, "EV": 1000, "WN": 1500, "VX": 500}, "100_8": {"AA": 3700, "UA": 1000, "DL": 5500, "B6": 5900, "EV": 1400, "WN": 1700, "VX": 100}, "10_13": {"AA": 3760, "UA": 620, "DL": 5470, "B6": 5150, "EV": 2020, "WN": 2000, "VX": 230}, "500_18": {"AA": 3000, "DL": 6500, "B6": 5500, "EV": 1500, "WN": 3000}}

var statesData = {"1000_20": {"VA": 2000, "PR": 2000, "FL": 3000, "CA": 1000, "NY": 5000, "MA": 4000, "NJ": 1000}, "10_18": {"VA": 850, "PR": 800, "FL": 5240, "CA": 1820, "NY": 5120, "MA": 4060, "NJ": 230}, "100_21": {"VA": 1300, "PR": 800, "FL": 5100, "CA": 1800, "NY": 5000, "MA": 4000, "NJ": 100}, "200_11": {"VA": 400, "PR": 1400, "FL": 4800, "CA": 800, "NY": 5800, "MA": 4400, "NJ": 600}, "1000_4": {"VA": 2000, "FL": 4000, "CA": 1000, "NY": 5000, "MA": 5000, "NJ": 1000}, "200_2": {"VA": 600, "PR": 400, "FL": 4800, "CA": 2000, "NY": 6000, "MA": 4400}, "100_2": {"VA": 1100, "PR": 1200, "FL": 4100, "CA": 1900, "NY": 4900, "MA": 4400, "NJ": 500}, "200_19": {"VA": 1000, "PR": 800, "FL": 6600, "CA": 1000, "NY": 4400, "MA": 4000, "NJ": 400}, "10_6": {"VA": 1050, "PR": 850, "FL": 5070, "CA": 2000, "NY": 4950, "MA": 3950, "NJ": 250}, "1000_21": {"VA": 2000, "PR": 1000, "FL": 4000, "CA": 4000, "NY": 1000, "MA": 6000}, "10_9": {"VA": 890, "PR": 990, "FL": 4730, "CA": 1950, "NY": 5120, "MA": 4120, "NJ": 320}, "500_3": {"VA": 500, "PR": 1500, "FL": 5000, "CA": 2000, "NY": 4500, "MA": 4000, "NJ": 500}, "10_21": {"VA": 1010, "PR": 940, "FL": 4750, "CA": 1900, "NY": 5090, "MA": 4060, "NJ": 370}, "200_13": {"VA": 800, "PR": 600, "FL": 5000, "CA": 2200, "NY": 4800, "MA": 4600, "NJ": 200}, "10_10": {"VA": 1050, "PR": 930, "FL": 4920, "CA": 1820, "NY": 5090, "MA": 3910, "NJ": 400}, "10_14": {"VA": 970, "PR": 1030, "FL": 5040, "CA": 1940, "NY": 4940, "MA": 3880, "NJ": 320}, "500_20": {"VA": 500, "PR": 500, "FL": 6000, "CA": 2000, "NY": 3000, "MA": 6000}, "200_10": {"VA": 1000, "PR": 800, "FL": 5800, "CA": 2600, "NY": 4200, "MA": 3200, "NJ": 600}, "500_10": {"VA": 500, "FL": 4500, "CA": 2000, "NY": 5500, "MA": 4500, "NJ": 1000}, "1000_11": {"VA": 3000, "FL": 3000, "CA": 3000, "NY": 6000, "MA": 2000, "NJ": 1000}, "100_4": {"VA": 800, "PR": 900, "FL": 4600, "CA": 2400, "NY": 5300, "MA": 3700, "NJ": 400}, "1000_16": {"VA": 2000, "PR": 1000, "FL": 5000, "CA": 4000, "NY": 3000, "MA": 2000, "NJ": 1000}, "500_2": {"VA": 1000, "PR": 1000, "FL": 3000, "CA": 500, "NY": 6000, "MA": 5500, "NJ": 1000}, "10_15": {"VA": 1000, "PR": 1060, "FL": 4870, "CA": 1950, "NY": 5080, "MA": 3870, "NJ": 290}, "1000_10": {"FL": 8000, "CA": 3000, "NY": 4000, "MA": 3000}, "10_7": {"VA": 980, "PR": 1020, "FL": 5130, "CA": 1770, "NY": 4990, "MA": 3910, "NJ": 320}, "10_5": {"VA": 800, "PR": 940, "FL": 5370, "CA": 1700, "NY": 5140, "MA": 3830, "NJ": 340}, "200_20": {"VA": 600, "PR": 400, "FL": 6000, "CA": 1800, "NY": 4400, "MA": 4600, "NJ": 400}, "500_6": {"VA": 1500, "PR": 1500, "FL": 5000, "NY": 5000, "MA": 5000}, "1000_17": {"PR": 2000, "FL": 5000, "CA": 1000, "NY": 5000, "MA": 5000}, "500_15": {"PR": 1000, "FL": 4000, "CA": 1500, "NY": 6000, "MA": 5000, "NJ": 500}, "500_14": {"VA": 1000, "PR": 1500, "FL": 5000, "CA": 2500, "NY": 5000, "MA": 3000}, "10_8": {"VA": 960, "PR": 990, "FL": 5110, "CA": 1770, "NY": 4880, "MA": 4060, "NJ": 350}, "200_12": {"VA": 1000, "PR": 800, "FL": 4400, "CA": 2600, "NY": 4600, "MA": 4400, "NJ": 400}, "200_4": {"VA": 800, "PR": 1200, "FL": 4200, "CA": 2000, "NY": 5000, "MA": 4600, "NJ": 400}, "1000_13": {"VA": 1000, "PR": 1000, "FL": 4000, "CA": 4000, "NY": 4000, "MA": 4000}, "500_17": {"VA": 1500, "PR": 1000, "FL": 3000, "CA": 2500, "NY": 4500, "MA": 5500}, "500_9": {"VA": 500, "PR": 500, "FL": 7000, "CA": 2000, "NY": 4500, "MA": 3500}, "1000_2": {"PR": 1000, "FL": 3000, "CA": 3000, "NY": 9000, "MA": 2000}, "100_10": {"VA": 1000, "PR": 900, "FL": 5800, "CA": 1500, "NY": 4300, "MA": 4400, "NJ": 200}, "500_8": {"VA": 1000, "PR": 500, "FL": 7000, "CA": 1500, "NY": 4000, "MA": 3500, "NJ": 500}, "10_12": {"VA": 1000, "PR": 970, "FL": 4610, "CA": 1760, "NY": 5180, "MA": 4290, "NJ": 310}, "100_5": {"VA": 1500, "PR": 900, "FL": 4000, "CA": 1900, "NY": 4300, "MA": 5300, "NJ": 200}, "200_14": {"VA": 200, "PR": 1800, "FL": 4800, "CA": 2400, "NY": 5600, "MA": 3200, "NJ": 200}, "500_13": {"VA": 2000, "PR": 1000, "FL": 3500, "CA": 1500, "NY": 5500, "MA": 4000, "NJ": 500}, "200_3": {"VA": 1400, "PR": 1400, "FL": 3800, "CA": 2400, "NY": 4800, "MA": 4400}, "10_17": {"VA": 1000, "PR": 970, "FL": 4910, "CA": 2000, "NY": 5310, "MA": 3680, "NJ": 250}, "1_0": {"VA": 961, "PR": 950, "FL": 4986, "CA": 1887, "NY": 5085, "MA": 3928, "NJ": 327}, "100_17": {"VA": 1400, "PR": 900, "FL": 4700, "CA": 2400, "NY": 4700, "MA": 3800, "NJ": 200}, "500_5": {"VA": 2500, "PR": 500, "FL": 7000, "CA": 1500, "NY": 2000, "MA": 4000, "NJ": 500}, "100_15": {"VA": 1000, "PR": 1200, "FL": 5400, "CA": 2200, "NY": 4800, "MA": 3000, "NJ": 500}, "1_1": {"VA": 961, "PR": 950, "FL": 4986, "CA": 1887, "NY": 5085, "MA": 3928, "NJ": 327}, "100_12": {"VA": 800, "PR": 600, "FL": 4400, "CA": 1700, "NY": 4900, "MA": 5300, "NJ": 400}, "10_11": {"VA": 960, "PR": 950, "FL": 5080, "CA": 1790, "NY": 5010, "MA": 3960, "NJ": 370}, "100_3": {"VA": 1100, "PR": 1100, "FL": 4300, "CA": 1700, "NY": 5000, "MA": 4600, "NJ": 300}, "200_21": {"VA": 1000, "PR": 1200, "FL": 5400, "CA": 1600, "NY": 5000, "MA": 3800, "NJ": 200}, "200_5": {"VA": 1600, "PR": 1400, "FL": 4800, "CA": 1400, "NY": 4600, "MA": 4000, "NJ": 400}, "200_18": {"VA": 400, "PR": 1400, "FL": 4800, "CA": 2200, "NY": 5600, "MA": 3400, "NJ": 400}, "10_20": {"VA": 880, "PR": 910, "FL": 5170, "CA": 1730, "NY": 5070, "MA": 4050, "NJ": 310}, "200_17": {"VA": 800, "PR": 1200, "FL": 6400, "CA": 1400, "NY": 3800, "MA": 4200, "NJ": 400}, "100_7": {"VA": 1200, "PR": 1300, "FL": 5700, "CA": 1700, "NY": 4500, "MA": 3600, "NJ": 100}, "200_9": {"VA": 800, "PR": 1200, "FL": 6000, "CA": 800, "NY": 5400, "MA": 3600, "NJ": 400}, "500_16": {"VA": 1000, "PR": 1000, "FL": 5000, "CA": 2000, "NY": 4500, "MA": 4000, "NJ": 500}, "200_6": {"VA": 1000, "PR": 1000, "FL": 4600, "CA": 2200, "NY": 5200, "MA": 4200}, "100_16": {"VA": 900, "PR": 1200, "FL": 5200, "CA": 1600, "NY": 5700, "MA": 3500}, "200_16": {"VA": 1000, "PR": 1000, "FL": 4400, "CA": 2400, "NY": 4000, "MA": 5400}, "1000_19": {"VA": 2000, "FL": 9000, "CA": 1000, "NY": 4000, "MA": 1000, "NJ": 1000}, "10_19": {"VA": 1220, "PR": 960, "FL": 5060, "CA": 1880, "NY": 4600, "MA": 4100, "NJ": 300}, "1000_3": {"PR": 2000, "FL": 2000, "CA": 1000, "NY": 11000, "MA": 1000, "NJ": 1000}, "100_18": {"VA": 1100, "PR": 1500, "FL": 4700, "CA": 1900, "NY": 4800, "MA": 3700, "NJ": 400}, "500_4": {"VA": 1500, "PR": 1000, "FL": 5500, "CA": 3000, "NY": 5000, "MA": 2000}, "10_16": {"VA": 1040, "PR": 910, "FL": 4750, "CA": 2100, "NY": 5320, "MA": 3700, "NJ": 300}, "1000_7": {"VA": 1000, "PR": 3000, "FL": 3000, "CA": 2000, "NY": 4000, "MA": 5000}, "100_14": {"VA": 900, "PR": 700, "FL": 5400, "CA": 1800, "NY": 5100, "MA": 3800, "NJ": 400}, "500_11": {"VA": 500, "PR": 500, "FL": 6000, "CA": 1000, "NY": 4500, "MA": 5500}, "10_2": {"VA": 980, "PR": 1010, "FL": 4780, "CA": 1800, "NY": 5220, "MA": 3990, "NJ": 340}, "1000_9": {"PR": 1000, "FL": 5000, "CA": 2000, "NY": 6000, "MA": 4000}, "200_15": {"VA": 1200, "PR": 1200, "FL": 4000, "CA": 2200, "NY": 5600, "MA": 3800, "NJ": 200}, "1000_14": {"VA": 2000, "FL": 8000, "CA": 3000, "NY": 1000, "MA": 4000}, "100_13": {"VA": 900, "PR": 1000, "FL": 5300, "CA": 1500, "NY": 4900, "MA": 3900, "NJ": 600}, "100_11": {"VA": 1300, "PR": 1000, "FL": 5200, "CA": 1400, "NY": 4600, "MA": 4400, "NJ": 200}, "100_19": {"VA": 900, "PR": 900, "FL": 5400, "CA": 1400, "NY": 5000, "MA": 4200, "NJ": 300}, "10_4": {"VA": 850, "PR": 850, "FL": 5260, "CA": 1860, "NY": 4780, "MA": 4210, "NJ": 310}, "200_7": {"VA": 1200, "PR": 1600, "FL": 5000, "CA": 1400, "NY": 5200, "MA": 3200, "NJ": 600}, "1000_15": {"VA": 1000, "FL": 4000, "CA": 2000, "NY": 9000, "MA": 2000}, "500_19": {"VA": 500, "PR": 1000, "FL": 6000, "CA": 1500, "NY": 3500, "MA": 5000, "NJ": 500}, "500_21": {"VA": 1000, "PR": 1000, "FL": 4500, "CA": 1500, "NY": 3000, "MA": 7000}, "1000_12": {"FL": 8000, "NY": 5000, "MA": 5000}, "100_20": {"VA": 1400, "PR": 1200, "FL": 4400, "CA": 2300, "NY": 4900, "MA": 3400, "NJ": 500}, "100_6": {"VA": 900, "PR": 1000, "FL": 5000, "CA": 1900, "NY": 5300, "MA": 3800, "NJ": 200}, "10_3": {"VA": 900, "PR": 1000, "FL": 5100, "CA": 1910, "NY": 5040, "MA": 3880, "NJ": 290}, "1000_18": {"VA": 1000, "PR": 1000, "FL": 8000, "CA": 2000, "NY": 2000, "MA": 4000}, "500_7": {"VA": 1500, "PR": 1000, "FL": 5500, "CA": 1500, "NY": 6500, "MA": 1500, "NJ": 500}, "100_9": {"VA": 1200, "PR": 1000, "FL": 5600, "CA": 1900, "NY": 4300, "MA": 3800, "NJ": 300}, "1000_6": {"VA": 2000, "PR": 3000, "FL": 5000, "NY": 6000, "MA": 1000, "NJ": 1000}, "200_8": {"VA": 1200, "PR": 1200, "FL": 5000, "CA": 1400, "NY": 5400, "MA": 4000}, "1000_8": {"VA": 2000, "PR": 2000, "FL": 2000, "CA": 2000, "NY": 4000, "MA": 6000}, "1000_5": {"PR": 1000, "FL": 3000, "CA": 2000, "NY": 6000, "MA": 6000}, "500_12": {"VA": 500, "PR": 1000, "FL": 5000, "CA": 1500, "NY": 7000, "MA": 3000}, "100_8": {"VA": 1000, "PR": 500, "FL": 6000, "CA": 1200, "NY": 5400, "MA": 3500, "NJ": 500}, "10_13": {"VA": 910, "PR": 910, "FL": 5060, "CA": 1690, "NY": 5440, "MA": 3800, "NJ": 310}, "500_18": {"VA": 1500, "PR": 500, "FL": 5500, "CA": 1500, "NY": 6500, "MA": 2500}}

CARRIER_NAMES = {
    'WN': 'Southwest Airlines',
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'OO': 'SkyWest Airlines',
    'EV': 'ExpressJet',
    'B6': 'JetBlue',
    'AS': 'Alaska Airlines',
    'NK': 'Spirit Airlines',
    'F9': 'Frontier Airlines',
    'VX': 'Virgin America',
    'HA': 'Hawaiian Airlines'
}

STATE_NAMES = {
    'AK': 'Alaska',
    'AL': 'Alabama',
    'AR': 'Arkansas',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DC': 'District of Columbia',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'IA': 'Iowa',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'MA': 'Massachusetts',
    'MD': 'Maryland',
    'ME': 'Maine',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MO': 'Missouri',
    'MP': 'Northern Mariana Islands',
    'MS': 'Mississippi',
    'MT': 'Montana',
    'NA': 'National',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'NE': 'Nebraska',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NV': 'Nevada',
    'NY': 'New York',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VA': 'Virginia',
    'VI': 'Virgin Islands',
    'VT': 'Vermont',
    'WA': 'Washington',
    'WI': 'Wisconsin',
    'WV': 'West Virginia',
    'WY': 'Wyoming'
}

function getSelectOptions(visualizationLookingAt) {
    var amountError = getError(visualizationLookingAt);
    var sequenceNumber = getSequence(visualizationLookingAt);

    var key = "" + amountError + "_" + sequenceNumber;
    if (visualizationLookingAt === 'airline') {
        return airlinesData[key];
    } else {
        return statesData[key];
    }
}

function getAllOptions(visualizationLookingAt) {
    if(visualizationLookingAt === 'airline') {
        return allOptions['airline'].map(function(m) {return {'short':m, 'long':CARRIER_NAMES[m]}});
    } else {
        return allOptions['states'].map(function(m) {return {'short':m, 'long':STATE_NAMES[m]}});
    }
}

function makeCRCTable(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

function crc32(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

function pseudo_random(n) {
    return crc32('' + userId + n);
}

$('#demographics-form').submit(function(ev) {
    ev.preventDefault();
    var dem = newLog.child("demographics");
    var data = $('#demographics-form').serializeArray();
    $.each(data, function(j, field) {
        dem.child(field.name).set(field.value || '-');
    });
    window.location.replace("thanks.html");
});

var page = window.location.pathname.replace('/', '').replace('bias-study', '').replace('.', '_');

// store time on page
var start = new Date();

if (page == 'index_html') {
    newLog.child("timing").child("start_time").set('' + start.getTime());
}
if (page == 'thanks_html') {
    newLog.child("timing").child("end_time").set('' + end.getTime());
}

window.onbeforeunload = function(ev) {
    var end = new Date();
    newLog.child("timing").child(page).set(end.getTime() - start.getTime());
};
