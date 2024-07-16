function calculateAge(birthdate) {
	const today = new Date();
	const birthDate = new Date(birthdate);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

const age = calculateAge('2006-01-29');
document.getElementById('age').textContent = age;

const aboutMeContent = `Hallo! Ich bin Dejan Breburda, ${age} Jahre alt und lebe in Österreich. Derzeit besuche ich noch die Schule und programmiere leidenschaftlich gerne in meiner Freizeit. Mein Fokus liegt auf Python, aber ich arbeite auch mit anderen Programmiersprachen wie JavaScript, C++, C, C# und Java. Programmieren ist für mich nicht nur ein Hobby, sondern auch eine Möglichkeit, kreative Lösungen für komplexe Probleme zu finden. Ich freue mich darauf, neue Technologien zu erkunden und innovative Projekte zu realisieren.`;
document.getElementById('about-me-content').textContent = aboutMeContent;