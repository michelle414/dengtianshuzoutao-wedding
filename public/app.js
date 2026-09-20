/* =========================================================
   婚礼配置
========================================================= */

const weddingConfig = {

  groom: "邓天澍",
  bride: "邹涛",

  groomLatin: "TIANSHU",
  brideLatin: "TAO",

  weddingDate: "2026-10-25T12:08:00+08:00",

  weddingDateText: "2026年10月25日",
  lunarDateText: "丙午年九月十六 · 星期日",

  venue: "吉安宾馆·礼堂",

  address: "中国·江西·吉安·吉州区沿江路99号",

  mapUrl: "https://surl.amap.com/1qtd9gB5ti",

  music: "Shortcut To Heaven.mp3",


  /*
    ========================================================
    婚礼照片

    以后你把照片放进 public 文件夹以后，
    只需要把文件名写进这里。

    例如：

    photos: [
      { src: "wedding-main.jpg" },
      { src: "wedding-01.jpg" },
      { src: "wedding-02.jpg" },
      { src: "wedding-03.jpg" }
    ]

    第一张就是首页大婚纱照。
    ========================================================
  */

  photos: [
    // { src: "wedding-main.jpg" },
    // { src: "wedding-01.jpg" },
    // { src: "wedding-02.jpg" },
    // { src: "wedding-03.jpg" },
    // { src: "wedding-04.jpg" }
  ]

};


/* =========================================================
   工具
========================================================= */

const $ = (selector) =>
  document.querySelector(selector);

const $$ = (selector) =>
  document.querySelectorAll(selector);


/* =========================================================
   宾客姓名
========================================================= */

function getGuestName() {

  const params = new URLSearchParams(
    window.location.search
  );

  const guest = params.get("guest");

  if (!guest) {
    return "邹 小 明";
  }

  return guest.trim() || "邹 小 明";
}


function formatGuestName(name) {

  /*
    不自动添加：
    阿姨 / 叔叔 / 先生 / 女士

    用户输入什么，就显示什么。

    如果输入：
    邹小明

    就显示：
    邹 小 明

    如果输入：
    邹小明一家

    则保持：
    邹小明一家
  */

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


function renderGuestName() {

  const element = $("#guestName");

  if (!element) return;

  const name = getGuestName();

  element.textContent =
    formatGuestName(name);
}


/* =========================================================
   地图
========================================================= */

function renderMap() {

  const mapButton =
    $("#mapButton");

  const mapImageLink =
    $("#mapImageLink");

  if (mapButton) {
    mapButton.href =
      weddingConfig.mapUrl;
  }

  if (mapImageLink) {
    mapImageLink.href =
      weddingConfig.mapUrl;
  }

}


/* =========================================================
   音乐
========================================================= */

const bgMusic =
  $("#bgMusic");

const musicControl =
  $("#musicControl");

const openInvitation =
  $("#openInvitation");

let musicStarted = false;


function setupMusic() {

  if (!bgMusic || !musicControl) {
    return;
  }

  bgMusic.src =
    weddingConfig.music;


  musicControl.addEventListener(
    "click",
    async () => {

      if (bgMusic.paused) {

        try {

          await bgMusic.play();

          musicControl.classList.add(
            "playing"
          );

          musicStarted = true;

        } catch (error) {

          console.log(
            "音乐播放失败：",
            error
          );

        }

      } else {

        bgMusic.pause();

        musicControl.classList.remove(
          "playing"
        );

      }

    }
  );


  if (openInvitation) {

    openInvitation.addEventListener(
      "click",
      async () => {

        /*
          用户点击“开启请柬”
          是移动端允许开始播放音乐的用户手势。
        */

        if (!musicStarted) {

          try {

            await bgMusic.play();

            musicControl.classList.add(
              "playing"
            );

            musicStarted = true;

          } catch (error) {

            console.log(
              "音乐播放失败：",
              error
            );

          }

        }


        document
          .querySelector("#weddingDay")
          ?.scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  }

}


/* =========================================================
   倒计时
========================================================= */

function updateCountdown() {

  const target =
    new Date(
      weddingConfig.weddingDate
    ).getTime();

  const now =
    new Date().getTime();

  let difference =
    target - now;


  if (difference <= 0) {

    $("#days").textContent = "0";
    $("#hours").textContent = "0";
    $("#minutes").textContent = "0";
    $("#seconds").textContent = "0";

    return;
  }


  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );

  difference %=
    1000 * 60 * 60 * 24;


  const hours =
    Math.floor(
      difference /
      (1000 * 60 * 60)
    );

  difference %=
    1000 * 60 * 60;


  const minutes =
    Math.floor(
      difference /
      (1000 * 60)
    );

  difference %=
    1000 * 60;


  const seconds =
    Math.floor(
      difference /
      1000
    );


  $("#days").textContent =
    String(days);

  $("#hours").textContent =
    String(hours).padStart(2, "0");

  $("#minutes").textContent =
    String(minutes).padStart(2, "0");

  $("#seconds").textContent =
    String(seconds).padStart(2, "0");

}


function startCountdown() {

  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );

}


/* =========================================================
   婚礼照片
========================================================= */

let currentPhotoIndex = 0;


function renderPhotos() {

  const photos =
    weddingConfig.photos;

  const mainImage =
    $("#mainGalleryImage");

  const heroPhoto =
    $("#heroPhoto");

  const photoScroll =
    $("#photoScroll");


  /*
    还没有照片时，
    保留漂亮的占位区域。
  */

  if (!photos.length) {

    if (mainImage) {

      mainImage.innerHTML =
        "<span>我们的瞬间</span>";

    }

    if (heroPhoto) {

      heroPhoto.innerHTML =
        "<span>我们的婚礼</span>";

    }

    return;
  }


  photoScroll.innerHTML = "";


  photos.forEach(
    (photo, index) => {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "photo-thumb";


      if (index === 0) {
        button.classList.add(
          "active"
        );
      }


      const image =
        document.createElement("img");

      image.src =
        photo.src;

      image.alt =
        "婚礼照片";


      button.appendChild(
        image
      );


      button.addEventListener(
        "click",
        () => {

          setMainPhoto(index);

        }
      );


      photoScroll.appendChild(
        button
      );

    }
  );


  setMainPhoto(0);

}


function setMainPhoto(index) {

  const photos =
    weddingConfig.photos;

  if (!photos.length) {
    return;
  }

  currentPhotoIndex =
    index;


  const photo =
    photos[index];

  const mainImage =
    $("#mainGalleryImage");

  const heroPhoto =
    $("#heroPhoto");


  if (mainImage) {

    mainImage.innerHTML = "";

    const image =
      document.createElement("img");

    image.src =
      photo.src;

    image.alt =
      "婚礼照片";

    image.style.width =
      "100%";

    image.style.height =
      "100%";

    image.style.objectFit =
      "cover";

    image.style.display =
      "block";

    mainImage.appendChild(
      image
    );

  }


  /*
    第一张照片同时作为首页大照片。
  */

  if (
    heroPhoto &&
    index === 0
  ) {

    heroPhoto.innerHTML = "";

    const image =
      document.createElement("img");

    image.src =
      photo.src;

    image.alt =
      "邓天澍与邹涛";

    image.style.width =
      "100%";

    image.style.height =
      "100%";

    image.style.objectFit =
      "cover";

    image.style.display =
      "block";

    heroPhoto.appendChild(
      image
    );

  }


  $$(".photo-thumb").forEach(
    (item, itemIndex) => {

      item.classList.toggle(
        "active",
        itemIndex === index
      );

    }
  );

}


/* =========================================================
   照片左右按钮
========================================================= */

function setupPhotoNavigation() {

  const photoScroll =
    $("#photoScroll");

  const prev =
    $("#photoPrev");

  const next =
    $("#photoNext");


  if (!photoScroll) {
    return;
  }


  const scrollAmount =
    () => photoScroll.clientWidth * 0.7;


  if (prev) {

    prev.addEventListener(
      "click",
      () => {

        photoScroll.scrollBy({
          left:
            -scrollAmount(),
          behavior:
            "smooth"
        });

      }
    );

  }


  if (next) {

    next.addEventListener(
      "click",
      () => {

        photoScroll.scrollBy({
          left:
            scrollAmount(),
          behavior:
            "smooth"
        });

      }
    );

  }

}


/* =========================================================
   宾客回复
========================================================= */

let attendance =
  null;

let needStay =
  null;


function setupAttendance() {

  const options =
    $$(".attendance-option");

  const details =
    $("#replyDetails");

  const absence =
    $("#absenceMessage");


  options.forEach(
    (option) => {

      option.addEventListener(
        "click",
        () => {

          options.forEach(
            (item) => {

              item.classList.remove(
                "selected"
              );

            }
          );


          option.classList.add(
            "selected"
          );


          attendance =
            option.dataset.attendance;


          if (
            attendance === "yes"
          ) {

            details?.classList.add(
              "show"
            );

            absence?.classList.remove(
              "show"
            );

          } else {

            details?.classList.remove(
              "show"
            );

            absence?.classList.add(
              "show"
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   住宿选择
========================================================= */

function setupStayChoice() {

  const choices =
    $$(".small-choice");

  const stayFields =
    $("#stayFields");


  choices.forEach(
    (choice) => {

      choice.addEventListener(
        "click",
        () => {

          choices.forEach(
            (item) => {

              item.classList.remove(
                "selected"
              );

            }
          );


          choice.classList.add(
            "selected"
          );


          needStay =
            choice.dataset.stay;


          if (
            needStay === "yes"
          ) {

            stayFields?.classList.add(
              "show"
            );

          } else {

            stayFields?.classList.remove(
              "show"
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   入住人数
========================================================= */

function setupPeopleControl() {

  const input =
    $("#stayPeople");

  const minus =
    $("#minusPeople");

  const plus =
    $("#plusPeople");


  if (!input) return;


  minus?.addEventListener(
    "click",
    () => {

      const value =
        Number(input.value);

      input.value =
        Math.max(
          1,
          value - 1
        );

    }
  );


  plus?.addEventListener(
    "click",
    () => {

      const value =
        Number(input.value);

      input.value =
        Math.min(
          10,
          value + 1
        );

    }
  );

}


/* =========================================================
   提交回复
========================================================= */

function setupReplySubmit() {

  const button =
    $("#submitReply");

  const success =
    $("#replySuccess");


  if (!button) return;


  button.addEventListener(
    "click",
    () => {

      if (!attendance) {

        alert(
          "请先选择是否出席。"
        );

        return;

      }


      const guest =
        getGuestName();


      const message =
        $("#message")?.value.trim()
        || "";


      const stayPeople =
        $("#stayPeople")?.value
        || "1";


      const stayDate =
        $("#stayDate")?.value
        || "";


      const leaveDate =
        $("#leaveDate")?.value
        || "";


      const replyData = {

        guest,

        attendance,

        needStay,

        stayPeople,

        stayDate,

        leaveDate,

        message,

        submittedAt:
          new Date().toISOString()

      };


      /*
        目前先保存在当前设备。

        等后面接 Cloudflare / 数据库以后，
        这里再改成真正的在线提交。

        现在先把前端流程跑通。
      */

      localStorage.setItem(
        "weddingReply",
        JSON.stringify(
          replyData
        )
      );


      success?.classList.add(
        "show"
      );


      button.style.display =
        "none";


      success?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );

}


/* =========================================================
   页面初始化
========================================================= */

function init() {

  renderGuestName();

  renderMap();

  renderPhotos();

  setupPhotoNavigation();

  setupMusic();

  startCountdown();

  setupAttendance();

  setupStayChoice();

  setupPeopleControl();

  setupReplySubmit();

}


document.addEventListener(
  "DOMContentLoaded",
  init
);
