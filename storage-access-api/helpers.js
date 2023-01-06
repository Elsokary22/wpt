'use strict';

function processQueryParams() {
  const queryParams = new URL(window.location).searchParams;
  return {
    expectAccessAllowed: queryParams.get("allowed") != "false",
    topLevelDocument: queryParams.get("rootdocument") != "false",
    testPrefix: queryParams.get("testCase") || "top-level-context",
  };
}

function CreateFrameHelper(setUpFrame, fetchTests) {
  const frame = document.createElement('iframe');
  const promise = new Promise((resolve, reject) => {
    frame.onload = () => resolve(frame);
    frame.onerror = reject;
  });

  setUpFrame(frame);

  if (fetchTests) {
    fetch_tests_from_window(frame.contentWindow);
  }
  return promise;
}

function CreateFrame(sourceURL, fetchTests = false) {
  return CreateFrameHelper((frame) => {
    frame.src = sourceURL;
    document.body.appendChild(frame);
  }, fetchTests);
}

function RunTestsInIFrame(sourceURL) {
  return CreateFrame(sourceURL, true);
}

function RunTestsInNestedIFrame(sourceURL) {
  return CreateFrameHelper((frame) => {
    document.body.appendChild(frame);
    frame.contentDocument.write(`
      <script src="/resources/testharness.js"></script>
      <script src="helpers.js"></script>
      <body>
      <script>
        RunTestsInIFrame("${sourceURL}");
      </script>
    `);
    frame.contentDocument.close();
  }, true);
}

function RunRequestStorageAccessInDetachedFrame() {
  const frame = document.createElement('iframe');
  document.body.append(frame);
  const inner_doc = frame.contentDocument;
  frame.remove();
  return inner_doc.requestStorageAccess();
}

function RunRequestStorageAccessViaDomParser() {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<html></html>', 'text/html');
  return doc.requestStorageAccess();
}

function RunCallbackWithGesture(callback) {
  return test_driver.bless('run callback with user gesture', callback);
}

// Sends a message to the given target window, and waits for the provided
// promise to resolve.
function PostMessageAndAwait(message, targetWindow, promise) {
  targetWindow.postMessage(message, "*");
  return promise;
}

// Returns a promise that resolves when the next "reply" is received via
// postMessage.
function ReplyPromise() {
  return new Promise((resolve) => {
    window.addEventListener("message", (event) => {
      console.log("received response", JSON.stringify(event.data));
      resolve(event.data);
    }, { once: true });
  });
}

// Returns a promise that resolves when the given frame fires its load event.
function ReloadPromise(frame) {
  return new Promise((resolve) => {
    frame.addEventListener("load", (event) => {
      resolve();
    }, { once: true });
  });
}

function GetCookiesFromFrame(frame) {
  return PostMessageAndAwait({ command: "document.cookie" }, frame.contentWindow, ReplyPromise());
}

function FrameHasStorageAccess(frame) {
  return PostMessageAndAwait({ command: "hasStorageAccess" }, frame.contentWindow, ReplyPromise());
}

function RequestStorageAccessInFrame(frame) {
  return PostMessageAndAwait({ command: "requestStorageAccess" }, frame.contentWindow, ReplyPromise());
}

function SetPermissionInFrame(frame, args = []) {
  return PostMessageAndAwait({ command: "set_permission", args }, frame.contentWindow, ReplyPromise());
}

function FrameInitiatedReload(frame) {
  return PostMessageAndAwait({ command: "reload" }, frame.contentWindow, ReloadPromise(frame));
}
