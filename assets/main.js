(function () {
  const data = window.SITE_DATA;

  if (!data) {
    return;
  }

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reduceMotionQuery.matches;

  hydrateChannel();
  renderProjects();
  renderWorkflow();
  renderTicker();
  setCurrentYear();

  if (prefersReducedMotion) {
    revealAll();
  } else {
    setupReveal();
    setupTiltCards();
    setupHeroStage();
  }

  function hydrateChannel() {
    setText("channel-name-inline", data.channel.officialName);
    setText("channel-name-button", data.channel.officialName);
    setText("channel-name-display", data.channel.officialName);
    setText("channel-name-heading", data.channel.officialName);
    setText("channel-name", data.channel.officialName);
    setText("channel-handle", data.channel.handle);
    setText("channel-handle-inline", data.channel.handle);
    setText("channel-tagline", data.channel.tagline);
    setText("channel-summary", data.channel.summary);
    setText("channel-brand-pulse", data.channel.brandPulse);

    const identity = document.getElementById("channel-identity");
    if (identity) {
      identity.innerHTML = data.channel.identity
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");
    }

    const points = document.getElementById("channel-points");
    if (points) {
      points.innerHTML = data.channel.points
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");
    }
  }

  function renderProjects() {
    const projectList = document.getElementById("project-list");
    if (!projectList) {
      return;
    }

    projectList.innerHTML = data.projects
      .map(function (project) {
        const tags = project.tags
          .map(function (tag) {
            return "<li>" + escapeHtml(tag) + "</li>";
          })
          .join("");

        const highlights = project.highlights
          .map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
          })
          .join("");

        const links = project.links
          .map(function (link) {
            return (
              '<a class="project-link" href="' +
              escapeAttribute(link.href) +
              '" target="_blank" rel="noreferrer">' +
              escapeHtml(link.label) +
              "</a>"
            );
          })
          .join("");

        return (
          '<article class="project-card tilt-card">' +
          '<div class="project-card-header">' +
          "<div>" +
          "<h3>" +
          escapeHtml(project.name) +
          "</h3>" +
          '<p class="project-type">' +
          escapeHtml(project.type) +
          "</p>" +
          "</div>" +
          '<span class="project-status">' +
          escapeHtml(project.status) +
          "</span>" +
          "</div>" +
          "<p>" +
          escapeHtml(project.summary) +
          "</p>" +
          '<ul class="project-tags">' +
          tags +
          "</ul>" +
          '<ul class="project-highlights">' +
          highlights +
          "</ul>" +
          '<div class="project-links">' +
          links +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderWorkflow() {
    const workflowList = document.getElementById("workflow-list");
    if (!workflowList) {
      return;
    }

    workflowList.innerHTML = data.workflow
      .map(function (item) {
        return (
          '<article class="workflow-card tilt-card">' +
          '<span class="workflow-step">' +
          escapeHtml(item.step) +
          "</span>" +
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

  function renderTicker() {
    const ticker = document.getElementById("ticker-track");
    if (!ticker) {
      return;
    }

    const repeatedItems = data.tickerItems.concat(data.tickerItems, data.tickerItems);
    ticker.innerHTML = repeatedItems
      .map(function (item) {
        return (
          '<span class="ticker-item">' +
          '<span class="ticker-dot" aria-hidden="true"></span>' +
          escapeHtml(item) +
          "</span>"
        );
      })
      .join("");
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) {
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
        threshold: 0.18
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function revealAll() {
    document.querySelectorAll(".reveal").forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  function setupTiltCards() {
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      let rafId = 0;

      card.addEventListener("pointermove", function (event) {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const rotateY = (x - 0.5) * 10;
        const rotateX = (0.5 - y) * 10;

        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(function () {
          card.style.setProperty("--card-rotate-x", rotateX.toFixed(2) + "deg");
          card.style.setProperty("--card-rotate-y", rotateY.toFixed(2) + "deg");
          card.style.setProperty("--glow-x", (x * 100).toFixed(2) + "%");
          card.style.setProperty("--glow-y", (y * 100).toFixed(2) + "%");
        });
      });

      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--card-rotate-x", "0deg");
        card.style.setProperty("--card-rotate-y", "0deg");
        card.style.setProperty("--glow-x", "50%");
        card.style.setProperty("--glow-y", "50%");
      });
    });
  }

  function setupHeroStage() {
    const stage = document.getElementById("hero-stage");
    if (!stage) {
      return;
    }

    const depthItems = stage.querySelectorAll("[data-depth]");

    stage.addEventListener("pointermove", function (event) {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const moveX = (x - 0.5) * 30;
      const moveY = (y - 0.5) * 24;

      stage.style.setProperty("--pointer-x", (x * 100).toFixed(2) + "%");
      stage.style.setProperty("--pointer-y", (y * 100).toFixed(2) + "%");

      depthItems.forEach(function (item) {
        const depth = Number(item.dataset.depth || 0);
        const translateX = moveX * depth;
        const translateY = moveY * depth;
        item.style.transform =
          "translate3d(" +
          translateX.toFixed(2) +
          "px, " +
          translateY.toFixed(2) +
          "px, 0)";
      });
    });

    stage.addEventListener("pointerleave", function () {
      stage.style.setProperty("--pointer-x", "50%");
      stage.style.setProperty("--pointer-y", "50%");
      depthItems.forEach(function (item) {
        item.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  function setCurrentYear() {
    const currentYear = document.getElementById("current-year");
    if (currentYear) {
      currentYear.textContent = String(new Date().getFullYear());
    }
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
