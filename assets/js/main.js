// --- Typewriter effect for the "worlds / realities / ... " word ---

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const deviceMemory = typeof navigator.deviceMemory === "number" ? navigator.deviceMemory : 0;
  const hardwareConcurrency = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 0;
  const isLikelyLowEndDevice = (deviceMemory > 0 && deviceMemory < 4) || (hardwareConcurrency > 0 && hardwareConcurrency <= 4);

  // --- Lenis Smooth Scroll Setup ---
  let lenis;
  let lenisRafId = null;
  const canUseLenis = !prefersReducedMotion && !saveData && !isCoarsePointer && !isLikelyLowEndDevice && typeof window.Lenis === "function";

  const startLenisRaf = () => {
    if (!lenis || lenisRafId !== null) return;
    const raf = (time) => {
      if (document.hidden) {
        lenisRafId = null;
        return;
      }
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(raf);
    };
    lenisRafId = requestAnimationFrame(raf);
  };

  const stopLenisRaf = () => {
    if (lenisRafId !== null) {
      cancelAnimationFrame(lenisRafId);
      lenisRafId = null;
    }
  };

  if (canUseLenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    startLenisRaf();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopLenisRaf();
      else startLenisRaf();
    });
  }

  const typewriterElement = document.getElementById("typewriter-word");
  const footerYearElement = document.getElementById("footer-year");
  const heroElement = document.querySelector(".hero");
  const heroVideo = heroElement?.querySelector(".hero__video");

  // Auto year in footer
  if (footerYearElement) {
    footerYearElement.textContent = new Date().getFullYear();
  }

  // --- Hero particles + deferred video loading ---
  if (heroElement && heroVideo) {
    const videoSources = heroVideo.querySelectorAll("source[data-src]");
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "hero__particles";
    heroElement.appendChild(particlesContainer);

    const PARTICLE_COUNT = 18;
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const particle = document.createElement("span");
      particle.className = "hero__particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty("--particle-duration", `${8 + Math.random() * 6}s`);
      particle.style.setProperty("--particle-delay", `${Math.random() * 4}s`);
      particle.style.setProperty("--particle-scale", `${0.6 + Math.random() * 0.9}`);
      particle.style.setProperty("--particle-opacity", `${0.15 + Math.random() * 0.35}`);
      particle.style.setProperty("--particle-drift", `${-25 + Math.random() * 50}px`);
      particlesContainer.appendChild(particle);
    }

    const PARTICLE_PERSIST_MS = 3000;
    const markVideoReady = () => {
      setTimeout(() => {
        heroElement.classList.add("hero--video-ready");
      }, PARTICLE_PERSIST_MS);
    };

    heroVideo.addEventListener("loadeddata", markVideoReady, { once: true });

    const loadVideoSources = () => {
      if (!videoSources.length) return;
      videoSources.forEach((source) => {
        const dataSrc = source.getAttribute("data-src");
        if (dataSrc && source.src !== dataSrc) {
          source.src = dataSrc;
        }
      });
      heroVideo.load();
      heroVideo.play().catch(() => {});
    };

    const scheduleHeroVideoLoad = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadVideoSources, { timeout: 2000 });
      } else {
        window.setTimeout(loadVideoSources, 0);
      }
    };

    const effectiveType = connection && typeof connection.effectiveType === "string" ? connection.effectiveType : "";
    const isLikelySlowConnection = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";

    // Avoid forcing a huge download in common constrained scenarios.
    if (prefersReducedMotion || saveData || isLikelySlowConnection) {
      const heroPoster = heroVideo.getAttribute("data-poster");
      if (heroPoster && !heroVideo.getAttribute("poster")) {
        heroVideo.setAttribute("poster", heroPoster);
      }
      return;
    }

    // If hero is visible quickly, load soon (but not synchronously).
    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(
        (entries, observer) => {
          const entry = entries[0];
          if (!entry || !entry.isIntersecting) return;
          observer.disconnect();
          scheduleHeroVideoLoad();
        },
        { root: null, threshold: 0.1 }
      );
      heroObserver.observe(heroVideo);
    } else {
      scheduleHeroVideoLoad();
    }
  }

  // Typewriter headline
  if (typewriterElement) {
    const words = [
      "for your eyes",
      "beyond your screen",
      "without vision",
      "beyond reality",
      "that react to you",
    ];

    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const TYPING_SPEED = 120;
    const DELETING_SPEED = 60;
    const WORD_HOLD_TIME = 1200;
    const EMPTY_HOLD_TIME = 250;

    const typeLoop = () => {
      const currentWord = words[currentWordIndex];

      if (!isDeleting && currentCharIndex <= currentWord.length) {
        typewriterElement.textContent = currentWord.slice(0, currentCharIndex);
        currentCharIndex += 1;

        const timeout = currentCharIndex === currentWord.length + 1
          ? WORD_HOLD_TIME
          : TYPING_SPEED;

        setTimeout(typeLoop, timeout);
      } else if (isDeleting && currentCharIndex >= 0) {
        typewriterElement.textContent = currentWord.slice(0, currentCharIndex);
        currentCharIndex -= 1;

        const timeout = currentCharIndex < 0 ? EMPTY_HOLD_TIME : DELETING_SPEED;
        setTimeout(typeLoop, timeout);
      } else {
        if (isDeleting) {
          currentWordIndex = (currentWordIndex + 1) % words.length;
          currentCharIndex = 0;
        } else {
          currentCharIndex = currentWord.length;
        }
        isDeleting = !isDeleting;
        setTimeout(typeLoop, TYPING_SPEED);
      }
    };

    typeLoop();
  }

  // --- Smooth scroll for "View projects" button (in addition to CSS scroll-behavior) ---

  const scrollButtons = document.querySelectorAll("[data-scroll-target]");

  const smoothScrollTo = (targetY, duration = 1300) => {
    if (prefersReducedMotion) {
      window.scrollTo({ top: targetY });
      return;
    }

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    const easeInOut = (t) => (
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeInOut(elapsed);
      window.scrollTo(0, startY + distance * eased);
      if (elapsed < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  scrollButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetSelector = button.getAttribute("data-scroll-target");
      if (!targetSelector) return;

      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      event.preventDefault();

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetPosition, 1000);
    });
  });

  // Feature project dropdown
  const featureToggleButtons = document.querySelectorAll("[data-feature-project-toggle]");
  featureToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-feature-project-target");
      const container = targetId
        ? document.querySelector(`[data-feature-project][data-feature-project-id="${targetId}"]`)
        : button.closest("[data-feature-project]");
      if (!container) return;

      const projectSection = container.closest(".feature-project");
      const content = projectSection?.querySelector(".feature-project__content");
      const startHeight = content ? content.offsetHeight : null;

      container.classList.add("is-expanded");
      button.setAttribute("disabled", "true");
      button.setAttribute("aria-expanded", "true");

      if (projectSection) {
        projectSection.classList.add("feature-project--expanded");
      }

      const details = container.querySelector(".feature-project__details");
      if (details) {
        details.hidden = false;
      }

      if (content && startHeight !== null) {
        const endHeight = content.scrollHeight;
        if (endHeight !== startHeight) {
          content.classList.add("feature-project__content--animating");
          content.style.height = `${startHeight}px`;
          content.style.transition = "height 0.7s ease";
          content.getBoundingClientRect();
          requestAnimationFrame(() => {
            content.style.height = `${endHeight}px`;
          });
          const cleanup = (event) => {
            if (event.propertyName !== "height") return;
            content.style.height = "";
            content.style.transition = "";
            content.classList.remove("feature-project__content--animating");
          };
          content.addEventListener("transitionend", cleanup, { once: true });
        }
      }

      // If this is the DON'T BLINK section, increase the number of background eyes
      const eyesContainer = document.getElementById("dont-blink-eyes");
      if (eyesContainer && projectSection && projectSection.id === "dont-blink") {
        eyesContainer.setAttribute("data-eyes-expanded", "true");
        // Trigger a rebuild of the eye grid with the higher density
        if (typeof window.rebuildBlinkEyes === "function") {
          window.rebuildBlinkEyes();
        }
      }
    }, { once: true });
  });

  // Abyssal Voyage: trippy text drift based on mouse position
  if (!prefersReducedMotion) {
    const abyssPanel = document.querySelector(
      '#abyssal-voyage [data-feature-project][data-feature-project-id="abyssal-voyage"]'
    );

    if (abyssPanel) {
      let hovering = false;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let rafId = null;

      const schedule = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(tick);
      };

      const handleMove = (event) => {
        const rect = abyssPanel.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        targetX = Math.max(-1, Math.min(1, nx));
        targetY = Math.max(-1, Math.min(1, ny));
        schedule();
      };

      const tick = () => {
        rafId = null;

        // Ease towards target while hovering; ease back to center when leaving.
        const damping = hovering ? 0.14 : 0.18;
        currentX += (targetX - currentX) * damping;
        currentY += (targetY - currentY) * damping;

        abyssPanel.style.setProperty("--trippy-x", currentX.toFixed(3));
        abyssPanel.style.setProperty("--trippy-y", currentY.toFixed(3));

        const closeEnough = Math.abs(currentX) < 0.002 && Math.abs(currentY) < 0.002;
        const noTarget = Math.abs(targetX) < 0.002 && Math.abs(targetY) < 0.002;

        if (!hovering && closeEnough && noTarget) {
          // Fully settled: clear the effect without a snap.
          currentX = 0;
          currentY = 0;
          abyssPanel.style.setProperty("--trippy-x", "0");
          abyssPanel.style.setProperty("--trippy-y", "0");
          abyssPanel.classList.remove("is-trippy");
          return;
        }

        schedule();
      };

      const start = (event) => {
        hovering = true;
        abyssPanel.classList.add("is-trippy");
        if (event) handleMove(event);
        schedule();
      };

      const stop = () => {
        hovering = false;
        targetX = 0;
        targetY = 0;
        schedule();
      };

      abyssPanel.addEventListener("pointerenter", start, { passive: true });
      abyssPanel.addEventListener("pointermove", handleMove, { passive: true });
      abyssPanel.addEventListener("pointerleave", stop, { passive: true });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
      });
    }
  }

  // Lazy load secondary videos (intersection-based so we don't fetch everything on window load)
  const lazyVideos = document.querySelectorAll("[data-video-lazy]");
  if (lazyVideos.length) {
    const loadVideo = (video) => {
      const sources = video.querySelectorAll("source[data-src]");
      if (!sources.length) return;

      sources.forEach((source) => {
        const dataSrc = source.getAttribute("data-src");
        if (dataSrc && source.src !== dataSrc) {
          source.src = dataSrc;
        }
      });
      video.load();
      video.play().catch(() => {});
      video.removeAttribute("data-video-lazy");
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            obs.unobserve(video);
            loadVideo(video);
          });
        },
        { root: null, rootMargin: "300px 0px", threshold: 0.01 }
      );
      lazyVideos.forEach((video) => observer.observe(video));
    } else {
      // Fallback: load after onload, but still only once.
      const loadAll = () => lazyVideos.forEach(loadVideo);
      window.addEventListener("load", loadAll, { once: true });
    }
  }

  // Dynamic marquee builder so the HTML only needs one DON'T BLINK instance
  const initMarquee = () => {
    const marquees = document.querySelectorAll("[data-marquee]");
    if (!marquees.length) return;

    const debounce = (fn, delay = 180) => {
      let timer;
      return (...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
      };
    };

    marquees.forEach((marquee) => {
      const track = marquee.querySelector("[data-marquee-track]");
      if (!track) return;

      const templateWord = track.querySelector("[data-marquee-word]");
      if (templateWord) {
        if (!marquee.dataset.marqueeText) {
          const text = templateWord.textContent?.trim();
          if (text) {
            marquee.dataset.marqueeText = text;
          }
        }
        templateWord.remove();
      }

      const buildMarquee = () => {
        const marqueeWord = marquee.dataset.marqueeText;
        if (!marqueeWord) return;

        const marqueeWidth = marquee.getBoundingClientRect().width;
        if (!marqueeWidth) return;

        track.innerHTML = "";

        const createWord = (isClone = false) => {
          const wordSpan = document.createElement("span");
          wordSpan.className = "feature-project__marquee-word";
          wordSpan.textContent = marqueeWord;
          if (isClone) {
            wordSpan.setAttribute("aria-hidden", "true");
          }
          return wordSpan;
        };

        const segment = document.createElement("div");
        segment.className = "feature-project__marquee-segment";
        segment.appendChild(createWord());
        track.appendChild(segment);

        while (segment.scrollWidth < marqueeWidth + 240) {
          segment.appendChild(createWord(true));
        }

        const clone = segment.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);

        const translateDistance = segment.scrollWidth;
        track.style.setProperty("--marquee-translate", `-${translateDistance}px`);
        const durationSeconds = Math.max(12, translateDistance / 50);
        track.style.setProperty("--marquee-duration", `${durationSeconds.toFixed(2)}s`);
        marquee.setAttribute("data-marquee-ready", "true");
      };

      buildMarquee();

      const handleResize = debounce(() => {
        buildMarquee();
      });

      window.addEventListener("resize", handleResize);
    });
  };

  initMarquee();

  // DON'T BLINK background eyes
  const eyesContainer = document.getElementById("dont-blink-eyes");
  if (eyesContainer) {
    const MAX_EYES = 36;
    const EYES_FPS = 30;
    const EYES_FRAME_MS = 1000 / EYES_FPS;
    const RECT_REFRESH_MS = 140;

    const GRID_LIMITS = {
      minCols: 3,
      maxCols: 9,
      minRows: 2,
      maxRows: 6,
      idealColWidth: 180,
      idealRowHeight: 120
    };

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let pointerDirty = true;
    const eyes = [];

    const randomRange = (min, max) => min + Math.random() * (max - min);

    const createEye = () => {
      const boxW = 140;
      const boxH = 90;
      const cx = boxW / 2;
      const cy = boxH / 2;
      const pupilR = 18;
      const id = `feature-eye-${Math.random().toString(36).slice(2)}`;
      const svgNS = "http://www.w3.org/2000/svg";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", `0 0 ${boxW} ${boxH}`);

      const almond = `M 8 ${cy} Q ${cx} ${-2} ${boxW - 8} ${cy} Q ${cx} ${boxH + 2} 8 ${cy} Z`;

      const defs = document.createElementNS(svgNS, "defs");
      const clip = document.createElementNS(svgNS, "clipPath");
      clip.setAttribute("id", id);
      const clipShape = document.createElementNS(svgNS, "path");
      clipShape.setAttribute("d", almond);
      clip.appendChild(clipShape);
      defs.appendChild(clip);
      svg.appendChild(defs);

      const sclera = document.createElementNS(svgNS, "path");
      sclera.setAttribute("d", almond);
      sclera.setAttribute("fill", "#f6f7fb");
      sclera.setAttribute("stroke", "#0c0c0c");
      sclera.setAttribute("stroke-width", "1");
      svg.appendChild(sclera);

      const g = document.createElementNS(svgNS, "g");
      g.setAttribute("clip-path", `url(#${id})`);

      const pupil = document.createElementNS(svgNS, "circle");
      pupil.setAttribute("cx", cx);
      pupil.setAttribute("cy", cy);
      pupil.setAttribute("r", pupilR);
      pupil.setAttribute("fill", "#1a1d23");
      g.appendChild(pupil);

      const lidTop = document.createElementNS(svgNS, "rect");
      lidTop.setAttribute("x", 0);
      lidTop.setAttribute("y", 0);
      lidTop.setAttribute("width", boxW);
      lidTop.setAttribute("height", boxH / 2 + 6);
      lidTop.setAttribute("fill", "#000");
      lidTop.classList.add("lid-top");
      g.appendChild(lidTop);

      const lidBottom = document.createElementNS(svgNS, "rect");
      lidBottom.setAttribute("x", 0);
      lidBottom.setAttribute("y", boxH / 2 - 6);
      lidBottom.setAttribute("width", boxW);
      lidBottom.setAttribute("height", boxH / 2 + 6);
      lidBottom.setAttribute("fill", "#000");
      lidBottom.classList.add("lid-bottom");
      g.appendChild(lidBottom);

      svg.appendChild(g);

      svg._state = {
        cx,
        cy,
        pupil,
        curX: cx,
        curY: cy,
        targetX: cx,
        targetY: cy,
        travel: randomRange(10, 26),
        rect: null,
        lastRectUpdate: 0
      };

      const cell = document.createElement("div");
      cell.className = "feature-eye";
      cell.appendChild(svg);
      return cell;
    };

    const computeGridShape = () => {
      const { clientWidth, clientHeight } = eyesContainer;
      const width = clientWidth || window.innerWidth || 1200;
      const height = clientHeight || 500;
      const approxCols = Math.round(width / GRID_LIMITS.idealColWidth);
      const approxRows = Math.round(height / GRID_LIMITS.idealRowHeight);
      const cols = Math.max(GRID_LIMITS.minCols, Math.min(GRID_LIMITS.maxCols, approxCols || GRID_LIMITS.minCols));
      const rows = Math.max(GRID_LIMITS.minRows, Math.min(GRID_LIMITS.maxRows, approxRows || GRID_LIMITS.minRows));
      return { rows, cols };
    };

    const buildEyes = () => {
      const { cols, rows } = computeGridShape();
      const expandedMultiplier = eyesContainer.getAttribute("data-eyes-expanded") === "true" ? 1.6 : 1;
      const needed = Math.min(MAX_EYES, Math.round(rows * cols * expandedMultiplier));

      if (eyes.length < needed) {
        const toAdd = needed - eyes.length;
        for (let i = 0; i < toAdd; i += 1) {
          const eye = createEye();
          eyes.push(eye);
          eyesContainer.appendChild(eye);
        }
      } else if (eyes.length > needed) {
        const toRemove = eyes.length - needed;
        const removed = eyes.splice(needed, toRemove);
        removed.forEach((eye) => eye.remove());
      }

      eyesContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(120px, 1fr))`;
      eyesContainer.style.gridTemplateRows = `repeat(${rows}, 140px)`;
    };
    // Expose a simple hook so other parts of the page can request a rebuild
    window.rebuildBlinkEyes = buildEyes;

    const updateEyeTargets = (svg, now, forceRectRefresh) => {
      const state = svg._state;
      if (!state) return;

      if (forceRectRefresh || !state.rect || now - state.lastRectUpdate > RECT_REFRESH_MS) {
        const rect = svg.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        state.rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        state.lastRectUpdate = now;
      }

      const rect = state.rect;
      if (!rect) return;

      const cxScreen = rect.left + (state.cx / svg.viewBox.baseVal.width) * rect.width;
      const cyScreen = rect.top + (state.cy / svg.viewBox.baseVal.height) * rect.height;
      const dx = mouseX - cxScreen;
      const dy = mouseY - cyScreen;
      const distance = Math.hypot(dx, dy) || 1;
      const maxTravel = state.travel;
      const clamped = Math.min(distance, maxTravel);
      const normX = dx / distance;
      const normY = dy / distance;
      state.targetX = state.cx + normX * clamped;
      state.targetY = state.cy + normY * clamped;
    };

    let eyesRafId = null;
    let eyesAnimating = false;
    let lastEyesFrame = 0;

    const animateEyes = (time) => {
      if (!eyesAnimating || document.hidden) {
        eyesRafId = null;
        return;
      }

      if (typeof time === "number") {
        if (time - lastEyesFrame < EYES_FRAME_MS) {
          eyesRafId = requestAnimationFrame(animateEyes);
          return;
        }
        lastEyesFrame = time;
      }

      const now = typeof time === "number" ? time : performance.now();
      const forceRectRefresh = pointerDirty;

      eyes.forEach((cell) => {
        const svg = cell.querySelector("svg");
        if (!svg || !svg._state) return;
        updateEyeTargets(svg, now, forceRectRefresh);
        const state = svg._state;
        state.curX += (state.targetX - state.curX) * 0.12;
        state.curY += (state.targetY - state.curY) * 0.12;
        state.pupil.setAttribute("cx", state.curX.toFixed(2));
        state.pupil.setAttribute("cy", state.curY.toFixed(2));
      });

      pointerDirty = false;
      eyesRafId = requestAnimationFrame(animateEyes);
    };

    const startEyes = () => {
      if (prefersReducedMotion) return;
      if (eyesAnimating) return;
      eyesAnimating = true;
      if (eyesRafId === null) {
        eyesRafId = requestAnimationFrame(animateEyes);
      }
    };

    const stopEyes = () => {
      eyesAnimating = false;
      if (eyesRafId !== null) {
        cancelAnimationFrame(eyesRafId);
        eyesRafId = null;
      }
    };

    const handlePointer = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      pointerDirty = true;
    };

    const handleTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      pointerDirty = true;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handlePointer, { passive: true });
      window.addEventListener("touchmove", handleTouch, { passive: true });
    }
    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildEyes();
        pointerDirty = true;
      }, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopEyes();
    });

    let usesEyesObserver = false;
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      usesEyesObserver = true;
      const section = document.getElementById("dont-blink") || eyesContainer;
      const eyesObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) startEyes();
          else stopEyes();
        },
        { root: null, threshold: 0.05 }
      );
      eyesObserver.observe(section);
    }

    buildEyes();
    if (!prefersReducedMotion && !usesEyesObserver) {
      startEyes();
    }
  }

  // --- Custom Audio Player ---
  const audioPlayer = document.querySelector('.audio-player');
  if (audioPlayer) {
    const audio = audioPlayer.querySelector('.audio-player__element');
    const playBtn = audioPlayer.querySelector('.audio-player__play-btn');
    const progressContainer = audioPlayer.querySelector('.audio-player__progress-container');
    const progressFill = audioPlayer.querySelector('.audio-player__progress-fill');
    const currentTimeEl = audioPlayer.querySelector('.audio-player__current-time');
    const durationEl = audioPlayer.querySelector('.audio-player__duration');
    
    const playIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;
    const pauseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/></svg>`;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.innerHTML = pauseIcon;
      } else {
        audio.pause();
        playBtn.innerHTML = playIcon;
      }
    });

    audio.addEventListener('timeupdate', () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    const setDuration = () => {
      if (!isNaN(audio.duration)) {
        durationEl.textContent = formatTime(audio.duration);
      }
    };

    if (audio.readyState >= 1) {
      setDuration();
    } else {
      audio.addEventListener('loadedmetadata', setDuration);
    }
    
    audio.addEventListener('ended', () => {
      playBtn.innerHTML = playIcon;
      progressFill.style.width = '0%';
      currentTimeEl.textContent = '0:00';
    });

    progressContainer.addEventListener('click', (e) => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    });
  }

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Registration Failed:', err));
  }
});
