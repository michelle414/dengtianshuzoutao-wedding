/* ==================================================
   婚礼基础资料
   以后修改婚礼时间，只需要修改这里
   ================================================== */

const weddingConfig = {

  weddingDate:
    "2026-10-25T12:08:00+08:00",

  welcome: {
    time: "11:00",
    cn: "迎宾",
    en: "WELCOME"
  },

  ceremony: {
    time: "12:08",
    cn: "婚礼仪式",
    en: "CEREMONY"
  },

  reception: {
    time: "12:18",
    cn: "喜宴",
    en: "RECEPTION"
  }

};


/* ==================================================
   页面加载
   ================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* ===============================================
       1. 宾客姓名
       =============================================== */

    const params =
      new URLSearchParams(
        window.location.search
      );

    const guestName =
      params.get("guest");


    const guestCard =
      document.getElementById(
        "guestCard"
      );

    const guestNameElement =
      document.getElementById(
        "guestName"
      );


    if (
      guestName &&
      guestName.trim() !== "" &&
      guestNameElement
    ) {

      guestNameElement.textContent =
        guestName.trim();

    } else if (guestCard) {

      guestCard.style.display =
        "none";

    }


    /* ===============================================
       2. 开启请柬
       =============================================== */

    const openButton =
      document.getElementById(
        "openInvitation"
      );

    const ourDay =
      document.getElementById(
        "ourDay"
      );


    if (openButton) {

      openButton.addEventListener(
        "click",
        () => {

          startMusic();


          if (ourDay) {

            ourDay.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    }


    /* ===============================================
       3. 音乐
       =============================================== */

    const music =
      document.getElementById(
        "bgMusic"
      );

    const musicButton =
      document.getElementById(
        "musicToggle"
      );


    function startMusic() {

      if (!music) return;

      music.volume = 0.45;

      music.play()
        .then(() => {

          if (musicButton) {

            musicButton.classList.add(
              "playing"
            );

          }

        })
        .catch(() => {

          // 手机浏览器阻止自动播放时
          // 不影响其他页面功能

        });

    }


    if (musicButton) {

      musicButton.addEventListener(
        "click",
        () => {

          if (!music) return;


          if (music.paused) {

            startMusic();

          } else {

            music.pause();

            musicButton.classList.remove(
              "playing"
            );

          }

        }
      );

    }


    /* ===============================================
       4. 生成 2026年10月日历
       =============================================== */

    createCalendar();


    function createCalendar() {

      const calendar =
        document.getElementById(
          "calendarGrid"
        );

      if (!calendar) return;


      const year = 2026;
      const month = 9;
      // JavaScript 月份从 0 开始
      // 9 = October


      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      /*
        2026年10月1日是星期四。

        我们的日历从 MON 开始，
        所以前面需要放 3 个空位。
      */

      const firstDay =
        new Date(
          year,
          month,
          1
        ).getDay();


      const mondayIndex =
        firstDay === 0
          ? 6
          : firstDay - 1;


      for (
        let i = 0;
        i < mondayIndex;
        i++
      ) {

        const empty =
          document.createElement(
            "div"
          );

        empty.className =
          "calendar-day empty";

        calendar.appendChild(
          empty
        );

      }


      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {

        const element =
          document.createElement(
            "div"
          );

        element.className =
          "calendar-day";


        if (day === 25) {

          element.classList.add(
            "wedding-day"
          );

        }


        element.textContent =
          day;


        calendar.appendChild(
          element
        );

      }

    }


    /* ===============================================
       5. 倒计时
       =============================================== */

    const countdownDays =
      document.getElementById(
        "countdownDays"
      );


    function updateCountdown() {

      if (!countdownDays) return;


      const now =
        new Date();


      const wedding =
        new Date(
          weddingConfig.weddingDate
        );


      const difference =
        wedding.getTime() -
        now.getTime();


      if (difference <= 0) {

        countdownDays.textContent =
          "0";

        return;

      }


      const days =
        Math.floor(
          difference /
          (1000 * 60 * 60 * 24)
        );


      countdownDays.textContent =
        days;

    }


    updateCountdown();

    setInterval(
      updateCountdown,
      1000
    );


    /* ===============================================
       6. 婚礼时间
       =============================================== */

    renderWeddingSchedule();


    function renderWeddingSchedule() {

      const container =
        document.getElementById(
          "weddingSchedule"
        );

      if (!container) return;


      const schedule = [

        weddingConfig.welcome,

        weddingConfig.ceremony,

        weddingConfig.reception

      ];


      schedule.forEach(
        (item) => {

          const row =
            document.createElement(
              "div"
            );

          row.className =
            "schedule-item";


          row.innerHTML = `

            <div class="schedule-time">
              ${item.time}
            </div>

            <div class="schedule-content">

              <strong>
                ${item.cn}
              </strong>

              <span>
                ${item.en}
              </span>

            </div>

          `;


          container.appendChild(
            row
          );

        }
      );

    }


    /* ===============================================
       7. 住宿登记
       =============================================== */

    const accommodationForm =
      document.getElementById(
        "accommodationForm"
      );

    const accommodationSuccess =
      document.getElementById(
        "accommodationSuccess"
      );


    if (accommodationForm) {

      accommodationForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          const formData =
            new FormData(
              accommodationForm
            );


          const data = {

            guest:
              guestName || "",

            name:
              formData.get(
                "name"
              ),

            people:
              formData.get(
                "people"
              ),

            date:
              formData.get(
                "date"
              ),

            note:
              formData.get(
                "note"
              ),

            createdAt:
              new Date().toISOString()

          };


          localStorage.setItem(
            "wedding-accommodation",
            JSON.stringify(data)
          );


          if (
            accommodationSuccess
          ) {

            accommodationSuccess.textContent =
              "已收到您的住宿登记，谢谢。";

          }


          accommodationForm.reset();

        }
      );

    }


    /* ===============================================
       8. 亲友祝福
       =============================================== */

    const blessingForm =
      document.getElementById(
        "blessingForm"
      );

    const blessingSuccess =
      document.getElementById(
        "blessingSuccess"
      );

    const blessingWall =
      document.getElementById(
        "blessingWall"
      );


    if (blessingForm) {

      blessingForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          const formData =
            new FormData(
              blessingForm
            );


          const blessing = {

            name:
              formData.get(
                "name"
              ),

            message:
              formData.get(
                "message"
              ),

            createdAt:
              new Date().toISOString()

          };


          const oldBlessings =
            JSON.parse(
              localStorage.getItem(
                "wedding-blessings"
              ) || "[]"
            );


          oldBlessings.push(
            blessing
          );


          localStorage.setItem(
            "wedding-blessings",
            JSON.stringify(
              oldBlessings
            )
          );


          if (
            blessingSuccess
          ) {

            blessingSuccess.textContent =
              "谢谢你的祝福 ♡";

          }


          blessingForm.reset();


          renderBlessings();

        }
      );

    }


    function renderBlessings() {

      if (!blessingWall) return;


      const blessings =
        JSON.parse(
          localStorage.getItem(
            "wedding-blessings"
          ) || "[]"
        );


      blessingWall.innerHTML = "";


      blessings.forEach(
        (item) => {

          const element =
            document.createElement(
              "div"
            );

          element.className =
            "blessing-item";


          const name =
            document.createElement(
              "div"
            );

          name.className =
            "blessing-item-name";

          name.textContent =
            item.name;


          const message =
            document.createElement(
              "div"
            );

          message.className =
            "blessing-item-message";

          message.textContent =
            item.message;


          element.appendChild(
            name
          );

          element.appendChild(
            message
          );


          blessingWall.appendChild(
            element
          );

        }
      );

    }


    renderBlessings();

  }
);
