
// Declare CDN globals

interface JsYaml {
  load: (str: string, opts?: any) => any;
  dump: (obj: any, opts?: any) => string;
}

interface XmlJs {
  xml2json: (xml: string, opts?: any) => string;
  json2xml: (json: string, opts?: any) => string;
  xml2js: (xml: string, opts?: any) => any;
  js2xml: (js: any, opts?: any) => string;
}

interface DateFns {
  format: (date: Date | number, format: string, opts?: any) => string;
  parse: (dateString: string, formatString: string, referenceDate: Date, opts?: any) => Date;
  fromUnixTime: (unixTimestamp: number) => Date;
  getUnixTime: (date: Date | number) => number;
  isValid: (date: any) => boolean;
}

declare global {
  interface Window {
    jsyaml: JsYaml;
    xmljs: XmlJs;
    dateFns: DateFns;
  }
}

export enum ToolCategory {
  DATA_CONVERSION = '데이터 변환',
  TEXT_MANIPULATION = '텍스트 조작',
  WEB = '웹 유틸리티',
  DEVELOPER = '개발자 유틸리티',
}

export enum ToolType {
  JSON_YAML = 'json_yaml',
  XML_JSON = 'xml_json',
  BASE64 = 'base64',
  URL_ENCODE_DECODE = 'url_encode_decode',
  HTML_ENTITY = 'html_entity',
  TIMESTAMP_DATE = 'timestamp_date',
  COLOR_CONVERTER = 'color_converter',
  TEXT_FORMATTER = 'text_formatter', // Indent, prettify, minify, line ops
  CASE_CONVERTER = 'case_converter',
  COUNTER = 'counter',
  REGEX_TOOL = 'regex_tool',
}

export interface ToolDefinition {
  id: ToolType;
  name: string;
  category: ToolCategory;
  icon: string; // FontAwesome class e.g. 'fa-solid fa-code'
  description: string;
}

export interface TabState {
  id: string;
  name: string;
  toolType: ToolType;
  input: string;
  output: string;
  options: Record<string, any>;
  lastActivity: number; // Timestamp for sorting/closing inactive tabs
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  toolType: ToolType;
  input: string;
  output: string;
  options?: Record<string, any>;
}

export type ConversionDirection = 'encode' | 'decode' | 'json_to_yaml' | 'yaml_to_json' | 'xml_to_json' | 'json_to_xml';
export type CaseType = 'lowercase' | 'uppercase' | 'capitalize' | 'sentence' | 'title' | 'toggle';

export interface ColorState {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}