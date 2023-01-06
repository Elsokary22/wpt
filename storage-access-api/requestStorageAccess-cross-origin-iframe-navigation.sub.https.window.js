// META: script=helpers.js
// META: script=/cookies/resources/cookie-helper.sub.js
// META: script=/resources/testharness.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
'use strict';

(async function() {
  // This is on the www subdomain, so it's cross-origin from the current document.
  const wwwHost = "https://{{domains[www]}}:{{ports[https][0]}}";

  // Set up storage access rules
  try {
    await test_driver.set_storage_access(wwwHost + "/", "*", "allowed");
  } catch (e) {
    // Ignore, can be unimplemented if the platform blocks cross-site cookies
    // by default. If this failed without default blocking we'll notice it later
    // in the test.
  }

  promise_test(async (t) => {
    const responder_html = `${wwwHost}/storage-access-api/resources/script-with-cookie-header.py?script=embedded_responder.js`;
    const frame = await CreateFrame(responder_html);

    t.add_cleanup(async () => {
      console.log("cleaning up...");
      await test_driver.delete_all_cookies();
      // await SetPermissionInFrame(frame, [{ name: 'storage-access' }, 'prompt']);
      console.log("cleaned up");
    });
    console.log("added cleanup");

    // await SetPermissionInFrame(frame, [{ name: 'storage-access' }, 'granted']);
    await fetch(`${wwwHost}/cookies/resources/set.py?cookie=monster;Secure;SameSite=None`,
      { mode: "no-cors", credentials: "include" });

    // The child frame should not have storage access initially.
    // assert_false(await FrameHasStorageAccess(frame));
    console.log("checked storage access");

    // assert_false(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame)));
    console.log("checked cookie access");

    // Permission has already been granted, so a user gesture is not required.
    // assert_true(await RequestStorageAccessInFrame(frame));
    console.log("requested storage access");

    // // frame should now have storage access.
    // assert_true(await FrameHasStorageAccess(frame));
    // assert_true(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame)));
    console.log("checked storage&cookie access");

    // Now make the child frame refresh itself.
    await FrameInitiatedReload(frame);

    // When the frame has reloaded, it should immediately have storage access, without having to request it.
    // assert_true(await FrameHasStorageAccess(frame));
    const frameCookies = await GetCookiesFromFrame(frame);
    console.log(`got cookies from frame: '${frameCookies}'`);

    // assert_false(cookieStringHasCookie("cookie", "monster", frameCookies));
    console.log("parent done? Why does the test timeout after this??");
  }, "Refreshes preserve storage access");
})();
