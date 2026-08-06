/**
 * Render by-sentence blocks; multi-pronunciation words are activatable.
 */
(function (global) {
  "use strict";

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function appendParts(container, parts, className) {
    var line = document.createElement("p");
    line.className = className;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part.text) continue;

      if (part.multi && part.pronunciations && part.pronunciations.length > 1) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pf-multi";
        btn.textContent = part.text;
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-haspopup", "dialog");
        btn.setAttribute(
          "aria-label",
          part.text.trim() + ", multiple pronunciations, show list"
        );
        btn.setAttribute("data-pronunciations", JSON.stringify(part.pronunciations));
        line.appendChild(btn);
        continue;
      }

      var span = document.createElement("span");
      span.textContent = part.text;
      if (part.oov) span.className = "pf-oov";
      line.appendChild(span);
    }
    container.appendChild(line);
  }

  function renderBlocks(outputEl, blocks) {
    clear(outputEl);
    if (!blocks || !blocks.length) {
      var empty = document.createElement("p");
      empty.className = "pf-empty";
      empty.textContent = "Transcription will appear here.";
      outputEl.appendChild(empty);
      return;
    }
    for (var i = 0; i < blocks.length; i++) {
      var block = document.createElement("div");
      block.className = "pf-out-block";
      appendParts(block, blocks[i].originalParts, "pf-out-en");
      appendParts(block, blocks[i].ipaParts, "pf-out-ipa");
      outputEl.appendChild(block);
    }
  }

  global.PhoneticRender = {
    renderBlocks: renderBlocks,
  };
})(typeof window !== "undefined" ? window : self);
