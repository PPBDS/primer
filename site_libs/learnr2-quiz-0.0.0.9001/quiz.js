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

  function saveState(data, state) {
    try {
      window.localStorage.setItem(storageKey(data), JSON.stringify(state));
    } catch (e) {
      // localStorage unavailable (e.g. private browsing) -- degrade silently.
    }
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

  // Re-encodes any browser-decodable raster image `file` as a PNG data URL,
  // via an off-DOM <img>/<canvas> round-trip -- so what's stored is always
  // PNG, regardless of which raster type the clipboard actually handed us.
  // (Also, incidentally, strips whatever metadata the original carried,
  // e.g. EXIF orientation/GPS from a photo -- not something readers should
  // need to think about for a plot screenshot.)
  function convertToPngDataUrl(file, onSuccess, onError) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          onSuccess(canvas.toDataURL("image/png"));
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
  function buildImagePasteArea() {
    var MAX_BYTES = 2 * 1024 * 1024;
    var wrapper = el("div", { class: "learnr2-image-paste", tabindex: "0" });
    var placeholder = el("div", {
      class: "learnr2-image-paste-placeholder",
      text: "Paste a screenshot with Ctrl+V (or Cmd+V) into the text box " +
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
    }

    function clearImage() {
      dataUrl = null;
      preview.src = "";
      preview.classList.add("d-none");
      placeholder.classList.remove("d-none");
      remove.classList.add("d-none");
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
    // ourselves in convertToPngDataUrl() below -- so what's actually
    // stored and submitted is always PNG regardless of what the reader's
    // platform put on the clipboard. Deliberately excludes image/svg+xml
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
        setError("That image is too large (max 2MB). Try a smaller screenshot or crop it first.");
        return;
      }

      convertToPngDataUrl(
        file,
        function (pngDataUrl) {
          setImage(pngDataUrl);
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
    var imagePaste = data.allowImage ? buildImagePasteArea() : null;
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

    function applyOutcome(disable) {
      showModelAnswer();
      if (disable) {
        textarea.disabled = true;
        submit.classList.add("d-none");
        if (imagePaste) {
          imagePaste.setDisabled(true);
        }
      } else {
        // Once a reflection_editable question has been submitted at least
        // once, further clicks revise the already-visible answer rather
        // than submit for the first time -- relabel the button to match.
        submit.textContent = data.editLabel;
      }
    }

    submit.addEventListener("click", function () {
      if (!passesValidation(textarea.value, data.validate)) {
        feedback.className = "learnr2-feedback learnr2-feedback-incorrect";
        feedback.textContent = VALIDATION_MESSAGES[data.validate];
        return;
      }
      feedback.className = "learnr2-feedback d-none";
      applyOutcome(!editable);
      saveState(data, {
        value: textarea.value,
        image: imagePaste ? imagePaste.getDataUrl() : null,
        submitted: true
      });
    });

    container.appendChild(el("div", { class: "learnr2-answers" }, [textarea]));
    if (imagePaste) {
      container.appendChild(imagePaste.element);
    }
    container.appendChild(el("div", { class: "learnr2-controls" }, [submit]));
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
        applyOutcome(!editable);
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
  function buildInfoForm(container, data) {
    var inputs = {};
    var validators = [];
    var saved = loadState(data) || {};
    // Mirrors question()'s reflection_editable handling exactly: starts as
    // "Submit", switches to "Edit" the moment the reader successfully
    // confirms a fully valid entry, and stays that way (including across a
    // reload) since any further click is revising an already-confirmed
    // entry, not submitting for the first time.
    var hasSubmitted = !!saved.submitted;

    function save() {
      var values = {};
      Object.keys(inputs).forEach(function (key) {
        values[key] = inputs[key].value;
      });
      values.submitted = hasSubmitted;
      saveState(data, values);
    }
    var debouncedSave = debounce(save, 400);

    data.fields.forEach(function (field) {
      var inputId = data.id + "-" + field.key;
      var input = el("input", { type: "text", id: inputId, class: "learnr2-info-input" });
      if (typeof saved[field.key] === "string") {
        input.value = saved[field.key];
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
        debouncedSave();
        if (input.value.trim()) {
          error.classList.add("d-none");
        }
      });
      input.addEventListener("blur", function () {
        save();
        validate();
      });
      inputs[field.key] = input;

      var labelText = field.required ? field.label + " *" : field.label;
      var label = el("label", { class: "learnr2-info-label", for: inputId, text: labelText });
      container.appendChild(el("div", { class: "learnr2-info-row" }, [label, input, error]));
    });

    var feedback = el("div", { class: "learnr2-feedback d-none" });
    var submit = el(
      "button",
      { type: "button", class: "learnr2-submit", text: hasSubmitted ? data.editLabel : data.submitLabel }
    );

    submit.addEventListener("click", function () {
      var allValid = validators.map(function (validate) { return validate(); })
        .every(Boolean);
      if (allValid) {
        hasSubmitted = true;
        submit.textContent = data.editLabel;
      }
      save();
      feedback.className = "learnr2-feedback " +
        (allValid ? "learnr2-feedback-correct" : "learnr2-feedback-incorrect");
      feedback.textContent = allValid ?
        "Looks good." :
        "Please fix the highlighted field(s) above.";
    });

    container.appendChild(el("div", { class: "learnr2-controls" }, [submit]));
    container.appendChild(feedback);
  }

  // Reads the *live* DOM value (not the possibly-stale debounced-save
  // localStorage copy) for one info field.
  function infoFieldValue(infoId, fieldKey) {
    var input = document.getElementById(infoId + "-" + fieldKey);
    return input ? input.value : "";
  }

  // Every info field, across every .learnr2-info on the page, that is
  // either a required field left empty or an "email" field with no "@".
  // Used to block downloading incomplete/invalid submissions.
  function infoFieldProblems() {
    var problems = [];
    document.querySelectorAll(".learnr2-info[data-learnr2-info]").forEach(function (node) {
      var data = decodeBase64Json(node.getAttribute("data-learnr2-info"));
      data.fields.forEach(function (field) {
        var value = infoFieldValue(data.id, field.key).trim();
        if (field.required && !value) {
          problems.push(field.label);
        } else if (field.key === "email" && value && !isValidEmail(value)) {
          problems.push(field.label + " (needs an \"@\")");
        }
      });
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
      var data = decodeBase64Json(node.getAttribute("data-learnr2-question"));
      if (!loadState(data)) {
        labels.push(data.text);
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
    // Live DOM values, not localStorage: a field's debounced auto-save may
    // not have fired yet if the reader is still focused in it when they
    // click "Download".
    var info = {};
    document.querySelectorAll(".learnr2-info[data-learnr2-info]").forEach(function (node) {
      var data = decodeBase64Json(node.getAttribute("data-learnr2-info"));
      data.fields.forEach(function (field) {
        var value = infoFieldValue(data.id, field.key);
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
        error.textContent = "Please fix: " + problems.join(", ");
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
    node.appendChild(el("div", { class: "learnr2-question-text", text: data.text }));

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

  // Appended to the bottom of Quarto's own TOC sidebar, if the page has
  // one (a tutorial rendered with `toc: false` has nowhere to put it, and
  // is left without a Start Over control).
  function injectStartOverButton() {
    var sidebar = document.getElementById("quarto-margin-sidebar");
    if (!sidebar || sidebar.querySelector(".learnr2-start-over")) {
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
    sidebar.appendChild(el("div", { class: "learnr2-start-over-container" }, [button]));
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
      return !(section.classList.contains("level3") &&
        section.querySelector(".exercise-hint, .exercise-solution"));
    });
    // Nothing to gate: a one-section tutorial (or one with `toc: false` and
    // no headings at all) already shows everything there is to show.
    if (sections.length < 2) {
      return;
    }

    var saved = loadState({ id: PROGRESS_ID });
    // Clamp -- a tutorial edited to have fewer sections since this was saved
    // shouldn't leave every remaining section permanently hidden.
    var unlocked = Math.min(Math.max(typeof saved === "number" ? saved : 1, 1), sections.length);

    function applyVisibility() {
      sections.forEach(function (section, i) {
        section.classList.toggle("d-none", i >= unlocked);
      });
    }

    function clearContinueButtons() {
      document.querySelectorAll(".learnr2-continue-container").forEach(function (node) {
        node.parentNode.removeChild(node);
      });
    }

    function placeContinueButton() {
      clearContinueButtons();
      if (unlocked >= sections.length) {
        return;
      }
      var current = sections[unlocked - 1];
      var next = sections[unlocked];
      var heading = sectionHeading(next);
      var button = el("button", {
        type: "button",
        class: "learnr2-continue",
        text: heading ? "Continue: " + heading.textContent.trim() : "Continue"
      });
      button.addEventListener("click", function () {
        unlockThrough(unlocked, true);
      });
      var container = el("div", { class: "learnr2-continue-container" }, [button]);

      var anchor = continueButtonAnchor(current, next);
      if (anchor) {
        current.insertBefore(container, anchor);
      } else {
        current.appendChild(container);
      }
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

    // Quarto's own TOC sidebar links jump straight to a heading's id via a
    // plain <a href="#id">, bypassing Continue entirely -- honor that as a
    // deliberate skip-ahead (a translated tutorial's learnr frontmatter
    // always set allow_skip: yes, see AGENTS.md) rather than leaving the
    // reader looking at a hash change with nothing visible to show for it.
    var toc = document.getElementById("quarto-margin-sidebar");
    if (toc) {
      toc.addEventListener("click", function (event) {
        var link = event.target;
        while (link && link !== toc && link.tagName !== "A") {
          link = link.parentElement;
        }
        if (!link || link.tagName !== "A") {
          return;
        }
        var href = link.getAttribute("href") || "";
        if (href.charAt(0) !== "#" || href.length < 2) {
          return;
        }
        var target = document.getElementById(href.slice(1));
        if (!target) {
          return;
        }
        // Scan from the end, not the start: a nested section's ancestor
        // (e.g. "Running R Code" containing "Exercise 2") also satisfies
        // `.contains(target)`, but at a lower, too-shallow index -- the
        // last (deepest/most specific) match is the actual target section.
        for (var i = sections.length - 1; i >= 0; i--) {
          if (sections[i] === target || sections[i].contains(target)) {
            unlockThrough(i, false);
            break;
          }
        }
      });
    }
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
