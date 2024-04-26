document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
});


document.addEventListener('DOMContentLoaded', function () {
    const words = document.querySelectorAll('.word');
    let count = 0;

function nextWord() {
    words[count].style.opacity = '0';
    count = (count + 1) % words.length;
    words[count].style.opacity = '1';
}
    setInterval(nextWord, 4000); // Change word every 4 seconds

    const btn = document.getElementById('who-am-i');
    const aboutMe = document.getElementById('about-me');

    btn.addEventListener('click', function () {
        aboutMe.classList.toggle('hidden');
        this.textContent = aboutMe.classList.contains('hidden') ? 'Who am I?' : 'Hide';
    });

    const button = document.querySelector('button');
    let angle = 0;

    function updateGradient() {
        button.style.backgroundImage = `linear-gradient(${angle}deg, #6e8efb, #a777e3)`;
        angle = (angle + 1) % 360; // Increment angle, reset after full rotation
    }

    // Set interval for continuously updating the gradient
    setInterval(updateGradient, 100); // Update gradient every 100ms

    // Event listeners for smooth transition adjustments
    button.addEventListener('mouseenter', () => {
        // This will slow the transition effect when the mouse hovers over the button
        button.style.transition = 'background-image 1s ease-in-out';
    });

    button.addEventListener('mouseleave', () => {
        // This will reset the transition effect speed when the mouse leaves the button
        button.style.transition = 'background-image 0.3s ease-in-out';
    });
});

