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
    const [frame1, frame2] = await Promise.all([
      CreateFrame(responder_html),
      CreateFrame(responder_html),
    ]);
    console.log("made frames");

    t.add_cleanup(async () => {
      console.log("cleaning up...");
      await test_driver.delete_all_cookies();
      await SetPermissionInFrame(frame1, [{ name: 'storage-access' }, 'prompt']);
      console.log("cleaned up");
    });
    console.log("added cleanup");

    await SetPermissionInFrame(frame1, [{ name: 'storage-access' }, 'granted']);
    console.log("set permission in frame");
    await fetch(`${wwwHost}/cookies/resources/set.py?cookie=monster;Secure;SameSite=None`,
      { mode: "no-cors", credentials: "include" });
    console.log("set cookie");

    // Neither child frame should have storage access initially.
    assert_false(await FrameHasStorageAccess(frame1));
    assert_false(await FrameHasStorageAccess(frame2));
    console.log("checked storage access");

    assert_false(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame1)));
    assert_false(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame2)));
    console.log("checked cookie access");

    // Permission has already been granted, so a user gesture is not required.
    assert_true(await RequestStorageAccessInFrame(frame1));
    console.log("requested storage access");

    // frame1 should now have storage access...
    assert_true(await FrameHasStorageAccess(frame1));
    assert_true(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame1)));
    console.log("checked storage&cookie access");

    // ... but frame2 has not requested access, so it should not have access yet.
    assert_true(await FrameHasStorageAccess(frame2));
    assert_false(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame2)));
    console.log("checked frame2 doesn't get access");

    // frame2 should also be able to request storage access and have it
    // auto-resolve, without requiring a user gesture.
    assert_true(await RequestStorageAccessInFrame(frame2));
    console.log("requested storage access for frame2");

    assert_true(await FrameHasStorageAccess(frame2));
    assert_true(cookieStringHasCookie("cookie", "monster", await GetCookiesFromFrame(frame2)));
    console.log("checked storage & cookie access for frame2");
  }, "Grants have per-frame scope");
})();
