(function () {
  var catalog = window.LonelyIsleSoundscapes || [];
  var filters = window.LonelyIsleSoundscapeFilters || [];
  var grid = document.getElementById("soundscape-grid");
  var filterBar = document.getElementById("soundscape-filters");
  var empty = document.getElementById("soundscape-empty");
  if (!grid || !filterBar) return;

  var active = "all";

  function matches(item, filterId) {
    if (filterId === "all") return true;
    return (item.categories || []).indexOf(filterId) !== -1;
  }

  function renderFilters() {
    filterBar.innerHTML = "";
    filters.forEach(function (f) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "soundscape-filter" + (f.id === active ? " is-active" : "");
      btn.textContent = f.label;
      btn.setAttribute("aria-pressed", f.id === active ? "true" : "false");
      btn.addEventListener("click", function () {
        active = f.id;
        renderFilters();
        renderGrid();
      });
      filterBar.appendChild(btn);
    });
  }

  function renderGrid() {
    var items = catalog.filter(function (item) {
      return matches(item, active);
    });
    grid.innerHTML = "";
    items.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "soundscape-card";
      a.href = item.id + ".html";
      var coverStyle = "--ss-hue:" + item.hue;
      if (item.cover) {
        coverStyle += ";background-image:url('" + item.cover + "')";
      }
      a.innerHTML =
        '<div class="soundscape-card__cover' +
        (item.cover ? " has-cover" : "") +
        '" style="' +
        coverStyle +
        '" aria-hidden="true"></div>' +
        '<div class="soundscape-card__body">' +
        '<h2 class="soundscape-card__title">' +
        item.title +
        "</h2>" +
        "</div>";
      li.appendChild(a);
      grid.appendChild(li);
    });
    if (empty) empty.classList.toggle("is-visible", items.length === 0);
  }

  renderFilters();
  renderGrid();
})();
