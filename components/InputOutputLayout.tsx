
import React, { useState } from 'react';

interface InputOutputLayoutProps {
  input: string;
  setInput: (value: string) => void;
  output: string;
  processAction?: () => void;
  actionLabel?: string;
  onClearInput?: () => void;
  onClearOutput?: () => void;
  onCopyInput?: () => void;
  onCopyOutput?: () => void;
  onSwap?: () => void;
  children?: React.ReactNode; // For additional controls specific to the tool
  inputLabel?: string;
  outputLabel?: string;
  isLoading?: boolean;
}

export const InputOutputLayout: React.FC<InputOutputLayoutProps> = ({
  input,
  setInput,
  output,
  processAction,
  actionLabel = '처리',
  onClearInput,
  onClearOutput,
  onCopyInput,
  onCopyOutput,
  onSwap,
  children,
  inputLabel = '입력',
  outputLabel = '출력',
  isLoading = false,
}) => {
  const [inputCopied, setInputCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);

  const handleCopy = async (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!navigator.clipboard) {
      alert('클립보드 API를 사용할 수 없습니다.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패: ', err);
      alert('텍스트 복사에 실패했습니다.');
    }
  };
  
  const commonTextareaClasses = "w-full h-64 p-3 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 resize-y";

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-textarea" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">{inputLabel}</label>
            <div className="space-x-2">
              {onCopyInput && (
                <button onClick={() => handleCopy(input, setInputCopied)} title="입력 복사" className="text-xs px-2 py-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-600">
                  <i className={`fas ${inputCopied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                </button>
              )}
              {onClearInput && (
                <button onClick={onClearInput} title="입력 지우기" className="text-xs px-2 py-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-600">
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>
          <textarea
            id="input-textarea"
            className={commonTextareaClasses}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${inputLabel.toLowerCase()}를 여기에 입력하세요...`}
            aria-label={inputLabel}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="output-textarea" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">{outputLabel}</label>
             <div className="space-x-2">
              {onCopyOutput && (
                <button onClick={() => handleCopy(output, setOutputCopied)} title="출력 복사" className="text-xs px-2 py-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-600">
                   <i className={`fas ${outputCopied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                </button>
              )}
              {onClearOutput && (
                <button onClick={onClearOutput} title="출력 지우기" className="text-xs px-2 py-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-600">
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>
          <textarea
            id="output-textarea"
            className={commonTextareaClasses}
            value={output}
            readOnly
            placeholder={`${outputLabel}이(가) 여기에 표시됩니다...`}
            aria-label={outputLabel}
          />
        </div>
      </div>

      {(children || processAction || onSwap) && (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-secondary-100 dark:bg-secondary-800 rounded-md shadow">
          {children}
          {onSwap && (
            <button
              onClick={onSwap}
              className="px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50 dark:hover:bg-primary-700/30 transition-colors flex items-center space-x-2"
              title="입력과 출력 바꾸기"
            >
              <i className="fas fa-exchange-alt"></i>
              <span>바꾸기</span>
            </button>
          )}
          {processAction && (
            <button
              onClick={processAction}
              disabled={isLoading}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-cogs"></i>
              )}
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};