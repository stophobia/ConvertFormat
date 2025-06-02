import { ToolType, ToolCategory, ToolDefinition } from './types';

export const MAX_TABS = 10;
export const MAX_HISTORY_ITEMS = 50;

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  { id: ToolType.JSON_YAML, name: 'JSON <> YAML', category: ToolCategory.DATA_CONVERSION, icon: 'fa-solid fa-file-code', description: 'JSON과 YAML 형식 간에 변환합니다.' },
  { id: ToolType.XML_JSON, name: 'JSON <> XML', category: ToolCategory.DATA_CONVERSION, icon: 'fa-solid fa-file-invoice', description: 'XML과 JSON 형식 간에 변환합니다.' },
  { id: ToolType.BASE64, name: 'Base64 인코더/디코더', category: ToolCategory.WEB, icon: 'fa-solid fa-shield-alt', description: 'Base64로 인코딩하거나 디코딩합니다.' },
  { id: ToolType.URL_ENCODE_DECODE, name: 'URL 인코더/디코더', category: ToolCategory.WEB, icon: 'fa-solid fa-link', description: 'URL 구성 요소를 인코딩하거나 디코딩합니다.' },
  { id: ToolType.HTML_ENTITY, name: 'HTML 엔티티 인코더/디코더', category: ToolCategory.WEB, icon: 'fa-solid fa-code', description: 'HTML 엔티티를 인코딩/디코딩합니다.' },
  { id: ToolType.TIMESTAMP_DATE, name: '타임스탬프 <> 날짜/시간', category: ToolCategory.DEVELOPER, icon: 'fa-solid fa-clock', description: 'Unix 타임스탬프를 사람이 읽을 수 있는 날짜로 또는 그 반대로 변환합니다.' },
  { id: ToolType.COLOR_CONVERTER, name: '색상 변환기', category: ToolCategory.DEVELOPER, icon: 'fa-solid fa-palette', description: 'Hex, RGB, HSL 색상 코드 간에 변환합니다.' },
  { id: ToolType.TEXT_FORMATTER, name: '텍스트 포맷터', category: ToolCategory.TEXT_MANIPULATION, icon: 'fa-solid fa-align-left', description: '텍스트 서식 지정: 들여쓰기, 축소, 줄 정렬, 중복 제거.' },
  { id: ToolType.CASE_CONVERTER, name: '대소문자 변환기', category: ToolCategory.TEXT_MANIPULATION, icon: 'fa-solid fa-font', description: '텍스트 대소문자 변경 (대문자, 소문자 등).' },
  { id: ToolType.COUNTER, name: '카운터', category: ToolCategory.TEXT_MANIPULATION, icon: 'fa-solid fa-calculator', description: '문자, 단어, 줄 수를 계산합니다.' },
  { id: ToolType.REGEX_TOOL, name: '정규식 테스터/리플레이서', category: ToolCategory.TEXT_MANIPULATION, icon: 'fa-solid fa-magnifying-glass-plus', description: '정규식을 테스트하고 대체를 수행합니다.' },
];

export const DEFAULT_TOOL_TYPE = ToolType.XML_JSON; // 변경됨: JSON_YAML에서 XML_JSON으로

export const TIMESTAMP_FORMATS: { label: string; value: string }[] = [
  { label: 'ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)', value: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx" },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
  { label: 'MM/DD/YYYY HH:mm:ss', value: 'MM/dd/yyyy HH:mm:ss' },
  { label: '요일, 월 DD, YYYY HH:mm', value: 'EEEE, MMMM dd, yyyy HH:mm' },
  { label: 'Unix 타임스탬프 (초)', value: 'unix_seconds' },
  { label: 'Unix 타임스탬프 (밀리초)', value: 'unix_milliseconds' },
];