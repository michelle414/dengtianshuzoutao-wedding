document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ★★★ 婚礼资料配置区 ★★★

     以后改资料，优先从这里改。
  ====================================================== */

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

    /*
      ★ 音乐文件

      如果音乐文件叫 music.mp3：
      就不用改。

      如果你上传后文件叫：
      wedding-song.mp3

      就改成：
      music: "wedding-song.mp3"
    */

  music: "Shortcut To Heaven.mp3",

    /*
      ★ 婚礼照片

      现在先留空。

      等你把照片上传到 GitHub 后，
      例如：

      photos/1.jpg
      photos/2.jpg
      photos/3.jpg

      就在这里填写：

      photos: [
        "photos/1.jpg",
        "photos/2.jpg",
        "photos/3.jpg"
      ]

      第一张会作为大图。
    */

    photos: [],


    /*
      ★ 婚礼流程

      以后如果改时间，只需要改这里。
    */

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


  /* =====================================================
     宾客姓名
  ====================================================== */

  const params = new URLSearchParams(
    window.location.search
  );

  const guestName =
    params.get("guest");


  const guestNameElement =
    document.getElementById("guestName");


  const guestInvitation =
    document.querySelector(".guest-invitation");


  if (guestName && guestNameElement) {

    guestNameElement.textContent =
      guestName.trim();

  } else {

    if (guestInvitation) {
      guestInvitation.classList.add("no-guest");
    }

  }


  /* =====================================================
     设置基本资料
  ====================================================== */

  const venueName =
    document.getElementById("venueName");

  const venueAddress =
    document.getElementById("venueAddress");

  const navigationButton =
    document.getElementById("navigationButton");


  if (venueName) {
    venueName.textContent =
      weddingConfig.venue;
  }


  if (venueAddress) {
    venueAddress.textContent =
      weddingConfig.address;
  }


  if (navigationButton) {
    navigationButton.href =
      weddingConfig.mapUrl;
  }


  /* =====================================================
     新人名字
  ====================================================== */

  document.querySelectorAll(".couple-cn").forEach((element) => {

    element.innerHTML = `
      <span>${weddingConfig.groom}</span>
      <span class="couple-and">&amp;</span>
      <span>${weddingConfig.bride}</span>
    `;

  });


  document.querySelectorAll(".couple-en").forEach((element) => {

    element.textContent =
      `${weddingConfig.groomLatin} & ${weddingConfig.brideLatin}`;

  });


  document.querySelectorAll(".final-names").forEach((element) => {

    element.textContent =
      `${weddingConfig.groomLatin} & ${weddingConfig.brideLatin}`;

  });


  /* =====================================================
     HERO 日期
  ====================================================== */

  const heroDate =
    document.querySelector(".hero-date-number");

  const heroDateSub =
    document.querySelector(".hero-date-sub");

  if (heroDate) {

    heroDate.textContent =
      `${weddingConfig.year} · ${String(weddingConfig.month).padStart(2, "0")} · ${String(weddingConfig.day).padStart(2, "0")}`;

  }


  if (heroDateSub) {

    heroDateSub.textContent =
      `SUNDAY · ${weddingConfig.lunarDate}`;

  }


  /* =====================================================
     音乐
  ====================================================== */

  const music =
    document.getElementById("bgMusic");

  const musicToggle =
    document.getElementById("musicToggle");


  if (music) {

    const source =
      music.querySelector("source");

    if (source) {

      source.src =
        weddingConfig.music;

      music.load();

    }

    music.volume = 0.45;

  }


  function startMusic() {

    if (!music) return;

    music.volume = 0.45;

    const playPromise =
      music.play();

    if (playPromise) {

      playPromise
        .then(() => {

          musicToggle?.classList.add(
            "playing"
          );

        })
        .catch(() => {

          /*
            如果浏览器阻止播放，
            不让网页报错。
          */

        });

    }

  }


  function stopMusic() {

    if (!music) return;

    music.pause();

    musicToggle?.classList.remove(
      "playing"
    );

  }


  /* =====================================================
     ★ 开启请柬 = 开始音乐 + 往下滑

     两个动作绑定在同一次点击。
  ====================================================== */

  const openInvitation =
    document.getElementById("openInvitation");

  const ourDay =
    document.getElementById("our-day");


  if (openInvitation) {

    openInvitation.addEventListener(
      "click",
      () => {

        // ① 用户点击
        // ② 立刻播放音乐
        startMusic();

        // ③ 往下滑
        setTimeout(() => {

          if (ourDay) {

            ourDay.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }, 80);

      }
    );

  }


  /* =====================================================
     右上角音乐按钮
  ====================================================== */

  if (musicToggle) {

    musicToggle.addEventListener(
      "click",
      () => {

        if (!music) return;

        if (music.paused) {

          startMusic();

        } else {

          stopMusic();

        }

      }
    );

  }


  /* =====================================================
     OUR DAY 日历
  ====================================================== */

  const calendar =
    document.getElementById("calendar");


  function createCalendar() {

    if (!calendar) return;


    const firstDay =
      new Date(
        weddingConfig.year,
        weddingConfig.month - 1,
        1
      );


    const lastDay =
      new Date(
        weddingConfig.year,
        weddingConfig.month,
        0
      );


    const startWeekday =
      firstDay.getDay();


    const totalDays =
      lastDay.getDate();


    const weekdays = [
      "SUN",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT"
    ];


    let html = `
      <div class="calendar-header">
        ${weekdays
          .map(day => `<div>${day}</div>`)
          .join("")}
      </div>

      <div class="calendar-grid">
    `;


    for (
      let i = 0;
      i < startWeekday;
      i++
    ) {

      html += `
        <div class="calendar-day empty">
          0
        </div>
      `;

    }


    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {

      const isWeddingDay =
        day === weddingConfig.day;


      html += `
        <div
          class="calendar-day ${
            isWeddingDay
              ? "wedding-day"
              : ""
          }"
        >
          ${day}
        </div>
      `;

    }


    html += `
      </div>
    `;


    calendar.innerHTML =
      html;

  }


  createCalendar();


  /* =====================================================
     倒计时
  ====================================================== */

  const weddingDate =
    new Date(
      weddingConfig.weddingDateTime
    );


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
      new Date();


    const difference =
      weddingDate.getTime() -
      now.getTime();


    if (difference <= 0) {

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
        difference /
        (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        difference /
        (1000 * 60 * 60) %
        24
      );


    const minutes =
      Math.floor(
        difference /
        (1000 * 60) %
        60
      );


    const seconds =
      Math.floor(
        difference /
        1000 %
        60
      );


    if (daysElement) {

      daysElement.textContent =
        String(days);

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
     THE WEDDING 婚礼流程
  ====================================================== */

  const schedule =
    document.getElementById("schedule");


  function renderSchedule() {

    if (!schedule) return;


    schedule.innerHTML =
      weddingConfig.schedule
        .map(item => {

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


  renderSchedule();


  /* =====================================================
     MOMENTS 照片
  ====================================================== */

  const mainPhoto =
    document.getElementById("mainPhoto");

  const photoCarousel =
    document.getElementById(
      "photoCarousel"
    );


  function createPhotoPlaceholder() {

    return `
      <div class="photo-placeholder">
        <span>YOUR PHOTO</span>
      </div>
    `;

  }


  function renderPhotos() {

    if (
      !photoCarousel ||
      !mainPhoto
    ) {
      return;
    }


    const photos =
      weddingConfig.photos;


    /*
      还没有照片：
      保留漂亮的占位框。
    */

    if (
      !photos ||
      photos.length === 0
    ) {

      mainPhoto.innerHTML =
        createPhotoPlaceholder();


      photoCarousel.innerHTML = `
        <div class="photo-card">
          ${createPhotoPlaceholder()}
        </div>

        <div class="photo-card">
          ${createPhotoPlaceholder()}
        </div>

        <div class="photo-card">
          ${createPhotoPlaceholder()}
        </div>
      `;

      return;

    }


    /*
      第一张 = 大图
    */

    mainPhoto.innerHTML = `
      <img
        src="${photos[0]}"
        alt="邓天澍与邹涛婚礼照片"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        "
      >
    `;


    /*
      横向照片
    */

    photoCarousel.innerHTML =
      photos
        .map((photo, index) => {

          return `
            <div class="photo-card">

              <img
                src="${photo}"
                alt="婚礼照片 ${index + 1}"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  display:block;
                "
              >

            </div>
          `;

        })
        .join("");

  }


  renderPhotos();


  /* =====================================================
     RSVP
  ====================================================== */

  const attendanceButtons =
    document.querySelectorAll(
      ".attendance-button"
    );


  const attendanceInput =
    document.getElementById(
      "attendanceInput"
    );


  const rsvpForm =
    document.getElementById(
      "rsvpForm"
    );


  const peopleField =
    document.getElementById(
      "peopleField"
    );


  const lodgingBox =
    document.getElementById(
      "lodgingBox"
    );


  let selectedAttendance = "";


  attendanceButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          attendanceButtons.forEach(
            item => {
              item.classList.remove(
                "active"
              );
            }
          );


          button.classList.add(
            "active"
          );


          selectedAttendance =
            button.dataset.attendance;


          if (attendanceInput) {

            attendanceInput.value =
              selectedAttendance;

          }


          if (rsvpForm) {

            rsvpForm.classList.add(
              "visible"
            );

          }


          /*
            如果无法出席，
            人数和住宿可以隐藏。
          */

          if (
            selectedAttendance ===
            "declined"
          ) {

            if (peopleField)
              peopleField.style.display =
                "none";

            if (lodgingBox)
              lodgingBox.style.display =
                "none";

          } else {

            if (peopleField)
              peopleField.style.display =
                "block";

            if (lodgingBox)
              lodgingBox.style.display =
                "block";

          }


          setTimeout(() => {

            rsvpForm?.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }, 100);

        }
      );

    }
  );


  /* =====================================================
     提交 RSVP
  ====================================================== */

  const rsvpSuccess =
    document.getElementById(
      "rsvpSuccess"
    );


  if (rsvpForm) {

    rsvpForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        if (!selectedAttendance) {

          alert(
            "请先选择是否出席。"
          );

          return;

        }


        const formData =
          new FormData(rsvpForm);


        const rsvpData = {

          guest:
            guestName || "",

          name:
            formData.get("name") || "",

          attendance:
            formData.get("attendance") || "",

          guests:
            formData.get("guests") || "",

          lodging:
            formData.get("lodging") || "",

          message:
            formData.get("message") || "",

          submittedAt:
            new Date().toISOString()

        };


        /*
          当前先保存到本机。

          后面做父母管理后台时，
          会把这里换成真正的数据库。
        */

        const oldData =
          JSON.parse(
            localStorage.getItem(
              "wedding-rsvps"
            ) || "[]"
          );


        oldData.push(
          rsvpData
        );


        localStorage.setItem(
          "wedding-rsvps",
          JSON.stringify(oldData)
        );


        if (rsvpSuccess) {

          rsvpSuccess.innerHTML = `
            谢谢你的回复。<br>
            我们婚礼见 ♡
          `;

          rsvpSuccess.style.display =
            "block";

        }


        rsvpForm.reset();


        attendanceButtons.forEach(
          item => {
            item.classList.remove(
              "active"
            );
          }
        );


        selectedAttendance = "";

      }
    );

  }


  /* =====================================================
     滚动出现动画
  ====================================================== */

  const sections =
    document.querySelectorAll(
      ".section-inner"
    );


  sections.forEach(
    section => {

      section.classList.add(
        "reveal"
      );

    }
  );


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

              }

            }
          );

        },
        {
          threshold: .12
        }
      );


    sections.forEach(
      section => {
        observer.observe(section);
      }
    );

  } else {

    sections.forEach(
      section => {
        section.classList.add(
          "visible"
        );
      }
    );

  }

});
