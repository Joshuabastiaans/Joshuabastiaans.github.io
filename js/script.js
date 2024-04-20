document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    // ... rest of your code
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
});
