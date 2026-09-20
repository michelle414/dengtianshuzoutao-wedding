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

  photos: [],

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


/* =========================
   DOM
========================= */

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const openInvitation = document.getElementById("openInvitation");

const guestNameElement = document.getElementById("guestName");

const mapButton = document.getElementById("mapButton");
const mapImageLink = document.getElementById("mapImageLink");

const scheduleElement = document.getElementById("schedule");


/* =========================
   Guest Name
   ========================= */

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("guest") || "";
}

const guestName = getGuestName();

if (guestNameElement) {
  if (guestName) {
    guestNameElement.textContent = guestName;
  } else {
    guestNameElement.textContent = "亲爱的朋友";
  }
}


/* =========================
   Couple Names
========================= */

const groomElements = document.querySelectorAll("[data-groom]");
groomElements.forEach((element) => {
  element.textContent = weddingConfig.groom;
});

const brideElements = document.querySelectorAll("[data-bride]");
brideElements.forEach((element) => {
  element.textContent = weddingConfig.bride;
});

const groomLatinElements = document.querySelectorAll("[data-groom-latin]");
groomLatinElements.forEach((element) => {
  element.textContent = weddingConfig.groomLatin;
});

const brideLatinElements = document.querySelectorAll("[data-bride-latin]");
brideLatinElements.forEach((element) => {
  element.textContent = weddingConfig.brideLatin;
});


/* =========================
   Hero Date
   第一页：
   丙午年九月十六 · 星期日
========================= */

const heroDateSub = document.querySelector(".hero-date-sub");

if (heroDateSub) {
  heroDateSub.innerHTML = `
    <span class="hero-date-lunar">${weddingConfig.lunarDate}</span>
    <span class="hero-date-divider">·</span>
    <span class="hero-date-week-cn">星期日</span>
  `;
}


/* =========================
   Date Information
========================= */

const venueElements = document.querySelectorAll("[data-venue]");
venueElements.forEach((element) => {
  element.textContent = weddingConfig.venue;
});

const addressElements = document.querySelectorAll("[data-address]");
addressElements.forEach((element) => {
  element.textContent = weddingConfig.address;
});


/* =========================
   Map
========================= */

if (mapButton) {
  mapButton.href = weddingConfig.mapUrl;
}

if (mapImageLink) {
  mapImageLink.href = weddingConfig.mapUrl;
}


/* =========================
   Music
========================= */

let musicStarted = false;
let fadeFrame = null;

if (bgMusic) {
  const source = bgMusic.querySelector("source");

  if (source) {
    source.src = weddingConfig.music;
    bgMusic.load();
  }

  bgMusic.volume = 0.08;
}


/* 音乐淡入 */

function fadeMusicIn() {
  if (!bgMusic) return;

  if (fadeFrame) {
    cancelAnimationFrame(fadeFrame);
  }

  const startVolume = 0.08;
  const targetVolume = 0.25;
  const duration = 2500;

  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    bgMusic.volume =
      startVolume +
      (targetVolume - startVolume) * easedProgress;

    if (progress < 1) {
      fadeFrame = requestAnimationFrame(animate);
    }
  }

  bgMusic.volume = startVolume;
  fadeFrame = requestAnimationFrame(animate);
}


/* 开始播放 */

async function startMusic() {
  if (!bgMusic) return;

  try {
    bgMusic.volume = 0.08;

    await bgMusic.play();

    musicStarted = true;

    fadeMusicIn();

    if (musicToggle) {
      musicToggle.classList.add("is-playing");
    }
  } catch (error) {
    console.log("Music playback was blocked:", error);
  }
}


/* 音乐按钮 */

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", async () => {

    if (bgMusic.paused) {
      try {
        await bgMusic.play();

        musicStarted = true;

        fadeMusicIn();

        musicToggle.classList.add("is-playing");
      } catch (error) {
        console.log("Music playback failed:", error);
      }

    } else {
      bgMusic.pause();
      musicToggle.classList.remove("is-playing");
    }

  });
}


/* =========================
   Open Invitation
========================= */

if (openInvitation) {
  openInvitation.addEventListener("click", async () => {

    await startMusic();

    const target = document.getElementById("our-day");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


/* =========================
   Calendar
========================= */

function renderCalendar() {

  const calendar = document.getElementById("calendar");

  if (!calendar) return;

  const year = weddingConfig.year;
  const month = weddingConfig.month;

  const firstDay = new Date(year, month - 1, 1).getDay();

  const daysInMonth =
    new Date(year, month, 0).getDate();

  const weekdays = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
  ];

  let html = "";

  weekdays.forEach((day) => {
    html += `
      <div class="calendar-weekday">
        ${day}
      </div>
    `;
  });

  for (let i = 0; i < firstDay; i++) {
    html += `
      <div class="calendar-empty"></div>
    `;
  }

  for (let day = 1; day <= daysInMonth; day++) {

    const isWeddingDay =
      day === weddingConfig.day;

    html += `
      <div class="calendar-day ${isWeddingDay ? "is-wedding-day" : ""}">
        ${day}
      </div>
    `;
  }

  calendar.innerHTML = html;
}

renderCalendar();


/* =========================
   Countdown
========================= */

function updateCountdown() {

  const countdown = document.getElementById("countdown");

  if (!countdown) return;

  const target =
    new Date(weddingConfig.weddingDateTime).getTime();

  const now = Date.now();

  let difference = target - now;

  if (difference < 0) {
    difference = 0;
  }

  const totalSeconds =
    Math.floor(difference / 1000);

  const days =
    Math.floor(totalSeconds / 86400);

  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  const formatNumber = (number) =>
    String(number).padStart(2, "0");

  const daysElement =
    document.getElementById("countdownDays");

  const hoursElement =
    document.getElementById("countdownHours");

  const minutesElement =
    document.getElementById("countdownMinutes");

  const secondsElement =
    document.getElementById("countdownSeconds");

  if (daysElement) {
    daysElement.textContent = days;
  }

  if (hoursElement) {
    hoursElement.textContent =
      formatNumber(hours);
  }

  if (minutesElement) {
    minutesElement.textContent =
      formatNumber(minutes);
  }

  if (secondsElement) {
    secondsElement.textContent =
      formatNumber(seconds);
  }
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   Wedding Schedule
========================= */

if (scheduleElement) {

  scheduleElement.innerHTML =
    weddingConfig.schedule
      .map((item) => {

        return `
          <div class="schedule-item">

            <div class="schedule-time">
              ${item.time}
            </div>

            <div class="schedule-info">

              <div class="schedule-title">
                ${item.title}
              </div>

              <div class="schedule-en">
                ${item.english}
              </div>

            </div>

          </div>
        `;
      })
      .join("");
}


/* =========================
   RSVP
========================= */

const rsvpForm =
  document.getElementById("rsvpForm");

if (rsvpForm) {

  const savedRSVP =
    localStorage.getItem("weddingRSVP");

  if (savedRSVP) {

    try {

      const data =
        JSON.parse(savedRSVP);

      const nameInput =
        document.getElementById("rsvpName");

      const attendanceInput =
        document.getElementById("rsvpAttendance");

      const peopleInput =
        document.getElementById("rsvpPeople");

      const lodgingInput =
        document.getElementById("rsvpLodging");

      if (nameInput && data.name) {
        nameInput.value = data.name;
      }

      if (attendanceInput && data.attendance) {
        attendanceInput.value =
          data.attendance;
      }

      if (peopleInput && data.people) {
        peopleInput.value =
          data.people;
      }

      if (lodgingInput && data.lodging) {
        lodgingInput.value =
          data.lodging;
      }

    } catch (error) {
      console.log("RSVP data error:", error);
    }
  }


  rsvpForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
      document.getElementById("rsvpName")?.value || "";

    const attendance =
      document.getElementById("rsvpAttendance")?.value || "";

    const people =
      document.getElementById("rsvpPeople")?.value || "";

    const lodging =
      document.getElementById("rsvpLodging")?.value || "";


    const data = {
      guest: guestName,
      name,
      attendance,
      people,
      lodging,
      submittedAt: new Date().toISOString()
    };


    localStorage.setItem(
      "weddingRSVP",
      JSON.stringify(data)
    );


    const successMessage =
      document.getElementById("rsvpSuccess");

    if (successMessage) {
      successMessage.classList.add("show");
    }

  });
}


/* =========================
   Reveal Animation
========================= */

const revealElements =
  document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

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
    element.classList.add("is-visible");
  });

}
