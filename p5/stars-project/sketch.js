let json
let stars = [];
//magnitude_cutoff is low cutoff; used to remove least brightest stars.
let magnitude_cutoff;

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
}

function draw() {
  background(7,11,52);

  for (let star of stars) {
    //AbsMag is set to star.z

    //second arg of map, maybe magnitude_cutoff?
    let alpha = map(star.z, -0.9923, 19.629, 0, 255); // max alpha? 150 is nice, but a too dim?

    stroke(255, 255, 255, alpha)
    point(star.x, star.y);
  }
}

function trimJSON() {
  //trim JSON based on magnitude_cutoff, place in stars array
  //AbsMag is set to Vector.z
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