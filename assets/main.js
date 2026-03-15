(function () {
  const data = window.SITE_DATA;

  if (!data) {
    return;
  }

  renderFocusStrip();
  hydrateProject();
  renderScenarios();
  renderAboutCards();
  hydrateChannel();
  setCurrentYear();
  setupReveal();

  function renderFocusStrip() {
    const strip = document.getElementById("focus-strip");
    if (!strip) {
      return;
    }

    strip.innerHTML = data.focusStrip
      .map(function (item) {
        return '<span class="focus-chip">' + escapeHtml(item) + "</span>";
      })
      .join("");
  }

  function hydrateProject() {
    setText("featured-name", data.project.name);
    setText("featured-summary", data.project.summary);
    setText("project-summary", data.project.summary);

    const tagList = document.getElementById("featured-tags");
    if (tagList) {
      tagList.innerHTML = data.project.tags
        .map(function (tag) {
          return "<li>" + escapeHtml(tag) + "</li>";
        })
        .join("");
    }

    const highlightList = document.getElementById("project-highlights");
    if (highlightList) {
      highlightList.innerHTML = data.project.highlights
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");
    }

    const projectLinks = document.getElementById("project-links");
    if (projectLinks) {
      projectLinks.innerHTML = data.project.links
        .map(function (link) {
          return (
            '<a class="button button-secondary" href="' +
            escapeAttribute(link.href) +
            '" target="_blank" rel="noreferrer">' +
            escapeHtml(link.label) +
            "</a>"
          );
        })
        .join("");
    }

    const primaryLink = document.getElementById("featured-primary-link");
    const secondaryLink = document.getElementById("featured-secondary-link");

    if (primaryLink) {
      primaryLink.href = data.project.links[0].href;
    }

    if (secondaryLink) {
      secondaryLink.href = data.project.links[2].href;
    }
  }

  function renderScenarios() {
    const scenarioGrid = document.getElementById("project-scenarios");
    if (!scenarioGrid) {
      return;
    }

    scenarioGrid.innerHTML = data.project.scenarios
      .map(function (item) {
        return (
          '<article class="scenario-card acrylic-panel">' +
          "<h3>" +
          escapeHtml(item.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(item.copy) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderAboutCards() {
    const aboutCards = document.getElementById("about-cards");
    if (!aboutCards) {
      return;
    }

    aboutCards.innerHTML = data.aboutCards
      .map(function (item) {
        return (
          '<article class="about-card acrylic-panel">' +
          "<h3>" +
          escapeHtml(item.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(item.copy) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function hydrateChannel() {
    setText("channel-name", data.channel.officialName);
    setText("channel-handle", data.channel.handle);
    setText("channel-summary", data.channel.summary);
    setText("channel-note-copy", data.channel.note);

    const points = document.getElementById("channel-points");
    if (points) {
      points.innerHTML = data.channel.points
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");
    }
  }

  function setCurrentYear() {
    const currentYear = document.getElementById("current-year");
    if (currentYear) {
      currentYear.textContent = String(new Date().getFullYear());
    }
  }

  function setupReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) {
      return;
    }

    if (reduceMotion) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");
  }
})();
