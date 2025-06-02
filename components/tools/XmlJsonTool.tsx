
import React, { useState, useCallback } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { transformXmlJson } from '../../utils/transformers';

interface XmlJsonToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const XmlJsonTool: React.FC<XmlJsonToolProps> = ({ tabState, updateTabState }) => {
  const [direction, setDirection] = useState<'xml_to_json' | 'json_to_xml'>(tabState.options?.direction || 'xml_to_json');

  const handleProcess = useCallback(() => {
    if (!tabState.input.trim()) {
      updateTabState({ output: '' });
      return;
    }
    try {
      const result = transformXmlJson(tabState.input, direction);
      updateTabState({ output: result, options: { ...tabState.options, direction } });
    } catch (error: any) {
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, direction, updateTabState, tabState.options]);

  const handleSwap = () => {
    const newDirection = direction === 'xml_to_json' ? 'json_to_xml' : 'xml_to_json';
    setDirection(newDirection);
    updateTabState({ 
        input: tabState.output, 
        output: tabState.input, 
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
      actionLabel={`${direction === 'xml_to_json' ? 'JSON' : 'XML'}(으)로 변환`}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={handleSwap}
      inputLabel={direction === 'xml_to_json' ? 'XML' : 'JSON'}
      outputLabel={direction === 'xml_to_json' ? 'JSON' : 'XML'}
    >
      <div className="flex items-center space-x-2">
        <label htmlFor="xml-json-direction" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">방향:</label>
        <select
          id="xml-json-direction"
          value={direction}
          onChange={(e) => {
            const newDir = e.target.value as 'xml_to_json' | 'json_to_xml';
            setDirection(newDir);
            updateTabState({ options: { ...tabState.options, direction: newDir } });
          }}
          className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          aria-label="변환 방향"
        >
          <option value="xml_to_json">XML → JSON</option>
          <option value="json_to_xml">JSON → XML</option>
        </select>
      </div>
    </InputOutputLayout>
  );
};