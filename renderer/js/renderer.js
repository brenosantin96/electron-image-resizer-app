//const os = require("os")
const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");


console.log("HOMEDIR:", os.homeDir())

function loadImage(e) {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        alertError("Please select an image.")
        return
    }

    //Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    form.style.display = "block";
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homeDir(), "imageresizer")
}

//Send image data to main
function sendImage(e) {
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const file = img.files[0]; // Pegue o arquivo diretamente

    console.log("img: ", img);   
    console.log("file: ", file);   


    if (!img.files[0]) {
        alertError("Please upload an image");
        return;
    }

    if (width === "" || height === "") {
        alertError("Please fill in a height and width");
        return
    }

    //send to main using ipcRenderer
    ipcRenderer.send("image:resize", {
        file,
        width,
        height
    }
    )


}

//Check if it is image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center'
        }
    })
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center'
        }
    })
}

img.addEventListener('change', loadImage);
form.addEventListener("submit", sendImage);