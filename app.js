 
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDhvhsndS8-hpLtTX1QXrY-GWOqYRYbpws",
    authDomain: "highheart-2e3e8.firebaseapp.com",
    databaseURL: "https://highheart-2e3e8.firebaseio.com",
    projectId: "highheart-2e3e8",
    storageBucket: "highheart-2e3e8.appspot.com",
    messagingSenderId: "123767894835"
  };
  firebase.initializeApp(config);

function getData(){
  const dbRef = firebase.database().ref('users');
    $("#outputDiv").html('');
    $("#outputDiv").append("<table id='userTable' border='1' width='100%'></table>");
    $("#userTable").html('');
	$("#userTable").append("<tr><th>Name</th><th>Email</th></tr>");
    dbRef.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
		  var uid = childSnapshot.val().userID;
          var name = childSnapshot.val().name;
		  var email = childSnapshot.val().email;
          $("#userTable").append("<tr><td align='left'>" + name + "</td><td align='left'>" + email + "</td></tr>");
      });
    });
}