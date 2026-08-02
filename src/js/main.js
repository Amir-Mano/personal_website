(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navList.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");

    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.hidden = false;
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      lightboxImg.src = "";
    };

    document.querySelectorAll("[data-lightbox]").forEach(function (img) {
      img.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
})();
