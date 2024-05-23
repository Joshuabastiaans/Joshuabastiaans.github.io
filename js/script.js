document.addEventListener("DOMContentLoaded", function () {
  const words = document.querySelectorAll(".word");
  let count = 0;

  function nextWord() {
    words[count].style.opacity = "0";
    count = (count + 1) % words.length;
    words[count].style.opacity = "1";
  }
  setInterval(nextWord, 4000); // Change word every 4 seconds

  const mainOverlay = document.getElementById("overlay");
  const subOverlays = document.querySelectorAll(".sub-overlay");
  const closeButton = document.getElementById("close-overlay");
  const openOverlayButton = document.getElementById("open-overlay");
  const designButtons = document.querySelectorAll(".design-button");
  const closeButtons = document.querySelectorAll(".close-overlay-button");
  const questionButtons = document.querySelectorAll(".question-button");

  // Gradient animation for the open-overlay button
  let angle = 0;
  setInterval(function () {
    openOverlayButton.style.backgroundImage = `linear-gradient(${angle}deg, #6e8efb, #a777e3)`;
    angle = (angle + 1) % 360;
  }, 100);

  // Prevent the page from scrolling while the overlay is open
  mainOverlay.addEventListener("scroll", function (event) {
    event.preventDefault();
  });

  window.onload = function () {
    var buttons = document.querySelectorAll(".design-button");
    var style = document.createElement("style");
    document.head.appendChild(style);

    buttons.forEach(function (button, index) {
      var randomDegrees = Math.floor(Math.random() * 360);
      style.sheet.insertRule(
        `
                .design-button:nth-child(${index + 1})::before {
                    background: linear-gradient(${randomDegrees}deg, #6e8efb, #a777e3);
                }
            `,
        style.sheet.cssRules.length
      );
    });
  };

  // Track open overlays
  let openOverlays = [];

  // // Open main overlay
  // openOverlayButton.addEventListener("click", function () {
  //   mainOverlay.classList.add("visible");
  //   openOverlays.push(mainOverlay);
  //   positionCloseButton();
  // });

  openOverlayButton.addEventListener("click", function () {
    mainOverlay.classList.remove("hidden");
    setTimeout(() => {
      mainOverlay.classList.add("visible");
      openOverlays.push(overlay);
      positionCloseButton();
    }, 10); // Short delay to ensure CSS applies correctly
  });

  // Open sub-overlays
  designButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const overlayId = button.getAttribute("data-overlay");
      const overlay = document.getElementById(overlayId);
      if (overlay) {
        overlay.style.display = "block";
        openOverlays.push(overlay);
      }
    });
  });

  // Close the topmost overlay
  closeButton.addEventListener("click", function () {
    if (openOverlays.length > 0) {
      const topmostOverlay = openOverlays.pop();
      if (topmostOverlay === mainOverlay) {
        mainOverlay.classList.remove("visible");
      } else {
        topmostOverlay.style.display = "none";
      }
    }
  });

  // Add event listener to close buttons inside sub-overlays
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const overlay = button.closest(".sub-overlay");
      if (overlay) {
        overlay.style.display = "none";
        openOverlays = openOverlays.filter((o) => o !== overlay);
      } else if (button.id === "close-overlay") {
        mainOverlay.classList.remove("visible");
        openOverlays = openOverlays.filter((o) => o !== mainOverlay);
      }
    });
  });

  questionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answerId = button.getAttribute("data-answer");
      const answerElement = document.getElementById(answerId);

      if (answerElement.classList.contains("visible")) {
        answerElement.classList.remove("visible");
        button.setAttribute("data-state", "closed");
      } else {
        document.querySelectorAll(".answer.visible").forEach((openAnswer) => {
          openAnswer.classList.remove("visible");
          const openButton = document.querySelector(
            `.question-button[data-answer="${openAnswer.id}"]`
          );
          openButton.setAttribute("data-state", "closed");
        });
        answerElement.classList.add("visible");
        button.setAttribute("data-state", "open");
      }
    });
  });

  window.addEventListener("resize", positionCloseButton);
  window.addEventListener("load", positionCloseButton);

  function positionCloseButton() {
    const overlayContent = document.querySelector(".overlay-content");
    const closeButton = document.querySelector(".close-overlay-button");

    if (overlayContent && closeButton) {
      const overlayContentRect = overlayContent.getBoundingClientRect();
      closeButton.style.left =
        overlayContentRect.left - closeButton.offsetWidth - 20 + "px";
    }
  }
});
