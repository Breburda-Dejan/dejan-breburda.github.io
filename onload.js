window.addEventListener('load', () => {
	anime({
		targets: '.scalechange',
		scale:[1.05, 1],
		opacity: [0.4, 1],
		easing: 'easeInExpo',
		duration: 500,
		delay: anime.stagger(100),
		complete: function(anim){
			animateParticles();
		}
	});
	
	anime({
		targets: '.section',
		translateY: 5,
		easing: 'easeOutExpo',
		duration: 500
	});

	anime({
		targets: '.skill-progress',
		width: (el) => [10,el.style.with],
		easing: 'easeInOutQuart',
		delay: anime.stagger(100),
		duration: 1500
	});
});

/*
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sunIcon = darkModeToggle.querySelector('.sun');
    const moonIcon = darkModeToggle.querySelector('.moon');

    // Check for saved user preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'dark') {
        root.classList.add('dark-mode');
    }

    function toggleDarkMode() {
        root.classList.toggle('dark-mode');
        
        // Save user preference
        if (root.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'dark');
        } else {
            localStorage.setItem('darkMode', 'light');
        }

        // Animate icon transition
        anime({
            targets: [sunIcon, moonIcon],
            opacity: {
                value: [1, 0],
                duration: 300,
                easing: 'easeInOutSine'
            },
            complete: function() {
                // Switch visibility after fade out
                sunIcon.style.display = root.classList.contains('dark-mode') ? 'none' : 'block';
                moonIcon.style.display = root.classList.contains('dark-mode') ? 'block' : 'none';
                
                // Fade in the new icon
                anime({
                    targets: root.classList.contains('dark-mode') ? moonIcon : sunIcon,
                    opacity: {
                        value: [0, 1],
                        duration: 300,
                        easing: 'easeInOutSine'
                    }
                });
            }
        });

        // Rotate the button
        anime({
            targets: darkModeToggle,
            rotate: {
                value: '+=180',
                duration: 600,
                easing: 'easeInOutSine'
            }
        });
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);
});
*/