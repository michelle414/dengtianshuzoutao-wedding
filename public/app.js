/* =========================================================
   婚礼基本信息
========================================================= */

const weddingConfig = {

  groom: "邓天澍",
  bride: "邹涛",

  year: 2026,
  month: 10,
  day: 25,

  lunarDate: "丙午年九月十六",

  weddingDateTime:
    "2026-10-25T12:08:00+08:00",

  venue:
    "吉安宾馆·礼堂",

  address:
    "中国·江西·吉安·吉州区沿江路99号",

  mapUrl:
    "https://surl.amap.com/1qtd9gB5ti",

  music:
    "Shortcut To Heaven.mp3",


  /* =======================================================
     照片
     
     现在你还没有选最终婚纱照。
     
     所以这里暂时不放文件名。

     等你准备好之后，只改这里。

     第一张 = 首页主婚纱照 + 照片区大图

     后面的 = 下面横向滚动照片
  ======================================================== */

  photos: [

    /*
    {
      src: "wedding-main.jpg"
    },

    {
      src: "wedding-01.jpg"
    },

    {
      src: "wedding-02.jpg"
    },

    {
      src: "wedding-03.jpg"
    },

    {
      src: "wedding-04.jpg"
    },

    {
      src: "wedding-05.jpg"
    },

    {
      src: "wedding-06.jpg"
    }
    */

  ],


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

  ]

};


/* =========================================================
   获取宾客名字
========================================================= */

function getGuestName() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const guest =
    params.get("guest");

  if (!guest) {
    return "您";
  }

  return guest.trim() || "您";
}


/* =========================================================
   页面元素
========================================================= */

const guestNameEl =
  document.getElementById(
    "guestName"
  );

const heroPhoto =
  document.getElementById(
    "heroPhoto"
  );

const heroPhotoEmpty =
  document.getElementById(
    "heroPhotoEmpty"
  );

const heroPhotoBox =
  document.querySelector(
    ".hero-photo"
  );

const mainGalleryImage =
  document.getElementById(
    "mainGalleryImage"
  );

const mainPhoto =
  document.getElementById(
    "mainPhoto"
  );

const mainPhotoPlaceholder =
  document.getElementById(
    "mainPhotoPlaceholder"
  );

const photoScroll =
  document.getElementById(
    "photoScroll"
  );

const openInvitation =
  document.getElementById(
    "openInvitation"
  );

const musicButton =
  document.getElementById(
    "musicButton"
  );

const bgMusic =
  document.getElementById(
    "bgMusic"
  );

const mapImageLink =
  document.getElementById(
    "mapImageLink"
  );

const navigationButton =
  document.getElementById(
    "navigationButton"
  );

const scheduleContainer =
  document.getElementById(
    "weddingSchedule"
  );

const rsvpForm =
  document.getElementById(
    "rsvpForm"
  );

const rsvpName =
  document.getElementById(
    "rsvpName"
  );

const rsvpResult =
  document.getElementById(
    "rsvpResult"
  );


/* =========================================================
   宾客名字
========================================================= */

const guestName =
  getGuestName();

if (guestNameEl) {
  guestNameEl.textContent =
    guestName;
}

if (
  rsvpName &&
  guestName !== "您"
) {
  rsvpName.value =
    guestName;
}


/* =========================================================
   地图
========================================================= */

if (mapImageLink) {
  mapImageLink.href =
    weddingConfig.mapUrl;
}

if (navigationButton) {
  navigationButton.href =
    weddingConfig.mapUrl;
}


/* =========================================================
   婚礼流程
========================================================= */

function renderSchedule() {

  if (!scheduleContainer) {
    return;
  }

  scheduleContainer.innerHTML = "";

  weddingConfig.schedule.forEach(
    item => {

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

        <div>

          <div class="schedule-title">
            ${item.title}
          </div>

          <div class="schedule-english">
            ${item.english}
          </div>

        </div>

      `;

      scheduleContainer.appendChild(
        row
      );

    }
  );
}

renderSchedule();


/* =========================================================
   照片
========================================================= */

function renderPhotos() {

  if (!Array.isArray(
    weddingConfig.photos
  )) {
    return;
  }


  /* 没照片 */

  if (
    weddingConfig.photos.length === 0
  ) {

    return;
  }


  const photos =
    weddingConfig.photos;


  /* =======================================================
     第一张：主照片
  ======================================================= */

  const firstPhoto =
    photos[0];


  if (firstPhoto) {

    const src =
      `./${firstPhoto.src}`;


    /* 首页主照片 */

    if (heroPhoto) {

      heroPhoto.src =
        src;

      heroPhoto.onload =
        () => {

          heroPhotoBox.classList.add(
            "has-image"
          );

        };

    }


    /* 照片区主照片 */

    if (mainGalleryImage) {

      mainGalleryImage.src =
        src;

      mainGalleryImage.onload =
        () => {

          mainPhoto.classList.add(
            "has-image"
          );

        };

    }

  }


  /* =======================================================
     下面横向照片
  ======================================================= */

  if (!photoScroll) {
    return;
  }

  photoScroll.innerHTML = "";


  photos.forEach(
    (photo, index) => {

      /*
        第一张已经作为大图。
        下面仍然可以显示它。
        这样用户横向滑动时，
        第一张也能看到。
      */

      const thumb =
        document.createElement(
          "div"
        );

      thumb.className =
        "photo-thumb";


      const img =
        document.createElement(
          "img"
        );

      img.src =
        `./${photo.src}`;

      img.alt =
        `婚礼照片 ${index + 1}`;

      img.loading =
        "lazy";


      thumb.appendChild(
        img
      );


      /*
        点击小图切换上面大图
      */

      thumb.addEventListener(
        "click",
        () => {

          if (
            mainGalleryImage &&
            mainPhoto
          ) {

            mainGalleryImage.src =
              `./${photo.src}`;

            mainPhoto.classList.add(
              "has-image"
            );

            mainGalleryImage.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }

        }
      );


      photoScroll.appendChild(
        thumb
      );

    }
  );

}

renderPhotos();


/* =========================================================
   音乐
========================================================= */

let musicStarted =
  false;


function startMusic() {

  if (!bgMusic) {
    return;
  }


  bgMusic.src =
    `./${weddingConfig.music}`;


  bgMusic.volume =
    0.08;


  const promise =
    bgMusic.play();


  if (
    promise !== undefined
  ) {

    promise
      .then(() => {

        musicStarted =
          true;

        musicButton.classList.add(
          "playing"
        );

      })
      .catch(() => {

        console.log(
          "等待用户再次操作播放音乐"
        );

      });

  }

}


/* 开启请柬 */

if (openInvitation) {

  openInvitation.addEventListener(
    "click",
    () => {

      startMusic();


      const ourDay =
        document.getElementById(
          "ourDay"
        );


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

          musicStarted =
            true;

          musicButton.classList.add(
            "playing"
          );

        } catch (error) {

          console.log(
            "音乐播放失败"
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
   倒计时
========================================================= */

const countDays =
  document.getElementById(
    "countDays"
  );

const countHours =
  document.getElementById(
    "countHours"
  );

const countMinutes =
  document.getElementById(
    "countMinutes"
  );

const countSeconds =
  document.getElementById(
    "countSeconds"
  );


function updateCountdown() {

  const target =
    new Date(
      weddingConfig.weddingDateTime
    ).getTime();


  const now =
    Date.now();


  let diff =
    target - now;


  if (diff <= 0) {

    countDays.textContent =
      "00";

    countHours.textContent =
      "00";

    countMinutes.textContent =
      "00";

    countSeconds.textContent =
      "00";

    return;
  }


  const days =
    Math.floor(
      diff / 86400000
    );


  diff %= 86400000;


  const hours =
    Math.floor(
      diff / 3600000
    );


  diff %= 3600000;


  const minutes =
    Math.floor(
      diff / 60000
    );


  diff %= 60000;


  const seconds =
    Math.floor(
      diff / 1000
    );


  countDays.textContent =
    String(days).padStart(
      2,
      "0"
    );

  countHours.textContent =
    String(hours).padStart(
      2,
      "0"
    );

  countMinutes.textContent =
    String(minutes).padStart(
      2,
      "0"
    );

  countSeconds.textContent =
    String(seconds).padStart(
      2,
      "0"
    );

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
        new FormData(
          rsvpForm
        );


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


      const oldData =
        JSON.parse(
          localStorage.getItem(
            "wedding_rsvp"
          ) || "[]"
        );


      oldData.push(
        response
      );


      localStorage.setItem(
        "wedding_rsvp",
        JSON.stringify(
          oldData
        )
      );


      if (rsvpResult) {

        rsvpResult.textContent =
          "谢谢您的回复，我们婚礼见。";

      }


      rsvpForm.reset();


      if (
        guestName !== "您"
      ) {

        rsvpName.value =
          guestName;

      }

    }
  );

}
