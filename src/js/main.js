(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  var lightbox = document.querySelector(".lightbox");

  var closeNav = function () {
    navList.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeNav();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        navList.classList.contains("is-open") &&
        !navList.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navList.classList.contains("is-open")) {
        if (!lightbox || lightbox.hidden) {
          closeNav();
          toggle.focus();
        }
      }
    });
  }

  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    var openLightbox = function (trigger, src, alt) {
      lastFocused = trigger;
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.hidden = false;
      document.body.classList.add("no-scroll");
      closeBtn.focus();
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.classList.remove("no-scroll");
      if (lastFocused) {
        lastFocused.focus();
        lastFocused = null;
      }
    };

    document.querySelectorAll("[data-lightbox]").forEach(function (img) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");

      img.addEventListener("click", function () {
        openLightbox(img, img.currentSrc || img.src, img.alt);
      });

      img.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
          event.preventDefault();
          openLightbox(img, img.currentSrc || img.src, img.alt);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeBtn.focus();
      }
    });
  }
})();
