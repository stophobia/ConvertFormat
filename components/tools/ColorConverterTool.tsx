
import React, { useState, useCallback, useEffect } from 'react';
import type { TabState, ColorState } from '../../types';
import { updateColorState, rgbToHex, hslToRgb, hexToRgb, rgbToHsl } from '../../utils/transformers';

interface ColorConverterToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

const initialColorState: ColorState = { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, hsl: { h: 0, s: 0, l: 100 } };

export const ColorConverterTool: React.FC<ColorConverterToolProps> = ({ tabState, updateTabState }) => {
  const [color, setColor] = useState<ColorState>(() => {
    if (tabState.options?.colorState) return tabState.options.colorState as ColorState;
    if (tabState.input) {
        const parsedFromInput = updateColorState(tabState.input, 'hex') || 
                                updateColorState(tabState.input, 'rgb') || 
                                updateColorState(tabState.input, 'hsl');
        if (parsedFromInput) return parsedFromInput as ColorState;
    }
    return initialColorState;
  });

  const [hexInput, setHexInput] = useState<string>(color.hex);
  const [rgbInput, setRgbInput] = useState<string>(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);
  const [hslInput, setHslInput] = useState<string>(`${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%`);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setHexInput(color.hex);
    setRgbInput(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);
    setHslInput(`${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%`);
    const outputString = `HEX: ${color.hex}\nRGB: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})\nHSL: hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    updateTabState({ 
        input: color.hex, 
        output: outputString, 
        options: { ...tabState.options, colorState: color } 
    });
  }, [color, updateTabState, tabState.options]);

  const handleColorChange = (value: string, type: 'hex' | 'rgb' | 'hsl') => {
    const newState = updateColorState(value, type);
    if (newState) {
      setColor(newState as ColorState);
      setError('');
    } else {
      setError(`잘못된 ${type.toUpperCase()} 값: ${value}`);
    }
  };

  const commonInputClasses = "w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100";

  return (
    <div className="p-4 space-y-6">
      <div
        className="w-full h-32 rounded-md border border-secondary-300 dark:border-secondary-600 shadow-inner"
        style={{ backgroundColor: color.hex }}
        aria-label={`현재 색상 미리보기: ${color.hex}`}
      ></div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="hex-input" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">HEX</label>
          <input
            id="hex-input"
            type="text"
            value={hexInput}
            onChange={(e) => {
                setHexInput(e.target.value);
                handleColorChange(e.target.value, 'hex');
            }}
            placeholder="#RRGGBB"
            className={commonInputClasses}
            aria-label="HEX 색상 코드 입력"
          />
        </div>
        <div>
          <label htmlFor="rgb-input" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">RGB</label>
          <input
            id="rgb-input"
            type="text"
            value={rgbInput}
            onChange={(e) => {
                setRgbInput(e.target.value);
                handleColorChange(e.target.value, 'rgb');
            }}
            placeholder="R, G, B (예: 255, 255, 255)"
            className={commonInputClasses}
            aria-label="RGB 색상 코드 입력"
          />
        </div>
        <div>
          <label htmlFor="hsl-input" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">HSL</label>
          <input
            id="hsl-input"
            type="text"
            value={hslInput}
            onChange={(e) => {
                setHslInput(e.target.value);
                handleColorChange(e.target.value, 'hsl');
            }}
            placeholder="H, S%, L% (예: 0, 0%, 100%)"
            className={commonInputClasses}
            aria-label="HSL 색상 코드 입력"
          />
        </div>
      </div>
       <div className="mt-4 p-4 bg-secondary-100 dark:bg-secondary-800 rounded-md shadow">
        <h4 className="text-md font-semibold mb-2 text-secondary-700 dark:text-secondary-300">변환된 값:</h4>
        <p className="text-sm text-secondary-600 dark:text-secondary-400"><strong>HEX:</strong> {color.hex}</p>
        <p className="text-sm text-secondary-600 dark:text-secondary-400"><strong>RGB:</strong> {`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`}</p>
        <p className="text-sm text-secondary-600 dark:text-secondary-400"><strong>HSL:</strong> {`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}</p>
      </div>
    </div>
  );
};