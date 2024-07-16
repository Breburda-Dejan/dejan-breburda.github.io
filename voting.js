

function submit(){
	document.getElementById("error").innerHTML = "";
	var design = document.querySelector('input[name="design"]:checked');
	var creativity = document.querySelector('input[name="creativity"]:checked');
	var userfriendliness = document.querySelector('input[name="userfriendliness"]:checked');
	var quality = document.querySelector('input[name="quality"]:checked');
	var interactivity = document.querySelector('input[name="interactivity"]:checked');
	
	if (!(design === null || creativity === null || userfriendliness === null || quality === null || interactivity === null)){
		/// TODO: send data to server
		window.location.replace("thanks.html")
	}
	else{
		document.getElementById("error").innerHTML = 'Sie müssen alle felder ausfüllen, welche nicht als optional gekennzeichnet sind!';
	}
}