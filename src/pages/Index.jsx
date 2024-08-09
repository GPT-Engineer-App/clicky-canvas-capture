import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as htmlToImage from 'html-to-image';

const Index = () => {
  const [showCanvas, setShowCanvas] = useState(false);

  const handleButtonClick = () => {
    if (showCanvas) {
      const element = document.getElementById('capture-area');
      htmlToImage.toPng(element)
        .then((dataUrl) => {
          console.log('PNG data URL:', dataUrl);
          // You can also download the image or send it to a server here
        })
        .catch((error) => {
          console.error('Error generating PNG:', error);
        });
    }
    setShowCanvas(!showCanvas);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" id="capture-area">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Canvas Overlay Demo</h1>
        <p className="text-xl text-gray-600">Click the button to toggle the canvas overlay</p>
      </div>
      <Button onClick={handleButtonClick}>
        {showCanvas ? 'Capture and Hide Canvas' : 'Show Canvas'}
      </Button>
      {showCanvas && (
        <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none" />
      )}
    </div>
  );
};

export default Index;
