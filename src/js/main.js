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
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var focusable = [prevBtn, closeBtn, nextBtn];
    var lastFocused = null;
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    var currentIndex = -1;

    var showImage = function (index) {
      if (!galleryItems.length) return;
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      var img = galleryItems[currentIndex];
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
    };

    var openLightbox = function (trigger, index) {
      lastFocused = trigger;
      showImage(index);
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

    galleryItems.forEach(function (img, index) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");

      img.addEventListener("click", function () {
        openLightbox(img, index);
      });

      img.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
          event.preventDefault();
          openLightbox(img, index);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () {
      showImage(currentIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      showImage(currentIndex + 1);
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showImage(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        showImage(currentIndex + 1);
      } else if (event.key === "Tab") {
        event.preventDefault();
        var activeIndex = focusable.indexOf(document.activeElement);
        var nextIndex;
        if (event.shiftKey) {
          nextIndex = activeIndex <= 0 ? focusable.length - 1 : activeIndex - 1;
        } else {
          nextIndex = activeIndex === -1 || activeIndex === focusable.length - 1 ? 0 : activeIndex + 1;
        }
        focusable[nextIndex].focus();
      }
    });
  }
})();
