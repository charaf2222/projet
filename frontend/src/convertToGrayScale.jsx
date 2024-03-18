import cv from 'opencv.js';

cv['onRuntimeInitialized'] = () => {
    console.log('OpenCV.js is ready.');
    // You can start using OpenCV.js functions here
};

function convertToGrayScale(imageSrc) {
    let src = cv.imread(imageSrc); // Read the image source
    let dst = new cv.Mat(); // Create a destination Mat object
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY); // Convert the image to grayscale
    cv.imshow('outputCanvas', dst); // Display the result on a canvas
    src.delete(); // Clean up memory
    dst.delete(); // Clean up memory
}
