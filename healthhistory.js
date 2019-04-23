var uid;
  firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  // User is signed in.
	  uid = user.uid;

	  // Reference messages collection
		var messagesRef = firebase.database().ref('users');

		//reading data values from the users.report database path
		var userDataRef = firebase.database().ref('users/' + uid + '/report/');

		userDataRef.on('value', function(snapshot) {
		 	updateGraph(snapshot.val());
		 	displayDate(snapshot.val());

		});
	}
  })


//Health History Chart code
function updateGraph(chartData){

	am4core.ready(function() {

	// Themes begin
	am4core.useTheme(am4themes_material);
	am4core.useTheme(am4themes_animated);
	// Themes end

	var chart = am4core.create("chartdiv", am4charts.XYChart);
	chart.paddingRight = 20;

	var i = 0;
	var data = [];
	var index = 0;
	var previousValue;

	for (key in chartData) {
	    index += chartData[key].hindex;

	    if(i > 0){
	        // add color to previous data item depending on whether current value is less or more than previous value
	        if(previousValue <= index){
	            data[i - 1].color = am4core.color("#00A3CC");
	        }
	        else{
	            data[i - 1].color = am4core.color("#FF0000");
	        }
	    }
	    
	    data.push({ date: chartData[key].date, value: chartData[key].hindex });
	    previousValue = index;
	    i++;
	}

		chart.data = data;

		var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.grid.template.location = 0;
		dateAxis.renderer.axisFills.template.disabled = true;
		dateAxis.renderer.ticks.template.disabled = true;

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.tooltip.disabled = true;
		valueAxis.renderer.minWidth = 35;
		valueAxis.renderer.axisFills.template.disabled = true;
		valueAxis.renderer.ticks.template.disabled = true;

		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.dateX = "date";
		series.dataFields.valueY = "value";
		series.strokeWidth = 2;

		// set stroke property field
		series.propertyFields.stroke = "color";

		chart.cursor = new am4charts.XYCursor();

		var scrollbarX = new am4core.Scrollbar();
		chart.scrollbarX = scrollbarX;


		}); // end am4core.ready()
}

function displayDate(chartData){
	$("#rec_body").html("");
	for (key in chartData) {
		var hindex = chartData[key].hindex;;

		if(hindex<5)
 			$("#rec_body").append("<tr class='bluebg' value="+ key +"><td>"+ chartData[key].date +"</td><td>Choose salmon, tuna, or eggs fortified with omega-3s</td><td class='deletebtn' ><i class='fa fa-trash' aria-hidden='true'></i></td></tr>");
 		else if(hindex<10 && hindex>=5)
 			$("#rec_body").append("<tr class='bluebg' value="+ key +"><td>"+ chartData[key].date +"</td><td>Consume low-fat dairy products, skinless poultry and fish, nuts and legumes</td><td class='deletebtn' ><i class='fa fa-trash' aria-hidden='true'></i></td></tr>");
 		else if(hindex>=10)
 			$("#rec_body").append("<tr class='bluebg' value="+ key +"><td>"+ chartData[key].date +"</td><td>Select fat-free (skim) and low-fat (1%) dairy products</td><td class='deletebtn' ><i class='fa fa-trash' aria-hidden='true'></i></td></tr>");

	}
}

	//delete the clicked health history row
	$(document).on('click', 'td.deletebtn', function () {

    	var rid = $(this).closest('tr').attr('value');
    	var delRef = firebase.database().ref('users/' + uid + '/report/');
    	console.log(delRef);
    	delRef.child(rid).remove();

    	$(this).closest('tr').remove();
    	return false;
		});
