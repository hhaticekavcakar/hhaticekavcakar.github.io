/* =================================================================
   Hatice Kavçakar – portfolio script
   Small enhancements only. All content lives in index.html, so the
   page is still readable if this file fails to load.
   ================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupHeaderShadow();
  highlightCurrentSection();
  setupProjectDetails();
  showProjectImagesWhenAvailable();
  hideMissingVideos();
  hideMissingReports();
  setCurrentYear();
});

/* 1. Mobile menu: open and close the navigation with the menu button */
function setupMobileMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector(".visually-hidden").textContent = isOpen ? "Close menu" : "Open menu";
  }

  button.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Close the menu after choosing a section
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setOpen(false); });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });
}

/* 2. Add a thin line under the header once the page is scrolled */
function setupHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* 3. Highlight the menu link of the section currently on screen */
function highlightCurrentSection() {
  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!("IntersectionObserver" in window) || links.length === 0) return;

  const linkFor = {};
  links.forEach(function (link) {
    linkFor[link.getAttribute("href").slice(1)] = link;
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); });
        const active = linkFor[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    },
    // A section counts as "current" when it crosses the upper part of the screen
    { rootMargin: "-25% 0px -65% 0px" }
  );

  // Watch every section that has an id, so leaving the menu's sections
  // (e.g. scrolling back to the top) clears the highlight correctly
  document.querySelectorAll("main section[id]").forEach(function (section) {
    observer.observe(section);
  });
}

/* 4. "View Details" buttons: show or hide the full project description.
      The details start visible in the HTML (so they are readable without
      JavaScript) and are collapsed here. */
function setupProjectDetails() {
  document.querySelectorAll(".details-toggle").forEach(function (button) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    function setOpen(isOpen) {
      panel.hidden = !isOpen;
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "Hide Details" : "View Details";
    }

    setOpen(false);
    button.addEventListener("click", function () {
      setOpen(panel.hidden);
    });
  });
}

/* 5. Project images: if the image file has not been uploaded yet,
      remove the <img> so the lavender illustration behind it shows. */
function showProjectImagesWhenAvailable() {
  document.querySelectorAll(".project-media img").forEach(function (img) {
    function useIllustration() { img.remove(); }

    // The error may already have happened before this script ran
    if (img.complete && img.naturalWidth === 0) useIllustration();
    else img.addEventListener("error", useIllustration);
  });
}

/* 6. Videos: hide the player until the video file exists */
function hideMissingVideos() {
  document.querySelectorAll(".project-video").forEach(function (block) {
    const video = block.querySelector("video");
    const source = video && video.querySelector("source");
    if (!video || !source) { block.hidden = true; return; }

    function hide() { block.hidden = true; }

    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) hide();
    source.addEventListener("error", hide);
    video.addEventListener("error", hide);
  });
}

/* 7. "View Report" buttons: only show them when the PDF exists.
      The button is hidden first and shown once the file is found. */
function hideMissingReports() {
  document.querySelectorAll(".report-link").forEach(function (link) {
    link.hidden = true;

    fetch(link.getAttribute("href"), { method: "HEAD" })
      .then(function (response) {
        if (response.ok) link.hidden = false;
      })
      .catch(function () {
        // Opening index.html directly from your computer blocks this check;
        // on GitHub Pages it works normally.
      });
  });
}

/* 8. Keep the year in the footer up to date */
function setCurrentYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}
