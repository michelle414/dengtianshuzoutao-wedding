const weddingConfig = {
  groom: "邓天澍",
  bride: "邹涛",

  groomLatin: "TIANSHU",
  brideLatin: "TAO",

  weddingDate: "2026-10-25T12:08:00+08:00",

  music: "Shortcut To Heaven.mp3",

  photos: [
    "photos/photo-01.jpg",
    "photos/photo-02.jpg",
    "photos/photo-03.jpg",
    "photos/photo-04.jpg",
    "photos/photo-05.jpg",
    "photos/photo-06.jpg",
    "photos/photo-07.jpg",
    "photos/photo-08.jpg",
    "photos/photo-09.jpg",
    "photos/photo-10.jpg"
  ]
};


/* =====================================================
   宾客姓名
===================================================== */

function getGuestName() {
  const params = new URLSearchParams(window.location.search);

  const guest = params.get("guest");

  if (!guest || !guest.trim()) {
    return "宾客";
  }

  return guest.trim();
}


function formatGuestName(name) {

  if (
    name.includes(" ") ||
    name.includes("　") ||
    name.includes("一家")
  ) {
    return name;
  }

  const characters = [...name];

  if (characters.length <= 2) {
    return name;
  }

  return characters.join(" ");
}


/* =====================================================
   页面初始化
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  initGuestName();

  initCalendar();

  initCountdown();

  initMusic();

  initGallery();

  initReply();

  initReveal();

});


/* =====================================================
   宾客姓名
===================================================== */

function initGuestName() {

  const guestNameElement =
    document.getElementById("guestName");

  if (!guestNameElement) {
    return;
  }

  const guestName = getGuestName();

  guestNameElement.textContent =
    formatGuestName(guestName);
}


/* =====================================================
   2026年10月日历
   周一开始
===================================================== */

function initCalendar() {

  const calendar =
    document.getElementById("calendarGrid");

  if (!calendar) {
    return;
  }

  calendar.innerHTML = "";

  /*
    2026年10月1日是星期四。

    如果周一为第一列：
    周一 空
    周二 空
    周三 空
    周四 1

    所以这里放 3 个空白。
  */

  const firstDay = 3;

  for (let i = 0; i < firstDay; i++) {

    const empty =
      document.createElement("div");

    empty.className = "calendar-empty";

    calendar.appendChild(empty);
  }


  for (let day = 1; day <= 31; day++) {

    const cell =
      document.createElement("div");

    cell.className = "calendar-day";


    if (day === 25) {

      const special =
        document.createElement("div");

      special.className = "calendar-special";

      special.textContent = day;

      cell.appendChild(special);

    } else {

      cell.textContent = day;

    }

    calendar.appendChild(cell);
  }
}


/* =====================================================
   倒计时
===================================================== */

function initCountdown() {

  const countdown =
    document.getElementById("countdownNumber");

  if (!countdown) {
    return;
  }


  function updateCountdown() {

    const now = new Date();

    const wedding =
      new Date(weddingConfig.weddingDate);

    const diff =
      wedding.getTime() - now.getTime();


    if (diff <= 0) {

      countdown.textContent = "0";

      return;
    }


    const days =
      Math.ceil(
        diff / (1000 * 60 * 60 * 24)
      );

    countdown.textContent = days;
  }


  updateCountdown();

  setInterval(
    updateCountdown,
    60 * 1000
  );
}


/* =====================================================
   音乐
===================================================== */

function initMusic() {

  const music =
    document.getElementById("bgMusic");

  const musicButton =
    document.getElementById("musicControl");

  const openButton =
    document.getElementById("openInvitation");


  if (!music || !musicButton) {
    return;
  }


  music.src = weddingConfig.music;


  let playing = false;


  function playMusic() {

    music.play()
      .then(() => {

        playing = true;

        musicButton.classList.add("playing");

        musicButton.textContent = "♫";

      })
      .catch(() => {

        playing = false;

      });
  }


  function pauseMusic() {

    music.pause();

    playing = false;

    musicButton.classList.remove("playing");

    musicButton.textContent = "♪";
  }


  musicButton.addEventListener(
    "click",
    () => {

      if (playing) {

        pauseMusic();

      } else {

        playMusic();

      }

    }
  );


  if (openButton) {

    openButton.addEventListener(
      "click",
      () => {

        playMusic();

        const target =
          document.getElementById("ourDay");

        if (target) {

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  }
}


/* =====================================================
   MOMENTS 相册
===================================================== */

function initGallery() {

  const mainImage =
    document.getElementById("mainGalleryImage");

  const scroll =
    document.getElementById("photoScroll");

  const prev =
    document.getElementById("photoPrev");

  const next =
    document.getElementById("photoNext");


  if (
    !mainImage ||
    !scroll
  ) {
    return;
  }


  /*
    01 是主图
    02-10 是缩略图
  */

  const thumbnails =
    weddingConfig.photos.slice(1);


  thumbnails.forEach(
    (src, index) => {

      const img =
        document.createElement("img");

      img.src = src;

      img.alt =
        `Moment ${index + 2}`;

      img.className =
        "photo-thumb";


      img.addEventListener(
        "click",
        () => {

          mainImage.src = src;


          document
            .querySelectorAll(".photo-thumb")
            .forEach(
              item => {
                item.classList.remove("active");
              }
            );


          img.classList.add("active");


          img.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
          });

        }
      );


      scroll.appendChild(img);

    }
  );


  const first =
    scroll.querySelector(".photo-thumb");

  if (first) {
    first.classList.add("active");
  }


  /*
    左右按钮
  */

  if (prev) {

    prev.addEventListener(
      "click",
      () => {

        scroll.scrollBy({
          left: -window.innerWidth * 0.65,
          behavior: "smooth"
        });

      }
    );

  }


  if (next) {

    next.addEventListener(
      "click",
      () => {

        scroll.scrollBy({
          left: window.innerWidth * 0.65,
          behavior: "smooth"
        });

      }
    );

  }


  /*
    自动轻微滚动
    用户触摸后不会强制抢控制权
  */

  let autoScrollTimer;

  function startAutoScroll() {

    autoScrollTimer =
      setInterval(() => {

        if (
          document.hidden ||
          scroll.matches(":hover")
        ) {
          return;
        }


        const maxScroll =
          scroll.scrollWidth -
          scroll.clientWidth;


        if (
          scroll.scrollLeft >=
          maxScroll - 10
        ) {

          scroll.scrollTo({
            left: 0,
            behavior: "smooth"
          });

        } else {

          scroll.scrollBy({
            left: window.innerWidth * 0.45,
            behavior: "smooth"
          });

        }

      }, 5000);

  }


  startAutoScroll();


  /*
    用户手动滑动时暂停一小段时间
  */

  let pauseTimer;

  scroll.addEventListener(
    "touchstart",
    () => {

      clearInterval(autoScrollTimer);

      clearTimeout(pauseTimer);

    },
    {
      passive: true
    }
  );


  scroll.addEventListener(
    "touchend",
    () => {

      pauseTimer =
        setTimeout(
          startAutoScroll,
          7000
        );

    },
    {
      passive: true
    }
  );

}


/* =====================================================
   宾客回复
===================================================== */

function initReply() {

  const attendanceButtons =
    document.querySelectorAll(
      ".attendance-button"
    );

  const stayFields =
    document.getElementById(
      "stayFields"
    );

  const absenceMessage =
    document.getElementById(
      "absenceMessage"
    );

  const replySuccess =
    document.getElementById(
      "replySuccess"
    );


  let attendance = "";


  attendanceButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          attendance =
            button.dataset.attendance;


          attendanceButtons.forEach(
            item => {
              item.classList.remove(
                "selected"
              );
            }
          );


          button.classList.add(
            "selected"
          );


          if (
            attendance === "yes"
          ) {

            stayFields.classList.remove(
              "hidden"
            );

            absenceMessage.classList.add(
              "hidden"
            );

          } else {

            stayFields.classList.add(
              "hidden"
            );

            absenceMessage.classList.remove(
              "hidden"
            );

          }

        }
      );

    }
  );


  /*
    住宿选择
  */

  const stayButtons =
    document.querySelectorAll(
      ".stay-button"
    );


  stayButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          stayButtons.forEach(
            item => {
              item.classList.remove(
                "selected"
              );
            }
          );

          button.classList.add(
            "selected"
          );

        }
      );

    }
  );


  /*
    出席提交
  */

  const submit =
    document.getElementById(
      "replySubmit"
    );


  if (submit) {

    submit.addEventListener(
      "click",
      () => {

        saveReply({
          attendance: "yes",

          stay:
            document.querySelector(
              ".stay-button.selected"
            )?.dataset.stay || "",

          count:
            document.getElementById(
              "guestCount"
            )?.value || "1",

          checkIn:
            document.getElementById(
              "checkIn"
            )?.value || "",

          checkOut:
            document.getElementById(
              "checkOut"
            )?.value || "",

          message:
            document.getElementById(
              "message"
            )?.value || ""
        });


        showReplySuccess();

      }
    );

  }


  /*
    无法出席提交
  */

  const absenceSubmit =
    document.getElementById(
      "absenceSubmit"
    );


  if (absenceSubmit) {

    absenceSubmit.addEventListener(
      "click",
      () => {

        saveReply({

          attendance: "no",

          message:
            document.getElementById(
              "absenceText"
            )?.value || ""

        });


        showReplySuccess();

      }
    );

  }


  function showReplySuccess() {

    if (!replySuccess) {
      return;
    }

    stayFields.classList.add(
      "hidden"
    );

    absenceMessage.classList.add(
      "hidden"
    );

    replySuccess.classList.remove(
      "hidden"
    );

  }


  function saveReply(data) {

    const guest =
      getGuestName();


    const reply = {

      guest,

      ...data,

      submittedAt:
        new Date().toISOString()

    };


    localStorage.setItem(
      `wedding-reply-${guest}`,
      JSON.stringify(reply)
    );

  }

}


/* =====================================================
   简单出现动画
===================================================== */

function initReveal() {

  const elements =
    document.querySelectorAll(
      ".section-heading, .calendar-card, .countdown-block, .main-photo-frame, .moments-quote, .photo-slider-wrap, .schedule, .location-card, .reply-card"
    );


  if (!("IntersectionObserver" in window)) {

    elements.forEach(
      element => {
        element.classList.add("visible");
      }
    );

    return;
  }


  elements.forEach(
    element => {
      element.classList.add("reveal");
    }
  );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
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


  elements.forEach(
    element => {
      observer.observe(element);
    }
  );

}
