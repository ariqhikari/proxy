function coverImages() {
  const divs = document.getElementsByTagName("div");
  const images = document.getElementsByTagName("img");

  for (let div of divs) {
    const hasBackgroundImage =
      window.getComputedStyle(div).backgroundImage !== "none";

    if (hasBackgroundImage) {
      div.style.filter = "blur(64px)";
    }
  }

  for (let img of images) {
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    if (
      !img.dataset.covered &&
      imgWidth > 50 &&
      imgHeight > 50 &&
      !img.src.includes("logo") &&
      !img.src.includes("icon")
    ) {
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.color = "white";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.fontSize = "16px";
      overlay.style.textAlign = "center";
      overlay.style.gap = "10px";
      overlay.style.zIndex = "1000";

      img.style.filter = "blur(64px)";
      img.style.opacity = "0.7";

      const sensitiveText = document.createElement("div");
      sensitiveText.innerText = "Image Content";
      sensitiveText.style.fontSize = "18px";
      sensitiveText.style.fontWeight = "bold";
      overlay.appendChild(sensitiveText);

      const description = document.createElement("div");
      description.innerText =
        "This photo may contain sensitive or disturbing content.";
      description.style.fontSize = "12px";
      overlay.appendChild(description);

      const loading = document.createElement("div");
      loading.innerText = "Loading...";
      loading.style.display = "none";
      overlay.appendChild(loading);

      const button = document.createElement("button");
      button.innerText = "See Image";
      button.style.marginTop = "10px";
      button.style.padding = "5px 15px";
      button.style.backgroundColor = "transparent";
      button.style.color = "white";
      button.style.border = "1px solid white";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.onclick = function () {
        loading.style.display = "block";
        button.disabled = true;

        setTimeout(() => {
          alert("Success Fetch (simulation).");
          overlay.remove();
          img.style.filter = "none";
          img.style.opacity = "1";
          img.dataset.covered = "true";
          img.style.pointerEvents = "auto";
        }, 250);
      };

      overlay.appendChild(button);
      img.style.position = "relative";
      img.parentNode.insertBefore(overlay, img);
      img.style.pointerEvents = "none";

      img.dataset.covered = "false";
    }
  }
}

let isCoverImagesRunning = false; // Flag untuk melacak status coverImages

function handleInteraction() {
  if (isCoverImagesRunning) return; // Cegah pemanggilan jika sudah berjalan

  isCoverImagesRunning = true; // Tandai fungsi sedang berjalan
  coverImages();
  isCoverImagesRunning = false; // Reset flag setelah selesai
}

coverImages();

const events = [
  "scroll",
  "click",
  "keydown",
  "mousemove",
  "touchstart",
  "touchmove",
  "touchend", // Tambahkan jika perlu
];

events.forEach((event) => {
  window.addEventListener(event, () => {
    clearTimeout(window.interactionTimeout);
    window.interactionTimeout = setTimeout(handleInteraction, 100); // Panggil handleInteraction
  });
});
