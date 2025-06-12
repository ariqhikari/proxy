function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const elementHeight = rect.bottom - rect.top;
  const elementWidth = rect.right - rect.left;

  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
  );
  const visibleWidth = Math.max(
    0,
    Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
  );

  const isVisible =
    (visibleHeight * visibleWidth) / (elementHeight * elementWidth) >= 0.25;

  return isVisible;
}

function coverImages() {
  const divs = document.getElementsByTagName("div");
  const images = document.getElementsByTagName("img");

  const urlRegex = /(url\(['"]?)([^'")]+)(['"]?\))/; // Regular expression to match URLs in the format url('...') or url("...")

  for (let div of divs) {
    const backgroundImage = window.getComputedStyle(div).backgroundImage;

    const match = backgroundImage.match(urlRegex);
    if (match && match[2]) {
      const url = match[2]; // Extract the URL

      const img = new Image();
      img.src = url;

      img.onload = function () {
        const width = img.width;
        const height = img.height;
        if (width > 100 && height > 100) {
          if (isElementInViewport(div)) {
            div.style.filter = "blur(64px)";
          }
        }
      };

      img.onerror = function () {
        console.error("Gagal memuat gambar latar belakang:", url);
      };
    }
  }

  for (let img of images) {
    const imgWidth = img.width;
    const imgHeight = img.height;

    if (
      !img.dataset.covered &&
      imgWidth > 50 &&
      imgHeight > 50 &&
      !img.src.includes("logo") &&
      !img.src.includes("icon")
    ) {
      if (isElementInViewport(img)) {
        console.log(img);
        
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = `${img.offsetTop}px`;
        overlay.style.left = `${img.offsetLeft}px`;
        overlay.style.width = `${imgWidth}px`;
        overlay.style.height = `${imgHeight}px`;
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.color = "white";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.fontSize = "16px";
        overlay.style.textAlign = "center";
        overlay.style.zIndex = "999999";

        img.style.filter = "blur(64px)";
        img.style.opacity = "0.7";

        const sensitiveText = document.createElement("div");
        sensitiveText.innerText = "Image Content";
        sensitiveText.style.fontSize = "18px";
        sensitiveText.style.fontWeight = "bold";
        overlay.appendChild(sensitiveText);

        const description = document.createElement("div");
        description.innerText =
          "This image may contain sensitive or disturbing content.";
        description.style.fontSize = "12px";
        overlay.appendChild(description);

        const loading = document.createElement("div");
        loading.innerText = "Loading...";
        loading.style.display = "block";
        overlay.appendChild(loading);

        // const button = document.createElement("button");
        // button.innerText = "See Image";
        // button.style.marginTop = "10px";
        // button.style.padding = "5px 15px";
        // button.style.backgroundColor = "transparent";
        // button.style.color = "white";
        // button.style.border = "1px solid white";
        // button.style.borderRadius = "5px";
        // button.style.cursor = "pointer";
        // button.onclick = function (e) {
        //   e.stopPropagation();
        //   e.preventDefault();

        //   loading.style.display = "block";
        //   button.disabled = true;
        // };

        // overlay.appendChild(button);

        img.parentNode.insertBefore(overlay, img);
        img.style.pointerEvents = "none";

        img.dataset.covered = "false";
        
        fetch("http://172.172.232.224:5001/predict-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: img.src,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API response:", data);
            if (data.hasil === "Berbahaya") {
              img.src =
                "https://ariqhikari.github.io/proxy/assets/blocked-image.png";
            }

            overlay.remove();
            img.style.filter = "none";
            img.style.opacity = "1";
            img.dataset.covered = "true";
          })
          .catch((error) => {
            console.error("Error fetching API:", error);
          });
      }
    }
  }
}

// Fungsi lainnya tetap sama

function pauseAllVideos() {
  const videos = document.getElementsByTagName("video");

  for (let video of videos) {
    console.log("URL VIDEO:", video.currentSrc || video.src);
    // video.pause();
  }
}

let isCoverImagesRunning = false;
let isPauseVideosRunning = false;

function handleInteractionImage() {
  if (isCoverImagesRunning) return;

  isCoverImagesRunning = true;
  coverImages();
  isCoverImagesRunning = false;
}

function handleInteractionVideo() {
  if (isPauseVideosRunning) return;

  isPauseVideosRunning = true;
  pauseAllVideos();
  isPauseVideosRunning = false;
}

if (
  !window.location.href.includes("tiktok.com") &&
  !window.location.href.includes("youtube.com") &&
  !window.location.href.includes("snailly-block.netlify.app")
) {
  const events = [
    "scroll",
    "click",
    "keydown",
    "mousemove",
    "touchstart",
    "touchmove",
    "touchend",
  ];

  events.forEach((event) => {
    window.addEventListener(event, () => {
      clearTimeout(window.interactionTimeout);
      window.interactionTimeout = setTimeout(handleInteractionImage, 100);
    });
  });

  handleInteractionImage();
}

// pauseAllVideos();

// const observer = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.type === "childList") {
//       console.log("New elements added to the DOM");
//       clearTimeout(window.interactionTimeout);
//       window.interactionTimeout = setTimeout(handleInteractionVideo, 100);
//     }
//   });
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true,
// });

/// Block Video Youtube

function blockVideoYoutube() {
  const playerContainer = document.getElementById("player");

  if (playerContainer) {
    const img = document.createElement("img");
    img.src = "https://ariqhikari.github.io/proxy/assets/blocked-video.png";
    img.style.position = "absolute";
    img.style.top = 0;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.pointerEvents = "none";
    playerContainer.appendChild(img);
  }
}

const urlYoutube = [
  "https://www.youtube.com/watch?app=desktop&v=LTcmiwlT4KU&ab_channel=saranghoe",
  "https://www.youtube.com/watch?v=M1YI40N2e3A&ab_channel=WindahBasudara",
  "https://www.youtube.com/watch?v=I4nI_rowdhM&ab_channel=CompilationsGuy",
  "https://www.youtube.com/watch?v=we6PRXmfils&ab_channel=Dragonxthe1",
];

const url = window.location.href;
if (urlYoutube.includes(url)) {
  blockVideoYoutube();
}
