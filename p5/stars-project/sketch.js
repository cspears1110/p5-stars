// TODO: Boundaries for rect. Don't let go offscreen
// TODO: Don't default transform to center. Mouse can go anywhere inside rect
// TODO: rect transorm. Width, Height, Rotate

let json;
let stars = [];
//magnitude_cutoff is low cutoff; used to remove least brightest stars.
let magnitude_cutoff;

let rect_window;
let rect_center, rect_width, rect_height;

let moveRect = false;

let starsInRect = [];

function preload(){
  if (magnitude_cutoff == null) {
    magnitude_cutoff = -0.9923;
  }
  json = loadJSON('data.json', trimJSON);
}

function setup() {
  // 0 <= x <= 847
  // 0 <= y <= 599
  // -0.9923 <= z <= 19.629
  createCanvas(850, 600);

  rectMode(CENTER);
  rect_center = createVector(width/2, height/2);
  rect_width = 400;
  rect_height = 25;
}

function draw() {
  background(7,11,52);

  //Draw Stars
  for (let star of stars) {
    //AbsMag is set to star.z
    let alpha = map(star.z, magnitude_cutoff, 19.629, 0, 255); // max alpha? 150 is nice, but a too dim?
    stroke(255, 255, 255, alpha);
    strokeWeight(1);
    point(star.x, star.y);
  }

  //Draw Rect
  stroke(255,0,0);
  strokeWeight(1);
  noFill();
  rect_window = rect(rect_center.x, rect_center.y, rect_width, rect_height);
}

function mousePressed() {
  if (calculateIsInsideRect(mouseX, mouseY)){
    moveRect = true;
  }
}

function mouseDragged() {
  if (moveRect) {
    rect_center.set(mouseX, mouseY);
  }
}

function mouseReleased(){
  if (moveRect) {
    moveRect = false;
    calculateStarsInRect();
    console.log(starsInRect);
  }
}

function calculateStarsInRect() {
  let tempArray = [];
  for (let star of stars) {
    if (calculateIsInsideRect(star.x, star.y)){
      tempArray.push(star);
    }
  }
  tempArray.sort(function(a,b){return a.x - b.x})
  starsInRect = {tempArray};
}

function calculateIsInsideRect(x, y) {
  // Create two triangles in rect, test areas. Will help with rotated rect

  //  A(X,Y)--------B(X,Y)
  //     |   P(X,Y)   |
  //  C(X,Y)--------D(X,Y)

  // if (ABC == APB + BPC + APC || BCD == BPC + CPD + BPD){
  //  is inside
  //}

  let A = createVector(rect_center.x - rect_width/2, rect_center.y - rect_height/2)
  let B = createVector(rect_center.x + rect_width/2, rect_center.y - rect_height/2)
  let C = createVector(rect_center.x - rect_width/2, rect_center.y + rect_height/2)
  let D = createVector(rect_center.x + rect_width/2, rect_center.y + rect_height/2)

  let P = createVector(x, y);

  let ABC = calculateAreaTriangle(A, B, C);
  let BCD = calculateAreaTriangle(B, C, D);

  let APB = calculateAreaTriangle(A, P, B);
  let BPC = calculateAreaTriangle(B, P, C);
  let APC = calculateAreaTriangle(A, P, C);

  // Already calculated BPC
  let CPD = calculateAreaTriangle(C, P, D);
  let BPD = calculateAreaTriangle(B, P, D);

  if (ABC == APB + BPC + APC || BCD == BPC + CPD + BPD){
    return true;
  }
  return false;
}

function calculateAreaTriangle(v1, v2, v3) {
  let area = (v1.x*(v2.y - v3.y) + v2.x*(v3.y - v1.y) + v3.x*(v1.y - v2.y))/2
  return Math.abs(area);
}

function trimJSON() {
  // trim JSON based on magnitude_cutoff, place in stars array
  // AbsMag is set to Vector.z
  for(let i = 0; i < Object.keys(json).length; i++) {
    if (json[i].AbsMag >= magnitude_cutoff) {
      stars.push(createVector(json[i].X, json[i].Y, json[i].AbsMag))
    }
  }
}

// start server:
// python -m SimpleHTTPServer

// star data from:
// https://starmap2d.appspot.com/
// https://starmap2d.appspot.com/download/stars.csv

// https://github.com/astronexus/HYG-Database
// comes with x,y,z