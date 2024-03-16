// OpenCvComponent.js 
import React, { useEffect } from 'react';

const OpenCvComponent = ({ canvas }) => {
    useEffect(() => {
        const cv = window.cv;

        const processImage = () => {
            try {
                let src = cv.imread(canvas);
                let gray = new cv.Mat();
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
                
                let faces = new cv.RectVector();
                let classifier = new cv.CascadeClassifier();
                
                // Load pre-trained classifiers (you should host this file)
                classifier.load('haarcascade_frontalface_default.xml');
                
                // Detect faces
                classifier.detectMultiScale(gray, faces, 1.1, 3, 0);

                // Draw rectangles around faces
                for (let i = 0; i < faces.size(); ++i) {
                    let face = faces.get(i);
                    let point1 = new cv.Point(face.x, face.y);
                    let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                    cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
                }
                
                cv.imshow(canvas, src);
                
                // Cleanup
                src.delete(); gray.delete(); faces.delete(); classifier.delete();
            } catch (error) {
                console.error('Error processing image:', error);
            }
        };

        processImage();

    }, [canvas]);

    return null;
};

export default OpenCvComponent;