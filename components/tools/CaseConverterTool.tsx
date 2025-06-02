
import React, { useState, useCallback } from 'react';
import type { TabState, CaseType } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { convertCase } from '../../utils/transformers';

interface CaseConverterToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const CaseConverterTool: React.FC<CaseConverterToolProps> = ({ tabState, updateTabState }) => {
  const [caseType, setCaseType] = useState<CaseType>(tabState.options?.caseType || 'lowercase');

  const caseTypes: { value: CaseType; label: string }[] = [
    { value: 'lowercase', label: '소문자 (lowercase)' },
    { value: 'uppercase', label: '대문자 (UPPERCASE)' },
    { value: 'capitalize', label: '단어 첫 글자 대문자 (Capitalize Words)' },
    { value: 'sentence', label: '문장 첫 글자 대문자 (Sentence case.)' },
    { value: 'title', label: '제목 형식 (Title Case)' },
    { value: 'toggle', label: '대소문자 전환 (tOGGLE cASE)' },
  ];

  const handleProcess = useCallback(() => {
    if (!tabState.input) {
      updateTabState({ output: '' });
      return;
    }
    try {
      const result = convertCase(tabState.input, caseType);
      updateTabState({ output: result, options: { ...tabState.options, caseType } });
    } catch (error: any) { 
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, caseType, updateTabState, tabState.options]);

  const setInput = (input: string) => updateTabState({ input });


  return (
    <InputOutputLayout
      input={tabState.input}
      setInput={setInput}
      output={tabState.output}
      processAction={handleProcess}
      actionLabel={`${caseTypes.find(c => c.value === caseType)?.label.split(' (')[0] || caseType}(으)로 변환`}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={() => updateTabState({ input: tabState.output, output: tabState.input })}
    >
      <div className="flex flex-col space-y-1">
        <label htmlFor="case-type" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">대상 케이스:</label>
        <select
          id="case-type"
          value={caseType}
          onChange={(e) => {
            const newCase = e.target.value as CaseType;
            setCaseType(newCase);
            updateTabState({ options: { ...tabState.options, caseType: newCase } });
          }}
          className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500 min-w-[200px]"
          aria-label="대상 텍스트 케이스"
        >
          {caseTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </InputOutputLayout>
  );
};