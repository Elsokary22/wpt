// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.line.join.miter
// Description:lineJoin 'miter' is rendered correctly
// Note:

importScripts("/resources/testharness.js");
importScripts("/html/canvas/resources/canvas-tests.js");

var t = async_test("lineJoin 'miter' is rendered correctly");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

var canvas = new OffscreenCanvas(100, 50);
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.lineJoin = 'miter';
ctx.lineWidth = 20;
ctx.fillStyle = '#f00';
ctx.strokeStyle = '#0f0';
ctx.fillStyle = '#f00';
ctx.strokeStyle = '#0f0';
ctx.fillRect(10, 10, 30, 20);
ctx.fillRect(20, 10, 20, 30);
ctx.beginPath();
ctx.moveTo(10, 20);
ctx.lineTo(30, 20);
ctx.lineTo(30, 40);
ctx.stroke();
ctx.fillStyle = '#0f0';
ctx.strokeStyle = '#f00';
ctx.beginPath();
ctx.moveTo(60, 20);
ctx.lineTo(80, 20);
ctx.lineTo(80, 40);
ctx.stroke();
ctx.fillRect(60, 10, 30, 20);
ctx.fillRect(70, 10, 20, 30);
_assertPixel(canvas, 38,12, 0,255,0,255);
_assertPixel(canvas, 39,11, 0,255,0,255);
_assertPixel(canvas, 40,10, 0,255,0,255);
_assertPixel(canvas, 41,9, 0,255,0,255);
_assertPixel(canvas, 42,8, 0,255,0,255);
_assertPixel(canvas, 88,12, 0,255,0,255);
_assertPixel(canvas, 89,11, 0,255,0,255);
_assertPixel(canvas, 90,10, 0,255,0,255);
_assertPixel(canvas, 91,9, 0,255,0,255);
_assertPixel(canvas, 92,8, 0,255,0,255);
t.done();

});
done();
