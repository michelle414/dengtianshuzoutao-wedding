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
   * 等你上传婚纱照以后，
   * 只需要把文件名写在这里。
   *
   * 例如：
   *
   * photos: [
   *   { src: "wedding-main.jpg" },
   *   { src: "wedding-01.jpg" },
   *   { src: "wedding-02.jpg" },
   *   { src: "wedding-03.jpg" },
   *   { src: "wedding-04.jpg" }
   * ]
   */
  photos: []
};


/* ==================== GUEST ==================== */

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("guest");

  return guest
    ? guest.trim() || "宾客"
    : "宾客";
}


function formatGuestName(name) {
  /*
   * 暂时保留中文名字之间的轻微留白，
   * 但不增加“叔叔、阿姨、先生、女士”等称呼。
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


/* ==================== INIT ==================== */

document.addEventListener("DOMContentLoaded", () => {

  const guestName = document.getElementById("guestName");

  if (guestName) {
    guestName.textContent = formatGuestName(getGuestName());
  }


  /* 地图 */

  const mapButton = document.getElementById("mapButton");
  const mapImageLink = document.getElementById("mapImageLink");

  if (mapButton) {
    mapButton.href = weddingConfig.mapUrl;
  }

  if (mapImageLink) {
    mapImageLink.href = weddingConfig.mapUrl;
  }


  /* 音乐 */

  const music = document.getElementById("bgMusic");
  const musicControl = document.getElementById("musicControl");
  const openInvitation = document.getElementById("openInvitation");

  music.src = weddingConfig.music;


  function updateMusicButton() {
    if (!musicControl) return;

    musicControl.textContent = music.paused ? "♪" : "♫";
  }


  if (openInvitation) {

    openInvitation.addEventListener("click", async () => {

      try {
        await music.play();
      } catch (error) {
        console.log("音乐播放需要用户再次点击。");
      }

      updateMusicButton();

      document
        .querySelector(".wedding-day")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    });

  }


  if (musicControl) {

    musicControl.addEventListener("click", async () => {

      if (music.paused) {

        try {
          await music.play();
        } catch (error) {
          console.log(error);
        }

      } else {

        music.pause();

      }

      updateMusicButton();
    });

  }


  /* 倒计时 */

  startCountdown();


  /* 照片 */

  initGallery();


  /* 宾客回复 */

  initReply();

});


/* ==================== COUNTDOWN ==================== */

function startCountdown() {

  const number = document.getElementById("countdownNumber");

  if (!number) return;


  function update() {

    const target = new Date(weddingConfig.weddingDate).getTime();
    const now = Date.now();

    const difference = target - now;

    if (difference <= 0) {

      number.textContent = "0";

      return;
    }

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    number.textContent = days;
  }


  update();

  setInterval(update, 60 * 1000);
}


/* ==================== GALLERY ==================== */

function initGallery() {

  const mainImage = document.getElementById("mainGalleryImage");
  const placeholder = document.getElementById("photoPlaceholder");
  const photoScroll = document.getElementById("photoScroll");

  const prevButton = document.getElementById("photoPrev");
  const nextButton = document.getElementById("photoNext");


  if (!mainImage || !photoScroll) {
    return;
  }


  /* 目前还没有照片 */

  if (!weddingConfig.photos.length) {

    mainImage.style.display = "none";

    if (placeholder) {
      placeholder.style.display = "flex";
    }

    photoScroll.innerHTML = `
      <div class="photo-thumb-placeholder">
        OUR MOMENTS
      </div>
    `;

    if (prevButton) {
      prevButton.style.display = "none";
    }

    if (nextButton) {
      nextButton.style.display = "none";
    }

    return;
  }


  /* 有照片以后 */

  if (placeholder) {
    placeholder.style.display = "none";
  }

  mainImage.style.display = "block";


  weddingConfig.photos.forEach((photo, index) => {

    const image = document.createElement("img");

    image.src = photo.src;
    image.alt = `TIANSHU & TAO · ${index + 1}`;

    image.className = "photo-thumb";

    if (index === 0) {
      image.classList.add("active");
      mainImage.src = photo.src;
    }


    image.addEventListener("click", () => {

      mainImage.src = photo.src;

      document
        .querySelectorAll(".photo-thumb")
        .forEach(item => {
          item.classList.remove("active");
        });

      image.classList.add("active");

    });


    photoScroll.appendChild(image);

  });


  /* 左右滑动 */

  if (prevButton) {

    prevButton.addEventListener("click", () => {

      photoScroll.scrollBy({
        left: -window.innerWidth * 0.62,
        behavior: "smooth"
      });

    });

  }


  if (nextButton) {

    nextButton.addEventListener("click", () => {

      photoScroll.scrollBy({
        left: window.innerWidth * 0.62,
        behavior: "smooth"
      });

    });

  }

}


/* ==================== REPLY ==================== */

function initReply() {

  const attendanceButtons =
    document.querySelectorAll(".attendance-button");

  const stayFields =
    document.getElementById("stayFields");

  const stayButtons =
    document.querySelectorAll(".stay-button");

  const submitButton =
    document.getElementById("submitReply");

  const success =
    document.getElementById("replySuccess");


  let attendance = "";
  let stay = "";


  attendanceButtons.forEach(button => {

    button.addEventListener("click", () => {

      attendance = button.dataset.attendance;

      attendanceButtons.forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");


      if (attendance === "yes") {

        stayFields?.classList.remove("hidden");

      } else {

        stayFields?.classList.add("hidden");

      }

    });

  });


  stayButtons.forEach(button => {

    button.addEventListener("click", () => {

      stay = button.dataset.stay;

      stayButtons.forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");

    });

  });


  if (!submitButton) return;


  submitButton.addEventListener("click", () => {

    const guest = getGuestName();

    const peopleCount =
      document.getElementById("peopleCount")?.value || "";

    const checkIn =
      document.getElementById("checkIn")?.value || "";

    const checkOut =
      document.getElementById("checkOut")?.value || "";

    const message =
      document.getElementById("guestMessage")?.value || "";


    const replyData = {
      guest,
      attendance,
      stay,
      peopleCount,
      checkIn,
      checkOut,
      message,
      submittedAt: new Date().toISOString()
    };


    localStorage.setItem(
      `weddingReply_${guest}`,
      JSON.stringify(replyData)
    );


    if (success) {
      success.classList.remove("hidden");
    }

    submitButton.textContent = "已送出";

    submitButton.disabled = true;

  });

}
