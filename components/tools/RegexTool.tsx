
import React, { useState, useCallback } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { applyRegex } from '../../utils/transformers';

interface RegexToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const RegexTool: React.FC<RegexToolProps> = ({ tabState, updateTabState }) => {
  const [pattern, setPattern] = useState<string>(tabState.options?.pattern || '');
  const [flags, setFlags] = useState<string>(tabState.options?.flags || 'g');
  const [replacement, setReplacement] = useState<string>(tabState.options?.replacement || '');
  const [action, setAction] = useState<'find' | 'replace'>(tabState.options?.regexAction || 'find');
  const [matchOutput, setMatchOutput] = useState<string>(''); 

  const handleProcess = useCallback(() => {
    if (!tabState.input) {
      updateTabState({ output: '' });
      setMatchOutput('');
      return;
    }
    if (!pattern) {
      const errorMsg = '오류: 정규식 패턴은 비워둘 수 없습니다.';
      if (action === 'replace') updateTabState({ output: errorMsg });
      else setMatchOutput(errorMsg);
      return;
    }
    try {
      const result = applyRegex(tabState.input, pattern, flags, replacement, action);
      if (action === 'find') {
        const matches = result as RegExpMatchArray[];
        const formattedMatches = matches.map((match, index) => 
          `일치 ${index + 1}:\n전체 일치: ${match[0]}\n${match.groups ? '그룹: ' + JSON.stringify(match.groups) + '\n' : ''}인덱스: ${match.index}`
        ).join('\n\n');
        setMatchOutput(matches.length > 0 ? formattedMatches : '일치하는 항목이 없습니다.');
        // Output field in InputOutputLayout is used for matchOutput when action is find
        // updateTabState options to save current settings
        updateTabState({ options: { ...tabState.options, pattern, flags, replacement, regexAction: action } });
      } else { // replace
        updateTabState({ output: result as string, options: { ...tabState.options, pattern, flags, replacement, regexAction: action } });
        setMatchOutput(''); 
      }
    } catch (error: any) {
      const errorMsg = `오류: ${error.message}`;
       if (action === 'replace') updateTabState({ output: errorMsg });
       else setMatchOutput(errorMsg);
    }
  }, [tabState.input, pattern, flags, replacement, action, updateTabState, tabState.options]);

  const setInput = (input: string) => updateTabState({ input });
  
  const commonInputClass = "w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100";

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="regex-pattern" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">정규식 패턴</label>
          <input id="regex-pattern" type="text" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="/패턴/" className={commonInputClass} aria-label="정규식 패턴"/>
        </div>
        <div>
          <label htmlFor="regex-flags" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">플래그 (예: gi)</label>
          <input id="regex-flags" type="text" value={flags} onChange={e => setFlags(e.target.value)} placeholder="g" className={commonInputClass} aria-label="정규식 플래그"/>
        </div>
        <div>
          <label htmlFor="regex-replacement" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">대체 문자열 (바꾸기 작업용)</label>
          <input id="regex-replacement" type="text" value={replacement} onChange={e => setReplacement(e.target.value)} placeholder="$1" className={commonInputClass} disabled={action === 'find'} aria-label="정규식 대체 문자열"/>
        </div>
      </div>

      <InputOutputLayout
        input={tabState.input}
        setInput={setInput}
        output={action === 'replace' ? tabState.output : matchOutput}
        processAction={handleProcess}
        actionLabel={action === 'find' ? '일치하는 항목 찾기' : '모두 바꾸기'}
        onClearInput={() => {
            updateTabState({ input: '', output: '' });
            setMatchOutput('');
        }}
        onClearOutput={() => {
            if (action === 'replace') updateTabState({ output: '' });
            setMatchOutput('');
        }}
        inputLabel="텍스트 입력"
        outputLabel={action === 'find' ? '일치 결과' : '바꾸기 후 결과'}
      >
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">작업:</span>
            <div role="radiogroup" aria-label="정규식 작업" className="flex space-x-1">
                <button
                    role="radio"
                    aria-checked={action === 'find'}
                    onClick={() => setAction('find')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${action === 'find' ? 'bg-primary-500 text-white' : 'bg-secondary-200 dark:bg-secondary-600 hover:bg-secondary-300 dark:hover:bg-secondary-500 text-secondary-700 dark:text-secondary-300'}`}
                >
                    찾기
                </button>
                <button
                    role="radio"
                    aria-checked={action === 'replace'}
                    onClick={() => setAction('replace')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${action === 'replace' ? 'bg-primary-500 text-white' : 'bg-secondary-200 dark:bg-secondary-600 hover:bg-secondary-300 dark:hover:bg-secondary-500 text-secondary-700 dark:text-secondary-300'}`}
                >
                    바꾸기
                </button>
            </div>
        </div>
      </InputOutputLayout>
    </div>
  );
};