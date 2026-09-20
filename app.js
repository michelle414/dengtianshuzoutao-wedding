document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. 宾客姓名
     ========================================= */

  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("guest");

  const guestCard = document.getElementById("guestCard");
  const guestNameElement = document.getElementById("guestName");

  if (guestName && guestNameElement) {
    guestNameElement.textContent = guestName;

    if (guestCard) {
      guestCard.style.display = "flex";
    }
  } else if (guestCard) {
    guestCard.style.display = "none";
  }


  /* =========================================
     2. 开启请柬
     
     点击后：
     第一页 → 第二页
     ========================================= */

  const openButton = document.getElementById("openInvitation");

  if (openButton) {
    openButton.addEventListener("click", () => {

      // 用户点击以后，允许播放背景音乐
      startMusic();

      // 滑到第二个完整页面
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    });
  }


  /* =========================================
     3. 背景音乐
     ========================================= */

  const music = document.getElementById("bgMusic");

  const musicButton =
    document.getElementById("musicToggle");

  function startMusic() {
    if (!music) return;

    music.volume = 0.45;

    music
      .play()
      .then(() => {
        if (musicButton) {
          musicButton.classList.add("playing");
        }
      })
      .catch(() => {
        // 手机浏览器禁止自动播放时，不做任何处理
      });
  }

  if (musicButton) {
    musicButton.addEventListener("click", () => {

      if (!music) return;

      if (music.paused) {
        startMusic();
      } else {
        music.pause();
        musicButton.classList.remove("playing");
      }

    });
  }


  /* =========================================
     4. 婚礼倒计时
     ========================================= */

  const weddingDate =
    new Date("2026-10-25T12:08:00+08:00");

  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  function updateCountdown() {

    const now = new Date();

    const difference =
      weddingDate.getTime() - now.getTime();


    if (difference <= 0) {

      if (daysElement)
        daysElement.textContent = "0";

      if (hoursElement)
        hoursElement.textContent = "00";

      if (minutesElement)
        minutesElement.textContent = "00";

      if (secondsElement)
        secondsElement.textContent = "00";

      return;
    }


    const days =
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );


    const minutes =
      Math.floor(
        (difference / (1000 * 60)) % 60
      );


    const seconds =
      Math.floor(
        (difference / 1000) % 60
      );


    if (daysElement)
      daysElement.textContent = days;

    if (hoursElement)
      hoursElement.textContent =
        String(hours).padStart(2, "0");

    if (minutesElement)
      minutesElement.textContent =
        String(minutes).padStart(2, "0");

    if (secondsElement)
      secondsElement.textContent =
        String(seconds).padStart(2, "0");
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* =========================================
     5. 滚动出现动画
     ========================================= */

  const revealElements =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
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


  /* =========================================
     6. RSVP
     ========================================= */

  const rsvpForm =
    document.getElementById("rsvpForm");


  if (rsvpForm) {

    rsvpForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const formData =
          new FormData(rsvpForm);


        const data = {

          guest:
            guestName || "",

          name:
            formData.get("name") || "",

          attendance:
            formData.get("attendance") || "",

          guests:
            formData.get("guests") || "",

          message:
            formData.get("message") || ""

        };


        console.log(
          "Wedding RSVP:",
          data
        );


        const successMessage =
          document.getElementById(
            "rsvpSuccess"
          );


        if (successMessage) {

          successMessage.textContent =
            "谢谢您的回复，我们婚礼见 ♡";

          successMessage.style.display =
            "block";
        }


        rsvpForm.reset();

      }
    );

  }

});
