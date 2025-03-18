# Audio-Reactive Sphere

Audio-Reactive Sphere is a visual project that dynamically reacts to an audio file's RMS (Root Mean Square) energy and ZCR (Zero Crossing Rate) using p5.js. The sphere glitches and speeds up in response to changes in these values, extracted using the `librosa` library.

This project was forked from [jakechen9/mir_demo](https://github.com/jakechen9/mir_demo). The original animation has been modified to feature a sphere, with added RMS reactivity for a more dynamic visual experience.

## Features
- Visual representation of an audio file using a dynamic sphere.
- Sphere reacts to RMS and ZCR changes in real-time.

## Technologies Used
- **Frontend:** p5.js (JavaScript)
- **Backend:** Python
- **Audio Processing:** `librosa`

## Setup
1. Install Python 3.11.1 (Homebrew preferred)
2. Set up a virtual environment and install dependencies:
   ```sh
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Navigate to the p5.js directory and start a local server:
   ```sh
   npx http-server
   ```
4. Run the audio processing script:
   ```sh
   python MIRAudioProcessing.py
   ```

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/paolosand/mir_demo.git
   cd mir_demo
   ```
2. Follow the setup instructions above to install dependencies and run the application.
3. Open the frontend (index.html) in a browser to visualize the audio-reactive sphere.

## To Do:
- [ ] Experiment with Pitch Detection

## Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request.

