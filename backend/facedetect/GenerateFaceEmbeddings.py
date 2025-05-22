import os
import numpy as np
import cv2
from tqdm import tqdm
from insightface.app import FaceAnalysis

# ====== Config ======
DATASET_DIR = "known_faces"
OUTPUT_FILE = "face_embeddings.npz"

# ====== Initialize FaceAnalysis ======
print("🚀 Initializing InsightFace...")
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))
print("✅ FaceAnalysis ready!\n")

embeddings = []
labels = []

# ====== Loop through each label ======
print("🔍 Starting to process dataset...\n")
for label in os.listdir(DATASET_DIR):
    label_dir = os.path.join(DATASET_DIR, label)
    if not os.path.isdir(label_dir):
        continue

    print(f"📁 Processing label: {label}")
    image_files = os.listdir(label_dir)

    for img_name in tqdm(image_files, desc=f"Images in '{label}'"):
        img_path = os.path.join(label_dir, img_name)
        img = cv2.imread(img_path)
        if img is None:
            print(f"⚠️ Failed to read image: {img_path}")
            continue

        faces = app.get(img)
        if faces:
            emb = faces[0].embedding
            embeddings.append(emb)
            labels.append(label)
        else:
            print(f"🚫 No face detected in: {img_name}")

print("\n💾 Saving embeddings to:", OUTPUT_FILE)
np.savez(OUTPUT_FILE, embeddings=np.array(embeddings), labels=np.array(labels))
print("✅ Done! Saved", len(embeddings), "embeddings.")
