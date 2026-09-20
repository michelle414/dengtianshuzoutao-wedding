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


document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =================================================
       GUEST NAME
    ================================================= */

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

    const guestElement =
      document.getElementById(
        "guestName"
      );


    if (
      guestName &&
      guestName.trim()
    ) {

      guestElement.textContent =
        guestName.trim();

    } else {

      guestCard.style.display =
        "none";

    }



    /* =================================================
       MUSIC
    ================================================= */

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

      music.volume = 0.38;


      music
        .play()
        .then(() => {

          musicButton
            ?.classList
            .add("playing");

        })
        .catch(() => {});

    }


    if (musicButton) {

      musicButton.addEventListener(
        "click",
        () => {

          if (music.paused) {

            startMusic();

          } else {

            music.pause();

            musicButton
              .classList
              .remove("playing");

          }

        }
      );

    }



    /* =================================================
       OPEN INVITATION
    ================================================= */

    const openButton =
      document.getElementById(
        "openInvitation"
      );


    if (openButton) {

      openButton.addEventListener(
        "click",
        () => {

          startMusic();


          document
            .getElementById("ourDay")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

        }
      );

    }



    /* =================================================
       CALENDAR
    ================================================= */

    function createCalendar() {

      const calendar =
        document.getElementById(
          "calendarGrid"
        );


      if (!calendar) return;


      const year = 2026;

      // JavaScript 月份从 0 开始
      // 9 = October

      const month = 9;


      const days =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      const firstDay =
        new Date(
          year,
          month,
          1
        ).getDay();


      // 转成 Monday = 0

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
        day <= days;
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


    createCalendar();



    /* =================================================
       COUNTDOWN
    ================================================= */

    const countdown =
      document.getElementById(
        "countdownDays"
      );


    function updateCountdown() {

      if (!countdown) return;


      const now =
        new Date();


      const wedding =
        new Date(
          weddingConfig.weddingDate
        );


      const difference =
        wedding.getTime()
        -
        now.getTime();


      if (difference <= 0) {

        countdown.textContent =
          "0";

        return;

      }


      const days =
        Math.floor(
          difference /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      countdown.textContent =
        days;

    }


    updateCountdown();


    setInterval(
      updateCountdown,
      1000
    );



    /* =================================================
       WEDDING SCHEDULE
    ================================================= */

    function renderSchedule() {

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


    renderSchedule();



    /* =================================================
       ACCOMMODATION
    ================================================= */

    const accommodationForm =
      document.getElementById(
        "accommodationForm"
      );


    const accommodationMessage =
      document.getElementById(
        "accommodationSuccess"
      );


    if (accommodationForm) {

      accommodationForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          const data =
            new FormData(
              accommodationForm
            );


          const accommodation = {

            guest:
              guestName || "",

            name:
              data.get("name"),

            people:
              data.get("people"),

            date:
              data.get("date"),

            note:
              data.get("note"),

            createdAt:
              new Date()
                .toISOString()

          };


          localStorage.setItem(

            "wedding-accommodation",

            JSON.stringify(
              accommodation
            )

          );


          accommodationMessage.textContent =
            "已收到您的住宿登记，谢谢。";


          accommodationForm.reset();

        }
      );

    }



    /* =================================================
       BLESSINGS
    ================================================= */

    const blessingForm =
      document.getElementById(
        "blessingForm"
      );


    const blessingMessage =
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


          const data =
            new FormData(
              blessingForm
            );


          const blessing = {

            name:
              data.get("name"),

            message:
              data.get("message"),

            createdAt:
              new Date()
                .toISOString()

          };


          const existing =
            JSON.parse(

              localStorage.getItem(
                "wedding-blessings"
              )

              || "[]"

            );


          existing.push(
            blessing
          );


          localStorage.setItem(

            "wedding-blessings",

            JSON.stringify(
              existing
            )

          );


          blessingMessage.textContent =
            "谢谢你的祝福 ♡";


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
          )

          || "[]"

        );


      blessingWall.innerHTML =
        "";


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
