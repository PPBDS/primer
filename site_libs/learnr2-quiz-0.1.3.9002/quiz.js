(function () {
  "use strict";

  // Captured once, at script-evaluation time (page load), not re-read on
  // every storage access. quarto-live's own WebRExerciseEditor does the
  // same for its `editor-${window.location.href}#${id}` persistence key --
  // it's set once in the constructor, not recomputed on every keystroke
  // (confirmed by reading its bundled live-runtime.js source). Reading
  // `window.location.href` fresh at click time instead, as this file used
  // to everywhere below, silently broke both Start Over and the exercises
  // in a download: Quarto's own TOC sidebar links change the URL's hash on
  // every click (a completely normal way to move around a tutorial), so a
  // reader who saved an answer while the hash pointed at one section and
  // then clicked to another section before downloading or starting over
  // ended up computing a different storage key than the one the data was
  // actually saved under -- the data was never touched, but neither
  // feature could find it. Stripping the hash keeps every learnr2-owned
  // key (and every `editor-` lookup into quarto-live's own keys) stable
  // for the lifetime of the page view, matching quarto-live's own
  // behavior -- as long as the page itself was first loaded without a
  // hash (true for every normal run_tutorial()/GitHub Pages entry point;
  // a reader arriving via a deep link straight to a `#section` anchor is a
  // known remaining gap, since quarto-live would then cache *that* hash
  // into its own key for the whole session and there is no way to read
  // quarto-live's internal state to match it).
  var pageUrl = window.location.href.split("#")[0];

  function decodeBase64Json(value) {
    var binary = atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    var json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json);
  }

  function shuffle(array) {
    var result = array.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === "class") {
        node.className = attrs[key];
      } else if (key === "text") {
        node.textContent = attrs[key];
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (child) {
      node.appendChild(child);
    });
    return node;
  }

  function normalizeText(value) {
    return String(value).trim().replace(/\s+/g, " ").toLowerCase();
  }

  // Client-side format check applied before a "text"/"reflection"/
  // "reflection_editable" answer is accepted, independent of grading --
  // e.g. `validate: "integer"` rejects free-form prose in an otherwise
  // ungraded reflection question ("how many minutes did this take?").
  // `data.validate` is "none" (never blocks submission) unless the R side
  // set it explicitly, so this is a no-op for every other question.
  var VALIDATION_MESSAGES = {
    integer: "Please enter a whole number (e.g. 42)."
  };

  function passesValidation(value, validate) {
    if (validate === "integer") {
      return /^-?\d+$/.test(String(value).trim());
    }
    return true;
  }

  // ---- Progress persistence -------------------------------------------
  // Mirrors the storage-key convention used by quarto-live's own exercise
  // editor persistence (`editor-${location.href}#${id}`), with our own
  // prefix so the two never collide. Shared by questions, info forms, and
  // anything else that persists state -- `data.id` already carries its own
  // semantic prefix (e.g. "learnr2-question-...", "learnr2-info-...").

  function storageKey(data) {
    return "learnr2-" + pageUrl + "#" + data.id;
  }

  function loadState(data) {
    try {
      var raw = window.localStorage.getItem(storageKey(data));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Returns true if the state was stored. On failure it tells the reader,
  // once per page, instead of failing silently: a full localStorage used to
  // mean an answer looked submitted but was never stored, and so was
  // missing from the download. Storage is per *site*, shared by every
  // tutorial served from it (all of run_tutorial()'s 127.0.0.1:7446, all
  // of ppbds.github.io), and about 5 MB in most browsers, so pasted
  // screenshots are what fill it.
  function saveState(data, state) {
    try {
      window.localStorage.setItem(storageKey(data), JSON.stringify(state));
      return true;
    } catch (e) {
      reportStorageFailure(e);
      return false;
    }
  }

  function isQuotaError(e) {
    return !!e && (e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22 || e.code === 1014);
  }

  var storageWarning = null;
  function reportStorageFailure(e) {
    var message = isQuotaError(e) ?
      "Your last answer was NOT saved: this browser's storage for this site is full. " +
      "Pasted screenshots take the most room. Remove one with \"Remove image\", or use " +
      "Start Over on a tutorial you have already downloaded and turned in, then submit again." :
      "This browser is blocking storage for this page, so your answers will not be kept " +
      "if you leave or reload it. Download your answers before you close the page.";
    if (!storageWarning) {
      storageWarning = el("div", { class: "learnr2-storage-warning", role: "alert" });
      var main = document.getElementById("quarto-document-content") || document.body;
      main.insertBefore(storageWarning, main.firstChild);
    }
    storageWarning.textContent = message;
  }

  function clearState(data) {
    try {
      window.localStorage.removeItem(storageKey(data));
    } catch (e) {
      // Ignore.
    }
  }

  function buildChoiceQuestion(container, data) {
    var inputType = data.type === "multiple" ? "checkbox" : "radio";
    var answers = data.randomAnswerOrder ? shuffle(data.answers) : data.answers;
    var name = data.id + "-choice";

    var list = el("div", { class: "learnr2-answers" });
    answers.forEach(function (answer, index) {
      var inputId = data.id + "-answer-" + index;
      var input = el("input", { type: inputType, id: inputId, name: name });
      input.value = String(index);
      var label = el(
        "label",
        { class: "learnr2-answer", for: inputId },
        [input, el("span", { text: answer.text })]
      );
      list.appendChild(el("div", { class: "learnr2-answer-row" }, [label]));
    });

    var feedback = el("div", { class: "learnr2-feedback d-none" });
    var submit = el("button", { type: "button", class: "learnr2-submit", text: data.submitLabel });
    var tryAgain = el(
      "button",
      { type: "button", class: "learnr2-try-again d-none", text: data.tryAgainLabel }
    );

    function setFeedback(correct, message) {
      feedback.className = "learnr2-feedback " +
        (correct ? "learnr2-feedback-correct" : "learnr2-feedback-incorrect");
      feedback.textContent = message;
    }

    // Shared by a fresh submission and by restoring a saved answer, so both
    // paths produce identical feedback/disabled state.
    function applyOutcome(chosen, disable) {
      var totalCorrect = answers.filter(function (a) { return a.correct; }).length;
      var allCorrect = chosen.length === totalCorrect &&
        chosen.every(function (a) { return a.correct; });

      var message = allCorrect ? data.correctMessage : data.incorrectMessage;
      var extra = chosen.map(function (a) { return a.message; }).filter(Boolean);
      if (extra.length > 0) {
        message = message + " " + extra.join(" ");
      }
      setFeedback(allCorrect, message);

      if (disable) {
        list.querySelectorAll("input").forEach(function (input) {
          input.disabled = true;
        });
        submit.classList.add("d-none");
        if (!allCorrect && data.allowRetry) {
          tryAgain.classList.remove("d-none");
        }
      }
      return allCorrect;
    }

    submit.addEventListener("click", function () {
      var checked = Array.prototype.slice.call(list.querySelectorAll("input:checked"));
      if (checked.length === 0) {
        setFeedback(false, "Please select an answer.");
        return;
      }

      var chosen = checked.map(function (input) {
        return answers[Number(input.value)];
      });
      var allCorrect = applyOutcome(chosen, true);
      saveState(data, {
        selected: chosen.map(function (a) { return a.text; }),
        correct: allCorrect
      });
    });

    tryAgain.addEventListener("click", function () {
      list.querySelectorAll("input").forEach(function (input) {
        input.checked = false;
        input.disabled = false;
      });
      feedback.className = "learnr2-feedback d-none";
      feedback.textContent = "";
      submit.classList.remove("d-none");
      tryAgain.classList.add("d-none");
      clearState(data);
    });

    container.appendChild(list);
    container.appendChild(el("div", { class: "learnr2-controls" }, [submit, tryAgain]));
    container.appendChild(feedback);

    var saved = loadState(data);
    if (saved && Array.isArray(saved.selected)) {
      var selectedTexts = saved.selected;
      list.querySelectorAll("input").forEach(function (input) {
        var a = answers[Number(input.value)];
        if (selectedTexts.indexOf(a.text) !== -1) {
          input.checked = true;
        }
      });
      var chosen = answers.filter(function (a) { return selectedTexts.indexOf(a.text) !== -1; });
      applyOutcome(chosen, true);
    }
  }

  function buildTextQuestion(container, data) {
    var input = el("input", { type: "text", class: "learnr2-text-input" });
    var feedback = el("div", { class: "learnr2-feedback d-none" });
    var submit = el("button", { type: "button", class: "learnr2-submit", text: data.submitLabel });
    var tryAgain = el(
      "button",
      { type: "button", class: "learnr2-try-again d-none", text: data.tryAgainLabel }
    );

    function applyOutcome(value, disable) {
      var normalized = normalizeText(value);
      var match = data.answers.find(function (a) { return normalizeText(a.text) === normalized; });
      var correct = !!(match && match.correct);

      var message = correct ? data.correctMessage : data.incorrectMessage;
      if (match && match.message) {
        message = message + " " + match.message;
      }
      feedback.className = "learnr2-feedback " +
        (correct ? "learnr2-feedback-correct" : "learnr2-feedback-incorrect");
      feedback.textContent = message;

      if (disable) {
        input.disabled = true;
        submit.classList.add("d-none");
        if (!correct && data.allowRetry) {
          tryAgain.classList.remove("d-none");
        }
      }
      return correct;
    }

    submit.addEventListener("click", function () {
      if (!passesValidation(input.value, data.validate)) {
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = VALIDATION_MESSAGES[data.validate];
        return;
      }
      var correct = applyOutcome(input.value, true);
      saveState(data, { value: input.value, correct: correct });
    });

    tryAgain.addEventListener("click", function () {
      input.value = "";
      input.disabled = false;
      feedback.className = "learnr2-feedback d-none";
      feedback.textContent = "";
      submit.classList.remove("d-none");
      tryAgain.classList.add("d-none");
      clearState(data);
    });

    container.appendChild(el("div", { class: "learnr2-answers" }, [input]));
    container.appendChild(el("div", { class: "learnr2-controls" }, [submit, tryAgain]));
    container.appendChild(feedback);

    var saved = loadState(data);
    if (saved && typeof saved.value === "string") {
      input.value = saved.value;
      applyOutcome(saved.value, true);
    }
  }

  // Shrinks a pasted screenshot before it is stored. The image is scaled to
  // at most IMAGE_MAX_WIDTH x IMAGE_MAX_HEIGHT (aspect kept), drawn on a white
  // background (so transparent areas don't turn black), and encoded as WebP,
  // or JPEG where the browser can't encode WebP (Safari's canvas silently
  // returns PNG for "image/webp"; we detect that from the data URL). If the
  // result is still over IMAGE_TARGET_CHARS, quality and then size step down
  // until it fits. Screenshots used to be stored as full-size PNG, so a
  // single one could take 3 MB of the ~5 MB localStorage a whole site
  // shares. Also strips metadata (EXIF orientation, GPS) as before.
  var IMAGE_MAX_WIDTH = 1600;
  var IMAGE_MAX_HEIGHT = 4000;
  var IMAGE_TARGET_CHARS = 600 * 1024; // of data URL, ~450 KB of image
  var IMAGE_QUALITIES = [0.85, 0.7, 0.55];

  function encodeCanvas(canvas, quality) {
    var webp = canvas.toDataURL("image/webp", quality);
    if (webp.indexOf("data:image/webp") === 0) {
      return webp;
    }
    return canvas.toDataURL("image/jpeg", quality);
  }

  function compressImage(file, onSuccess, onError) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var scale = Math.min(1, IMAGE_MAX_WIDTH / img.naturalWidth, IMAGE_MAX_HEIGHT / img.naturalHeight);
          var result = null;
          for (var attempt = 0; attempt < 6 && !result; attempt++) {
            var canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            for (var q = 0; q < IMAGE_QUALITIES.length; q++) {
              var url = encodeCanvas(canvas, IMAGE_QUALITIES[q]);
              if (url.length <= IMAGE_TARGET_CHARS) {
                result = url;
                break;
              }
            }
            scale = scale * 0.75;
          }
          if (result) {
            onSuccess(result);
          } else {
            onError();
          }
        } catch (e) {
          onError();
        }
      };
      img.onerror = onError;
      img.src = reader.result;
    };
    reader.onerror = onError;
    reader.readAsDataURL(file);
  }

  // A box showing the pasted image, plus a *secondary* paste target of its
  // own -- but the primary way readers paste is directly into the response
  // textarea (see wireImagePaste below). A <textarea> reliably fires native
  // "paste" events in every browser; an arbitrary non-editable <div> does
  // not always, and even where it does, a reader who never notices the
  // small box below the textarea will naturally paste into the textarea
  // instead and see nothing happen. Handling paste on the textarea too
  // means it works wherever the reader's cursor actually is.
  //
  // Accepted clipboard image types and the MAX_BYTES cap are documented
  // just above handlePaste(), below -- a handful of screenshots shouldn't
  // blow past the browser's localStorage quota (pasted images are
  // persisted as base64 data URLs, like everything else).
  //
  // `onChange(hasImage)` fires whenever an image is set or removed, so the
  // caller can hide its response textarea while an image is the answer.
  //
  // `noTextBox`: the question has no text box (allow_text = FALSE), so the
  // placeholder must not point the reader at one.
  function buildImagePasteArea(onChange, noTextBox) {
    // A sanity cap on what is decoded; the stored image is shrunk by
    // compressImage() regardless, so readers no longer need to crop.
    var MAX_BYTES = 20 * 1024 * 1024;
    var wrapper = el("div", { class: "learnr2-image-paste", tabindex: "0" });
    var placeholder = el("div", {
      class: "learnr2-image-paste-placeholder",
      text: noTextBox
        ? "Click here, then paste a screenshot with Ctrl+V (or Cmd+V)."
        : "Paste a screenshot with Ctrl+V (or Cmd+V) into the text box " +
          "above, or click here and paste it directly."
    });
    var preview = el("img", { class: "learnr2-image-paste-preview d-none" });
    var error = el("div", { class: "learnr2-image-paste-error d-none" });
    var remove = el(
      "button",
      { type: "button", class: "learnr2-image-paste-remove d-none", text: "Remove image" }
    );

    var dataUrl = null;
    var disabled = false;

    function setError(message) {
      error.textContent = message;
      error.classList.remove("d-none");
    }

    function clearError() {
      error.textContent = "";
      error.classList.add("d-none");
    }

    function setImage(nextDataUrl) {
      dataUrl = nextDataUrl;
      preview.src = nextDataUrl;
      preview.classList.remove("d-none");
      placeholder.classList.add("d-none");
      if (!disabled) {
        remove.classList.remove("d-none");
      }
      clearError();
      if (onChange) {
        onChange(true);
      }
    }

    function clearImage() {
      dataUrl = null;
      preview.src = "";
      preview.classList.add("d-none");
      placeholder.classList.remove("d-none");
      remove.classList.add("d-none");
      if (onChange) {
        onChange(false);
      }
    }

    // Which raster types get accepted: verified (MDN, web.dev) that only
    // the *newer* Async Clipboard API's write() path is documented as
    // PNG-only for images. This code uses the older `paste`-event
    // clipboardData.items path instead (works without the permission
    // prompt the async API needs), which has no such documented
    // guarantee -- and a real OS-native screenshot's clipboard format is
    // platform-dependent (this could not be verified end-to-end against
    // real macOS/Windows/ChromeOS screenshot tools from this sandbox, only
    // simulated). Rather than gamble on "screenshots are always PNG" and
    // reject anything else, accept every raster type every mainstream
    // browser can reliably decode via <img>/canvas, and normalize to PNG
    // ourselves in compressImage() above -- so what's actually stored and
    // submitted is always a size-capped WebP or JPEG regardless of what the
    // reader's platform put on the clipboard. Deliberately excludes image/svg+xml
    // (vector markup, not a raster screenshot, and a different security
    // surface to feed into <img>) and image/tiff (real OS clipboards can
    // expose this, notably on macOS, but mainstream browsers other than
    // Safari generally don't decode it via <img> either, so accepting it
    // would just trade one confusing failure for another -- flagged as an
    // open gap rather than papered over).
    var ACCEPTED_IMAGE_TYPES = /^image\/(png|jpeg|gif|webp|bmp)$/;

    // `silent`: when handling paste on the textarea (which is also used for
    // ordinary typed/pasted text), a clipboard paste with no image should
    // just fall through to the browser's normal text-paste behavior --
    // no error, no preventDefault(). The dedicated box has no other
    // purpose, so there `silent` is false and a non-image paste is an error.
    function handlePaste(event, silent) {
      if (disabled) {
        return;
      }
      var items = (event.clipboardData && event.clipboardData.items) || [];
      var imageItem = null;
      for (var i = 0; i < items.length; i++) {
        if (ACCEPTED_IMAGE_TYPES.test(items[i].type)) {
          imageItem = items[i];
          break;
        }
      }
      if (!imageItem) {
        if (!silent) {
          setError("Please paste an image (copy a screenshot, then press Ctrl+V here).");
        }
        return;
      }
      event.preventDefault();

      var file = imageItem.getAsFile();
      if (!file) {
        setError("Could not read the pasted image. Please try again.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That image is too large (max 20MB). Try a smaller screenshot.");
        return;
      }

      compressImage(
        file,
        function (dataUrl) {
          setImage(dataUrl);
        },
        function () {
          setError("Could not read the pasted image. Please try again.");
        }
      );
    }

    wrapper.addEventListener("paste", function (event) {
      handlePaste(event, false);
    });

    remove.addEventListener("click", function () {
      clearImage();
    });

    wrapper.appendChild(placeholder);
    wrapper.appendChild(preview);
    wrapper.appendChild(remove);
    wrapper.appendChild(error);

    return {
      element: wrapper,
      getDataUrl: function () { return dataUrl; },
      setImage: setImage,
      handlePaste: function (event) { handlePaste(event, true); },
      setDisabled: function (isDisabled) {
        disabled = isDisabled;
        wrapper.classList.toggle("learnr2-image-paste-disabled", disabled);
        wrapper.tabIndex = disabled ? -1 : 0;
        if (disabled) {
          remove.classList.add("d-none");
        } else if (dataUrl) {
          remove.classList.remove("d-none");
        }
      }
    };
  }

  // Ungraded free-response: reveals the `correct`-marked answer(s) as a
  // model answer after submitting. `type === "reflection"` locks the
  // reader's own response afterward; `"reflection_editable"` leaves it open
  // so they can keep revising it.
  function buildReflectionQuestion(container, data) {
    var editable = data.type === "reflection_editable";
    var modelAnswers = data.answers
      .filter(function (a) { return a.correct; })
      .map(function (a) { return a.text; });

    // `validate: "integer"` (e.g. "how many minutes did this take?") expects
    // a short numeric answer, not prose -- a single-line box sized like
    // student_info()'s fields (same "learnr2-text-input" class, no
    // "learnr2-textarea") fits that better than a 4-row textarea.
    var textarea = data.validate === "integer"
      ? el("input", { type: "text", class: "learnr2-text-input" })
      : el("textarea", { class: "learnr2-text-input learnr2-textarea", rows: "4" });
    var reveal = el("div", { class: "learnr2-model-answer d-none" });
    var feedback = el("div", { class: "learnr2-feedback d-none" });
    var submit = el("button", { type: "button", class: "learnr2-submit", text: data.submitLabel });
    var answers = el("div", { class: "learnr2-answers" }, [textarea]);
    // A locked image question can still swap its screenshot: its Edit
    // button (labelled `editLabel`, like reflection_editable's) reopens only
    // the image box (the text box stays hidden and disabled), and the
    // question counts as unsubmitted, via `editing`, until a new image is
    // submitted. Readers pasted the wrong screenshot and had to Start Over
    // the whole tutorial to fix it. Text stays locked for good, per the
    // note above EDITING_NOTE; reflection_editable already has Edit.
    var replaceable = data.allowImage && !editable;
    var replacing = false;
    var replace = replaceable
      ? el("button", { type: "button", class: "learnr2-image-edit d-none" })
      : null;
    // question(allow_text = FALSE): a screenshot-only question, with no text
    // box at all and Submit refused until an image is pasted. Payloads from
    // before allowText existed lack the key, so only an explicit false counts.
    var imageOnly = data.allowImage && data.allowText === false;
    if (imageOnly) {
      answers.classList.add("d-none");
    }
    // Once an image is pasted it *is* the answer: hide the text box so the
    // reader sees only the image (plus "Remove image", which brings the
    // text box back, except while replacing or for an image-only question).
    var imagePaste = data.allowImage
      ? buildImagePasteArea(function (hasImage) {
          answers.classList.toggle("d-none", hasImage || replacing || imageOnly);
        }, imageOnly)
      : null;
    if (imagePaste) {
      textarea.addEventListener("paste", function (event) {
        imagePaste.handlePaste(event);
      });
    }

    function showModelAnswer() {
      // Nothing to reveal -- e.g. question() was called with no answer()
      // marked correct, for a genuinely open-ended prompt. Leave `reveal`
      // hidden rather than showing an empty "Model answer:" box.
      if (modelAnswers.length === 0) {
        return;
      }
      reveal.textContent = "";
      reveal.appendChild(el("div", { class: "learnr2-model-answer-label", text: "Model answer:" }));
      modelAnswers.forEach(function (text) {
        reveal.appendChild(el("p", { text: text }));
      });
      reveal.classList.remove("d-none");
    }

    // "reflection" locks for good on submit. "reflection_editable" uses the
    // Edit/Submit cycle described above EDITING_NOTE: submitting locks it
    // with an "Edit" button, and Edit reopens it until the next Submit. The
    // saved answer stays the last submitted one throughout; an open edit
    // only sets `editing`, which the Continue gate and the download read
    // (widgetPending()).
    var locked = false;
    var note = el("div", { class: "learnr2-editing-note d-none", text: EDITING_NOTE });

    function setLocked(isLocked, isEditing) {
      locked = isLocked;
      replacing = replaceable && !isLocked && !!isEditing;
      textarea.disabled = isLocked || replacing;
      if (replacing) {
        answers.classList.add("d-none");
      }
      if (imagePaste) {
        imagePaste.setDisabled(isLocked);
      }
      if (editable) {
        submit.textContent = isLocked ? data.editLabel : data.submitLabel;
      } else {
        submit.classList.toggle("d-none", isLocked);
      }
      if (replace) {
        replace.textContent = data.editLabel;
        replace.classList.toggle("d-none", !isLocked);
      }
      note.textContent = replacing ? REPLACING_NOTE : EDITING_NOTE;
      note.classList.toggle("d-none", isLocked || !isEditing);
    }

    if (replace) {
      replace.addEventListener("click", function () {
        feedback.className = "learnr2-feedback d-none";
        setLocked(false, true);
        var reopened = loadState(data) || {};
        reopened.editing = true;
        saveState(data, reopened);
        imagePaste.element.focus();
      });
    }

    function applyOutcome() {
      showModelAnswer();
      setLocked(true, false);
    }

    submit.addEventListener("click", function () {
      if (locked && editable) {
        feedback.className = "learnr2-feedback d-none";
        setLocked(false, true);
        var reopened = loadState(data) || {};
        reopened.editing = true;
        saveState(data, reopened);
        (imageOnly ? imagePaste.element : textarea).focus();
        return;
      }
      if ((replacing || imageOnly) && !imagePaste.getDataUrl()) {
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = "Paste an image before submitting.";
        return;
      }
      if (!passesValidation(textarea.value, data.validate)) {
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = VALIDATION_MESSAGES[data.validate];
        return;
      }
      feedback.className = "learnr2-feedback d-none";
      var image = imagePaste ? imagePaste.getDataUrl() : null;
      var stored = saveState(data, {
        // Text typed before pasting is hidden along with the text box, so
        // don't submit it alongside the image.
        value: image ? "" : textarea.value,
        image: image,
        submitted: true
      });
      if (!stored) {
        // Not received, so don't present it as submitted: leave it open to
        // retry once there is room (see reportStorageFailure()).
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = "Your answer could not be saved. See the warning at the top of the page.";
        return;
      }
      applyOutcome();
    });

    container.appendChild(answers);
    if (imagePaste) {
      container.appendChild(imagePaste.element);
    }
    container.appendChild(el("div", { class: "learnr2-controls" }, replace ? [submit, replace] : [submit]));
    container.appendChild(note);
    container.appendChild(feedback);
    container.appendChild(reveal);

    var saved = loadState(data);
    if (saved) {
      if (typeof saved.value === "string") {
        textarea.value = saved.value;
      }
      if (saved.image && imagePaste) {
        imagePaste.setImage(saved.image);
      }
      if (saved.submitted) {
        showModelAnswer();
        var reopened = !!saved.editing && (editable || replaceable);
        setLocked(!reopened, reopened);
      }
    }
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  // A non-empty "email" field's value is required to look at least
  // vaguely like an email address -- checked with a plain "@" test, not a
  // full RFC 5322 regex, since this is a friendly nudge against typos
  // ("adaexample.com"), not a security or deliverability check.
  function isValidEmail(value) {
    return value.indexOf("@") !== -1;
  }

  // Ungraded, always-editable data collection (name/email/id, etc.) --
  // auto-saved as the reader types (so nothing is lost if they never click
  // the confirmation button), plus a button matching the one on every
  // question(), so the reader gets the same explicit "did that go through"
  // confirmation. Required fields (per-field `required`, e.g. name/email by
  // default) get a marker, and an "email" field is checked for an "@"
  // regardless of `required`; both kinds of problem get inline validation
  // on blur *and* on click. The actual gate that matters is in
  // buildDownloadButton, which blocks downloading until they're fixed,
  // regardless of whether the button was ever clicked.
  // The Edit/Submit cycle shared by student_info() and reflection_editable
  // questions. Two states only: *submitted* (fields locked, button "Edit")
  // and *editing* (fields open, button "Submit"). "Edit" just reopens the
  // fields; nothing counts as received until the next Submit, so the
  // button always tells the reader whether what they see is what was
  // received. (The previous design left fields open after Submit and
  // relabelled the button "Edit", which silently resaved -- readers had no
  // signal their changes had gone in.) Ordinary "reflection" questions do
  // not get this cycle: they stay locked for good, so a reader can't reopen
  // one and paste in the model answer they were just shown.
  var EDITING_NOTE = "Editing. Submit to save your changes.";
  var REPLACING_NOTE = "Click the image box and paste a new screenshot " +
    "(Ctrl+V or Cmd+V), then Submit.";

  // student_info() storage, per form: the flat field keys hold the last
  // *submitted* values (what the download reports); `submitted` is true only
  // while the form is locked on a submission; `editing` marks a form reopened
  // after a submission; `draft` holds typed-but-unsubmitted values, so a
  // reload mid-edit loses nothing. Older saved data (flat keys plus
  // `submitted: false`, from when every keystroke autosaved as the answer)
  // is read as a draft, not as a submission.
  function buildInfoForm(container, data) {
    var inputs = {};
    var validators = [];
    var saved = loadState(data) || {};
    var locked = !!saved.submitted;
    var editing = !!saved.editing;
    var lastSubmitted = {};
    if (saved.submitted || saved.editing) {
      data.fields.forEach(function (field) {
        if (typeof saved[field.key] === "string") {
          lastSubmitted[field.key] = saved[field.key];
        }
      });
    }
    var draft = saved.draft ||
      (!saved.submitted && !saved.editing ? saved : null);

    function currentValues() {
      var values = {};
      Object.keys(inputs).forEach(function (key) {
        values[key] = inputs[key].value;
      });
      return values;
    }

    function persist() {
      var state = Object.assign({}, lastSubmitted);
      // Returns saveState()'s result, so Submit can refuse to lock a form
      // that wasn't stored.
      if (locked) {
        state.submitted = true;
      } else {
        state.submitted = false;
        if (editing) {
          state.editing = true;
        }
        state.draft = currentValues();
      }
      return saveState(data, state);
    }
    var debouncedPersist = debounce(persist, 400);

    data.fields.forEach(function (field) {
      var inputId = data.id + "-" + field.key;
      var input = el("input", { type: "text", id: inputId, class: "learnr2-info-input" });
      var source = locked ? lastSubmitted : (draft || lastSubmitted);
      if (source && typeof source[field.key] === "string") {
        input.value = source[field.key];
      }

      var error = el("div", { class: "learnr2-info-error d-none" });

      function validate() {
        var value = input.value.trim();
        var missing = field.required && !value;
        var invalidEmail = !missing && field.key === "email" && value && !isValidEmail(value);
        if (missing) {
          error.textContent = "This field is required.";
        } else if (invalidEmail) {
          error.textContent = "Please include an \"@\" in the email address.";
        }
        var problem = missing || invalidEmail;
        error.classList.toggle("d-none", !problem);
        return !problem;
      }
      validators.push(validate);

      input.addEventListener("input", function () {
        debouncedPersist();
        if (input.value.trim()) {
          error.classList.add("d-none");
        }
      });
      input.addEventListener("blur", function () {
        if (!locked) {
          persist();
          validate();
        }
      });
      inputs[field.key] = input;

      var labelText = field.required ? field.label + " *" : field.label;
      var label = el("label", { class: "learnr2-info-label", for: inputId, text: labelText });
      container.appendChild(el("div", { class: "learnr2-info-row" }, [label, input, error]));
    });

    var feedback = el("div", { class: "learnr2-feedback d-none" });
    var note = el("div", { class: "learnr2-editing-note d-none", text: EDITING_NOTE });
    var submit = el("button", { type: "button", class: "learnr2-submit" });

    function render() {
      Object.keys(inputs).forEach(function (key) {
        inputs[key].disabled = locked;
      });
      submit.textContent = locked ? data.editLabel : data.submitLabel;
      note.classList.toggle("d-none", locked || !editing);
    }

    submit.addEventListener("click", function () {
      if (locked) {
        locked = false;
        editing = true;
        feedback.className = "learnr2-feedback d-none";
        render();
        persist();
        var first = inputs[data.fields[0].key];
        if (first) {
          first.focus();
        }
        return;
      }
      var allValid = validators.map(function (validate) { return validate(); })
        .every(Boolean);
      var previous = lastSubmitted;
      if (allValid) {
        lastSubmitted = currentValues();
        locked = true;
        editing = false;
      }
      if (!persist() && allValid) {
        lastSubmitted = previous;
        locked = false;
        editing = true;
        render();
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = "Your information could not be saved. See the warning at the top of the page.";
        return;
      }
      render();
      feedback.className = "learnr2-feedback " +
        (allValid ? "learnr2-feedback-correct" : "learnr2-feedback-incorrect");
      feedback.textContent = allValid ?
        "Looks good." :
        "Please fix the highlighted field(s) above.";
    });

    render();
    container.appendChild(el("div", { class: "learnr2-controls" }, [submit]));
    container.appendChild(note);
    container.appendChild(feedback);
  }

  // A widget counts as received only once submitted, and not while it has
  // been reopened for editing. Shared by the Continue gate and the
  // download's checks, so they always agree.
  function widgetPending(node) {
    var isInfo = node.classList.contains("learnr2-info");
    var data = decodeBase64Json(node.getAttribute(isInfo ? "data-learnr2-info" : "data-learnr2-question"));
    var saved = loadState(data);
    if (isInfo) {
      return !(saved && saved.submitted);
    }
    return !saved || saved.editing === true;
  }

  // The last *submitted* value of one info field, or "" if the form has
  // never been submitted. Never the live DOM value: what is typed but not
  // submitted has not been received.
  function infoFieldValue(data, fieldKey) {
    var saved = loadState(data);
    return saved && typeof saved[fieldKey] === "string" && (saved.submitted || saved.editing) ?
      saved[fieldKey] : "";
  }

  // Every student_info() form on the page that is not currently submitted --
  // never submitted, or reopened with Edit and not resubmitted. Blocks the
  // download: the submission identifies the student, so it must be one they
  // actually confirmed.
  function infoFieldProblems() {
    var problems = [];
    document.querySelectorAll(".learnr2-info[data-learnr2-info]").forEach(function (node) {
      if (widgetPending(node)) {
        problems.push("submit your student information above");
      }
    });
    return problems;
  }

  // Every question, across every .learnr2-question on the page, that has no
  // saved state yet -- i.e. was never submitted. Unlike infoFieldProblems(),
  // this doesn't block the download outright: a reader legitimately might
  // download a partial attempt (see collectAnswers()'s own `answer: null`
  // reporting for exactly that case). It's just what buildDownloadButton
  // warns about before letting an incomplete download through.
  function unansweredQuestionLabels() {
    var labels = [];
    document.querySelectorAll(".learnr2-question[data-learnr2-question]").forEach(function (node) {
      if (widgetPending(node)) {
        labels.push(decodeBase64Json(node.getAttribute("data-learnr2-question")).text);
      }
    });
    return labels;
  }

  function renderInfo(node) {
    var encoded = node.getAttribute("data-learnr2-info");
    if (!encoded) {
      return;
    }
    var data = decodeBase64Json(encoded);
    node.textContent = "";
    node.classList.add("learnr2-info-rendered");
    buildInfoForm(node, data);
    node.setAttribute("data-learnr2-initialized", "true");
  }

  // A random id generated once and persisted in localStorage, so it stays
  // the same across a reader's sessions on this browser/device -- not tied
  // to their real identity, just a "this is the same device that did the
  // work" signal in the download's metadata.
  var DEVICE_ID_KEY = "learnr2-device-id";

  function randomId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getDeviceId() {
    try {
      var existing = window.localStorage.getItem(DEVICE_ID_KEY);
      if (existing) {
        return existing;
      }
      var id = randomId();
      window.localStorage.setItem(DEVICE_ID_KEY, id);
      return id;
    } catch (e) {
      return "unknown";
    }
  }

  // What a browser can actually expose to a web page -- notably NOT the
  // computer name, OS username, or anything filesystem-related, which
  // browsers deliberately never give to JavaScript.
  function captureMetadata() {
    var timezone = "unknown";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      // Ignore; leave "unknown".
    }
    return {
      timezone: timezone,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: window.screen.width + "x" + window.screen.height,
      deviceId: getDeviceId()
    };
  }

  // The download time, obfuscated: base-36 of (epoch-seconds * MUL + ADD).
  // NOT cryptographic -- these constants are public, right here -- just
  // enough that the raw timestamp isn't sitting in the downloaded file and a
  // student can neither read it nor swap in a different valid one by hand.
  // `learnr2::submission_time()` reverses it. Keep MUL/ADD in sync with
  // R/submission.R. (epoch-seconds * MUL stays well under 2^53, so the
  // base-36 round-trips exactly.)
  var TIME_MUL = 8093;
  var TIME_ADD = 1000003;

  function encodeDownloadTime() {
    return (Math.floor(Date.now() / 1000) * TIME_MUL + TIME_ADD).toString(36);
  }

  // Gathers every learnr2 question/info answer currently on *this* page
  // (cross-referencing each element's own payload against its saved
  // localStorage state, so the export is human-readable, not just raw ids)
  // into one JSON object. The only non-plaintext field is `time` -- the
  // download timestamp, obfuscated (see encodeDownloadTime() above) so it
  // isn't readable or editable at a glance; nothing else is hashed or
  // signed. {webr} exercises are entirely quarto-live's own markup -- learnr2 adds
  // no data-learnr2-* attributes to them the way it does for its own
  // question()/student_info() widgets. Discover them from quarto-live's own
  // static markup instead: every {webr} cell embeds a
  // `<script type="webr-<block-id>-contents">` tag holding a base64-encoded
  // JSON blob of its starter code and chunk options (`{attr, code}`,
  // confirmed by reading quarto-live's own webr-exercise.ojs template and
  // live-runtime.js) -- present in the static HTML regardless of whether
  // WebR has finished booting, unlike anything that depends on the live
  // editor having initialized.
  //
  // Reads one such tag and returns `{ id, answer }`, or null for a cell
  // that can't be captured: a plain demo/non-editable cell (no `#| exercise:`
  // attr), or one without `#| persist: true` -- quarto-live's own editor
  // only ever writes the reader's current code to `localStorage` when
  // `persist` is enabled (see its `WebRExerciseEditor` constructor/`onInput`
  // handler), so there is no record of it anywhere, live-DOM or otherwise,
  // for a non-persisted cell. The key is `editor-${location.href}#${id}`,
  // where `id` defaults to the script tag's own `type` (e.g.
  // "webr-4-contents") -- *not* the `exercise:` label -- unless a chunk
  // sets its own `#| id:` option. The stored value is the plain code
  // string itself, not JSON.
  function exerciseAnswerFromScript(scriptEl) {
    var block;
    try {
      block = decodeBase64Json(scriptEl.textContent);
    } catch (e) {
      return null;
    }
    var attr = block.attr || {};
    if (!attr.exercise || !attr.persist) {
      return null;
    }
    var storageKey = "editor-" + pageUrl + "#" + (attr.id || scriptEl.type);
    return { id: attr.exercise, answer: window.localStorage.getItem(storageKey) };
  }

  async function collectAnswers() {
    // Submitted values only (see infoFieldValue()): the download is blocked
    // until every student_info() form is submitted, so these are what the
    // reader confirmed, never half-typed edits.
    var info = {};
    document.querySelectorAll(".learnr2-info[data-learnr2-info]").forEach(function (node) {
      var data = decodeBase64Json(node.getAttribute("data-learnr2-info"));
      data.fields.forEach(function (field) {
        var value = infoFieldValue(data, field.key);
        info[field.key] = value ? value : null;
      });
    });

    // One flat list, in the order things appear on the page, mixing
    // question()/reflection widgets and {webr} exercises together -- every
    // entry is just `{ id, answer }`. A single combined selector so the
    // browser hands the nodes back in document order (querySelectorAll
    // always does); branch per node on which kind it is. An unsubmitted
    // question reports `answer: null` (saveState() only runs from a submit
    // handler, so no saved state means it was never submitted).
    var answers = [];
    document
      .querySelectorAll(
        '.learnr2-question[data-learnr2-question], script[type^="webr-"][type$="-contents"]'
      )
      .forEach(function (node) {
        if (node.tagName === "SCRIPT") {
          var exercise = exerciseAnswerFromScript(node);
          if (exercise) {
            answers.push(exercise);
          }
          return;
        }
        var data = decodeBase64Json(node.getAttribute("data-learnr2-question"));
        var saved = loadState(data);
        answers.push({
          id: data.id,
          // Choice questions save an array of picked texts in
          // `saved.selected`; an image-paste reflection saves the screenshot
          // as a PNG data-URL string in `saved.image`; everything else saves
          // a string in `saved.value`. For an image-paste answer the data
          // URL *is* the answer we record.
          answer: saved ? (saved.selected || saved.image || saved.value || null) : null
        });
      });

    return {
      page: window.location.href,
      info: info,
      answers: answers,
      metadata: captureMetadata(),
      time: encodeDownloadTime()
    };
  }

  function triggerDownload(filename, dataObj) {
    var json = JSON.stringify(dataObj, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = el("a", { href: url, download: filename });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function buildDownloadButton(node, data) {
    var button = el("button", { type: "button", class: "learnr2-download-answers-btn", text: data.label });
    var error = el("div", { class: "learnr2-download-error d-none" });

    button.addEventListener("click", async function () {
      var problems = infoFieldProblems();
      if (problems.length > 0) {
        error.textContent = "Before downloading, please " + problems.join(", and ") + ".";
        error.classList.remove("d-none");
        return;
      }
      error.classList.add("d-none");

      var unanswered = unansweredQuestionLabels();
      if (unanswered.length > 0) {
        var confirmed = await showConfirmDialog(
          "You haven't submitted an answer for " + unanswered.length +
          " question" + (unanswered.length === 1 ? "" : "s") + ": " +
          unanswered.join("; ") + ". Download anyway?",
          "Download Anyway"
        );
        if (!confirmed) {
          return;
        }
      }

      var payload = await collectAnswers();
      var stamp = new Date().toISOString().replace(/[:.]/g, "-");
      triggerDownload(data.filenamePrefix + "-" + stamp + ".json", payload);
    });

    node.appendChild(button);
    node.appendChild(error);
  }

  function renderDownloadButton(node) {
    var encoded = node.getAttribute("data-learnr2-download");
    if (!encoded) {
      return;
    }
    var data = decodeBase64Json(encoded);
    node.textContent = "";
    node.classList.add("learnr2-download-rendered");
    buildDownloadButton(node, data);
    node.setAttribute("data-learnr2-initialized", "true");
  }

  function renderQuestion(node) {
    var encoded = node.getAttribute("data-learnr2-question");
    if (!encoded) {
      return;
    }
    var data = decodeBase64Json(encoded);

    node.textContent = "";
    node.classList.add("learnr2-question-rendered");
    // show_text = FALSE: the prompt is written on the page itself, so keep it
    // out of the box visually, but leave it in the DOM for screen readers.
    var textClass =
      data.showText === false ? "learnr2-question-text learnr2-visually-hidden" : "learnr2-question-text";
    node.appendChild(el("div", { class: textClass, text: data.text }));

    if (data.type === "text") {
      buildTextQuestion(node, data);
    } else if (data.type === "reflection" || data.type === "reflection_editable") {
      buildReflectionQuestion(node, data);
    } else {
      buildChoiceQuestion(node, data);
    }

    node.setAttribute("data-learnr2-initialized", "true");
  }

  // ---- Start Over (entire tutorial) ------------------------------------
  // Clears every bit of progress this page has saved -- both learnr2's own
  // question()/student_info() state (the "learnr2-" prefix from
  // storageKey(), above) and quarto-live's own {webr} exercise persistence
  // (the "editor-" prefix noted there too) -- then reloads so every widget
  // on the page re-initializes from a clean slate. Deliberately leaves the
  // "learnr2-device-id" key alone: that identifies this browser/device
  // across every tutorial and visit, not this one tutorial's progress.
  function clearAllProgress() {
    var prefixes = ["learnr2-" + pageUrl + "#", "editor-" + pageUrl + "#"];
    var keysToRemove = [];
    for (var i = 0; i < window.localStorage.length; i++) {
      var key = window.localStorage.key(i);
      if (key && prefixes.some(function (prefix) { return key.indexOf(prefix) === 0; })) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(function (key) {
      window.localStorage.removeItem(key);
    });
  }

  // A confirm() substitute built from plain DOM/CSS (the <dialog> element,
  // not a browser-chrome-level dialog) rather than window.confirm().
  // window.confirm() is a native, out-of-process browser dialog -- several
  // real surfaces a rendered tutorial ends up viewed in (VS Code's built-in
  // Simple Browser webview in particular, see item 0's notes on how
  // run_tutorial() ends up opening there) don't support it at all and
  // silently resolve it to `false` with no dialog ever appearing, which
  // made Start Over look completely inert: the click registered, nothing
  // asked for confirmation, and clearAllProgress() was simply never
  // reached. A <dialog> is ordinary page content, so it renders the same
  // everywhere a tutorial itself renders.
  function showConfirmDialog(message, confirmLabel) {
    return new Promise(function (resolve) {
      var settled = false;
      function settle(result) {
        if (settled) {
          return;
        }
        settled = true;
        dialog.close();
        dialog.remove();
        resolve(result);
      }
      var cancelButton = el("button", { type: "button", class: "learnr2-confirm-dialog-cancel", text: "Cancel" });
      var confirmButton = el("button", { type: "button", class: "learnr2-confirm-dialog-confirm", text: confirmLabel });
      cancelButton.addEventListener("click", function () { settle(false); });
      confirmButton.addEventListener("click", function () { settle(true); });
      var dialog = el("dialog", { class: "learnr2-confirm-dialog" }, [
        el("p", { class: "learnr2-confirm-dialog-message", text: message }),
        el("div", { class: "learnr2-confirm-dialog-actions" }, [cancelButton, confirmButton])
      ]);
      // Esc, or any other way the dialog closes itself, is a dismissal.
      dialog.addEventListener("cancel", function () { settle(false); });
      dialog.addEventListener("close", function () { settle(false); });
      document.body.appendChild(dialog);
      dialog.showModal();
      confirmButton.focus();
    });
  }

  // Where the Start Over button lives: the bottom of Quarto's own TOC
  // sidebar when the page has one that is actually showing, otherwise the
  // top of the tutorial, directly after the title block -- before the first
  // section, so the progressive reveal below never hides it. "Actually
  // showing" matters, not just "exists": a tutorial rendered with
  // `toc: false` has no #quarto-margin-sidebar at all, but one rendered
  // with `toc: true` still has the element on a phone-width screen, where
  // Quarto's own stylesheet sets it to display: none (bootstrap's
  // `@media (max-width: 767.98px) { #quarto-margin-sidebar { display: none } }`,
  // confirmed in a real render). A button appended into a hidden sidebar
  // is as good as missing, which is exactly how the first version of this
  // behaved on mobile. getClientRects() is empty for anything display: none,
  // itself or via an ancestor, which is the check wanted here.
  function sidebarShowing() {
    var sidebar = document.getElementById("quarto-margin-sidebar");
    return sidebar && sidebar.getClientRects().length > 0 ? sidebar : null;
  }

  function placeStartOverButton(container) {
    var sidebar = sidebarShowing();
    if (sidebar) {
      container.classList.remove("learnr2-start-over-top");
      sidebar.appendChild(container);
      return;
    }
    container.classList.add("learnr2-start-over-top");
    var header = document.getElementById("title-block-header");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(container, header.nextSibling);
      return;
    }
    var main = document.getElementById("quarto-document-content") || document.body;
    main.insertBefore(container, main.firstChild);
  }

  function injectStartOverButton() {
    if (document.querySelector(".learnr2-start-over")) {
      return;
    }
    var button = el("button", { type: "button", class: "learnr2-start-over", text: "Start Over" });
    button.addEventListener("click", function () {
      showConfirmDialog(
        "Start over this entire tutorial? Every saved answer, pasted " +
        "image, and exercise on this device will be permanently cleared. " +
        "This cannot be undone.",
        "Start Over"
      ).then(function (confirmed) {
        if (!confirmed) {
          return;
        }
        clearAllProgress();
        window.location.reload();
      });
    });
    var container = el("div", { class: "learnr2-start-over-container" }, [button]);
    placeStartOverButton(container);
    // The sidebar can appear or disappear after load (a window resized
    // across Quarto's breakpoint, a phone rotated), so follow it. Moving
    // the same node keeps its click handler; nothing is rebuilt.
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () { placeStartOverButton(container); }, 100);
    });
  }

  // ---- Tutorial-wide options --------------------------------------------
  // learnr2::tutorial_options() renders a hidden <div class="learnr2-options">
  // carrying base64 JSON, the same way question()/student_info() carry
  // their payloads. Every option has a default here, so a page with no
  // such element behaves as documented in tutorial_options()'s help.
  var OPTION_DEFAULTS = { allowSkip: false, requireSubmission: true };

  function readTutorialOptions() {
    var options = Object.assign({}, OPTION_DEFAULTS);
    document.querySelectorAll(".learnr2-options[data-learnr2-options]").forEach(function (node) {
      try {
        Object.assign(options, decodeBase64Json(node.getAttribute("data-learnr2-options")));
      } catch (e) {
        // A malformed payload leaves the defaults in place.
      }
    });
    return options;
  }

  // ---- Progressive section reveal ("Continue" buttons) ------------------
  // Every level-2 (##) and level-3 (###) heading in the tutorial becomes its
  // own gated section: hidden until the reader clicks a "Continue" button at
  // the end of the section before it. Quarto's HTML output wraps each
  // heading and everything under it in its own
  // <section id="..." class="level2"|"level3">, nested for subsections (a
  // "### Exercise 1" section renders *inside* its enclosing "## Running R
  // Code" section) -- so a still-locked nested section stays hidden even
  // once its parent section is revealed, and revealing a parent never forces
  // open a child that hasn't been unlocked on its own: `.d-none` on one
  // element has no effect on how its ancestors render, only its own
  // descendants.
  //
  // Verified against a real rendered hello-learnr2.html (not just the JS
  // test fixtures) -- see AGENTS.md for both this confirmation and a real
  // regression it caught (Hints/Solutions wrongly getting their own gate).
  var PROGRESS_ID = "progressive-sections";

  function sectionHeading(section) {
    return section.querySelector("h2, h3");
  }

  // The heading's visible text, or "" for a bare `###` divider (see
  // markPauseSections() below).
  function sectionTitle(section) {
    var heading = sectionHeading(section);
    return heading ? heading.textContent.trim() : "";
  }

  // A bare `###` line -- tutorial.helpers' pacing break, used twice inside
  // every exercise (one before "our answer", one before the knowledge drop)
  // -- renders as a <section class="level3"> whose <h3> has no text; Quarto
  // still gives it an id ("section", "section-1", ...) and a TOC entry,
  // which Quarto's own stylesheet hides (`nav[role=doc-toc] a:empty`).
  // Gating it works unchanged; what needs fixing is cosmetic: the empty
  // heading still takes up margin (and anchor.js would hang an anchor on
  // it), and the Continue button would read "Continue: ". Mark such
  // sections so CSS can hide the heading and the label can be plain
  // "Continue". Verified against a real render (AGENTS.md, "bare ###
  // dividers").
  function markPauseSections(sections) {
    sections.forEach(function (section) {
      if (sectionTitle(section) === "") {
        section.classList.add("learnr2-pause");
      }
    });
  }

  // Where the "Continue to <next>" button for `section` belongs: as its own
  // last child, unless `next` sits *inside* `section` (the nested-subsection
  // case above), in which case the button goes right before whichever of
  // `next`'s ancestors is `section`'s own direct child -- so it lands after
  // `section`'s own intro content but before its first subsection, not after
  // every subsection that follows.
  function continueButtonAnchor(section, next) {
    if (!section.contains(next)) {
      return null;
    }
    var node = next;
    while (node.parentElement !== section) {
      node = node.parentElement;
    }
    return node;
  }

  function initProgressiveSections() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("section.level2, section.level3")
    ).filter(function (section) {
      // A "### Hints"/"### Solutions" section (quarto-live's own rendering
      // of a `.hint`/`.solution` fenced div tied to an exercise -- see
      // AGENTS.md's translation guide) exists purely as a supplementary,
      // reader-toggled aside for the exercise right before it, not a step
      // to progress through in its own right -- confirmed by an actual
      // hello-learnr2 render, where each one wraps a div already hidden by
      // quarto-live itself pending its own separate "show hint"/"show
      // solution" reveal (`class="... exercise-hint d-none"` /
      // `"... exercise-solution d-none"`). Leaving one out of the gated
      // list here means it simply inherits its enclosing section's
      // visibility once that's unlocked, instead of demanding its own
      // extra Continue click first -- verified against that same render:
      // without this filter, reaching "5. Automatic grading" from "2.
      // Non-editable cells" took two extra, easy-to-miss intermediate
      // clicks through bare "Hints"/"Solutions" stops with no number of
      // their own, which is what read as the numbering "jumping". Checked
      // only for level3 sections themselves -- an *enclosing* level2
      // section (e.g. "3. Exercises") also matches `querySelector` here
      // simply because a Hints/Solutions section is nested somewhere
      // inside it, which would wrongly exclude the enclosing section too.
      if (section.classList.contains("level3") &&
          section.querySelector(".exercise-hint, .exercise-solution")) {
        return false;
      }
      // A subsection that comes directly after its parent's heading, with
      // no content of its own in between, is revealed together with that
      // heading rather than behind a Continue of its own. tutorial.helpers
      // starts every topic as "## Title" then a bare "###"; gating that
      // first "###" put a Continue button directly under the heading with
      // nothing above it to read (reported on the Orientation translation,
      // 2026-10). learnr shows a topic's heading and first block together,
      // and so do we: every Continue now sits at the end of real content.
      var parent = section.parentElement;
      var heading = parent && parent.tagName === "SECTION" ? sectionHeading(parent) : null;
      if (heading && section.previousElementSibling === heading) {
        return false;
      }
      return true;
    });
    // Nothing to gate: a one-section tutorial (or one with no headings at
    // all) already shows everything there is to show.
    // Mark *every* headingless section, not just the gated ones: a bare
    // "###" right after its parent's heading isn't gated (it's revealed
    // with that heading), but its empty <h3> must still be hidden. Marking
    // only the gated list left that heading rendered as a blank band
    // between a topic's title and its first paragraph (Orientation, 2026-10).
    markPauseSections(Array.prototype.slice.call(
      document.querySelectorAll("section.level2, section.level3")
    ));
    if (sections.length < 2) {
      return;
    }

    var saved = loadState({ id: PROGRESS_ID });
    // Clamp -- a tutorial edited to have fewer sections since this was saved
    // shouldn't leave every remaining section permanently hidden.
    var unlocked = Math.min(Math.max(typeof saved === "number" ? saved : 1, 1), sections.length);

    var options = readTutorialOptions();
    var toc = document.getElementById("quarto-margin-sidebar");

    // The gated section a TOC link points at: the deepest one that is, or
    // contains, the link's target. Scan from the end, not the start: a
    // nested section's ancestor (e.g. "Running R Code" containing
    // "Exercise 2") also satisfies `.contains(target)`, but at a lower,
    // too-shallow index -- the last (most specific) match is the real one.
    // -1 for a link that points outside every gated section.
    function sectionIndexForLink(link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#" || href.length < 2) {
        return -1;
      }
      var target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) {
        return -1;
      }
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === target || sections[i].contains(target)) {
          return i;
        }
      }
      return -1;
    }

    // Without allow_skip, a TOC entry for a section the reader hasn't
    // reached is dimmed and inert (styled via .learnr2-toc-locked, taken out
    // of the tab order, flagged for assistive tech), and turns back into an
    // ordinary link the moment its section unlocks. Re-run on every
    // visibility change so the sidebar always mirrors the page.
    function applyTocLocks() {
      if (!toc || options.allowSkip) {
        return;
      }
      toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
        var index = sectionIndexForLink(link);
        var locked = index !== -1 && index >= unlocked;
        link.classList.toggle("learnr2-toc-locked", locked);
        if (locked) {
          link.setAttribute("aria-disabled", "true");
          link.setAttribute("tabindex", "-1");
        } else {
          link.removeAttribute("aria-disabled");
          link.removeAttribute("tabindex");
        }
      });
    }

    function applyVisibility() {
      sections.forEach(function (section, i) {
        section.classList.toggle("d-none", i >= unlocked);
      });
      applyTocLocks();
    }

    function clearContinueButtons() {
      document.querySelectorAll(".learnr2-continue-container").forEach(function (node) {
        node.parentNode.removeChild(node);
      });
    }

    // The widgets a Continue button waits on, with require_submission (the
    // default): every question() and student_info() inside `section` that
    // sits *before* `container` in document order -- i.e. above the button.
    // Anything below it belongs to a later stop and gets its own gate. A
    // widget counts as submitted when it has saved state (saveState() only
    // runs from a submit handler; student_info() autosaves as the reader
    // types, so for it the saved `submitted` flag is what matters).
    function pendingWidgets(section, container) {
      if (!options.requireSubmission) {
        return [];
      }
      var nodes = section.querySelectorAll(
        ".learnr2-question[data-learnr2-question], .learnr2-info[data-learnr2-info]"
      );
      return Array.prototype.filter.call(nodes, function (node) {
        if (!(container.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING)) {
          return false;
        }
        return widgetPending(node);
      });
    }

    // Disable or enable the current Continue button according to what is
    // still unsubmitted above it. Re-run after every submit click.
    var gate = null;
    function refreshContinueGate() {
      if (!gate || !gate.container.parentNode) {
        return;
      }
      var pending = pendingWidgets(gate.section, gate.container);
      var locked = pending.length > 0;
      gate.button.disabled = locked;
      gate.container.classList.toggle("learnr2-continue-locked", locked);
      gate.note.textContent = locked
        ? (pending.length === 1
            ? "Submit your answer above to continue."
            : "Submit the " + pending.length + " answers above to continue.")
        : "";
      gate.note.classList.toggle("d-none", !locked);
    }

    function placeContinueButton() {
      clearContinueButtons();
      if (unlocked >= sections.length) {
        return;
      }
      var current = sections[unlocked - 1];
      var next = sections[unlocked];
      var title = sectionTitle(next);
      var button = el("button", {
        type: "button",
        class: "learnr2-continue",
        text: title ? "Continue: " + title : "Continue"
      });
      button.addEventListener("click", function () {
        if (button.disabled) {
          return;
        }
        unlockThrough(unlocked, true);
      });
      var note = el("div", { class: "learnr2-continue-note d-none" });
      var container = el("div", { class: "learnr2-continue-container" }, [button, note]);

      var anchor = continueButtonAnchor(current, next);
      if (anchor) {
        current.insertBefore(container, anchor);
      } else {
        current.appendChild(container);
      }
      gate = { section: current, container: container, button: button, note: note };
      refreshContinueGate();
    }

    // `index` is the 0-based section to reveal. `scroll` is true only for an
    // explicit Continue click -- a TOC link's own default action already
    // scrolls to its target once that target stops being display:none, so a
    // second, JS-driven scroll there would just fight the native one.
    function unlockThrough(index, scroll) {
      if (index + 1 <= unlocked) {
        return;
      }
      unlocked = index + 1;
      saveState({ id: PROGRESS_ID }, unlocked);
      applyVisibility();
      placeContinueButton();
      if (scroll) {
        var heading = sectionHeading(sections[index]);
        if (heading) {
          heading.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    applyVisibility();
    placeContinueButton();

    // Every widget's Submit (and Try Again / Edit) is a .learnr2-submit or
    // .learnr2-try-again button; its own click handler saves or clears
    // state synchronously, and this document-level listener runs after it,
    // so a zero-delay timeout is enough to observe the new state.
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.closest && target.closest(".learnr2-submit, .learnr2-try-again, .learnr2-info-submit")) {
        window.setTimeout(refreshContinueGate, 0);
      }
    });

    // Quarto's own TOC sidebar links jump straight to a heading's id via a
    // plain <a href="#id">, bypassing Continue entirely. What happens next
    // is the author's call, via learnr2::tutorial_options(allow_skip = ...):
    //
    // * allow_skip = TRUE: honour the click as a deliberate skip-ahead and
    //   unlock every section through the target (classic learnr's
    //   `allow_skip: yes`), rather than leaving the reader looking at a hash
    //   change with nothing visible to show for it.
    // * allow_skip = FALSE (the default): a link to a still-locked section
    //   is inert -- its default hash jump is cancelled too, so the URL
    //   doesn't change and nothing scrolls. applyTocLocks() has already
    //   dimmed it and removed it from the tab order; the preventDefault here
    //   is for a click that gets through anyway (keyboard activation of a
    //   focused link, a stale pointer). Links to unlocked sections behave as
    //   ordinary navigation.
    if (toc) {
      toc.addEventListener("click", function (event) {
        var link = event.target;
        while (link && link !== toc && link.tagName !== "A") {
          link = link.parentElement;
        }
        if (!link || link.tagName !== "A") {
          return;
        }
        var index = sectionIndexForLink(link);
        if (index === -1) {
          return;
        }
        if (options.allowSkip) {
          unlockThrough(index, false);
        } else if (index >= unlocked) {
          event.preventDefault();
        }
      });
    }
  }

  // Every link that leaves the page opens in a new tab, so following one
  // never makes the tutorial "disappear" -- which worried students, and
  // whose answers live in this page's localStorage. In-page links (the
  // table of contents, footnotes: href starting "#"), download links, and
  // mailto:/javascript: links are left alone. Quarto's own
  // link-external-newwindow option would only catch other sites; a link to
  // another page on the same site (the tutorial index on GitHub Pages)
  // would still replace this one.
  function openLinksInNewTabs() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href === "" || href.charAt(0) === "#" || link.hasAttribute("download") ||
          /^(mailto|javascript|tel):/i.test(href)) {
        return;
      }
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function init() {
    document
      .querySelectorAll(".learnr2-question:not([data-learnr2-initialized])")
      .forEach(renderQuestion);
    document
      .querySelectorAll(".learnr2-info:not([data-learnr2-initialized])")
      .forEach(renderInfo);
    document
      .querySelectorAll(".learnr2-download-answers:not([data-learnr2-initialized])")
      .forEach(renderDownloadButton);
    injectStartOverButton();
    initProgressiveSections();
    openLinksInNewTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
