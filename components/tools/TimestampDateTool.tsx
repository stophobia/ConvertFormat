
import React, { useState, useCallback, useEffect } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { transformTimestampDate } from '../../utils/transformers';
import { TIMESTAMP_FORMATS } from '../../constants';

interface TimestampDateToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const TimestampDateTool: React.FC<TimestampDateToolProps> = ({ tabState, updateTabState }) => {
  const [conversionType, setConversionType] = useState<'date' | 'timestamp'>(tabState.options?.conversionType || 'date'); // 'date' means input is timestamp, output is date
  const [selectedFormat, setSelectedFormat] = useState<string>(tabState.options?.format || TIMESTAMP_FORMATS[0].value);

  const handleProcess = useCallback(() => {
    if (!tabState.input.trim()) {
      updateTabState({ output: '' });
      return;
    }
    try {
      const result = transformTimestampDate(tabState.input, conversionType, selectedFormat);
      updateTabState({ output: result, options: { ...tabState.options, conversionType, format: selectedFormat } });
    } catch (error: any) {
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, conversionType, selectedFormat, updateTabState, tabState.options]);
  
  useEffect(() => {
    if (tabState.input) {
        handleProcess();
    } else {
        updateTabState({output: ''}); // Clear output if input is cleared
    }
  }, [tabState.input, conversionType, selectedFormat, handleProcess]); // handleProcess dependency added


  const handleSwap = () => {
    const newConversionType = conversionType === 'date' ? 'timestamp' : 'date';
    setConversionType(newConversionType);
    updateTabState({ 
        input: tabState.output, 
        output: tabState.input,
        options: { ...tabState.options, conversionType: newConversionType, format: selectedFormat } 
    });
  };
  
  const setInput = (input: string) => updateTabState({ input });

  return (
    <InputOutputLayout
      input={tabState.input}
      setInput={setInput}
      output={tabState.output}
      // processAction={handleProcess} // Auto-processes via useEffect
      actionLabel={`변환: ${conversionType === 'date' ? '날짜/시간' : '타임스탬프'}`}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={handleSwap}
      inputLabel={conversionType === 'date' ? '타임스탬프' : '날짜/시간 문자열'}
      outputLabel={conversionType === 'date' ? '날짜/시간 문자열' : '타임스탬프'}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col space-y-1">
          <label htmlFor="conversion-type" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">변환:</label>
          <select
            id="conversion-type"
            value={conversionType}
            onChange={(e) => {
              const newType = e.target.value as 'date' | 'timestamp';
              setConversionType(newType);
            }}
            className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            aria-label="변환 유형"
          >
            <option value="date">타임스탬프 → 날짜/시간</option>
            <option value="timestamp">날짜/시간 → 타임스탬프</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="date-format" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {conversionType === 'date' ? '출력 날짜 형식:' : '입력 날짜 형식 / 출력 타임스탬프 유형:'}
          </label>
          <select
            id="date-format"
            value={selectedFormat}
            onChange={(e) => {
              setSelectedFormat(e.target.value);
            }}
            className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            aria-label="날짜 형식 또는 타임스탬프 유형"
          >
            {TIMESTAMP_FORMATS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>
    </InputOutputLayout>
  );
};