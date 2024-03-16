
// CameraFeed.js
import React, { useState, useEffect } from 'react';
import Camera from './Camera';
import OpenCvComponent from './OpenCvComponent';

const CameraFeed = () => {
    const [isCvReady, setCvReady] = useState(false);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        const checkOpenCv = () => {
            if (window.cv && window.cv.imread) {
                setCvReady(true);
            } else {
                document.addEventListener('opencvloaded', () => {
                    console.log('OpenCV loaded');
                    setCvReady(true);
                });
            }
        };

        checkOpenCv();

        return () => {
            document.removeEventListener('opencvloaded', () => {
                console.log('OpenCV unloaded');
            });
        };
    }, []);

    const handleCanvasReady = (canvasElement) => {
        setCanvas(canvasElement);
    };

    return (
        <div>
            <Camera onCanvasReady={handleCanvasReady} />
            {isCvReady && canvas && <OpenCvComponent canvas={canvas} />}
        </div>
    );
};

export default CameraFeed;