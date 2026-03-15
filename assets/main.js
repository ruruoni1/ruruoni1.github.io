(function () {
  const data = window.SITE_DATA;

  if (!data) {
    return;
  }

  const projectList = document.getElementById("project-list");
  const projectCount = document.querySelector("[data-project-count]");
  const channelSummary = document.getElementById("channel-summary");
  const channelPoints = document.getElementById("channel-points");
  const currentYear = document.getElementById("current-year");

  if (projectList) {
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
          '<article class="project-card">' +
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

  if (projectCount) {
    projectCount.textContent = String(data.projects.length).padStart(2, "0");
  }

  if (channelSummary) {
    channelSummary.textContent = data.channel.summary;
  }

  if (channelPoints) {
    channelPoints.innerHTML = data.channel.points
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
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
    return String(value).replace(/"/g, "&quot;");
  }
})();
