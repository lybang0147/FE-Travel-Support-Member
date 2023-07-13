import React, { useState, useEffect } from 'react';
import ReactInputRange, { Range } from 'react-input-range';
import 'react-input-range/lib/css/index.css';


interface MoneyRangePickerProps {
  selectedRange: { min: number; max: number };
  onRangeChange: (value: { min: number; max: number }) => void;
}

const MoneyRangePicker: React.FC<MoneyRangePickerProps> = ({ selectedRange, onRangeChange }) => {
  const [minValue, setMinValue] = useState(selectedRange.min);
  const [maxValue, setMaxValue] = useState(selectedRange.max);


  const handleRangeChange = (value: number | Range) => {
    if (typeof value === 'object') {
      const { min, max } = value as Range;
      setMinValue(min);
      setMaxValue(max);
      onRangeChange({ min: min,max: max})
    }
  };
  
  const handleMinValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); 
    const newMinValue = Math.min(Number(sanitizedInput), maxValue); 
    setMinValue(newMinValue);
    onRangeChange({ min: newMinValue, max: maxValue });
  };

  const handleMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); 
    const newMaxValue = Math.min(Number(sanitizedInput), 20000000); 
    const newMinValue = Math.min(newMaxValue, minValue); 
    setMaxValue(newMaxValue);
    setMinValue(newMinValue);
    onRangeChange({ min: newMinValue, max: newMaxValue });
  };
  return (
    <div className="xl:w-[780px] 2xl:w-[500px] flex-shrink-0 xl:px-8 ">
      <div className="relative">
        <label htmlFor="moneyRange" className="text-lg text-gray-600">
          Khoảng giá
        </label>
        <div className="mt-3" style={{ width: '100%' }}>
          <div className="flex items-center space-x-2">
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-32"
              value={minValue}
              onChange={handleMinValueChange}
            />
            <span className="text-gray-600">-</span>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-32"
              value={maxValue}
              onChange={handleMaxValueChange}
            />
          </div>
          <div className="mt-4">
          <ReactInputRange
            minValue={0}
            maxValue={20000000}
            step = {500000}
            value={{ min: minValue, max: maxValue }}
            onChange={handleRangeChange}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyRangePicker;
