# MADSKI

A Major Project consisting of a Face Recognition model and a Music Classification model.

Face samples can be added to the model which can be used for recognition.

The Music model is trained with 10 music genres.

---

### Installation

User can directly download the zip file of this repository and can extract it or they can run the following command in the terminal.

The user will require the following things installed in their system: 

- **Node.js**
- **Git**
- **Python 3.9**

```bash
git clone https://github.com/Axwaizee/MADSKI.git
cd MADSKI
```

On completion of the download of the project files they need to run the following command:


```bash
npm install
```

The user need to configure and set the environment variables as show in the `.env.example`.

```env
# FACE RECOGNITION URL
VITE_FACE_RECOGNITION=http://192.168.65.241:5000
```


### For Developement Mode

The user can continue with the follow code in the terminal to view the webapp in the development mode:

```bash
npm run dev
```
Or can run the build version by first making a build of the project.

```bash
npm build
```

### For Deployment Mode

and can serve the build:

```bash
npx serve -s dist
```



##  Face Recognition

Move to the `/facedetect/` directory:

```bash
cd backend/facedetect
```

You can run in the python virtual environment (recommended):

```bash
python -m venv .venv
```

Next you can activate the virtual environment as per your terminal, an example of powershell is provided below:

```ps
.\.venv\Scripts\activate
```

Then you can install the required dependences.

```bash
pip install -r requirements.txt
```

----

Now you can run `face_collector.py` -> `GenerateFaceEmbeddings.py` -> `TrainFaceClassifier.py` -> `server.py`

The face recognition will be running on host `0.0.0.0` and port `5000`

---

## Music Classification

You can train the model with your music dataset. We have already trained a best model which can be downloaded and saved in the `backend/music/models/` folder.

Create a virtual environment as we did in Face recognition

Then you can run this command to in the `/music/` directory:

```bash
python server.py
```

The music classification will be running on host `0.0.0.0` and port `5000`