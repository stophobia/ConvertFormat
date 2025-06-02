
import React, { useState, useCallback } from 'react';
import type { TabState } from '../../types';
import { InputOutputLayout } from '../InputOutputLayout';
import { transformJsonYaml } from '../../utils/transformers';

interface JsonYamlToolProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const JsonYamlTool: React.FC<JsonYamlToolProps> = ({ tabState, updateTabState }) => {
  const [direction, setDirection] = useState<'json_to_yaml' | 'yaml_to_json'>(tabState.options?.direction || 'json_to_yaml');

  const handleProcess = useCallback(() => {
    if (!tabState.input.trim()) {
      updateTabState({ output: '' });
      return;
    }
    try {
      const result = transformJsonYaml(tabState.input, direction);
      updateTabState({ output: result, options: { ...tabState.options, direction } });
    } catch (error: any) {
      updateTabState({ output: `오류: ${error.message}` });
    }
  }, [tabState.input, direction, updateTabState, tabState.options]);

  const handleSwap = () => {
    const newDirection = direction === 'json_to_yaml' ? 'yaml_to_json' : 'json_to_yaml';
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
      actionLabel={`${direction === 'json_to_yaml' ? 'YAML' : 'JSON'}(으)로 변환`}
      onClearInput={() => updateTabState({ input: '', output: '' })}
      onClearOutput={() => updateTabState({ output: '' })}
      onSwap={handleSwap}
      inputLabel={direction === 'json_to_yaml' ? 'JSON' : 'YAML'}
      outputLabel={direction === 'json_to_yaml' ? 'YAML' : 'JSON'}
    >
      <div className="flex items-center space-x-2">
        <label htmlFor="json-yaml-direction" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">방향:</label>
        <select
          id="json-yaml-direction"
          value={direction}
          onChange={(e) => {
            const newDir = e.target.value as 'json_to_yaml' | 'yaml_to_json';
            setDirection(newDir);
            updateTabState({ options: { ...tabState.options, direction: newDir }});
          }}
          className="bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          aria-label="변환 방향"
        >
          <option value="json_to_yaml">JSON → YAML</option>
          <option value="yaml_to_json">YAML → JSON</option>
        </select>
      </div>
    </InputOutputLayout>
  );
};