document.addEventListener('DOMContentLoaded', function () {
    const words = document.querySelectorAll('.word');
    let count = 0;

    function nextWord() {
        words[count].style.opacity = '0';
        count = (count + 1) % words.length;
        words[count].style.opacity = '1';
    }
    setInterval(nextWord, 4000); // Change word every 4 seconds
    
    
    const openButton = document.getElementById('open-overlay');
    const closeButton = document.getElementById('close-overlay');
    const overlay = document.getElementById('overlay');
    // Gradient animation for the open-overlay button
    let angle = 0;
    setInterval(function() {
        openButton.style.backgroundImage = `linear-gradient(${angle}deg, #6e8efb, #a777e3)`;
        angle = (angle + 1) % 360;
    }, 100);

    function openOverlay() {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.add('visible'); // Ensure visible properties are set after removing hidden
        }, 10); // Short delay to ensure CSS applies correctly
    }

    function closeOverlay() {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 500); // Delay should match transition time
    }
        // Event listeners for the buttons
    openButton.addEventListener('click', openOverlay);
    closeButton.addEventListener('click', closeOverlay);

    // Prevent the page from scrolling while the overlay is open
    overlay.addEventListener('scroll', function(event) {
        event.preventDefault();
    });
});