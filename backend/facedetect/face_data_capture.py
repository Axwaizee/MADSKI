import cv2
import os
import time
import numpy as np
from datetime import datetime
import mediapipe as mp


DATASET_FOLDER = "dataset"
SHUTTER_DELAY = 0.2 
RESOLUTION = (640, 480)
MIN_MOVEMENT_THRES = 10000
NO_OF_IMAGES_FOR_A_PERSON = 100
WEBCAM_INDEX_NO = 0 
START_KEY = 's'
SHOW_LIVE_FEED = True


FACE_LABEL = input("Enter the name of the person: ").strip()
person_dir = os.path.join(DATASET_FOLDER, FACE_LABEL)
os.makedirs(person_dir, exist_ok=True)


mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.6)


print(f"Opening webcam...")

cap = cv2.VideoCapture(WEBCAM_INDEX_NO)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, RESOLUTION[0])
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, RESOLUTION[1])

if not cap.isOpened():
    raise IOError(f"❌ Failed to open webcam at index {WEBCAM_INDEX_NO}")


background = None
last_capture_time = time.time()
started = False

print(
    f"\nReady to capture {NO_OF_IMAGES_FOR_A_PERSON} face image(s) for '{FACE_LABEL}'. Press '{START_KEY.upper()}' to start.\n")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to read frame")
            break

        # Motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if background is None:
            background = gray.copy()

        diff = cv2.absdiff(background, gray)
        thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        motion_detected = np.sum(thresh) > MIN_MOVEMENT_THRES

        # Face detection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb)
        face_detected = results.detections is not None

        current_count = len(os.listdir(person_dir))
        current_time = time.time()
        time_since_last_capture = current_time - last_capture_time

        if started:
            if (time_since_last_capture >= SHUTTER_DELAY and
                    motion_detected and face_detected and
                    current_count < NO_OF_IMAGES_FOR_A_PERSON):

                filename = os.path.join(
                    person_dir,
                    f"{FACE_LABEL}_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.jpg"
                )
                cv2.imwrite(filename, frame)
                print(f"Saved: {filename} ({current_count + 1}/{NO_OF_IMAGES_FOR_A_PERSON})")
                last_capture_time = current_time
                background = gray.copy()

                if current_count + 1 >= NO_OF_IMAGES_FOR_A_PERSON:
                    print(f"\nCollection complete for '{FACE_LABEL}'!")
                    break

        # UI Display
        if SHOW_LIVE_FEED:
            if not started:
                cv2.putText(frame, f"Press '{START_KEY.upper()}' to start capturing...",
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                status = [
                    f"Label: {FACE_LABEL}",
                    f"Images: {current_count}/{NO_OF_IMAGES_FOR_A_PERSON}",
                    f"Next: {max(0, round(SHUTTER_DELAY - time_since_last_capture, 1))}s",
                    f"Motion: {'YES' if motion_detected else 'NO'}",
                    f"Face: {'YES' if face_detected else 'NO'}"
                ]
                for i, text in enumerate(status):
                    cv2.putText(frame, text, (10, 30 + i * 25),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            cv2.imshow("Face Collector (Q to quit)", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("\nQuit by user.")
            break
        elif key == ord(START_KEY) and not started:
            print("Starting face capture...")
            started = True
            last_capture_time = time.time()

except KeyboardInterrupt:
    print("\nInterrupted by keyboard.")

finally:
    cap.release()
    cv2.destroyAllWindows()
    face_detection.close()
    print("Done collecting face dataset.")
