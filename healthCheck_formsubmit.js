var uid;
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  // User is signed in.
	  uid = user.uid;
	}

})

// Listen for form submit
document.getElementById('healthcheck-form').addEventListener('submit', submitForm);

// form validation
$(document).ready(function() {

    var age = getRadioVal('age');
    var gender = getRadioVal('gender');
    var gest = getRadioVal('gest');
    var family = getRadioVal('family');
    var bp = getRadioVal('bp');
    var phy = getRadioVal('phy');
    var height = getSelectVal('height');
    var weight = getSelectVal('weight');

    if (age == undefined || gender == undefined || gest == undefined || family == undefined || bp == undefined || phy == undefined || height == (undefined || "") || weight == (undefined || "")) {
     $("#healthcheck-form button").attr("disabled","disabled");
     return false;
    }

});

$("input.control_hc-input").on('change', function () {
    var age = getRadioVal('age');
    var gender = getRadioVal('gender');
    var gest = getRadioVal('gest');
    var family = getRadioVal('family');
    var bp = getRadioVal('bp');
    var phy = getRadioVal('phy');
    var height = getSelectVal('height');
    var weight = getSelectVal('weight');
    if (age != undefined && gender != undefined && gest != undefined && family != undefined && bp != undefined && phy != undefined && height != (undefined || "") && weight != (undefined || "")) {
     $("#healthcheck-form button").removeAttr("disabled");
     $("#invalid-msg").hide();
    }         
});

$("select").on('click change', function () {
    var age = getRadioVal('age');
    var gender = getRadioVal('gender');
    var gest = getRadioVal('gest');
    var family = getRadioVal('family');
    var bp = getRadioVal('bp');
    var phy = getRadioVal('phy');
    var height = getSelectVal('height');
    var weight = getSelectVal('weight');
    if (age != undefined && gender != undefined && gest != undefined && family != undefined && bp != undefined && phy != undefined && height != (undefined || "") && weight != (undefined || "")) {
     $("#healthcheck-form button").removeAttr("disabled");
     $("#invalid-msg").hide();
    }             
});

// Submit form
function submitForm(e){

  e.preventDefault();
  
  // Get values
  var age = parseInt(getRadioVal('age'));
  var gender = parseInt(getRadioVal('gender'));
  var gest = parseInt(getRadioVal('gest'));
  var family = parseInt(getRadioVal('family'));
  var bp = parseInt(getRadioVal('bp'));
  var phy = parseInt(getRadioVal('phy'));
  var height = parseInt(getSelectVal('height'));
  var weight = parseInt(getSelectVal('weight'));
  var range;
  var bmi;

  //BMI and risk index assigned as a combination of height and weight
  if((height == 0 && weight == 0) || (height == 1 && weight == 0) || (height == 2 && weight == 0) || (height == 3 && weight == 0)){
  	range = 0;
    bmi = "18.5 - 24.9";
  }
  else if((height == 0 && weight == 1) || (height == 1 && weight == 1) || (height == 2 && weight == 1) || (height == 3 && weight == 1)){
  	range = 1;
    bmi = "24.9 - 34.9";
  }
  else if((height == 0 && weight == 2) || (height == 1 && weight == 2) ||(height == 2 && weight == 2) || (height == 2 && weight == 3)){
  	range = 2;
    bmi = "34.9 - 39.9";
  }
  else if(height == 0 && weight == 3 || (height == 1 && weight == 3) || (height == 2 && weight == 3) || (height == 3 && weight == 3) ){
  	range = 3;
    bmi = ">=40";
  }
  // calculate health index
  var hindex = age+gender+gest+family+bp+phy+range;

  // condition for recommendations to be shown
  var recommendations;
  if(hindex<5){
  	recommendations = {exercise:'Go for morning walk and practice stretching exercises upto 3 times in a week.',
  		protein:'Choose salmon, tuna, or eggs fortified with omega-3s.',
  		fat:'Avoid foods containing partially hydrogenated vegetable oils to reduce trans fat in your diet. ',
  		mineral:'Intake of Broccoli, potatoes, meats, poultry, fish, some cereals.',
  		stress:'Try Hatha yoga, it is a good stress reliever because of its slower pace and easier movements.',
  		water:'Drink at least 101 ounces of water per day, which is a little under 13 cups.'}
  }
  else if(hindex<10 && hindex>=5){
  	recommendations = {exercise:'Balance exercise with moderate food intake to maintain or reduce weight. (BMI 19-25).',
  		protein:'Consume low-fat dairy products, skinless poultry and fish, nuts and legumes.',
  		fat:'Limit fat, sodium and cholesterol intake, avoid alcohol. Cut back on beverages and foods with added sugars.',
  		mineral:'Eat 5 or more servings of fruits and vegetables per day. Eat other plant foods several times per day (bread, cereal, grains, rice, pasta, beans).',
  		stress:'Guided meditation, guided imagery, visualization and other forms of meditation can be practiced anywhere at any time.',
  		water:'Intake of 3.7 liters per day for adult men and 2.7 liters per day for adult women.'}
  }
  else if(hindex>=10){
  	recommendations = {exercise:'Strength training, such as lifting weights or performing body weight exercises like crunches and lunges.',
  		protein:'Limit the amount of red meat, especially processed red meat, and eat more fish, poultry, and beans.',
  		fat:'Select fat-free (skim) and low-fat (1%) dairy products.',
  		mineral:'Conserve energy by consuming seafood, nuts, seeds, wheat bran cereals, whole grains',
  		stress:'Learn and practice relaxation techniques; try meditation, yoga, or tai-chi for stress management.',
  		water:'Drink water before the start of your meal to help lose weight.'}
  }

  // save date of taking health assessment
  var n =  new Date();
  var dd = String(n.getDate()).padStart(2, '0');
  var mm = String(n.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = n.getFullYear();

  var date = mm + '/' + dd + '/' + yyyy;

  // Save message
  if(uid){
    saveMessage(uid, date, hindex);
  }
  
  showrecommendations(recommendations, hindex, bmi);

  // Clear form
  document.getElementById('healthcheck-form').reset();
  $("#healthcheck-form button").attr("disabled","disabled");
  $("#invalid-msg").show();

 }

// Function to get form radio button values
function getRadioVal(name){
  return $('input[name='+name+']:checked').val();
}

// Function to get form dropdown values
function getSelectVal(id){
  return $("#"+id+" option:selected").val();
}

// Save message to users collection, report field
function saveMessage(uid, date, hindex){
  var x = firebase.database().ref().child('/users/' + uid + '/report/').push({
    date: date,
    hindex: hindex	
  });
}

//show recommendations modal according to helath index
function showrecommendations(recommendations, hindex, bmi){
  $('#hindex_span').html(" "+hindex);
  $('#bmi_span').html(" "+bmi);
	$('#exercise').html(recommendations.exercise);
	$('#protein').html(recommendations.protein);
	$('#fat').html(recommendations.fat);
	$('#mineral').html(recommendations.mineral);
	$('#stress').html(recommendations.stress);
	$('#water').html(recommendations.water);
}
