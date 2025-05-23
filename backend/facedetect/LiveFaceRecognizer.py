import cv2
import numpy as np
import joblib
from insightface.app import FaceAnalysis
from sklearn.preprocessing import LabelEncoder

# ===== Configuration =====
WEBCAM_INDEX = 0  # Change to 0 if using laptop cam
THRESHOLD = 0.7   # Confidence threshold for predictions

# ===== Load Model & Encoder =====
print("📦 Loading classifier and label encoder...")
classifier = joblib.load("face_classifier.pkl")
# a pretrained SVM model
lb_enc = joblib.load("lb_enc.pkl")

# ===== Initialize InsightFace =====
print("🚀 Initializing InsightFace...")
app = FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
# FaceAnalysis: Initializes InsightFace with the buffalo_l model (optimized for CPU).

app.prepare(ctx_id=0, det_size=(640, 640))
# det_size: Sets the resolution for face detection (640x640 pixels).

# ===== Start Webcam =====
print("🎥 Opening webcam...")
cap = cv2.VideoCapture(WEBCAM_INDEX)
if not cap.isOpened():
    raise IOError("❌ Failed to open webcam")

print("✅ Webcam started. Press 'Q' to quit.\n")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Failed to read frame.")
            break
            # cap.read(): Captures each frame from the webcam. Exits if the frame is corrupted.

        # Detect faces and extract embeddings
        faces = app.get(frame)
        # app.get(frame): Detects faces in the frame and extracts their embeddings (128D/512D feature vectors).
        for face in faces:
            bbox = face.bbox.astype(int)
            emb = face.embedding.reshape(1, -1)
            # bbox: Face bounding box coordinates ([x1, y1, x2, y2]).
            #
            # emb: Reshapes the embedding into a 2D array for the classifier.

            # Predict
            probs = classifier.predict_proba(emb)[0]
            max_prob = np.max(probs)
            pred_label = classifier.predict(emb)[0]
            name = lb_enc.inverse_transform([pred_label])[0] if max_prob >= THRESHOLD else "Unknown"
            # predict_proba: Gets probabilities for all possible labels.
            #
            # max_prob: Highest confidence score among predictions.
            #
            # inverse_transform: Converts numerical label (e.g., 0) to a name (e.g., "Alice").

            # Draw box and label
            cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
            cv2.putText(frame, f"{name} ({max_prob*100:.1f}%)", (bbox[0], bbox[1]-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0) if name != "Unknown" else (0, 0, 255), 2)
            # rectangle: Draws a green box around the face.
            #
            # putText: Displays the name and confidence score (red if "Unknown").

        cv2.imshow("🔍 Live Face Recognition (Press Q to quit)", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("\n⛔ Quit requested.")
            break

except KeyboardInterrupt:
    print("\n⛔ Interrupted.")

finally:
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Face recognition ended.")
