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


  /* 婚礼流程 */
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
  ],


  /*
    照片

    你现在还没有选好照片，所以这里先为空。

    以后例如你上传：

    public/photo-01.jpg
    public/photo-02.jpg
    public/photo-03.jpg

    就可以改成：

    photos: [
      {
        src: "photo-01.jpg",
        type: "landscape"
      },
      {
        src: "photo-02.jpg",
        type: "portrait"
      }
    ]
  */

  photos: []

};


/* =========================================================
   GET GUEST NAME
   ========================================================= */

function getGuestName() {

  const params = new URLSearchParams(
    window.location.search
  );

  const guest = params.get("guest");

  if (!guest) {
    return "您";
  }

  return guest.trim() || "您";
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const guestNameEl =
  document.getElementById("guestName");

const openInvitation =
  document.getElementById("openInvitation");

const musicButton =
  document.getElementById("musicButton");

const bgMusic =
  document.getElementById("bgMusic");

const mapImageLink =
  document.getElementById("mapImageLink");

const navigationButton =
  document.getElementById("navigationButton");

const scheduleContainer =
  document.getElementById("weddingSchedule");

const photoGallery =
  document.getElementById("photoGallery");

const rsvpForm =
  document.getElementById("rsvpForm");

const rsvpName =
  document.getElementById("rsvpName");

const rsvpResult =
  document.getElementById("rsvpResult");


/* =========================================================
   GUEST
   ========================================================= */

const guestName = getGuestName();

guestNameEl.textContent = guestName;

if (rsvpName && guestName !== "您") {
  rsvpName.value = guestName;
}


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

  if (!scheduleContainer) {
    return;
  }

  scheduleContainer.innerHTML = "";

  weddingConfig.schedule.forEach(item => {

    const row = document.createElement("div");

    row.className = "schedule-item";

    row.innerHTML = `
      <div class="schedule-time">
        ${item.time}
      </div>

      <div class="schedule-content">

        <div class="schedule-title">
          ${item.title}
        </div>

        <div class="schedule-english">
          ${item.english}
        </div>

      </div>
    `;

    scheduleContainer.appendChild(row);

  });

}

renderSchedule();


/* =========================================================
   PHOTO GALLERY
   ========================================================= */

function renderPhotos() {

  if (!photoGallery) {
    return;
  }

  photoGallery.innerHTML = "";

  if (
    !Array.isArray(weddingConfig.photos) ||
    weddingConfig.photos.length === 0
  ) {
    /*
      没照片的时候整个照片区域不显示。

      不会出现：
      PHOTO COMING SOON
      PLACEHOLDER
      假照片
      Broken Image

      等你选好照片之后再打开。
    */

    photoGallery.style.display = "none";

    return;
  }

  weddingConfig.photos.forEach(photo => {

    const item =
      document.createElement("div");

    item.className =
      `photo-item ${photo.type || "landscape"}`;

    const image =
      document.createElement("img");

    image.src = `./${photo.src}`;

    image.alt = "TIANSHU & TAO";

    image.loading = "lazy";

    item.appendChild(image);

    photoGallery.appendChild(item);

  });

}

renderPhotos();


/* =========================================================
   MUSIC
   ========================================================= */

let musicStarted = false;

function startMusic() {

  if (!bgMusic) {
    return;
  }

  bgMusic.src =
    `./${weddingConfig.music}`;

  bgMusic.volume = 0.06;

  const playPromise =
    bgMusic.play();

  if (
    playPromise !== undefined
  ) {

    playPromise
      .then(() => {

        musicStarted = true;

        musicButton.classList.add(
          "playing"
        );

        fadeMusicIn();

      })
      .catch(() => {
        /*
          浏览器阻止播放时不报错。

          用户再次点击音乐按钮即可。
        */
      });

  }

}


function fadeMusicIn() {

  if (!bgMusic) {
    return;
  }

  let volume = 0.06;

  const timer =
    setInterval(() => {

      volume += 0.01;

      if (volume >= 0.22) {

        volume = 0.22;

        clearInterval(timer);
      }

      bgMusic.volume = volume;

    }, 150);

}


/* 开启请柬 */

if (openInvitation) {

  openInvitation.addEventListener(
    "click",
    () => {

      startMusic();

      const ourDay =
        document.getElementById("ourDay");

      if (ourDay) {

        ourDay.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );

}


/* 音乐按钮 */

if (musicButton) {

  musicButton.addEventListener(
    "click",
    async () => {

      if (!bgMusic) {
        return;
      }

      if (
        bgMusic.paused
      ) {

        if (!musicStarted) {
          bgMusic.src =
            `./${weddingConfig.music}`;
        }

        try {

          await bgMusic.play();

          musicStarted = true;

          musicButton.classList.add(
            "playing"
          );

        } catch (error) {
          console.log(
            "Music playback was blocked."
          );
        }

      } else {

        bgMusic.pause();

        musicButton.classList.remove(
          "playing"
        );

      }

    }
  );

}


/* =========================================================
   COUNTDOWN
   ========================================================= */

const countDays =
  document.getElementById("countDays");

const countHours =
  document.getElementById("countHours");

const countMinutes =
  document.getElementById("countMinutes");

const countSeconds =
  document.getElementById("countSeconds");


function updateCountdown() {

  const target =
    new Date(
      weddingConfig.weddingDateTime
    ).getTime();

  const now =
    Date.now();

  let difference =
    target - now;


  if (difference <= 0) {

    if (countDays) {
      countDays.textContent = "00";
    }

    if (countHours) {
      countHours.textContent = "00";
    }

    if (countMinutes) {
      countMinutes.textContent = "00";
    }

    if (countSeconds) {
      countSeconds.textContent = "00";
    }

    return;
  }


  const day =
    Math.floor(
      difference / 86400000
    );

  difference %= 86400000;


  const hour =
    Math.floor(
      difference / 3600000
    );

  difference %= 3600000;


  const minute =
    Math.floor(
      difference / 60000
    );

  difference %= 60000;


  const second =
    Math.floor(
      difference / 1000
    );


  if (countDays) {
    countDays.textContent =
      String(day).padStart(2, "0");
  }

  if (countHours) {
    countHours.textContent =
      String(hour).padStart(2, "0");
  }

  if (countMinutes) {
    countMinutes.textContent =
      String(minute).padStart(2, "0");
  }

  if (countSeconds) {
    countSeconds.textContent =
      String(second).padStart(2, "0");
  }

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   RSVP
   ========================================================= */

if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const formData =
        new FormData(rsvpForm);


      const response = {

        guest:
          formData.get("name"),

        attending:
          formData.get("attending"),

        guests:
          formData.get("guests"),

        message:
          formData.get("message"),

        invitationGuest:
          guestName,

        createdAt:
          new Date().toISOString()

      };


      /*
        当前阶段先保存到浏览器。

        等我们下一步接 Cloudflare 后端，
        这里会改成真正的数据提交。

        宾客不用重新改页面。
      */

      const existing =
        JSON.parse(
          localStorage.getItem(
            "wedding_rsvp"
          ) || "[]"
        );


      existing.push(response);


      localStorage.setItem(
        "wedding_rsvp",
        JSON.stringify(existing)
      );


      if (rsvpResult) {

        rsvpResult.textContent =
          "谢谢您的回复，我们婚礼见。";

      }


      rsvpForm.reset();


      if (
        guestName !== "您" &&
        rsvpName
      ) {

        rsvpName.value =
          guestName;

      }

    }
  );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealItems =
  document.querySelectorAll(
    ".section-heading, .day-layout, .countdown-wrap, .schedule, .location-map, .navigation-button, .rsvp-form, .final-section"
  );


if (
  "IntersectionObserver" in window
) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealItems.forEach(item => {

    item.classList.add(
      "reveal"
    );

    observer.observe(item);

  });

}
