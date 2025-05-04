document.addEventListener("DOMContentLoaded", () => {
  // Abort on extremely slow connections
  if (navigator.connection?.effectiveType?.includes("2g")) return;

  const hero = document.getElementById("hero");
  if (!hero) return;

  const isMobile = matchMedia("(max-width: 768px)").matches;
  const src = isMobile
    ? "assets/videos/Trailer_Optimized.mp4" // 720 p or 480 p – ≈ 3‑5 MB
    : "assets/videos/Trailer.mp4"; // Full‑quality desktop file

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect(); // Run only once

      const v = document.createElement("video");
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.src = src; // network request starts here
      v.poster = "assets/img/video-fallback.webp";
      v.style.cssText =
        "object-fit:cover;width:100%;height:100%;position:absolute;top:0;left:0;";
      hero.appendChild(v);
    },
    { rootMargin: "0px", threshold: 0 }
  );

  io.observe(hero);
});
