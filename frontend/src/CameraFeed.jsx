// CameraFeed.js
import React from 'react';


function CameraFeed() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      {/* Embed the CameraFeed.html page using an iframe */}
      <iframe
        src="C:\\Users\\user\\Desktop\\Projet\\frontend\\src\\CameraFeed.html"
        title="Camera Feed"
        width="100%"
        height="600px" // Adjust the height as needed
        frameBorder="0"
      />
    </div>
  );
}

export default CameraFeed;
