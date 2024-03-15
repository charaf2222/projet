import React, { useEffect } from 'react';

const OpenCvComponent = ({ canvas }) => {
  useEffect(() => {
    const performFaceDetection = async () => {
      try {
        await cvReady(); // Ensure OpenCV is ready
        console.log(cvReady)

        // Fetch the classifier file
        const classifierResponse = await fetch('haarcascade_frontalface_default.xml');
        console.log("ta7t fetch")
        const classifierBlob = await classifierResponse.blob();
        const classifierArrayBuffer = await classifierBlob.arrayBuffer();
        const data = new Uint8Array(classifierArrayBuffer);

        // Write the classifier data to OpenCV.js FS (File System)
        const classifierPath = 'C:\\Users\\user\\Desktop\\Projet\\frontend\\src\\haarcascade_frontalface_default.xml';
        cv.FS_createDataFile('/', classifierPath, data, true, false, false);

        // Initialize the CascadeClassifier
        const faceCascade = new cv.CascadeClassifier();
        faceCascade.load(classifierPath); // Load the classifier
        console.log("ta7t load")

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

        // Perform face detection
        const faces = new cv.RectVector();
        const msize = new cv.Size(0, 0);
        // Inside your performFaceDetection function, adjust parameters like this
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, new cv.Size(30, 30));
        console.log("ta7t detectMultiScale")
        console.log("faces === ", faces)

        // Draw rectangles around detected faces
        for (let i = 0; i < faces.size(); i++) {
          let face = faces.get(i);
          let point1 = new cv.Point(face.x, face.y);
          let point2 = new cv.Point(face.x + face.width, face.y + face.height);
          cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        }

        cv.imshow(canvas, src);

        // Cleanup
        src.delete(); gray.delete(); faces.delete(); faceCascade.delete();

      } catch (error) {
        console.error('Failed to load the classifier file and perform face detection.', error);
      }
    };

    performFaceDetection();
  }, [canvas]);

  // Function to ensure OpenCV has been initialized
  const cvReady = () => {
    return new Promise(resolve => {
      if (window.cv && window.cv.imread) {
        resolve(true);
      } else {
        document.addEventListener('opencvready', () => resolve(true), { once: true });
      }
    });
  };

  return null;
};

export default OpenCvComponent;
