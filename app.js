/* =====================================================
   邓天澍 & 邹涛 · Wedding Invitation
   app.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


  /* =====================================================
     1. 宾客姓名
     
     示例：
     ?guest=邹小明

     页面显示：
     邹小明
     诚邀您出席
  ===================================================== */

  const params =
    new URLSearchParams(window.location.search);

  const guestName =
    params.get("guest");


  const guestCard =
    document.getElementById("guestCard");

  const guestNameElement =
    document.getElementById("guestName");


  if (
    guestName &&
    guestName.trim() &&
    guestNameElement
  ) {

    const cleanGuestName =
      guestName.trim();

    guestNameElement.textContent =
      cleanGuestName;

  } else if (guestCard) {

    /*
     * 没有宾客姓名时，
     * 隐藏整个宾客区域。
     */

    guestCard.style.display =
      "none";

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


  if (
    openInvitation &&
    invitation
  ) {

    openInvitation.addEventListener(
      "click",
      async () => {

        /*
         * 用户主动点击，
         * 手机浏览器通常允许此时播放音乐。
         */

        if (bgMusic) {

          try {

            await bgMusic.play();

            musicPlaying = true;

            if (musicButton) {

              musicButton.classList.add(
                "playing"
              );

            }

          } catch (error) {

            console.log(
              "音乐暂时无法自动播放。"
            );

          }

        }


        /*
         * 滑动进入正式请柬
         */

        invitation.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  }



  /* =====================================================
     3. 音乐播放 / 暂停
  ===================================================== */

  if (
    musicButton &&
    bgMusic
  ) {

    musicButton.addEventListener(
      "click",
      async () => {

        if (!musicPlaying) {

          try {

            await bgMusic.play();

          } catch (error) {

            console.log(
              "音乐播放失败。"
            );

          }

        } else {

          bgMusic.pause();

        }

      }
    );


    /*
     * 音乐真正开始播放
     */

    bgMusic.addEventListener(
      "play",
      () => {

        musicPlaying = true;

        musicButton.classList.add(
          "playing"
        );

      }
    );


    /*
     * 音乐暂停
     */

    bgMusic.addEventListener(
      "pause",
      () => {

        musicPlaying = false;

        musicButton.classList.remove(
          "playing"
        );

      }
    );

  }



  /* =====================================================
     4. 婚礼倒计时
     
     2026年10月25日 12:08
     中国时间 UTC+8
  ===================================================== */

  const weddingDate =
    new Date(
      "2026-10-25T12:08:00+08:00"
    ).getTime();


  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  function updateCountdown() {

    const now =
      Date.now();

    const distance =
      weddingDate - now;


    /*
     * 婚礼已经开始
     */

    if (distance <= 0) {

      if (daysElement)
        daysElement.textContent = "00";

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
        distance /
        (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        (
          distance %
          (1000 * 60 * 60 * 24)
        ) /
        (1000 * 60 * 60)
      );


    const minutes =
      Math.floor(
        (
          distance %
          (1000 * 60 * 60)
        ) /
        (1000 * 60)
      );


    const seconds =
      Math.floor(
        (
          distance %
          (1000 * 60)
        ) /
        1000
      );


    if (daysElement) {

      daysElement.textContent =
        String(days).padStart(2, "0");

    }


    if (hoursElement) {

      hoursElement.textContent =
        String(hours).padStart(2, "0");

    }


    if (minutesElement) {

      minutesElement.textContent =
        String(minutes).padStart(2, "0");

    }


    if (secondsElement) {

      secondsElement.textContent =
        String(seconds).padStart(2, "0");

    }

  }


  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );



  /* =====================================================
     5. 滑动出现动画
  ===================================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                revealObserver.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.15
        }
      );


    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    /*
     * 老浏览器兼容
     */

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "visible"
        );

      }
    );

  }



  /* =====================================================
     6. RSVP
     
     目前先做前端确认。
     后面再接真正数据库。
  ===================================================== */

  const rsvpForm =
    document.getElementById(
      "rsvpForm"
    );

  const rsvpResult =
    document.getElementById(
      "rsvpResult"
    );


  if (rsvpForm) {

    rsvpForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const name =
          document
            .getElementById("rsvpName")
            .value
            .trim();


        const attendance =
          document
            .getElementById(
              "rsvpAttendance"
            )
            .value;


        const people =
          document
            .getElementById(
              "rsvpPeople"
            )
            .value;


        const message =
          document
            .getElementById(
              "rsvpMessage"
            )
            .value
            .trim();


        if (!name) {

          rsvpResult.textContent =
            "请填写您的姓名。";

          return;

        }


        if (
          attendance === "yes"
        ) {

          rsvpResult.textContent =
            `谢谢 ${name}！我们会在婚礼当天等你，一共 ${people} 人。`;

        } else {

          rsvpResult.textContent =
            `谢谢 ${name} 的祝福，我们会一直记得。`;

        }


        console.log(
          "RSVP:",
          {
            name,
            attendance,
            people,
            message
          }
        );

      }
    );

  }



  /* =====================================================
     7. 防止浏览器记住上一次滚动位置
  ===================================================== */

  if (
    "scrollRestoration"
    in history
  ) {

    history.scrollRestoration =
      "manual";

  }

});
