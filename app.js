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

     如果没有 guest 参数，
     就不会显示宾客姓名。
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const params = new URLSearchParams(window.location.search);
const guestName = params.get("guest");

const guestCard = document.getElementById("guestCard");
const guestNameElement = document.getElementById("guestName");

if (guestName && guestName.trim()) {
  const cleanGuestName = guestName.trim();

  guestNameElement.textContent = cleanGuestName;
} else {
  guestCard.style.display = "none";
}

  /* =====================================================
     2. 开启请柬
     -----------------------------------------------------
     点击以后：
     - 页面向下滑
     - 尝试播放音乐
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


  if (openInvitation) {

    openInvitation.addEventListener("click", async () => {

      /*
       * 用户主动点击按钮，
       * 这是浏览器允许网页启动音乐的最佳时机。
       */

      try {

        await bgMusic.play();

        musicPlaying = true;

        musicButton.classList.add("playing");

      } catch (error) {

        /*
         * 如果音乐因为浏览器策略没有播放，
         * 不影响网站正常使用。
         */

        console.log("音乐暂时无法自动播放。");

      }


      /*
       * 平滑进入正式请柬
       */

      invitation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  }


  /* =====================================================
     3. 音乐播放 / 暂停
  ===================================================== */

  if (musicButton) {

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

  }


  /*
   * 如果音乐因为系统原因暂停，
   * 同步按钮状态。
   */

  bgMusic.addEventListener("pause", () => {

    musicPlaying = false;

    musicButton.classList.remove("playing");

  });


  bgMusic.addEventListener("play", () => {

    musicPlaying = true;

    musicButton.classList.add("playing");

  });


  /* =====================================================
     4. 婚礼倒计时
     -----------------------------------------------------
     婚礼时间：
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

    const now = Date.now();

    const distance = weddingDate - now;


    /*
     * 婚礼已经开始
     */

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


  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            /*
             * 出现过一次以后就不用重复动画。
             */

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


  /* =====================================================
     6. RSVP
     -----------------------------------------------------
     第一阶段先做前端确认。
     
     真正保存到后台数据库的功能，
     下一阶段再接入。
  ===================================================== */

  const rsvpForm =
    document.getElementById("rsvpForm");

  const rsvpResult =
    document.getElementById("rsvpResult");


  if (rsvpForm) {

    rsvpForm.addEventListener("submit", (event) => {

      event.preventDefault();


      const name =
        document.getElementById("rsvpName").value.trim();

      const attendance =
        document.getElementById("rsvpAttendance").value;

      const people =
        document.getElementById("rsvpPeople").value;

      const message =
        document.getElementById("rsvpMessage").value.trim();


      if (!name) {

        rsvpResult.textContent =
          "请填写您的姓名。";

        return;

      }


      /*
       * 现在先给用户一个确认。
       * 下一阶段会把这些数据真正保存下来。
       */

      if (attendance === "yes") {

        rsvpResult.textContent =
          `谢谢 ${name}！我们会在婚礼当天等你，一共 ${people} 人。`;

      } else {

        rsvpResult.textContent =
          `谢谢 ${name} 的祝福，我们会一直记得。`;

      }


      console.log("RSVP:", {
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
