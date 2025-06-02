
import React, { useState, useCallback } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { transformHtmlEntities } from '../../utils/transformers';

interface HtmlEntityToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const HtmlEntityTool: React.FC<HtmlEntityToolProps> = ({ tabState, updateTabState }) => {
  const [direction, setDirection] = useState<'encode' | 'decode'>(tabState.options?.direction || 'encode');

  const actionLabelMap = {
    encode: '인코딩',
    decode: '디코딩',
  };

  const handleProcess = useCallback(() => {
    if (!tabState.input.trim() && direction === 'encode') {
      updateTabState({ output: '' });
      return;
    }
    if (!tabState.input.trim() && direction === 'decode') {
        updateTabState({output: ''});
        return;
    }
    try {
      const result = transformHtmlEntities(tabState.input, direction);
      updateTabState({ output: result, options: { ...tabState.options, direction } });
    } catch (error: any) {
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, direction, updateTabState, tabState.options]);

  const handleSwap = () => {
    const newDirection = direction === 'encode' ? 'decode' : 'encode';
    setDirection(newDirection);
    updateTabState({ 
        input: tabState.output, 
        output: '', 
        options: { ...tabState.options, direction: newDirection } 
    });
  };

  const setInput = (input: string) => updateTabState({ input });

  return (
    <InputOutputLayout
      input={tabState.input}
      setInput={setInput}
      output={tabState.output}
      processAction={handleProcess}
      actionLabel={actionLabelMap[direction]}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={handleSwap}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">작업:</span>
        <div role="radiogroup" aria-label="HTML 엔티티 작업" className="flex space-x-1">
            <button
                role="radio"
                aria-checked={direction === 'encode'}
                onClick={() => { setDirection('encode'); updateTabState({ options: {...tabState.options, direction: 'encode'} }); }}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${direction === 'encode' ? 'bg-primary-500 text-white' : 'bg-secondary-200 dark:bg-secondary-600 hover:bg-secondary-300 dark:hover:bg-secondary-500 text-secondary-700 dark:text-secondary-300'}`}
            >
                {actionLabelMap.encode}
            </button>
            <button
                role="radio"
                aria-checked={direction === 'decode'}
                onClick={() => { setDirection('decode'); updateTabState({ options: {...tabState.options, direction: 'decode'} }); }}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${direction === 'decode' ? 'bg-primary-500 text-white' : 'bg-secondary-200 dark:bg-secondary-600 hover:bg-secondary-300 dark:hover:bg-secondary-500 text-secondary-700 dark:text-secondary-300'}`}
            >
                {actionLabelMap.decode}
            </button>
        </div>
      </div>
    </InputOutputLayout>
  );
};