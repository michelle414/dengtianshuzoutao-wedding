/* =====================================================
   邓天澍 & 邹涛 · Wedding Invitation
   app.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. 读取宾客姓名
     -----------------------------------------------------
     网址示例：
     ?guest=邹小明

     有 guest：
     显示专属宾客姓名

     没有 guest：
     隐藏宾客专属区域
  ===================================================== */

  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("guest");

  const guestCard = document.getElementById("guestCard");
  const guestNameElement = document.getElementById("guestName");

  if (
    guestCard &&
    guestNameElement &&
    guestName &&
    guestName.trim()
  ) {
    const cleanGuestName = guestName.trim();

    guestNameElement.textContent = cleanGuestName;

    guestCard.classList.add("has-guest");

  } else if (guestCard) {

    guestCard.style.display = "none";

  }


  /* =====================================================
     2. 开启请柬
  ===================================================== */

  const openInvitation =
    document.getElementById("openInvitation");

  const invitation =
    document.getElementById("invitation");

  const bgMusic =
    document.getElementById("bgMusic");

  const musicButton =
    document.getElementById("musicButton");

  let musicPlaying = false;


  if (openInvitation && invitation) {

    openInvitation.addEventListener("click", async () => {

      /* 尝试播放音乐 */

      if (bgMusic) {

        try {

          await bgMusic.play();

          musicPlaying = true;

          if (musicButton) {
            musicButton.classList.add("playing");
          }

        } catch (error) {

          console.log("音乐暂时无法自动播放。");

        }

      }


      /* 进入正式请柬 */

      invitation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  }


  /* =====================================================
     3. 音乐播放 / 暂停
  ===================================================== */

  if (musicButton && bgMusic) {

    musicButton.addEventListener("click", async () => {

      if (!musicPlaying) {

        try {

          await bgMusic.play();

          musicPlaying = true;

          musicButton.classList.add("playing");

        } catch (error) {

          console.log("音乐播放失败。");

        }

      } else {

        bgMusic.pause();

        musicPlaying = false;

        musicButton.classList.remove("playing");

      }

    });


    bgMusic.addEventListener("pause", () => {

      musicPlaying = false;

      musicButton.classList.remove("playing");

    });


    bgMusic.addEventListener("play", () => {

      musicPlaying = true;

      musicButton.classList.add("playing");

    });

  }


  /* =====================================================
     4. 婚礼倒计时
     -----------------------------------------------------
     2026-10-25 12:08
     中国时间 UTC+8
  ===================================================== */

  const weddingDate =
    new Date("2026-10-25T12:08:00+08:00").getTime();


  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  function updateCountdown() {

    if (
      !daysElement ||
      !hoursElement ||
      !minutesElement ||
      !secondsElement
    ) {
      return;
    }


    const now = Date.now();

    const distance = weddingDate - now;


    /* 婚礼已经开始 */

    if (distance <= 0) {

      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;

    }


    const days =
      Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours =
      Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
      );

    const minutes =
      Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
      );

    const seconds =
      Math.floor(
        (distance % (1000 * 60))
        / 1000
      );


    daysElement.textContent =
      String(days).padStart(2, "0");

    hoursElement.textContent =
      String(hours).padStart(2, "0");

    minutesElement.textContent =
      String(minutes).padStart(2, "0");

    secondsElement.textContent =
      String(seconds).padStart(2, "0");

  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* =====================================================
     5. 滑动出现动画
  ===================================================== */

  const revealElements =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              revealObserver.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.15
        }
      );


    revealElements.forEach((element) => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach((element) => {

      element.classList.add("visible");

    });

  }


  /* =====================================================
     6. RSVP
     -----------------------------------------------------
     第一阶段：
     只做前端确认

     下一阶段：
     接入 Cloudflare Worker + D1
  ===================================================== */

  const rsvpForm =
    document.getElementById("rsvpForm");

  const rsvpResult =
    document.getElementById("rsvpResult");


  if (rsvpForm) {

    rsvpForm.addEventListener("submit", (event) => {

      event.preventDefault();


      const nameElement =
        document.getElementById("rsvpName");

      const attendanceElement =
        document.getElementById("rsvpAttendance");

      const peopleElement =
        document.getElementById("rsvpPeople");

      const messageElement =
        document.getElementById("rsvpMessage");


      const name =
        nameElement
          ? nameElement.value.trim()
          : "";


      const attendance =
        attendanceElement
          ? attendanceElement.value
          : "";


      const people =
        peopleElement
          ? peopleElement.value
          : "1";


      const message =
        messageElement
          ? messageElement.value.trim()
          : "";


      if (!name) {

        if (rsvpResult) {

          rsvpResult.textContent =
            "请填写您的姓名。";

        }

        return;

      }


      if (!rsvpResult) {
        return;
      }


      if (attendance === "yes") {

        rsvpResult.textContent =
          `谢谢 ${name}！我们会在婚礼当天等你，一共 ${people} 人。`;

      } else {

        rsvpResult.textContent =
          `谢谢 ${name} 的祝福，我们会一直记得。`;

      }


      console.log("RSVP:", {
        guestFromUrl: guestName || null,
        name,
        attendance,
        people,
        message
      });

    });

  }


  /* =====================================================
     7. 防止页面打开时自动跳到中间
  ===================================================== */

  if ("scrollRestoration" in history) {

    history.scrollRestoration = "manual";

  }

});
