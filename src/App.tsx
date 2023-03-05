import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import rough from 'roughjs';
import getStroke from 'perfect-freehand';
import './App.css';
import { Stack } from '@mantine/core';
import { NumberInput } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import { Radio } from '@mantine/core';
import { Group } from '@mantine/core';
import { Textarea } from '@mantine/core';

const App = () => {
  const canvaRef: any = useRef(null);
  const contextRef: any = useRef(null);
  const [toolType, setToolType] = useState('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState<number | ''>(3);
  const [strokeColor, setStrokeColor] = useState('#000');
  useEffect(() => {
    const canva: any = canvaRef.current;
    canva.width = window.innerWidth * 2;
    canva.height = window.innerHeight * 2;
    canva.style.width = `${window.innerWidth}px`;
    canva.style.height = `${window.innerHeight}px`;

    const context = canva.getContext('2d');
    context.scale(2, 2);
    console.log(canva);
    context.linecap = 'round';
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    contextRef.current.lineWidth = strokeWidth;
    console.log({ contextRef });
  }, [strokeWidth]);

  useEffect(() => {
    contextRef.current.strokeStyle = strokeColor;
  }, [strokeColor]);

  const handleMouseDown = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = ({ nativeEvent }: any) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleMouseUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="App">
      <Stack className="options">
        {/* <label>stroke Width:</label> */}
        <Radio.Group name="tool" value={toolType} onChange={setToolType}>
          <Group mt="xs">
            <Radio value="draw" label="Draw" />
            <Radio value="write" label="write" />
          </Group>
        </Radio.Group>
        <NumberInput label="Stroke Width ✒:" value={strokeWidth} onChange={setStrokeWidth} defaultValue={3} min={1} />

        <ColorInput label="Pick stroke color 🎨" defaultValue="#000000" value={strokeColor} onChange={setStrokeColor} />
        {toolType === 'write' && <Textarea placeholder="Write something..." minRows={1} autosize />}
      </Stack>
      <canvas
        id="canvas"
        ref={canvaRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default App;
