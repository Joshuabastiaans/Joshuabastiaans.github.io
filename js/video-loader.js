(function () {
  function loadBackgroundVideo() {
    const container = document.getElementById("bg-container");
    if (!container) return;

    // 1) Build the video element
    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = "assets/img/video-fallback.jpg";
    video.style.cssText =
      "object-fit:cover;width:100%;height:100%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);";

    const src = document.createElement("source");
    src.src = "assets/videos/Trailer.mp4";
    src.type = "video/mp4";
    video.appendChild(src);

    // 2) When the first frame is ready, remove the poster img
    video.addEventListener("loadeddata", () => {
      const posterImg = document.getElementById("bg-poster");
      if (posterImg) posterImg.remove();
    });

    // 3) Inject the video into the container
    container.appendChild(video);
  }

  // Use requestIdleCallback if available, otherwise window.load
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadBackgroundVideo, { timeout: 2000 });
  } else {
    window.addEventListener("load", loadBackgroundVideo);
  }
})();
