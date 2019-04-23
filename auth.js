var globaluser;
function toggleSignIn() {
	
	    var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
		var errorCode=0;
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
		  return;
          // [END_EXCLUDE]
        });
		setTimeout(function(){
		if(errorCode==0){
		var close = document.getElementById('signin-close');
		document.getElementById('SignInNout').style.display = 'none';
		document.getElementById('logout').style.display = 'block';
		close.click();
        // [END authwithemail]
        }
		},1000);
    }
	
	function handleSignout(){
	
	 var user= firebase.auth().currentUser;
     if (user) {
        // [START signout]
        firebase.auth().signOut().then(function() {
			}).catch(function(error) {
			alert("error");
		// An error happened.
		});
		document.getElementById('logout').style.display = 'none';
		document.getElementById('SignInNout').style.display = 'block';
		document.getElementById('greeting').style.display = 'none';
        // [END signout]
      } 	
	}
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('orangeForm-email').value;
      var password = document.getElementById('orangeForm-pass').value;
	  var name= document.getElementById('orangeForm-name').value;
	  
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
	  var errorCode=0;
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
		var user=updateuser(data.user.uid,name);
	// save the user's profile into Firebase so we can list users,
      // use them in Security and Firebase Rules, and show profiles
	  	  
        }).catch(function(error) {
    // Handle Errors here.
        errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
		});
        
		if(errorCode==0){
		var close = document.getElementById('signup-close');
		close.click();
		}
      }
     
     
    function updateuser(uid, name){
		var user = firebase.auth().currentUser;
		user.updateProfile({
		displayName: name
		}).then(function() {
	firebase.auth().onAuthStateChanged(function(user) {
           firebase.database().ref('users/' + user.uid).set({
		    userID: user.uid,
            name: user.displayName,
			email: user.email,
			report: "NA"
            });
			
			});
			
	}).catch(function(error) {
		alert(" update error");
	});
		return user;
	}
	
	
    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }
    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]	  
	  var home=false;
	  var element = document.getElementById('register'); 
	  if (typeof(element) != 'undefined' && element != null) { 
	  home=true;
	  }
      firebase.auth().onAuthStateChanged(function(user) {
		var pagename= window.location.href;
		
        if (user) {
			if(pagename.search("defaultHistory")!=-1){
			window.location = "https://highheart-2e3e8.firebaseapp.com/healthHistory.html";
		}
          // User is signed in.
          var displayName = user.displayName;
		  var greetname=displayName.split(" ")[0];
		  document.getElementById('greeting').innerHTML="<span class='greet-padding'> <a onclick='getProfile();'> Hi "+greetname+" !</a></span>";
		  if(home) {document.getElementById('register').style.display = 'none';}
		  document.getElementById('SignInNout').style.display = 'none';
		  document.getElementById('logout').style.display = 'block';
		  if(displayName=="Admin"){
			  document.getElementById('dbimg').style.display = 'inline-block';	
		  }else{
			  document.getElementById('dbimg').style.display = 'None';
		  }
		  globaluser=user;
		}else{
		 
		 if(pagename.search("healthHistory")!=-1){
			window.location.href = "https://highheart-2e3e8.firebaseapp.com/defaultHistory.html";
		}
		 
		 if(home) {document.getElementById('register').style.display = 'inline-block';}
		 document.getElementById('dbimg').style.display = 'None';
		}
      });
      // [END authstatelistener] 
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
	  document.getElementById('reset').addEventListener('click', sendPasswordReset, false);
      if(home){document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);}
	  document.getElementById('contact-us').addEventListener('click', contactUs, false);
    }
    window.onload = function() {
      initApp();
    };

	
	function contactUs(){
		
		const name = document.getElementById('form-name').value;
		const email = document.getElementById('form-email').value;
		const subject = document.getElementById('form-subject').value;
		const message = document.getElementById('form-message').value;

		if(name != "" && email != "" && subject != "") {

		const msgTimestamp = Math.floor(Date.now() / 1000);

		firebase.database().ref('messages').once('value', snapshot => {
		var totalMessages = snapshot.numChildren();
		totalMessages++;
	
    firebase.database().ref('messages').child(totalMessages).set({
      name: name,
      email: email,
	  subject: subject,
      message: message,
      timestamp: msgTimestamp
    });
	var sent = document.getElementById('contact-close');
	sent.click();

  }, function(error) {
    console.log(error);
  });
} else {
  alert('Please fill all the fields.');
  }
}

	function sendStory(){
		
		const name = document.getElementById('senderName').value;
		const message = document.getElementById('content').value;

		if(name != "" && message != "") {

		const msgTimestamp = Math.floor(Date.now() / 1000);
		firebase.database().ref('stories').once('value', snapshot => {
		var totalMessages = snapshot.numChildren();
		totalMessages++;

		firebase.database().ref('stories').child(totalMessages).set({
			name: name,
			message: message,
			timestamp: msgTimestamp
		});
	}, function(error) {
    console.log(error);
	});
} else {
  alert('Please fill all the fields.');
  }
  document.getElementById("storyForm").reset();
  alert('Thank you for sharing!');
}

	function doClick(){
		var user = firebase.auth().currentUser;
		if (user != null){
       window.location.href = "healthHistory.html";
		}else{
       window.location.href = "defaultHistory.html";
		}
	}

	function getProfile(){
			window.location = "profile.html";
			localStorage.setItem("highheartUser",JSON.stringify(globaluser));
			}
	
	function updateProfileData(){
		var user= firebase.auth().currentUser;
		var name=document.getElementById('displayname').value;
		var email=document.getElementById('email').value;
		user.updateProfile({
		displayName: name,
		email:email
		}).then(function() {
           firebase.database().ref('users/' + globaluser.uid).update({
            name: user.displayName,
			email: user.email	
			}).catch(function(error) {
			alert(" update error");
			});
			localStorage.setItem("highheartUser",JSON.stringify(user));
			return user;
		});
		alert("Profile updated!");
		
	}