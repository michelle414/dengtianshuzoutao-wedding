document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     1. 获取宾客姓名
     ========================= */

  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("guest");

  const guestCard = document.getElementById("guestCard");
  const guestNameElement = document.getElementById("guestName");

  if (guestName && guestNameElement) {
    guestNameElement.textContent = guestName;
  } else if (guestCard) {
    guestCard.style.display = "none";
  }


  /* =========================
     2. 开启请柬按钮
     ========================= */

  const openButton = document.querySelector(
    ".open-invitation, #openInvitation, .open-btn"
  );

  const detailsSection =
    document.getElementById("details") ||
    document.querySelector(".details-section") ||
    document.querySelector(".wedding-section") ||
    document.querySelector("main section:nth-of-type(2)");

  if (openButton) {
    openButton.addEventListener("click", () => {

      // 播放音乐
      startMusic();

      // 页面向下滚动
      if (detailsSection) {
        detailsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth"
        });
      }
    });
  }


  /* =========================
     3. 背景音乐
     ========================= */

  const music = document.getElementById("bgMusic");
  const musicButton =
    document.getElementById("musicToggle") ||
    document.querySelector(".music-toggle");

  let musicStarted = false;

  function startMusic() {
    if (!music) return;

    music.volume = 0.45;

    music.play()
      .then(() => {
        musicStarted = true;

        if (musicButton) {
          musicButton.classList.add("playing");
          musicButton.textContent = "♫";
        }
      })
      .catch(() => {
        // 手机浏览器禁止播放时，不报错
      });
  }

  function toggleMusic() {
    if (!music) return;

    if (music.paused) {
      startMusic();
    } else {
      music.pause();

      if (musicButton) {
        musicButton.classList.remove("playing");
        musicButton.textContent = "♫";
      }
    }
  }

  if (musicButton) {
    musicButton.addEventListener("click", toggleMusic);
  }

  if (music) {
    music.addEventListener("play", () => {
      if (musicButton) {
        musicButton.classList.add("playing");
        musicButton.textContent = "♫";
      }
    });

    music.addEventListener("pause", () => {
      if (musicButton) {
        musicButton.classList.remove("playing");
        musicButton.textContent = "♫";
      }
    });
  }


  /* =========================
     4. 婚礼倒计时
     ========================= */

  const weddingDate = new Date("2026-10-25T12:08:00+08:00");

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const difference = weddingDate - now;

    if (difference <= 0) {
      if (daysElement) daysElement.textContent = "0";
      if (hoursElement) hoursElement.textContent = "0";
      if (minutesElement) minutesElement.textContent = "0";
      if (secondsElement) secondsElement.textContent = "0";
      return;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    if (daysElement) daysElement.textContent = days;
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, "0");
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, "0");
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================
     5. 页面滚动出现动画
     ========================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .story-section, .wedding-section, .photo-section, .rsvp-section"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =========================
     6. RSVP
     ========================= */

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(rsvpForm);

      const data = {
        guest: guestName || "",
        name: formData.get("name") || "",
        attendance: formData.get("attendance") || "",
        guests: formData.get("guests") || "",
        message: formData.get("message") || ""
      };

      console.log("RSVP:", data);

      const successMessage =
        document.getElementById("rsvpSuccess");

      if (successMessage) {
        successMessage.textContent =
          "谢谢您的回复，我们婚礼见 ♡";
        successMessage.style.display = "block";
      }

      rsvpForm.reset();
    });
  }
});
