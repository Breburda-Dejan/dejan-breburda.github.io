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
document.getElementById('age2').textContent = age;