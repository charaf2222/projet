// Camera.js 
import React, { useRef, useEffect } from 'react';

const Camera = ({ onCanvasReady }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const initializeCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        };

        initializeCamera();

    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const updateCanvas = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                onCanvasReady(canvas);
            }
            requestAnimationFrame(updateCanvas);
        };

        updateCanvas();
    }, [onCanvasReady]);

    return (
        <div>
            <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default Camera;