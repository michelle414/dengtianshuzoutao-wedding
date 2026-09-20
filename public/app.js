const weddingConfig = {
  groom: "邓天澍",
  bride: "邹涛",

  groomLatin: "TIANSHU",
  brideLatin: "TAO",

  year: 2026,
  month: 10,
  day: 25,

  lunarDate: "丙午年九月十六",

  weddingDateTime: "2026-10-25T12:08:00+08:00",

  venue: "吉安宾馆·礼堂",

  address: "中国·江西·吉安·吉州区沿江路99号",

  mapUrl: "https://surl.amap.com/1qtd9gB5ti",

  music: "Shortcut To Heaven.mp3",

  schedule: [
    {
      time: "11:00",
      title: "迎宾",
      english: "WELCOME"
    },
    {
      time: "12:08",
      title: "婚礼仪式",
      english: "CEREMONY"
    },
    {
      time: "12:18",
      title: "喜宴",
      english: "RECEPTION"
    }
  ]
};


/* =========================================================
   DOM
========================================================= */

const bgMusic =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

const openInvitation =
  document.getElementById("openInvitation");

const guestCard =
  document.getElementById("guestCard");

const guestNameElement =
  document.getElementById("guestName");

const mapButton =
  document.getElementById("mapButton");

const mapImageLink =
  document.getElementById("mapImageLink");

const scheduleElement =
  document.getElementById("weddingSchedule");


/* =========================================================
   GUEST NAME
========================================================= */

const params =
  new URLSearchParams(
    window.location.search
  );

const guestName =
  (params.get("guest") || "").trim();


if (guestName) {

  if (guestNameElement) {
    guestNameElement.textContent =
      guestName;
  }

} else {

  if (guestNameElement) {
    guestNameElement.textContent =
      "亲爱的朋友";
  }

}


/* =========================================================
   MAP
========================================================= */

if (mapButton) {
  mapButton.href =
    weddingConfig.mapUrl;
}

if (mapImageLink) {
  mapImageLink.href =
    weddingConfig.mapUrl;
}


/* =========================================================
   MUSIC
========================================================= */

if (bgMusic) {

  const source =
    bgMusic.querySelector("source");

  if (source) {
    source.src =
      weddingConfig.music;

    bgMusic.load();
  }

  bgMusic.volume = 0.06;
}


let musicFadeFrame = null;


function startMusic() {

  if (!bgMusic) return;

  if (musicFadeFrame) {
    cancelAnimationFrame(
      musicFadeFrame
    );
  }


  bgMusic.volume = 0.06;


  bgMusic
    .play()
    .then(() => {

      if (musicToggle) {
        musicToggle.classList.add(
          "playing"
        );
      }


      const start =
        performance.now();

      const duration =
        2600;

      function fade(current) {

        const progress =
          Math.min(
            (current - start) /
              duration,
            1
          );

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );

        bgMusic.volume =
          0.06 +
          (0.22 - 0.06) *
            eased;


        if (progress < 1) {

          musicFadeFrame =
            requestAnimationFrame(
              fade
            );

        }

      }

      musicFadeFrame =
        requestAnimationFrame(
          fade
        );

    })
    .catch(() => {});

}


if (musicToggle) {

  musicToggle.addEventListener(
    "click",
    () => {

      if (!bgMusic) return;


      if (bgMusic.paused) {

        startMusic();

      } else {

        bgMusic.pause();

        musicToggle.classList.remove(
          "playing"
        );

      }

    }
  );

}


/* =========================================================
   OPEN INVITATION
========================================================= */

if (openInvitation) {

  openInvitation.addEventListener(
    "click",
    () => {

      startMusic();


      const target =
        document.getElementById(
          "ourDay"
        );


      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}


/* =========================================================
   CALENDAR
========================================================= */

function createCalendar() {

  const calendar =
    document.getElementById(
      "calendarGrid"
    );

  if (!calendar) return;


  calendar.innerHTML = "";


  const year =
    weddingConfig.year;

  const monthIndex =
    weddingConfig.month - 1;


  const firstDay =
    new Date(
      year,
      monthIndex,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      year,
      monthIndex + 1,
      0
    ).getDate();


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


    if (
      day === weddingConfig.day
    ) {

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


/* =========================================================
   COUNTDOWN
========================================================= */

const countdown =
  document.getElementById(
    "countdownDays"
  );


function updateCountdown() {

  if (!countdown) return;


  const now =
    Date.now();


  const wedding =
    new Date(
      weddingConfig.weddingDateTime
    ).getTime();


  const difference =
    wedding - now;


  if (difference <= 0) {

    countdown.textContent = "0";

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


/* =========================================================
   WEDDING SCHEDULE
========================================================= */

if (scheduleElement) {

  scheduleElement.innerHTML =
    weddingConfig.schedule
      .map((item) => {

        return `
          <div class="schedule-item">

            <div class="schedule-time">
              ${item.time}
            </div>

            <div class="schedule-dot"></div>

            <div class="schedule-content">

              <strong>
                ${item.title}
              </strong>

              <span>
                ${item.english}
              </span>

            </div>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   RSVP
========================================================= */

const rsvpForm =
  document.getElementById(
    "rsvpForm"
  );

const attendingFields =
  document.getElementById(
    "attendingFields"
  );

const stayDate =
  document.getElementById(
    "stayDate"
  );

const rsvpSuccess =
  document.getElementById(
    "rsvpSuccess"
  );


let attendance = "";
let accommodation = "";


/* 出席 */

document
  .querySelectorAll(
    ".attendance-option"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".attendance-option"
          )
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );

          });


        button.classList.add(
          "selected"
        );


        attendance =
          button.dataset.attendance;


        if (rsvpForm) {
          rsvpForm.classList.add(
            "active"
          );
        }


        if (attendingFields) {

          if (
            attendance === "yes"
          ) {

            attendingFields.style.display =
              "block";

          } else {

            attendingFields.style.display =
              "none";

          }

        }

      }
    );

  });


/* 住宿 */

document
  .querySelectorAll(
    ".stay-options button"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".stay-options button"
          )
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );

          });


        button.classList.add(
          "selected"
        );


        accommodation =
          button.dataset.stay;


        if (stayDate) {

          stayDate.style.display =
            accommodation === "yes"
              ? "block"
              : "none";

        }

      }
    );

  });


/* 提交 */

if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const formData =
        new FormData(
          rsvpForm
        );


      const data = {

        guest:
          guestName,

        name:
          formData.get("name") || "",

        attendance,

        people:
          formData.get("people") || "",

        accommodation,

        date:
          formData.get("date") || "",

        message:
          formData.get("message") || "",

        submittedAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        "weddingRSVP",
        JSON.stringify(data)
      );


      if (rsvpSuccess) {

        rsvpSuccess.textContent =
          "谢谢你，我们已经收到你的回复。";

        rsvpSuccess.classList.add(
          "show"
        );

      }

    }
  );

}


/* =========================================================
   FADE REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


if (
  "IntersectionObserver"
  in window
) {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(
    (element) => {

      observer.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "is-visible"
      );

    }
  );

}
