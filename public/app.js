const weddingConfig = {
weddingDate: "2026-10-25T12:08:00+08:00",

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

document.addEventListener("DOMContentLoaded", () => {

/* =========================
GUEST NAME
========================= */

const params = new URLSearchParams(window.location.search);
const guestName = params.get("guest");

const guestCard = document.getElementById("guestCard");
const guestElement = document.getElementById("guestName");

if (guestName && guestName.trim()) {
guestElement.textContent = guestName.trim();
} else {
guestCard.style.display = "none";
}

/* =========================
MUSIC
========================= */

const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicToggle");
const openButton = document.getElementById("openInvitation");

function startMusic() {
if (!music) return;

```
music.volume = 0.35;

music.play()
  .then(() => {
    musicButton?.classList.add("playing");
  })
  .catch(() => {});
```

}

musicButton?.addEventListener("click", () => {
if (music.paused) {
startMusic();
} else {
music.pause();
musicButton.classList.remove("playing");
}
});

openButton?.addEventListener("click", () => {
startMusic();

```
document.getElementById("ourDay")?.scrollIntoView({
  behavior: "smooth"
});
```

});

/* =========================
CALENDAR
========================= */

const calendar = document.getElementById("calendarGrid");

if (calendar) {
const year = 2026;
const month = 9;

```
const firstDay = new Date(year, month, 1).getDay();
const mondayIndex = firstDay === 0 ? 6 : firstDay - 1;

const days = new Date(year, month + 1, 0).getDate();

for (let i = 0; i < mondayIndex; i++) {
  const empty = document.createElement("div");
  empty.className = "calendar-day";
  calendar.appendChild(empty);
}

for (let day = 1; day <= days; day++) {
  const cell = document.createElement("div");

  cell.className = "calendar-day";
  cell.textContent = day;

  if (day === 25) {
    cell.classList.add("wedding-day");
  }

  calendar.appendChild(cell);
}
```

}

/* =========================
COUNTDOWN
========================= */

const countdown = document.getElementById("countdownDays");

function updateCountdown() {
if (!countdown) return;

```
const now = new Date();
const wedding = new Date(weddingConfig.weddingDate);

const difference = wedding.getTime() - now.getTime();

if (difference <= 0) {
  countdown.textContent = "0";
  return;
}

const days = Math.floor(
  difference / (1000 * 60 * 60 * 24)
);

countdown.textContent = days;
```

}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================
WEDDING SCHEDULE
========================= */

const scheduleContainer =
document.getElementById("weddingSchedule");

if (scheduleContainer) {

```
const schedule = [
  weddingConfig.welcome,
  weddingConfig.ceremony,
  weddingConfig.reception
];

schedule.forEach(item => {

  const row = document.createElement("div");
  row.className = "schedule-item";

  row.innerHTML = `
    <div class="schedule-time">${item.time}</div>
    <div class="schedule-content">
      <strong>${item.cn}</strong>
      <span>${item.en}</span>
    </div>
  `;

  scheduleContainer.appendChild(row);
});
```

}

/* =========================
RSVP
========================= */

const rsvpForm = document.getElementById("rsvpForm");
const attendingFields = document.getElementById("attendingFields");
const stayDate = document.getElementById("stayDate");
const success = document.getElementById("rsvpSuccess");

let attendance = "";
let accommodation = "";

const attendanceButtons =
document.querySelectorAll(".attendance-option");

attendanceButtons.forEach(button => {

```
button.addEventListener("click", () => {

  attendanceButtons.forEach(item => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");

  attendance = button.dataset.attendance;

  rsvpForm.classList.add("active");

  if (attendance === "yes") {
    attendingFields.style.display = "block";
  } else {
    attendingFields.style.display = "none";
  }
});
```

});

const stayButtons =
document.querySelectorAll(".stay-options button");

stayButtons.forEach(button => {

```
button.addEventListener("click", () => {

  stayButtons.forEach(item => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");

  accommodation = button.dataset.stay;

  if (accommodation === "yes") {
    stayDate.classList.add("show");
  } else {
    stayDate.classList.remove("show");
  }
});
```

});

rsvpForm?.addEventListener("submit", event => {

```
event.preventDefault();

if (!attendance) {
  success.textContent = "请先选择是否参加婚礼。";
  return;
}

const formData = new FormData(rsvpForm);

const response = {
  guest:
    guestName?.trim() || "",

  name:
    formData.get("name") || "",

  attendance,

  people:
    attendance === "yes"
      ? formData.get("people")
      : "",

  accommodation:
    attendance === "yes"
      ? accommodation
      : "",

  date:
    attendance === "yes" && accommodation === "yes"
      ? formData.get("date")
      : "",

  message:
    formData.get("message") || "",

  submittedAt:
    new Date().toISOString()
};

localStorage.setItem(
  "wedding-rsvp",
  JSON.stringify(response)
);

if (attendance === "yes") {

  success.textContent =
    "期待与你相见。2026 · 10 · 25 吉安宾馆·礼堂，婚礼见。";

} else {

  success.textContent =
    "谢谢你的告知。虽然这次无法相见，你的祝福我们已经收到。";

}

rsvpForm.reset();

attendanceButtons.forEach(item => {
  item.classList.remove("selected");
});

stayButtons.forEach(item => {
  item.classList.remove("selected");
});

attendingFields.style.display = "none";
stayDate.classList.remove("show");
```

});

});
