import cv2
import os
import time
import numpy as np
from datetime import datetime
import mediapipe as mp

# ===== Configuration =====
OUTPUT_FOLDER = "known_faces"
CAPTURE_INTERVAL = 0.2  # seconds
RESOLUTION = (640, 480)
MIN_MOTION_THRESHOLD = 10000
MIN_IMAGES_PER_CLASS = 100
WEBCAM_INDEX = 0  # Use 0 for laptop webcam
START_KEY = 's'
SHOW_LIVE_FEED = True

# ===== Get User Label =====
FACE_LABEL = input("Enter your name (label) to collect face data: ").strip()
face_folder = os.path.join(OUTPUT_FOLDER, FACE_LABEL)
os.makedirs(face_folder, exist_ok=True)

# ===== Initialize Face Detection =====
mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.6)

# ===== Start Webcam =====
print(f"🎥 Opening webcam (Index: {WEBCAM_INDEX}) — please wait...")
start_time = time.time()

cap = cv2.VideoCapture(WEBCAM_INDEX)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, RESOLUTION[0])
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, RESOLUTION[1])

if not cap.isOpened():
    raise IOError(f"❌ Failed to open webcam at index {WEBCAM_INDEX}")
print(f"✅ Webcam opened in {time.time() - start_time:.2f} seconds")

# ===== Capture Logic =====
background = None
last_capture_time = time.time()
started = False

print(
    f"\n▶️ Press '{START_KEY.upper()}' to start collecting {MIN_IMAGES_PER_CLASS} face images for '{FACE_LABEL}'...\n")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Failed to read frame")
            break

        # Motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if background is None:
            background = gray.copy()

        diff = cv2.absdiff(background, gray)
        thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        motion_detected = np.sum(thresh) > MIN_MOTION_THRESHOLD

        # Face detection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb)
        face_detected = results.detections is not None

        current_count = len(os.listdir(face_folder))
        current_time = time.time()
        time_since_last_capture = current_time - last_capture_time

        if started:
            if (time_since_last_capture >= CAPTURE_INTERVAL and
                    motion_detected and face_detected and
                    current_count < MIN_IMAGES_PER_CLASS):

                filename = os.path.join(
                    face_folder,
                    f"{FACE_LABEL}_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.jpg"
                )
                cv2.imwrite(filename, frame)
                print(f"📸 Saved: {filename} ({current_count + 1}/{MIN_IMAGES_PER_CLASS})")
                last_capture_time = current_time
                background = gray.copy()

                if current_count + 1 >= MIN_IMAGES_PER_CLASS:
                    print(f"\n✅ Collection complete for '{FACE_LABEL}'!")
                    break

        # UI Display
        if SHOW_LIVE_FEED:
            if not started:
                cv2.putText(frame, f"Press '{START_KEY.upper()}' to start capturing...",
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                status = [
                    f"Label: {FACE_LABEL}",
                    f"Images: {current_count}/{MIN_IMAGES_PER_CLASS}",
                    f"Next: {max(0, round(CAPTURE_INTERVAL - time_since_last_capture, 1))}s",
                    f"Motion: {'YES' if motion_detected else 'NO'}",
                    f"Face: {'YES' if face_detected else 'NO'}"
                ]
                for i, text in enumerate(status):
                    cv2.putText(frame, text, (10, 30 + i * 25),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            cv2.imshow("Face Collector (Q to quit)", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("\n⛔ Quit by user.")
            break
        elif key == ord(START_KEY) and not started:
            print("✅ Starting face capture...")
            started = True
            last_capture_time = time.time()

except KeyboardInterrupt:
    print("\n⛔ Interrupted by keyboard.")

finally:
    cap.release()
    cv2.destroyAllWindows()
    face_detection.close()
    print("📦 Done collecting face dataset.")
