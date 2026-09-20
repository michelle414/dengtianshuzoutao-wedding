```javascript
/* =========================================================
   WEDDING CONFIG
========================================================= */

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

const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

const openInvitation = document.getElementById("openInvitation");

const guestNameElement = document.getElementById("guestName");

const navigationButton =
  document.getElementById("navigationButton");

const mapImageLink =
  document.getElementById("mapImageLink");

const scheduleElement =
  document.getElementById("weddingSchedule");

const countdownDays =
  document.getElementById("days");

const countdownHours =
  document.getElementById("hours");

const countdownMinutes =
  document.getElementById("minutes");

const countdownSeconds =
  document.getElementById("seconds");

const rsvpForm =
  document.getElementById("rsvpForm");

const rsvpResult =
  document.getElementById("rsvpMessageResult");


/* =========================================================
   GUEST NAME
========================================================= */

function getGuestName() {
  const params = new URLSearchParams(window.location.search);

  const guest = params.get("guest");

  if (!guest) {
    return "亲爱的朋友";
  }

  return guest.trim() || "亲爱的朋友";
}

const guestName = getGuestName();

guestNameElement.textContent = guestName;


/* =========================================================
   MAP
========================================================= */

if (mapImageLink) {
  mapImageLink.href = weddingConfig.mapUrl;
}

if (navigationButton) {
  navigationButton.href = weddingConfig.mapUrl;
}


/* =========================================================
   SCHEDULE
========================================================= */

function renderSchedule() {

  if (!scheduleElement) return;

  scheduleElement.innerHTML = "";

  weddingConfig.schedule.forEach((item) => {

    const scheduleItem =
      document.createElement("div");

    scheduleItem.className = "schedule-item";

    scheduleItem.innerHTML = `
      <div class="schedule-time">
        ${item.time}
      </div>

      <div class="schedule-dot"></div>

      <div class="schedule-content">
        <h3>${item.title}</h3>
        <span>${item.english}</span>
      </div>
    `;

    scheduleElement.appendChild(scheduleItem);
  });
}

renderSchedule();


/* =========================================================
   MUSIC
========================================================= */

let musicStarted = false;
let fadeAnimation = null;

function fadeMusicIn() {

  if (!bgMusic) return;

  if (fadeAnimation) {
    cancelAnimationFrame(fadeAnimation);
  }

  bgMusic.volume = 0.04;

  const startTime = performance.now();

  const startVolume = 0.04;
  const targetVolume = 0.22;
  const duration = 2600;

  function animate(now) {

    const progress =
      Math.min((now - startTime) / duration, 1);

    const eased =
      1 - Math.pow(1 - progress, 3);

    bgMusic.volume =
      startVolume +
      (targetVolume - startVolume) * eased;

    if (progress < 1) {
      fadeAnimation =
        requestAnimationFrame(animate);
    }
  }

  fadeAnimation =
    requestAnimationFrame(animate);
}


async function startMusic() {

  if (!bgMusic) return;

  if (!bgMusic.src) {
    bgMusic.src = weddingConfig.music;
  }

  try {

    bgMusic.volume = 0.04;

    await bgMusic.play();

    musicStarted = true;

    musicButton.classList.add("playing");

    fadeMusicIn();

  } catch (error) {

    console.log(
      "Music playback requires user interaction.",
      error
    );
  }
}


function pauseMusic() {

  if (!bgMusic) return;

  bgMusic.pause();

  musicStarted = false;

  musicButton.classList.remove("playing");
}


musicButton?.addEventListener(
  "click",
  async () => {

    if (musicStarted) {
      pauseMusic();
    } else {
      await startMusic();
    }

  }
);


/* =========================================================
   OPEN INVITATION
========================================================= */

openInvitation?.addEventListener(
  "click",
  async () => {

    await startMusic();

    document
      .getElementById("ourDay")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* =========================================================
   COUNTDOWN
========================================================= */

function updateCountdown() {

  const weddingDate =
    new Date(weddingConfig.weddingDateTime);

  const now =
    new Date();

  const difference =
    weddingDate.getTime() -
    now.getTime();

  if (difference <= 0) {

    countdownDays.textContent = "00";
    countdownHours.textContent = "00";
    countdownMinutes.textContent = "00";
    countdownSeconds.textContent = "00";

    return;
  }

  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );

  const hours =
    Math.floor(
      (difference /
        (1000 * 60 * 60)) %
      24
    );

  const minutes =
    Math.floor(
      (difference /
        (1000 * 60)) %
      60
    );

  const seconds =
    Math.floor(
      (difference / 1000) %
      60
    );

  countdownDays.textContent =
    String(days).padStart(2, "0");

  countdownHours.textContent =
    String(hours).padStart(2, "0");

  countdownMinutes.textContent =
    String(minutes).padStart(2, "0");

  countdownSeconds.textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   RSVP
========================================================= */

const RSVP_STORAGE_KEY =
  "tianshu-tao-rsvp";


function saveRSVP(data) {

  const current =
    JSON.parse(
      localStorage.getItem(RSVP_STORAGE_KEY) || "[]"
    );

  current.push({
    ...data,
    guestFromLink: guestName,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    RSVP_STORAGE_KEY,
    JSON.stringify(current)
  );
}


rsvpForm?.addEventListener(
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
        .getElementById("rsvpAttendance")
        .value;

    const guests =
      document
        .getElementById("rsvpGuests")
        .value;

    const message =
      document
        .getElementById("rsvpMessage")
        .value
        .trim();

    if (!name || !attendance || !guests) {
      rsvpResult.textContent =
        "请把信息填写完整。";
      return;
    }

    saveRSVP({
      name,
      attendance,
      guests,
      message
    });

    rsvpResult.textContent =
      attendance === "yes"
        ? "谢谢你的回复，我们婚礼见。"
        : "收到你的回复，也谢谢你的祝福。";

    rsvpForm.reset();
  }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealTargets = document.querySelectorAll(
  ".section-intro, .calendar, .countdown-wrap, " +
  ".photo-editorial, .story-inner, .schedule, " +
  ".location-card, .rsvp-inner, .final-inner"
);

revealTargets.forEach((element) => {
  element.classList.add("reveal");
});


const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(
            entry.target
          );
        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealTargets.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================================================
   INITIAL PAGE STATE
========================================================= */

window.addEventListener(
  "load",
  () => {

    window.scrollTo(0, 0);

    /*
      不自动播放音乐。
      必须由用户点击“开启请柬”后播放，
      这样更符合微信 / 手机浏览器限制。
    */

  }
);
```
