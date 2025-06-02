import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TransformationHost } from './components/TransformationHost';
import { HistoryPanel } from './components/HistoryPanel';
import { ClipboardHandler } from './components/ClipboardHandler';
import { ThemeToggle } from './components/ThemeToggle';
// Changed import: ToolType is now a value import, TabState and HistoryItem can be type imports
import { ToolType, type TabState, type HistoryItem } from './types';
import { TOOL_DEFINITIONS, DEFAULT_TOOL_TYPE, MAX_HISTORY_ITEMS } from './constants';
import { loadHistory, saveHistory } from './utils/storage';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<TabState[]>(() => {
    const savedTabsJson = localStorage.getItem('universalTransformerTabs');
    if (savedTabsJson) {
      try {
        const savedTabs = JSON.parse(savedTabsJson) as TabState[];
        if (Array.isArray(savedTabs) && savedTabs.length > 0) {
          return savedTabs.map(tab => ({
            ...tab,
            name: TOOL_DEFINITIONS.find(t => t.id === tab.toolType)?.name || '변환기'
          }));
        }
      } catch (e) {
        console.error("저장된 탭을 파싱하는데 실패했습니다:", e);
      }
    }
    const defaultToolConstant = TOOL_DEFINITIONS.find(t => t.id === DEFAULT_TOOL_TYPE) || TOOL_DEFINITIONS[0];
    let initialOptions: Record<string, any> = {};
    if (defaultToolConstant.id === ToolType.XML_JSON) {
      initialOptions = { direction: 'json_to_xml' };
    }
    return [{
      id: Date.now().toString(),
      name: defaultToolConstant.name,
      toolType: defaultToolConstant.id,
      input: '',
      output: '',
      options: initialOptions,
      lastActivity: Date.now(),
    }];
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(tabs.length > 0 ? tabs[0].id : null);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory());
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('universalTransformerTabs', JSON.stringify(tabs));
  }, [tabs]);

  const handleToolSelect = useCallback((toolType: ToolType) => {
    if (activeTabId) {
      const tool = TOOL_DEFINITIONS.find(t => t.id === toolType) || TOOL_DEFINITIONS[0];
      let initialOptions: Record<string, any> = {};
      if (toolType === ToolType.XML_JSON) {
        initialOptions = { direction: 'json_to_xml' };
      }
      
      updateTabState(activeTabId, { 
        toolType, 
        name: tool.name, 
        input: '', 
        output: '',
        options: initialOptions,
        lastActivity: Date.now() 
      });
    } else {
      const defaultToolConstant = TOOL_DEFINITIONS.find(t => t.id === toolType) || TOOL_DEFINITIONS[0];
      let initialOptions: Record<string, any> = {};
      if (defaultToolConstant.id === ToolType.XML_JSON) {
        initialOptions = { direction: 'json_to_xml' };
      }
      
      const newTab: TabState = {
        id: Date.now().toString(),
        name: defaultToolConstant.name,
        toolType: defaultToolConstant.id,
        input: '',
        output: '',
        options: initialOptions,
        lastActivity: Date.now(),
      };
      
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [activeTabId]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      if (newTabs.length === 0) {
        const defaultToolConstant = TOOL_DEFINITIONS.find(t => t.id === DEFAULT_TOOL_TYPE) || TOOL_DEFINITIONS[0];
        let initialOptions: Record<string, any> = {};
        if (defaultToolConstant.id === ToolType.XML_JSON) {
          initialOptions = { direction: 'json_to_xml' };
        }
        const lastTab: TabState = {
          id: Date.now().toString(),
          name: defaultToolConstant.name,
          toolType: defaultToolConstant.id,
          input: '',
          output: '',
          options: initialOptions,
          lastActivity: Date.now(),
        };
        setActiveTabId(lastTab.id);
        return [lastTab];
      }
      if (activeTabId === tabId) {
        setActiveTabId(newTabs[0]?.id || null);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const updateTabState = useCallback((tabId: string, updates: Partial<Omit<TabState, 'id'>>) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, ...updates, name: updates.name || tab.name, lastActivity: Date.now() } : tab
      )
    );
    if(updates.output !== undefined && updates.input !== undefined && updates.toolType !== undefined) {
       addToHistory({
        toolType: updates.toolType!,
        input: updates.input!,
        output: updates.output!,
        options: updates.options,
      });
    }
  }, []);

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory(prevHistory => {
      const newHistory = [
        { ...item, id: Date.now().toString(), timestamp: Date.now() },
        ...prevHistory,
      ].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(newHistory);
      return newHistory;
    });
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    const currentTab = tabs.find(t => t.id === activeTabId);
    const toolName = TOOL_DEFINITIONS.find(t => t.id === item.toolType)?.name || '변환기';
    if (currentTab) {
      updateTabState(currentTab.id, {
        toolType: item.toolType,
        name: toolName,
        input: item.input,
        output: item.output,
        options: item.options || {},
      });
    } else {
      const newTab: TabState = {
        id: Date.now().toString(),
        name: toolName,
        toolType: item.toolType,
        input: item.input,
        output: item.output,
        options: item.options || {},
        lastActivity: Date.now(),
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
    setIsHistoryPanelOpen(false);
  }, [tabs, activeTabId, updateTabState]);

  const activeTabData = tabs.find(tab => tab.id === activeTabId);

  const handleClipboardSuggestion = useCallback((toolType: ToolType, content: string) => {
    const tool = TOOL_DEFINITIONS.find(t=>t.id === toolType);
    const toolName = tool?.name || '알 수 없는 도구';
    if (confirm(`붙여넣은 콘텐츠는 '${toolName}' 도구와 함께 사용할 수 있을 것 같습니다. 이 도구로 전환하고 콘텐츠를 입력으로 사용하시겠습니까?`)) {
      const newToolName = tool?.name || '변환기';
      let suggestedOptions: Record<string, any> = {};
      if (toolType === ToolType.XML_JSON) { // If suggesting XML_JSON, default to appropriate direction
        try {
          JSON.parse(content);
          suggestedOptions = { direction: 'json_to_xml' };
        } catch (e) {
          suggestedOptions = { direction: 'xml_to_json' };
        }
      }

      if (activeTabId) {
        updateTabState(activeTabId, { toolType, input: content, name: newToolName, options: suggestedOptions });
      } else {
        const newTab: TabState = {
          id: Date.now().toString(),
          name: newToolName,
          toolType,
          input: content,
          output: '',
          options: suggestedOptions,
          lastActivity: Date.now(),
        };
        setTabs([newTab]);
        setActiveTabId(newTab.id);
      }
    }
  }, [activeTabId, updateTabState]);

  return (
    <div className="flex h-screen antialiased text-secondary-800 dark:text-secondary-200 bg-secondary-100 dark:bg-secondary-900">
      <ClipboardHandler onSuggestion={handleClipboardSuggestion} />
      {isSidebarOpen && <Sidebar onSelectTool={handleToolSelect} activeTool={activeTabData?.toolType} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-secondary-800 p-3 shadow flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-700 mr-2 lg:hidden"
              aria-label="사이드바 토글"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">데이터 변환기</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} 
              className="p-2 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-700"
              aria-label="기록 토글"
            >
              <i className="fas fa-history"></i>
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary-50 dark:bg-secondary-800/50">
          {activeTabData ? (
            <TransformationHost
              key={activeTabData.id}
              tabState={activeTabData}
              updateTabState={(updates) => updateTabState(activeTabData.id, updates)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className="fas fa-tools text-6xl text-secondary-400 dark:text-secondary-600 mb-4"></i>
                <p className="text-xl text-secondary-600 dark:text-secondary-400">활성 탭이 없습니다. 사이드바에서 도구를 선택하세요.</p>
              </div>
            </div>
          )}
        </main>
      </div>
      {isHistoryPanelOpen && (
        <HistoryPanel
          history={history}
          onLoadHistoryItem={loadFromHistory}
          onClearHistory={() => { setHistory([]); saveHistory([]); }}
          onClose={() => setIsHistoryPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
