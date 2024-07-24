const cookies = document.getElementsByClassName("cookie");
const counter = document.getElementById('counter');
const myimage = document.getElementById("myimage");
var cookieCount = 0;
var imagerotate = 0;

for (const cookie of cookies) {
	cookie.addEventListener('click', () => {
		cookieCount++;
		counter.textContent = `🍪 ${cookieCount}`;
		counter.style.display = "block";
		const counterRect = counter.getBoundingClientRect();
		const cookieRect = cookie.getBoundingClientRect();

		const deltaX = counterRect.left - cookieRect.left + (counterRect.width / 2);
		const deltaY = counterRect.top - cookieRect.top + (counterRect.height / 2);

		cookie.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1) rotateY(720deg)`;
		cookie.style.opacity = '0';
		if(cookieCount === 5){
			window.location.href = "cbee267d48f85228db6773f67bbb49d2e2103d7e.html";
		}
		setTimeout(() => cookie.remove(), 1000);
	});
}

function foldelement(id){
	const tofoldelement= document.getElementById(id);
	if(cookieCount >= 1){
		tofoldelement.classList.toggle('folded');
	}
}
