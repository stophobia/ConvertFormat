
import React from 'react';
import type { ToolType, ToolDefinition } from '../types';
import { ToolCategory } from '../types';
import { TOOL_DEFINITIONS } from '../constants';

interface SidebarProps {
  onSelectTool: (toolType: ToolType) => void;
  activeTool?: ToolType;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectTool, activeTool }) => {
  const categorizedTools = TOOL_DEFINITIONS.reduce((acc, tool) => {
    const category = tool.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, ToolDefinition[]>);

  return (
    <aside className="w-64 bg-white dark:bg-secondary-800 p-4 space-y-6 overflow-y-auto shadow-lg flex-shrink-0">
      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-6 text-center">도구</div>
      {Object.entries(categorizedTools).map(([category, tools]) => (
        <div key={category}>
          <h3 className="text-xs uppercase font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-2">{category}</h3>
          <ul className="space-y-1">
            {tools.map((tool) => (
              <li key={tool.id}>
                <button
                  onClick={() => onSelectTool(tool.id)}
                  title={tool.description}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${activeTool === tool.id 
                      ? 'bg-primary-500 text-white dark:bg-primary-600' 
                      : 'hover:bg-primary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
                    }`}
                >
                  <i className={`${tool.icon} w-5 h-5`}></i>
                  <span>{tool.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};