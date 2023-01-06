// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
"use strict";

test_driver.set_test_context(window.top);

console.log("added child listener");
window.addEventListener("message", async (event) => {
  function reply(data) {
    event.source.postMessage(data, event.origin);
  }

  console.log(JSON.stringify(event.data));
  switch (event.data["command"]) {
    case "hasStorageAccess": {
      const hasStorageAccess = await document.hasStorageAccess();
      reply(hasStorageAccess);
    }
      break;
    case "requestStorageAccess": {
      const obtainedAccess = await document.requestStorageAccess()
        .then(() => true, () => false);
      reply(obtainedAccess);
    }
      break;
    case "document.cookie":
      console.log(`replying with cookie '${document.cookie}'`);
      reply(document.cookie);
      break;
    case "set_permission":
      test_driver.set_permission(...event.data.args);
      reply(undefined);
      break;
    case "reload":
      console.log("reloading child");
      window.location.reload();
      break;
    default:
  }
});