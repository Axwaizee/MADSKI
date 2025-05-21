# MADSKI

A Major Project consisting of a Face Recognition model and a Music Classification model.

Face samples can be added to the model which can be used for recognition.

The Music model is trained with 10 music genres.

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

and can serve the build:

```bash
npx serve -s dist
```