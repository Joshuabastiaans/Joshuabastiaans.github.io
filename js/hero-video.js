/* js/hero-video.js */
document.addEventListener("DOMContentLoaded", () => {
  // Don’t load video on mobile or slow connections
  if (
    matchMedia("(max-width:768px)").matches ||
    navigator.connection?.effectiveType?.includes("2g")
  )
    return;

  const hero = document.getElementById("hero");

  // Wait until the hero is visible for 100 ms (i.e. first paint done)
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();

      const v = document.createElement("video");
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      // defer network until DOM inserted
      v.src = "assets/videos/Trailer.mp4";
      v.poster = "assets/img/video-fallback.webp";
      v.style.cssText =
        "object-fit:cover;width:100%;height:100%;position:absolute;top:0;left:0;";
      hero.appendChild(v);
    },
    { rootMargin: "0px", threshold: 0 }
  );

  io.observe(hero);
});
