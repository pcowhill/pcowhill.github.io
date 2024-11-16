"use strict";
let doc = document;
let element = doc.getElementById("myCanvas");
if (element) {
    let context = element.getContext("2d");
    if (context) {
        context.fillStyle = "rgb(99,99,99)";
        context.fillRect(0, 0, 800, 800);
    }
}
console.log("hello world");
