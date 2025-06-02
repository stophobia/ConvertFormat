
import React from 'react';
import type { TabState } from '../types';
import { ToolType } from '../types';

import { JsonYamlTool } from './tools/JsonYamlTool';
import { XmlJsonTool } from './tools/XmlJsonTool';
import { Base64Tool } from './tools/Base64Tool';
import { UrlEncoderDecoderTool } from './tools/UrlEncoderDecoderTool';
import { HtmlEntityTool } from './tools/HtmlEntityTool';
import { TimestampDateTool } from './tools/TimestampDateTool';
import { ColorConverterTool } from './tools/ColorConverterTool';
import { TextFormatterTool } from './tools/TextFormatterTool';
import { CaseConverterTool } from './tools/CaseConverterTool';
import { CounterTool } from './tools/CounterTool';
import { RegexTool } from './tools/RegexTool';

interface TransformationHostProps {
  tabState: TabState;
  updateTabState: (updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const TransformationHost: React.FC<TransformationHostProps> = ({ tabState, updateTabState }) => {
  const { toolType } = tabState;

  const renderTool = () => {
    switch (toolType) {
      case ToolType.JSON_YAML:
        return <JsonYamlTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.XML_JSON:
        return <XmlJsonTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.BASE64:
        return <Base64Tool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.URL_ENCODE_DECODE:
        return <UrlEncoderDecoderTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.HTML_ENTITY:
        return <HtmlEntityTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.TIMESTAMP_DATE:
        return <TimestampDateTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.COLOR_CONVERTER:
        return <ColorConverterTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.TEXT_FORMATTER:
        return <TextFormatterTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.CASE_CONVERTER:
        return <CaseConverterTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.COUNTER:
        return <CounterTool tabState={tabState} updateTabState={updateTabState} />;
      case ToolType.REGEX_TOOL:
        return <RegexTool tabState={tabState} updateTabState={updateTabState} />;
      default:
        return <div className="text-center p-8 text-secondary-600 dark:text-secondary-400">도구가 아직 구현되지 않았거나 잘못된 도구 유형입니다.</div>;
    }
  };

  return <div className="h-full w-full">{renderTool()}</div>;
};