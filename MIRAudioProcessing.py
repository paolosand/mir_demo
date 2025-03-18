import threading
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from lib.MIRRealTimeFeatureExtractor import RealTimeFileFeatureExtractor
import signal
import logging
import numpy as np
logging.getLogger('werkzeug').setLevel(logging.ERROR)  # Suppress logs

zcr_values = []
rms_values = []

# Flask app
app = Flask(__name__)
CORS(app)

feature_extractor = RealTimeFileFeatureExtractor("test_track.wav")


# Start the audio stream in a separate thread
def start_audio_stream():
    feature_extractor.start_stream()


@app.route("/get_zcr/<int:index>", methods=["GET"])
def get_zcr(index):
    zcr = feature_extractor.get_zcr_features_at_index(index)
    if zcr is not None:
        zcr_values.append({"index": index, "zcr": zcr})  # Append ZCR value
        # Save all ZCR values to JSON immediately
        with open("zcr_values.json", "w") as json_file:
            json.dump(zcr_values, json_file)
            print(f"Saved ZCR at index {index} to zcr_values.json")

        print(f"ZCR at index {index}: {zcr}")  # Print the ZCR value live
        return jsonify({"zcr": zcr})
    else:
        return jsonify({"error": "Index out of range"}), 404


@app.route("/get_rms/<int:index>", methods=["GET"])
def get_rms(index):
    rms = feature_extractor.get_rms_features_at_index(index)
    if rms is not None:
        # print(f"reading at {index}: rms: {rms}")
        rms_values.append({"index": index, "rms": np.float64(rms)})  # Append RMS value
        # print(f"writing to {index}: {rms_values[-1]}")
        # Save all RMS values to JSON immediately
        with open("rms_values.json", "w") as json_file:
            json.dump(rms_values, json_file)
            print(f"Saved RMS at index {index} to rms_values.json")

        print(f"RMS at index {index}: {rms}")  # Print the RMS value live
        return jsonify({"rms": np.float64(rms)})
    else:
        return jsonify({"error": "Index out of range"}), 404


@app.route("/shutdown", methods=["POST"])
def shutdown():
    """
    Shutdown route to stop the audio stream and terminate the Flask server.
    """
    feature_extractor.stop_event.set()  # Signal the feature extractor to stop
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()  # Shutdown the Flask server
    return jsonify({"message": "Shutting down..."})


# Signal handler for graceful shutdown
def handle_exit(signal, frame):
    """
    Handle Ctrl+C or SIGTERM signals to cleanly stop the application.
    """
    print("Signal received, shutting down gracefully...")
    feature_extractor.stop_event.set()  # Signal threads to stop
    audio_thread.join()  # Wait for audio thread to complete
    feature_extractor.stop_stream()  # Clean up PyAudio resources
    print("Shutdown complete.")
    exit(0)


# Register signal handlers for SIGINT (Ctrl+C) and SIGTERM
signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

if __name__ == "__main__":
    # Initialize an empty JSON file to overwrite old data
    with open("zcr_values.json", "w") as zcr_json_file:
        json.dump([], zcr_json_file)  # Start with an empty JSON list

    with open("rms_values.json", "w") as rms_json_file:
        json.dump([], rms_json_file)  # Start with an empty JSON list

    # Start audio stream in a background thread
    audio_thread = threading.Thread(target=start_audio_stream, daemon=True)
    audio_thread.start()

    # Run the Flask server
    try:
        app.run(host="127.0.0.1", port=5050)
    except Exception as e:
        print(f"Error occurred: {e}")
        handle_exit(None, None)