var design;
var creativity;
var userfriendliness;
var quality;
var interactivity;
var message;
var username;



function submit(){
	document.getElementById("error").innerHTML = "";
	design = document.querySelector('input[name="design"]:checked');
	creativity = document.querySelector('input[name="creativity"]:checked');
	userfriendliness = document.querySelector('input[name="userfriendliness"]:checked');
	quality = document.querySelector('input[name="quality"]:checked');
	interactivity = document.querySelector('input[name="interactivity"]:checked');
	message = document.getElementById("feedbackText");
	username = document.getElementById("feedbackName");
	
	if (!(design === null || creativity === null || userfriendliness === null || quality === null || interactivity === null)){
		if (message === null) message.value = "";
		if (username === null || username.value === "") username.value = "Anonym";
		sendMessage();
	}
	else{
		document.getElementById("error").innerHTML = 'Sie müssen alle felder ausfüllen, welche nicht als optional gekennzeichnet sind!';
	}
}


function sendMessage() {
	
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://trigger.macrodroid.com/9447f3bf-2f81-41e9-97b5-173bf12f6773/feedback");
	var body = "--------------------------\nNeues Feedback von "+username.value+"\nDesign: "+design.value+" Sterne\nKreativität: "+ creativity.value+" Sterne\nBenutzerfreundlichkeit: "+ userfriendliness.value+" Sterne\nInhaltliche Qualität: "+quality.value+" Sterne\nInteraktivität: "+interactivity.value+" Sterne\nNachricht: "+message.value;
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 201) {
		console.log(JSON.parse(xhr.responseText));
	  } else {
		console.log(`Error: ${xhr.status}`);
		window.location.replace("thanks.html");
	  }
	};
	xhr.send(body);
}