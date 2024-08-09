import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as htmlToImage from 'html-to-image';
import { Square, Type } from 'lucide-react';

const handleMouseMove = (e, elements, selectedElement, startPos, setElements, setStartPos) => {
  if (selectedElement !== null) {
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setElements(elements.map((el, index) => 
      index === selectedElement 
        ? { ...el, x: el.x + dx, y: el.y + dy }
        : el
    ));
    setStartPos({ x: e.clientX, y: e.clientY });
  }
};

const handleMouseUp = (setIsMoving, setSelectedElement) => {
  setIsMoving(false);
  setSelectedElement(null);
};

const Index = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

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

  const addRectangle = () => {
    setElements([...elements, { type: 'rectangle', x: 50, y: 50, width: 100, height: 100, color: '#' + Math.floor(Math.random()*16777215).toString(16) }]);
  };

  const addText = () => {
    setElements([...elements, { type: 'text', x: 50, y: 50, text: 'New Text', fontSize: 16, color: '#000000' }]);
  };

  const handleMouseDown = (e, index) => {
    setSelectedElement(index);
    setIsMoving(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isMoving && selectedElement !== null) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setElements(elements.map((el, index) => 
        index === selectedElement 
          ? { ...el, x: el.x + dx, y: el.y + dy }
          : el
      ));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsMoving(false);
    setSelectedElement(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const mouseMoveHandler = (e) => handleMouseMove(e, elements, selectedElement, startPos, setElements, setStartPos);
      const mouseUpHandler = () => handleMouseUp(setIsMoving, setSelectedElement);
      
      canvas.addEventListener('mousemove', mouseMoveHandler);
      canvas.addEventListener('mouseup', mouseUpHandler);
      
      return () => {
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        canvas.removeEventListener('mouseup', mouseUpHandler);
      };
    }
  }, [elements, selectedElement, startPos]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Canvas Editor Demo</h1>
        <p className="text-xl text-gray-600">Add shapes and text, then capture the image</p>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleButtonClick}>
          {showCanvas ? 'Capture and Hide Canvas' : 'Show Canvas'}
        </Button>
        {showCanvas && (
          <>
            <Button onClick={addRectangle}><Square className="mr-2 h-4 w-4" /> Add Rectangle</Button>
            <Button onClick={addText}><Type className="mr-2 h-4 w-4" /> Add Text</Button>
          </>
        )}
      </div>
      {showCanvas && (
        <div 
          id="capture-area"
          ref={canvasRef}
          className="w-[800px] h-[600px] border-2 border-gray-300 relative bg-white"
        >
          {elements.map((element, index) => (
            element.type === 'rectangle' ? (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  backgroundColor: element.color,
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            ) : (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: element.x,
                  top: element.y,
                  fontSize: element.fontSize,
                  color: element.color,
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
              >
                {element.text}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
