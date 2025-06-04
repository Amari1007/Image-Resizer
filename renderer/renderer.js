const selectImg = document.getElementById("img");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const fileType = document.getElementById("fileType");
const imgHeight = document.getElementById("imgHeight");
const imgWidth = document.getElementById("imgWidth");
const resetBtn = document.getElementById("reset");
const resizeBtn = document.getElementById("resize");
const form = document.getElementById("form");
const imageTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg", "image/tiff"];

console.log("Node", versions.node(), "ElectronJS", versions.electron());

selectImg.addEventListener("change", (e) => {
    e.preventDefault();
    console.log("files array", e.target.files);
    const imgFile = e.target.files[0];

    if(!imgFile){
        errorMsg(message="Invalid file type");
        return false;
    }

    if(!imageTypes.includes(imgFile["type"])){
        errorMsg(message="Invalid file type");
        return false;
    }

    
    const imgObj = new Image();
    imgObj.src = URL.createObjectURL(imgFile);
    imgObj.onload = function () {
        imgWidth.value = this.width;
        imgHeight.value = this.height;
        fileName.innerText = `${imgFile.name}`;
        fileSize.innerText = `${((imgFile.size)/1000000).toFixed(1)} MB`;
        fileType.innerText = `${imgFile.type}`;
    };

    console.log("Image selected");
});

resizeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if(!selectImg.files[0]){
        errorMsg("Please select a file");
        return false;
    }
    //SEND TO MAIN PROCESS
    const imgPath = selectImg.files[0].path;
    const width = imgWidth.value;
    const height = imgHeight.value;
    ipcRenderer.send('image:resize', {
        imgPath,
        width,
        height
    });
});

resetBtn.addEventListener("click", (e) => {
    fileName.innerText = "--";
    fileSize.innerText = "--";
    fileType.innerText = "--";
    selectImg.files = null;
});

function successMsg(message = "undefined message", duration = 3000){
    Toastify.toast({
        text: message,
        duration: duration,
        close: false,
        style: {
            background: "green",
            color: "white",
            fontSize: "15px",
            textAlign: "center",
        }
    })
};

function errorMsg(message = "undefined message", duration = 3000){
    Toastify.toast({
        text: message,
        duration: duration,
        close: false,
        style: {
            background: "red",
            color: "white",
            fontSize: "16px",
            textAlign: "center",
        }
    });
};

ipcRenderer.on("image:done", () => {
    successMsg(message=`Image resized to ${imgWidth.value} x ${imgHeight.value}`, duration=10000);
});

ipcRenderer.on("image:error", () => {
    errorMsg(message="Failed to resize image", duration=4000);
});
