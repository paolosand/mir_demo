let bgColor;
let fontColor;
let canvas;
let sampleRate = 44100;
let frameLength = 2048;
let zcrIndex = 0; // Start fetching from the first index
let particles = []; // Array to store particle objects
let noiseScale = 0.01; // Scale for Perlin noise
let maxParticles = 200; // Number of particles
let shootingStarMode = false; // Flag for shooting star effect

// Server URL
const SERVER_URL = "http://127.0.0.1:5050";

function setup() {
    canvas = createCanvas(1600, 1000); // Canvas size
    centerCanvas();
    bgColor = color(255); // Default background color (white)
    fontColor = color(0); // Default font color (black)

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle());
    }

    // Start fetching ZCR values
    setInterval(fetchZCR, sampleRate / frameLength); // Fetch ZCR every ~46ms
}

function createParticle() {
    return {
        x: random(width),
        y: random(height),
        size: random(5, 15),
        speed: random(1, 3),
        dirX: random([-1, 1]),
        dirY: random([-1, 1]),
        trail: [], // Array to store trail positions
        maxTrailLength: 10, // Length of the trail
    };
}

function centerCanvas() {
    let x = (windowWidth - width) / 2; // Center horizontally
    let y = (windowHeight - height) / 2; // Center vertically
    canvas.position(x, y); // Set the canvas position
}

function windowResized() {
    centerCanvas();
}

function draw() {
    background(bgColor);

    for (let p of particles) {
        // Update particle position
        if (shootingStarMode) {
            // Particles move in a line during shooting star mode
            p.x += p.dirX * p.speed * 2; // Faster movement
            p.y += p.dirY * p.speed * 0.5; // Smaller vertical movement
        } else {
            // Particles move organically using Perlin noise
            let n = noise(p.x * noiseScale, p.y * noiseScale);
            let angle = TAU * n;
            p.x += cos(angle) * p.dirX * p.speed;
            p.y += sin(angle) * p.dirY * p.speed;
        }

        // Add current position to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrailLength) {
            p.trail.shift(); // Remove oldest trail point
        }

        // Draw trail
        noFill();
        stroke(shootingStarMode ? color(0, 255, 0, 150) : color(255, 100)); // Neon green for shooting star mode
        beginShape();
        for (let t of p.trail) {
            vertex(t.x, t.y);
        }
        endShape();

        // Draw particle
        fill(shootingStarMode ? color(0, 255, 0) : fontColor); // Neon green for shooting star mode
        noStroke();
        ellipse(p.x, p.y, p.size);

        // Reset particle if it goes off-screen
        if (!onScreen(p)) {
            p.x = random(width);
            p.y = random(height);
            p.dirX *= -1;
            p.dirY *= -1;
            p.trail = []; // Clear the trail
        }
    }

    // Display title text
    fill(fontColor);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("ZCR Visualization", width / 2, height - 50);
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
                    bgColor = color(0); // Black background
                    fontColor = color(255); // White font
                    shootingStarMode = true; // Activate line movement and neon green color
                } else {
                    // Default mode
                    bgColor = color(255); // White background
                    fontColor = color(0); // Black font
                    shootingStarMode = false;
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

function onScreen(p) {
    return p.x > 0 && p.x < width && p.y > 0 && p.y < height;
}
