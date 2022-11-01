// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.clearRect.globalalpha
// Description:clearRect is not affected by globalAlpha
// Note:

importScripts("/resources/testharness.js");
importScripts("/html/canvas/resources/canvas-tests.js");

var t = async_test("clearRect is not affected by globalAlpha");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

var canvas = new OffscreenCanvas(100, 50);
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.globalAlpha = 0.1;
ctx.clearRect(0, 0, 100, 50);
_assertPixel(canvas, 50,25, 0,0,0,0);
t.done();

});
done();
