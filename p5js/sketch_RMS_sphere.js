let angle = 0;
let glitch = false;
let invert = false;
// let glitchTimer = 0;

let sampleRate = 44100;
let frameLength = 2048;
let zcrIndex = 0; // Start fetching from the first index
let rmsIndex = 0; // Start fetching from the first index

let w = window.innerWidth;
let h = window.innerHeight;

// Server URL
const SERVER_URL = "http://127.0.0.1:5050";

function setup() {
    createCanvas(w, h, WEBGL);

    // Start fetching ZCR and RMS values
    setInterval(fetchRMS, sampleRate / frameLength); // Fetch ZCR every ~46ms
    setInterval(fetchZCR, sampleRate / frameLength); // Fetch RMS every ~46ms
}

function draw() {
    background(invert ? 20 : 240); // Light background normally, dark when inverted

    // Set up lights
    if (invert) {
        ambientLight(30, 30, 30);
        pointLight(200, 50, 50, 200, -200, 350);
    } else {
        ambientLight(200, 200, 200);
        pointLight(255, 255, 255, 200, -200, 350);
    }

    // Simulate glitch condition randomly
    // if (random(1) < 0.01) {
    //     glitch = true;
    //     glitchTimer = frameCount + 10; // Glitch for 10 frames
    // }
    // if (frameCount > glitchTimer) {
    //     glitch = false;
    // }

    // // Simulate invert condition randomly
    // if (random(1) < 0.005) {
    //     invert = !invert;
    // }

    // Apply glitch effect
    let glitchOffset = glitch ? random(-0.2, 0.2) : 0;
    let rotationX = angle + glitchOffset;
    let rotationY = angle * 0.5 + glitchOffset;

    rotateX(rotationX);
    rotateY(rotationY);

    // Sphere material
    if (invert) {
        ambientMaterial(100, 100, 150); // Darker tones
    } else {
        ambientMaterial(150, 200, 255); // Light blueish
    }

    sphere(200);

    angle += 0.02; // Constant rotation speed
}

function fetchZCR() {
    fetch(`${SERVER_URL}/get_zcr/${zcrIndex}`) // Dynamically request ZCR for current index
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.zcr !== undefined) {
                console.log(`ZCR: ${data.zcr}`); // Log the ZCR value
                if (data.zcr >= 0.02 && data.zcr <= 0.08) {
                    // Activate shooting star mode
                    glitch = true; // Activate line movement and neon green color
                } else {
                    // Default mode
                    glitch = false;
                }
                zcrIndex++; // Increment index to fetch next value
            } else if (data.error) {
                console.error(`Error from server: ${data.error}`); // Log server error
            }
        })
        .catch((err) => {
            console.error("Fetch error:", err); // Log fetch error
        });
}

function fetchRMS() {
    fetch(`${SERVER_URL}/get_rms/${rmsIndex}`) // Dynamically request RMS for current index
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.rms !== undefined) {
                console.log(`RMS: ${data.rms}`); // Log the RMS value
                if (data.rms >= 0.1 && data.rms <= 0.6) {
                    // Activate rms shooting star mode
                    invert = true; // add rms shooting star text
                } else {
                    // Default mode
                    invert = false; // default mode
                }
                rmsIndex++; // Increment index to fetch next value
            } else if (data.error) {
                console.error(`Error from server: ${data.error}`); // Log server error
            }
        })
        .catch((err) => {
            console.error("Fetch error:", err); // Log fetch error
        });
}