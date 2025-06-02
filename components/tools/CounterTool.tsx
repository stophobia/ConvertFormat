
import React, { useCallback, useEffect, useState } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { countText } from '../../utils/transformers';

interface CounterToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

interface Counts {
  characters: number;
  words: number;
  lines: number;
  bytes: number;
}

export const CounterTool: React.FC<CounterToolProps> = ({ tabState, updateTabState }) => {
  const [counts, setCounts] = useState<Counts>({ characters: 0, words: 0, lines: 0, bytes: 0 });

  const processInput = useCallback(() => {
    const currentCounts = countText(tabState.input);
    setCounts(currentCounts);
    const outputString = `문자: ${currentCounts.characters}\n단어: ${currentCounts.words}\n줄: ${currentCounts.lines}\n바이트: ${currentCounts.bytes}`;
    updateTabState({ output: outputString, options: { ...tabState.options, counts: currentCounts } });
  }, [tabState.input, updateTabState, tabState.options]);

  useEffect(() => {
    processInput(); 
  }, [tabState.input, processInput]);

  const setInput = (input: string) => updateTabState({ input });

  return (
    <InputOutputLayout
      input={tabState.input}
      setInput={setInput}
      output={tabState.output} 
      onClearInput={() => {
        updateTabState({ input: '', output: '' });
        setCounts({ characters: 0, words: 0, lines: 0, bytes: 0 });
      }}
      onClearOutput={() => updateTabState({ output: '' })}
    >
      <div className="w-full p-4 bg-secondary-100 dark:bg-secondary-800 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-3 text-primary-600 dark:text-primary-400">개수:</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="font-medium text-secondary-700 dark:text-secondary-300">문자:</div>
          <div className="text-secondary-900 dark:text-secondary-100" aria-live="polite">{counts.characters}</div>
          
          <div className="font-medium text-secondary-700 dark:text-secondary-300">단어:</div>
          <div className="text-secondary-900 dark:text-secondary-100" aria-live="polite">{counts.words}</div>
          
          <div className="font-medium text-secondary-700 dark:text-secondary-300">줄:</div>
          <div className="text-secondary-900 dark:text-secondary-100" aria-live="polite">{counts.lines}</div>

          <div className="font-medium text-secondary-700 dark:text-secondary-300">바이트 (UTF-8):</div>
          <div className="text-secondary-900 dark:text-secondary-100" aria-live="polite">{counts.bytes}</div>
        </div>
      </div>
    </InputOutputLayout>
  );
};