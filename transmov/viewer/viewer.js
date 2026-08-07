/**
 * TransMov online animated image viewer (GIF / APNG / WebP).
 * All file handling stays in the browser — nothing is uploaded.
 */
(function (global) {
  "use strict";

  var FORMAT_META = {
    gif: {
      label: "GIF",
      accept: "image/gif,.gif",
      mimeHint: ["image/gif"],
      ext: [".gif"],
      siblingPath: {
        apng: "../apng-viewer/",
        webp: "../webp-viewer/",
      },
    },
    apng: {
      label: "APNG",
      accept: "image/png,.png,.apng",
      mimeHint: ["image/png", "image/apng"],
      ext: [".png", ".apng"],
      siblingPath: {
        gif: "../gif-viewer/",
        webp: "../webp-viewer/",
      },
    },
    webp: {
      label: "WebP",
      accept: "image/webp,.webp",
      mimeHint: ["image/webp"],
      ext: [".webp"],
      siblingPath: {
        gif: "../gif-viewer/",
        apng: "../apng-viewer/",
      },
    },
  };

  function $(id) {
    return document.getElementById(id);
  }

  function formatBytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDuration(ms) {
    if (ms == null || !isFinite(ms) || ms < 0) return "—";
    if (ms === 0) return "0 ms";
    if (ms < 1000) return Math.round(ms) + " ms";
    var s = ms / 1000;
    if (s < 10) return s.toFixed(2).replace(/\.?0+$/, "") + " s";
    if (s < 60) return s.toFixed(1).replace(/\.0$/, "") + " s";
    var m = Math.floor(s / 60);
    var rem = Math.round(s % 60);
    return m + "m " + rem + "s";
  }

  function readU16LE(view, offset) {
    return view.getUint16(offset, true);
  }

  function readU24LE(view, offset) {
    return view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16);
  }

  function parseGifAnimation(buffer) {
    var view = new DataView(buffer);
    if (buffer.byteLength < 6) return null;
    var sig =
      String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2)) +
      String.fromCharCode(view.getUint8(3), view.getUint8(4), view.getUint8(5));
    if (sig !== "GIF87a" && sig !== "GIF89a") return null;

    var frames = 0;
    var durationMs = 0;
    var delayCs = 10; // default 100ms when unspecified
    var i = 13;
    var packed = view.getUint8(10);
    if (packed & 0x80) {
      var gctSize = 3 * (1 << ((packed & 0x07) + 1));
      i += gctSize;
    }

    while (i < buffer.byteLength) {
      var b = view.getUint8(i);
      if (b === 0x3b) break; // trailer
      if (b === 0x21) {
        if (i + 2 >= buffer.byteLength) break;
        var label = view.getUint8(i + 1);
        if (label === 0xf9 && i + 8 < buffer.byteLength) {
          // Graphic Control Extension — delay in centiseconds
          delayCs = readU16LE(view, i + 4);
          i += 8;
          continue;
        }
        i += 2;
        while (i < buffer.byteLength) {
          var blockSize = view.getUint8(i);
          i += 1;
          if (blockSize === 0) break;
          i += blockSize;
        }
        continue;
      }
      if (b === 0x2c) {
        // Image Descriptor
        if (i + 10 >= buffer.byteLength) break;
        var localPacked = view.getUint8(i + 9);
        i += 10;
        if (localPacked & 0x80) {
          i += 3 * (1 << ((localPacked & 0x07) + 1));
        }
        if (i >= buffer.byteLength) break;
        i += 1; // LZW min code size
        while (i < buffer.byteLength) {
          var sz = view.getUint8(i);
          i += 1;
          if (sz === 0) break;
          i += sz;
        }
        frames += 1;
        // Browsers often treat very short GIF delays as ~100ms
        var useCs = delayCs < 2 ? 10 : delayCs;
        durationMs += useCs * 10;
        delayCs = 10;
        continue;
      }
      break;
    }

    if (frames === 0) frames = 1;
    return { frames: frames, durationMs: frames > 1 ? durationMs : 0 };
  }

  function parsePngApngAnimation(buffer) {
    var view = new DataView(buffer);
    if (buffer.byteLength < 8) return null;
    var pngSig = [137, 80, 78, 71, 13, 10, 26, 10];
    for (var s = 0; s < 8; s++) {
      if (view.getUint8(s) !== pngSig[s]) return null;
    }

    var frames = 0;
    var durationMs = 0;
    var hasActl = false;
    var offset = 8;

    while (offset + 8 <= buffer.byteLength) {
      var length = view.getUint32(offset, false);
      var type =
        String.fromCharCode(
          view.getUint8(offset + 4),
          view.getUint8(offset + 5),
          view.getUint8(offset + 6),
          view.getUint8(offset + 7)
        );
      var dataStart = offset + 8;
      if (dataStart + length + 4 > buffer.byteLength) break;

      if (type === "acTL" && length >= 8) {
        hasActl = true;
        frames = view.getUint32(dataStart, false);
      } else if (type === "fcTL" && length >= 26) {
        var delayNum = view.getUint16(dataStart + 20, false);
        var delayDen = view.getUint16(dataStart + 22, false);
        if (delayDen === 0) delayDen = 100;
        if (delayNum === 0) {
          durationMs += 100; // treat unspecified like ~100ms
        } else {
          durationMs += (delayNum / delayDen) * 1000;
        }
      }

      offset = dataStart + length + 4; // data + CRC
      if (type === "IEND") break;
    }

    if (!hasActl) return { frames: 1, durationMs: 0 };
    if (frames <= 0) frames = 1;
    return { frames: frames, durationMs: frames > 1 ? durationMs : 0 };
  }

  function parseWebpAnimation(buffer) {
    var view = new DataView(buffer);
    if (buffer.byteLength < 12) return null;
    var riff =
      String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    var webp =
      String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
    if (riff !== "RIFF" || webp !== "WEBP") return null;

    var frames = 0;
    var durationMs = 0;
    var offset = 12;

    while (offset + 8 <= buffer.byteLength) {
      var fourcc =
        String.fromCharCode(
          view.getUint8(offset),
          view.getUint8(offset + 1),
          view.getUint8(offset + 2),
          view.getUint8(offset + 3)
        );
      var size = view.getUint32(offset + 4, true);
      var dataStart = offset + 8;
      if (dataStart + size > buffer.byteLength) break;

      if (fourcc === "ANMF" && size >= 16) {
        frames += 1;
        var frameDuration = readU24LE(view, dataStart + 12);
        durationMs += frameDuration;
      }

      offset = dataStart + size + (size & 1); // pad to even
    }

    if (frames === 0) return { frames: 1, durationMs: 0 };
    return { frames: frames, durationMs: durationMs };
  }

  function parseAnimationMeta(buffer, detected) {
    try {
      if (detected === "gif") return parseGifAnimation(buffer);
      if (detected === "webp") return parseWebpAnimation(buffer);
      if (detected === "apng") return parsePngApngAnimation(buffer);
    } catch (e) {
      return null;
    }
    return null;
  }

  function detectFormat(file) {
    var name = (file.name || "").toLowerCase();
    var type = (file.type || "").toLowerCase();
    if (type === "image/gif" || name.endsWith(".gif")) return "gif";
    if (type === "image/webp" || name.endsWith(".webp")) return "webp";
    if (type === "image/apng" || name.endsWith(".apng")) return "apng";
    if (type === "image/png" || name.endsWith(".png")) return "apng";
    return null;
  }

  function isImageFile(file) {
    if (!file) return false;
    if (file.type && file.type.indexOf("image/") === 0) return true;
    var name = (file.name || "").toLowerCase();
    return (
      name.endsWith(".gif") ||
      name.endsWith(".png") ||
      name.endsWith(".apng") ||
      name.endsWith(".webp")
    );
  }

  function track(eventName, params) {
    try {
      if (typeof global.gtag === "function") {
        global.gtag("event", eventName, params || {});
      }
    } catch (e) {
      /* ignore */
    }
  }

  function mount(options) {
    var format = options.format || "gif";
    var meta = FORMAT_META[format];
    if (!meta) {
      console.error("[TransMovViewer] Unknown format:", format);
      return;
    }

    var campaign = options.campaign || "transmov_" + format + "_viewer";
    var sampleUrl = options.sampleUrl || "../viewer/demo/sample." + (format === "apng" ? "apng" : format);
    var pageVersion = options.pageVersion || format + "_viewer";

    var dropzone = $("viewer-dropzone");
    var active = $("viewer-active");
    var fileInput = $("viewer-file-input");
    var stageWrap = $("viewer-stage-wrap");
    var previewImg = $("viewer-preview-img");
    var previewCanvas = $("viewer-preview-canvas");
    var crossHint = $("viewer-cross-format");
    var errorEl = $("viewer-error");
    var sampleBtn = $("viewer-sample-btn");

    var metaName = $("viewer-meta-name");
    var metaFormat = $("viewer-meta-format");
    var metaSize = $("viewer-meta-size");
    var metaDims = $("viewer-meta-dims");
    var metaFrames = $("viewer-meta-frames");
    var metaDuration = $("viewer-meta-duration");

    var btnPlay = $("viewer-btn-play");
    var btnFit = $("viewer-btn-fit");
    var btnActual = $("viewer-btn-actual");
    var btnClear = $("viewer-btn-clear");

    var objectUrl = null;
    var playing = true;
    var zoomMode = "fit"; // fit | actual
    var scale = 1;
    var currentDetected = format;

    function setError(msg) {
      if (!errorEl) return;
      if (!msg) {
        errorEl.textContent = "";
        errorEl.classList.add("is-hidden");
        return;
      }
      errorEl.textContent = msg;
      errorEl.classList.remove("is-hidden");
    }

    function revokeUrl() {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    }

    function showEmpty() {
      revokeUrl();
      if (dropzone) dropzone.classList.remove("is-hidden");
      if (active) active.classList.remove("is-visible");
      if (previewImg) {
        previewImg.removeAttribute("src");
        previewImg.classList.remove("is-hidden");
      }
      if (previewCanvas) {
        previewCanvas.classList.add("is-hidden");
        var ctx = previewCanvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      }
      if (crossHint) {
        crossHint.classList.add("is-hidden");
        crossHint.innerHTML = "";
      }
      setError("");
      if (metaFrames) metaFrames.textContent = "—";
      if (metaDuration) metaDuration.textContent = "—";
      playing = true;
      zoomMode = "fit";
      scale = 1;
      updatePlayButton();
      updateZoomButtons();
      applyTransform();
    }

    function updatePlayButton() {
      if (!btnPlay) return;
      btnPlay.textContent = playing ? "Pause" : "Play";
      btnPlay.setAttribute("aria-pressed", playing ? "true" : "false");
    }

    function updateZoomButtons() {
      if (btnFit) btnFit.classList.toggle("is-active", zoomMode === "fit");
      if (btnActual) btnActual.classList.toggle("is-active", zoomMode === "actual");
    }

    function applyTransform() {
      var nodes = [previewImg, previewCanvas];
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (!el) continue;
        el.classList.toggle("zoom-fit", zoomMode === "fit");
        el.classList.toggle("zoom-actual", zoomMode === "actual");
        if (zoomMode === "fit") {
          el.style.transform = scale === 1 ? "" : "scale(" + scale + ")";
          el.style.transformOrigin = "center center";
        } else {
          el.style.transform = scale === 1 ? "" : "scale(" + scale + ")";
          el.style.transformOrigin = "center center";
        }
      }
    }

    function setBackground(mode) {
      if (!stageWrap) return;
      stageWrap.classList.remove("bg-checker", "bg-black", "bg-white");
      stageWrap.classList.add("bg-" + mode);
      var dots = document.querySelectorAll("[data-viewer-bg]");
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.classList.toggle("is-active", d.getAttribute("data-viewer-bg") === mode);
        d.setAttribute("aria-pressed", d.getAttribute("data-viewer-bg") === mode ? "true" : "false");
      }
    }

    function showCrossFormatHint(detected) {
      if (!crossHint) return;
      if (!detected || detected === format) {
        crossHint.classList.add("is-hidden");
        crossHint.innerHTML = "";
        return;
      }
      var path = meta.siblingPath[detected];
      var label = FORMAT_META[detected] ? FORMAT_META[detected].label : detected.toUpperCase();
      crossHint.innerHTML =
        "This looks like a <strong>" +
        label +
        "</strong> file. Preview works here — for a dedicated page, open the " +
        (path
          ? '<a href="' + path + '">' + label + " Viewer</a>."
          : label + " Viewer.");
      crossHint.classList.remove("is-hidden");
    }

    function setPlaying(next) {
      playing = next;
      updatePlayButton();
      if (!previewImg || !previewCanvas) return;

      if (playing) {
        previewCanvas.classList.add("is-hidden");
        previewImg.classList.remove("is-hidden");
        // Force restart animation by reassigning src
        var src = previewImg.getAttribute("src");
        if (src) {
          previewImg.removeAttribute("src");
          previewImg.src = src;
        }
      } else {
        try {
          var w = previewImg.naturalWidth || 1;
          var h = previewImg.naturalHeight || 1;
          previewCanvas.width = w;
          previewCanvas.height = h;
          var ctx = previewCanvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(previewImg, 0, 0);
          }
          previewImg.classList.add("is-hidden");
          previewCanvas.classList.remove("is-hidden");
        } catch (err) {
          /* canvas tainted or unavailable — keep playing */
          playing = true;
          updatePlayButton();
        }
      }
    }

    function openFile(file, source) {
      if (!file || !isImageFile(file)) {
        setError("Please choose a GIF, APNG/PNG, or WebP image.");
        return;
      }

      var detected = detectFormat(file) || format;
      currentDetected = detected;
      revokeUrl();
      objectUrl = URL.createObjectURL(file);
      setError("");

      if (previewImg) {
        previewImg.onload = function () {
          if (metaDims) {
            metaDims.textContent = previewImg.naturalWidth + " × " + previewImg.naturalHeight;
          }
          playing = true;
          zoomMode = "fit";
          scale = 1;
          updatePlayButton();
          updateZoomButtons();
          applyTransform();
          if (previewCanvas) previewCanvas.classList.add("is-hidden");
          previewImg.classList.remove("is-hidden");
        };
        previewImg.onerror = function () {
          setError(
            "This browser could not display the file. Try another format, or open it in TransMov for Mac."
          );
          showEmpty();
        };
        previewImg.alt = file.name || meta.label + " preview";
        previewImg.src = objectUrl;
      }

      if (metaName) metaName.textContent = file.name || "Untitled";
      if (metaFormat) {
        metaFormat.textContent =
          detected === "apng" && (file.name || "").toLowerCase().endsWith(".png")
            ? "PNG / APNG"
            : (FORMAT_META[detected] && FORMAT_META[detected].label) || detected.toUpperCase();
      }
      if (metaSize) metaSize.textContent = formatBytes(file.size || 0);
      if (metaDims) metaDims.textContent = "—";
      if (metaFrames) metaFrames.textContent = "…";
      if (metaDuration) metaDuration.textContent = "…";

      showCrossFormatHint(detected);

      if (dropzone) dropzone.classList.add("is-hidden");
      if (active) active.classList.add("is-visible");

      file.arrayBuffer()
        .then(function (buffer) {
          var anim = parseAnimationMeta(buffer, detected);
          if (metaFrames) {
            metaFrames.textContent = anim && anim.frames ? String(anim.frames) : "—";
          }
          if (metaDuration) {
            if (anim && anim.frames > 1) {
              metaDuration.textContent = formatDuration(anim.durationMs);
            } else if (anim && anim.frames === 1) {
              metaDuration.textContent = "—";
            } else {
              metaDuration.textContent = "—";
            }
          }
        })
        .catch(function () {
          if (metaFrames) metaFrames.textContent = "—";
          if (metaDuration) metaDuration.textContent = "—";
        });

      track(source === "sample" ? "viewer_sample_load" : "viewer_file_open", {
        format: format,
        detected_format: detected,
        page_version: pageVersion,
        file_size: file.size || 0,
      });
    }

    function openFromUrl(url, name, source) {
      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error("fetch failed");
          return res.blob();
        })
        .then(function (blob) {
          var file = new File([blob], name || "sample", { type: blob.type || "image/" + format });
          openFile(file, source || "sample");
        })
        .catch(function () {
          setError("Could not load the sample file.");
        });
    }

    // Wire dropzone
    if (fileInput) {
      fileInput.setAttribute("accept", options.accept || meta.accept);
      fileInput.addEventListener("change", function () {
        var f = fileInput.files && fileInput.files[0];
        if (f) openFile(f, "file");
        fileInput.value = "";
      });
    }

    function openPicker() {
      if (fileInput) fileInput.click();
    }

    if (dropzone) {
      dropzone.addEventListener("click", function (e) {
        if (e.target && e.target.closest && e.target.closest("[data-no-picker]")) return;
        openPicker();
      });
      dropzone.addEventListener("dragenter", function (e) {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragleave", function (e) {
        if (e.target === dropzone) dropzone.classList.remove("is-dragover");
      });
      dropzone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropzone.classList.remove("is-dragover");
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) openFile(f, "drop");
      });
    }

    document.addEventListener("paste", function (e) {
      var items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.indexOf("image/") === 0) {
          var f = items[i].getAsFile();
          if (f) {
            e.preventDefault();
            openFile(f, "paste");
            return;
          }
        }
      }
    });

    if (sampleBtn) {
      sampleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openFromUrl(sampleUrl, "sample." + (format === "apng" ? "apng" : format), "sample");
      });
    }

    if (btnPlay) {
      btnPlay.addEventListener("click", function () {
        setPlaying(!playing);
      });
    }
    if (btnFit) {
      btnFit.addEventListener("click", function () {
        zoomMode = "fit";
        scale = 1;
        updateZoomButtons();
        applyTransform();
      });
    }
    if (btnActual) {
      btnActual.addEventListener("click", function () {
        zoomMode = "actual";
        scale = 1;
        updateZoomButtons();
        applyTransform();
      });
    }
    if (btnClear) {
      btnClear.addEventListener("click", function () {
        showEmpty();
      });
    }

    var bgDots = document.querySelectorAll("[data-viewer-bg]");
    for (var bi = 0; bi < bgDots.length; bi++) {
      bgDots[bi].addEventListener("click", function (ev) {
        var mode = ev.currentTarget.getAttribute("data-viewer-bg");
        if (mode) setBackground(mode);
      });
    }

    if (stageWrap) {
      stageWrap.addEventListener(
        "wheel",
        function (e) {
          if (!active || !active.classList.contains("is-visible")) return;
          if (!e.ctrlKey && !e.metaKey) return;
          e.preventDefault();
          var delta = e.deltaY > 0 ? -0.1 : 0.1;
          scale = Math.min(4, Math.max(0.25, scale + delta));
          applyTransform();
        },
        { passive: false }
      );
    }

    // Download CTA tracking
    var downloadLinks = document.querySelectorAll("[data-viewer-download]");
    for (var di = 0; di < downloadLinks.length; di++) {
      downloadLinks[di].addEventListener("click", function (ev) {
        var position = ev.currentTarget.getAttribute("data-viewer-download") || "unknown";
        track("download_click", {
          page_version: pageVersion,
          position: position,
          campaign: campaign,
        });
      });
    }

    // Top bar scroll polish (optional narrowing skipped for minimal bar)
    setBackground("checker");
    showEmpty();

    return {
      openFile: openFile,
      clear: showEmpty,
    };
  }

  global.TransMovViewer = {
    mount: mount,
    FORMAT_META: FORMAT_META,
  };
})(typeof window !== "undefined" ? window : this);
