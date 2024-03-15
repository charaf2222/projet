// CameraFeed.jsx
import React, { useEffect, useRef } from 'react';

const Camera = ({ onCanvasReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        drawCanvas();
      })
      .catch(console.error);
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    const draw = () => {
      if (videoRef.current?.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        onCanvasReady(canvas);
      }
      requestAnimationFrame(draw);
    };

    draw();
  };

  return (
    <>
      <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default Camera;
