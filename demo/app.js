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

  const dbRef = firebase.database().ref();
  const usersRef = dbRef.child('users');
  
  const userListUI = document.getElementById("userList");

usersRef.on("child_added", snap => {
   let user = snap.val();
   let $li = document.createElement("li");
   $li.innerHTML = user.name;
   $li.setAttribute("child-key", snap.key); 
   $li.addEventListener("click", userClicked)
   userListUI.append($li);
});

function userClicked(e) {

  var userID = e.target.getAttribute("child-key");

  const userRef = dbRef.child('users/' + userID);

  const userDetailUI = document.getElementById("userDetail");
  userDetailUI.innerHTML = ""

  userRef.on("child_added", snap => {
    var $p = document.createElement("p");
    $p.innerHTML = snap.key + " - " + snap.val()
    userDetailUI.append($p);
  });

}
