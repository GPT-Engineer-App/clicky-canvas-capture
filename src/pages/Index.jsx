import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as htmlToImage from 'html-to-image';
import { Square, Type } from 'lucide-react';
import { Canvas, Frame, Rectangle, Text } from 'react-figma-plugin-ds';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

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
  const [editMode, setEditMode] = useState(false);
  const [elements, setElements] = useState([]);
  const canvasRef = useRef(null);

  const handleButtonClick = () => {
    if (editMode) {
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
    setEditMode(!editMode);
  };

  const addRectangle = () => {
    setElements([...elements, { type: 'rectangle', x: 50, y: 50, width: 100, height: 100, fill: '#' + Math.floor(Math.random()*16777215).toString(16) }]);
  };

  const addText = () => {
    setElements([...elements, { type: 'text', x: 50, y: 50, content: 'New Text', fontSize: 16, fill: '#000000' }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Canvas Editor Demo</h1>
        <p className="text-xl text-gray-600">Add shapes and text, then capture the image</p>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleButtonClick}>
          {editMode ? 'Capture and Exit Edit Mode' : 'Edit as Canvas'}
        </Button>
        {editMode && (
          <>
            <Button onClick={addRectangle}><Square className="mr-2 h-4 w-4" /> Add Rectangle</Button>
            <Button onClick={addText}><Type className="mr-2 h-4 w-4" /> Add Text</Button>
          </>
        )}
      </div>
      {editMode && (
        <Canvas id="capture-area" ref={canvasRef} width={800} height={600}>
          <Frame width={800} height={600}>
            {elements.map((element, index) => (
              element.type === 'rectangle' ? (
                <Rectangle
                  key={index}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.fill}
                />
              ) : (
                <Text
                  key={index}
                  x={element.x}
                  y={element.y}
                  fontSize={element.fontSize}
                  fill={element.fill}
                >
                  {element.content}
                </Text>
              )
            ))}
          </Frame>
        </Canvas>
      )}
    </div>
  );
};

export default Index;
