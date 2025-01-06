import json
import matplotlib.pyplot as plt

# Step 1: Load the JSON file
with open("zcr_values.json", "r") as json_file:
    zcr_data = json.load(json_file)

# Step 2: Extract indices and ZCR values
indices = [item["index"] for item in zcr_data]
zcr_values = [item["zcr"] for item in zcr_data]

# Step 3: Plot the ZCR values
plt.figure(figsize=(10, 6))  # Set the figure size
plt.plot(indices, zcr_values, label="ZCR", linewidth=2)

# Step 4: Add labels, title, and grid
plt.title("Zero Crossing Rate (ZCR) Over Time", fontsize=16)
plt.xlabel("Frame Index", fontsize=14)
plt.ylabel("ZCR", fontsize=14)
plt.grid(True, linestyle="--", alpha=0.6)
plt.legend(fontsize=12)

# Step 5: Show the plot
# plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()
