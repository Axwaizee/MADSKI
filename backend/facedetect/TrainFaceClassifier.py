import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split, GridSearchCV
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# ===== Load Embeddings =====
print("📦 Loading face embeddings...")
data = np.load("face_embeddings.npz")
embeddings, labels = data["embeddings"], data["labels"]
print(f"✅ Loaded {len(embeddings)} embeddings from face_embeddings.npz")

# ===== Encode Labels =====
print("🔤 Encoding labels...")
le = LabelEncoder()
labels_encoded = le.fit_transform(labels)

# ===== Normalize Embeddings =====
print("📏 Normalizing embeddings...")
scaler = StandardScaler()
embeddings_scaled = scaler.fit_transform(embeddings)

# ===== Split Dataset =====
print("📊 Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    embeddings_scaled, labels_encoded, test_size=0.2, random_state=42, stratify=labels_encoded
)

# ===== Train SVM with Grid Search =====
print("🧠 Training SVM classifier with GridSearchCV...")

param_grid = {
    'C': [1, 10, 100],
    'kernel': ['linear', 'rbf'],
    'gamma': ['scale', 'auto']
}

grid = GridSearchCV(SVC(probability=True), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)

clf = grid.best_estimator_
print(f"✅ Best SVM Params: {grid.best_params_}")

# ===== Evaluate Classifier =====
print("📈 Evaluating model...")
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"🎯 Model Accuracy on Test Set: {acc * 100:.2f}%")

print("\n🧾 Classification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

print("🧩 Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt='d', xticklabels=le.classes_, yticklabels=le.classes_, cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()

# ===== Save Classifier & Label Encoder =====
joblib.dump(clf, "face_classifier.pkl")
joblib.dump(le, "label_encoder.pkl")
joblib.dump(scaler, "embedding_scaler.pkl")

print("\n💾 Classifier saved to: face_classifier.pkl")
print("💾 Label encoder saved to: label_encoder.pkl")
print("💾 Scaler saved to: embedding_scaler.pkl")
