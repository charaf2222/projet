class Utils {
    constructor(errorOutputId) {
        this.errorOutputId = errorOutputId;
        this.errorOutput = document.getElementById(this.errorOutputId);
        if (!this.errorOutput) {
            console.error(`Error: No element found with ID ${this.errorOutputId}`);
        }
    }

    loadOpenCv = (onloadCallback) => {
        const script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.onload = () => {
            if (cv.getBuildInformation) {
                console.log(cv.getBuildInformation());
                onloadCallback();
            } else {
                cv['onRuntimeInitialized'] = () => {
                    console.log(cv.getBuildInformation());
                    onloadCallback();
                };
            }
        };
        script.onerror = () => {
            this.printError(`Failed to load ${OPENCV_URL}`);
        };
        script.src = 'opencv.js';
        document.getElementsByTagName('script')[0].parentNode.insertBefore(script, null);
    };

    createFileFromUrl = async (path, url, callback) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = new Uint8Array(await response.arrayBuffer());
                cv.FS_createDataFile('/', path, data, true, false, false);
                callback();
            } else {
                throw new Error(`Failed to load ${url}, status: ${response.status}`);
            }
        } catch (error) {
            this.printError(error.toString());
        }
    };

    loadImageToCanvas = (url, canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = url;
        }
    };

    clearError = () => {
        if (this.errorOutput) {
            this.errorOutput.innerHTML = '';
        }
    };

    printError = (err) => {
        if (this.errorOutput) {
            this.errorOutput.innerHTML = typeof err === 'object' ? JSON.stringify(err) : err;
        }
    };

    // Additional methods like executeCode, loadCode, addFileInputHandler, startCamera, stopCamera...
}

export default Utils;
