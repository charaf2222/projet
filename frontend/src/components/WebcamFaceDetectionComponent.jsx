// WebcamFaceDetectionComponent.js
import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

import './WebcamFaceDetectionComponent.css'; // Import CSS file


const WebcamFaceDetectionComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModelsAndDetectFaces = async () => {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      // Access webcam stream
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Error accessing the webcam:', err));
    };

    loadModelsAndDetectFaces();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size to match video size
      video.addEventListener('play', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Start face detection loop
        const detectFaces = async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
          console.log("detectors :: ", detections);

          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw detected faces
          faceapi.draw.drawDetections(canvas, detections);
          console.log("draw", faceapi.draw.drawDetections(canvas, detections));
          faceapi.draw.drawFaceLandmarks(canvas, detections);
          faceapi.draw.drawFaceExpressions(canvas, detections);

          // Loop
          requestAnimationFrame(detectFaces);
        };

        detectFaces();
      });
    }
  }, []);

  return (
    <div className='video-container'>
      <video ref={videoRef} autoPlay muted></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default WebcamFaceDetectionComponent;