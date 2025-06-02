
import React, { useState, useCallback } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { formatText } from '../../utils/transformers';

type FormatAction = 'prettify_json' | 'minify_json' | 'prettify_xml' | 'minify_xml' | 'indent' | 'outdent' | 'remove_line_breaks' | 'one_liner' | 'sort_asc' | 'sort_desc' | 'remove_duplicates' | 'trim_lines';

interface TextFormatterToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const TextFormatterTool: React.FC<TextFormatterToolProps> = ({ tabState, updateTabState }) => {
  const [action, setAction] = useState<FormatAction>(tabState.options?.action || 'prettify_json');
  const [indentSize, setIndentSize] = useState<number>(tabState.options?.indentSize || 2);

  const actions: { value: FormatAction; label: string }[] = [
    { value: 'prettify_json', label: 'JSON 예쁘게 만들기' },
    { value: 'minify_json', label: 'JSON 축소' },
    { value: 'prettify_xml', label: 'XML 예쁘게 만들기' },
    { value: 'minify_xml', label: 'XML 축소' },
    { value: 'indent', label: '줄 들여쓰기' },
    { value: 'outdent', label: '줄 내어쓰기' },
    { value: 'remove_line_breaks', label: '줄 바꿈 제거' },
    { value: 'one_liner', label: '한 줄로 만들기 (공백 제거)' },
    { value: 'sort_asc', label: '줄 정렬 (오름차순)' },
    { value: 'sort_desc', label: '줄 정렬 (내림차순)' },
    { value: 'remove_duplicates', label: '중복 줄 제거' },
    { value: 'trim_lines', label: '각 줄 공백 제거' },
  ];

  const handleProcess = useCallback(() => {
    if (!tabState.input && action !== 'remove_line_breaks' && action !== 'one_liner' && action !== 'trim_lines') { // Some actions might process empty string
      // updateTabState({ output: '' });
      return;
    }
    try {
      const result = formatText(tabState.input, action, { indentSize });
      updateTabState({ output: result, options: { ...tabState.options, action, indentSize } });
    } catch (error: any) {
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, action, indentSize, updateTabState, tabState.options]);

  const setInput = (input: string) => updateTabState({ input });


  return (
    <InputOutputLayout
      input={tabState.input}
      setInput={setInput}
      output={tabState.output}
      processAction={handleProcess}
      actionLabel={`적용: ${actions.find(a=>a.value === action)?.label || action }`}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={() => updateTabState({ input: tabState.output, output: tabState.input })}
    >
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex flex-col space-y-1">
          <label htmlFor="format-action" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">작업:</label>
          <select
            id="format-action"
            value={action}
            onChange={(e) => {
                const newAction = e.target.value as FormatAction;
                setAction(newAction);
                updateTabState({ options: { ...tabState.options, action: newAction, indentSize }});
            }}
            className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            aria-label="서식 작업"
          >
            {actions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {(action.includes('indent') || action.includes('prettify')) && (
          <div className="flex flex-col space-y-1">
            <label htmlFor="indent-size" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">들여쓰기 크기:</label>
            <input
              id="indent-size"
              type="number"
              min="0"
              max="16"
              value={indentSize}
              onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  setIndentSize(newSize);
                  updateTabState({ options: { ...tabState.options, action, indentSize: newSize }});
              }}
              className="w-20 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              aria-label="들여쓰기 크기"
            />
          </div>
        )}
      </div>
    </InputOutputLayout>
  );
};