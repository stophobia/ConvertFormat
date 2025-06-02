import type { ColorState, ConversionDirection, CaseType } from '../types';

// JSON <-> YAML
export const transformJsonYaml = (input: string, direction: 'json_to_yaml' | 'yaml_to_json'): string => {
  if (!window.jsyaml || typeof window.jsyaml.load !== 'function' || typeof window.jsyaml.dump !== 'function') {
    throw new Error('YAML 라이브러리(js-yaml)가 로드되지 않았습니다. 페이지를 새로고침하거나 네트워크 연결을 확인하세요.');
  }
  try {
    if (direction === 'json_to_yaml') {
      const obj = JSON.parse(input);
      return window.jsyaml.dump(obj, { indent: 2 });
    } else { // yaml_to_json
      const obj = window.jsyaml.load(input);
      return JSON.stringify(obj, null, 2);
    }
  } catch (e: any) {
    if (direction === 'json_to_yaml' && e instanceof SyntaxError) {
      throw new Error('잘못된 JSON 형식입니다.');
    } else if (direction === 'yaml_to_json' && typeof e.message === 'string' && e.message.toLowerCase().includes('yaml')) { 
      throw new Error('잘못된 YAML 형식입니다.');
    }
    throw new Error('변환 중 오류가 발생했습니다: ' + e.message);
  }
};

// XML <-> JSON
export const transformXmlJson = (input: string, direction: 'xml_to_json' | 'json_to_xml'): string => {
  if (!window.xmljs || typeof window.xmljs.js2xml !== 'function' || typeof window.xmljs.xml2json !== 'function') {
    throw new Error('XML 라이브러리(xml-js)가 로드되지 않았습니다. 페이지를 새로고침하거나 네트워크 연결을 확인하세요.');
  }
  if (direction === 'json_to_xml') {
    let parsedJs: any;
    try {
      parsedJs = JSON.parse(input);
    } catch (e: any) {
      throw new Error('잘못된 JSON 형식입니다. 입력이 유효한 JSON인지 확인해주세요.');
    }

    let objectToConvert: any;
    if (Array.isArray(parsedJs)) {
      objectToConvert = { "root": { "item": parsedJs } };
    } else if (typeof parsedJs === 'object' && parsedJs !== null) {
      objectToConvert = { "root": parsedJs };
    } else {
      objectToConvert = { "root": { "_text": String(parsedJs) } };
    }

    try {
      return window.xmljs.js2xml(objectToConvert, { compact: true, spaces: 2 });
    } catch (e: any) {
      console.error("Error in js2xml:", e, "Input object to js2xml:", JSON.stringify(objectToConvert));
      throw new Error('JSON을 XML로 변환하는 중 내부 오류가 발생했습니다. 변환기가 이 JSON 구조를 처리하지 못할 수 있습니다.');
    }
  } else { // xml_to_json
    try {
      return window.xmljs.xml2json(input, { compact: true, spaces: 2 });
    } catch (e: any) {
      throw new Error('잘못된 XML 형식입니다. 입력이 유효한 XML인지 확인해주세요.');
    }
  }
};

// Base64
export const transformBase64 = (input: string, direction: 'encode' | 'decode', encoding: string = 'utf-8'): string => {
  try {
    if (direction === 'encode') {
      if (typeof TextEncoder !== 'undefined') { 
          const encoder = new TextEncoder(); 
          const data = encoder.encode(input);
          let binary = '';
          data.forEach(byte => binary += String.fromCharCode(byte));
          return btoa(binary);
      } else { 
          return btoa(unescape(encodeURIComponent(input))); 
      }
    } else {
      if (typeof TextDecoder !== 'undefined') {
          const binary = atob(input);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
          }
          const decoder = new TextDecoder(encoding);
          return decoder.decode(bytes);
      } else { 
          return decodeURIComponent(escape(atob(input)));
      }
    }
  } catch (e: any) {
    throw new Error('Base64 처리 중 오류: ' + e.message);
  }
};

// URL Encode/Decode
export const transformUrl = (input: string, direction: 'encode' | 'decode'): string => {
  try {
    if (direction === 'encode') {
      return encodeURIComponent(input);
    } else {
      return decodeURIComponent(input);
    }
  } catch (e: any) {
    throw new Error('URL 처리 중 오류: ' + e.message);
  }
};

// HTML Entity Encode/Decode
export const transformHtmlEntities = (input: string, direction: 'encode' | 'decode'): string => {
  const textarea = document.createElement('textarea');
  if (direction === 'encode') {
    textarea.textContent = input;
    return textarea.innerHTML;
  } else {
    textarea.innerHTML = input;
    return textarea.value;
  }
};

// Timestamp <-> Date
export const transformTimestampDate = (input: string, toType: 'date' | 'timestamp', format: string = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"): string => {
  if (!window.dateFns || 
      typeof window.dateFns.fromUnixTime !== 'function' ||
      typeof window.dateFns.isValid !== 'function' ||
      typeof window.dateFns.format !== 'function' ||
      typeof window.dateFns.parse !== 'function' ||
      typeof window.dateFns.getUnixTime !== 'function') {
    throw new Error('날짜 라이브러리(date-fns)가 로드되지 않았습니다. 페이지를 새로고침하거나 네트워크 연결을 확인하세요.');
  }
  if (toType === 'date') { 
    const tsNumber = parseInt(input, 10);
    if (isNaN(tsNumber)) throw new Error('잘못된 타임스탬프 숫자입니다.');
    const date = (input.length <= 10) ? window.dateFns.fromUnixTime(tsNumber) : new Date(tsNumber);
    if (!window.dateFns.isValid(date)) throw new Error('타임스탬프로부터 유효하지 않은 날짜입니다.');
    return window.dateFns.format(date, format);
  } else { 
    let dateToConvert: Date;
    if (format === 'unix_seconds' || format === 'unix_milliseconds') {
        const tsNum = parseInt(input, 10);
        if(isNaN(tsNum)) throw new Error('잘못된 입력 날짜/타임스탬프 문자열입니다.');
        dateToConvert = (format === 'unix_seconds' || input.length <= 10) ? window.dateFns.fromUnixTime(tsNum) : new Date(tsNum);
    } else {
        dateToConvert = window.dateFns.parse(input, format, new Date());
    }

    if (!window.dateFns.isValid(dateToConvert)) throw new Error('선택한 형식에 대해 잘못된 입력 날짜 문자열입니다.');
    
    if (format.includes('SSS') || format === 'unix_milliseconds') { 
      return (window.dateFns.getUnixTime(dateToConvert) * 1000 + dateToConvert.getMilliseconds()).toString();
    } else {
       return window.dateFns.getUnixTime(dateToConvert).toString();
    }
  }
};


// Color Conversion
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const componentToHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100; l /= 100;
  let rValue: number, gValue: number, bValue: number;

  if (s === 0) {
    rValue = gValue = bValue = l; 
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    h /= 360;
    rValue = hueToRgb(p, q, h + 1 / 3);
    gValue = hueToRgb(p, q, h);
    bValue = hueToRgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(rValue * 255), g: Math.round(gValue * 255), b: Math.round(bValue * 255) };
};

export const updateColorState = (value: string, type: 'hex' | 'rgb' | 'hsl'): Partial<ColorState> | null => {
    let currentHex = "", currentRgb = {r:0,g:0,b:0}, currentHsl = {h:0,s:0,l:0};

    if (type === 'hex') {
        const rgbVal = hexToRgb(value);
        if (rgbVal) {
            currentHex = value.startsWith('#') ? value : `#${value}`;
            if (!/^#[0-9A-F]{6}$/i.test(currentHex) && !/^#[0-9A-F]{3}$/i.test(currentHex) ) return null;
            currentRgb = rgbVal;
            currentHsl = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        } else return null;
    } else if (type === 'rgb') {
        const parts = value.match(/(\d+%?\s*,\s*\d+%?\s*,\s*\d+%?)/);
        if (!parts) return null;
        const [r,g,b] = parts[0].split(',').map(v => parseInt(v.trim()));

        if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r>=0 && r<=255 && g>=0 && g<=255 && b>=0 && b<=255) {
             currentRgb = {r,g,b};
             currentHex = rgbToHex(r,g,b);
             currentHsl = rgbToHsl(r,g,b);
        } else return null;
    } else if (type === 'hsl') {
        const parts = value.match(/(\d+\s*,\s*\d+%\s*,\s*\d+%?)/);
        if (!parts) return null;
        const [h,s,l] = parts[0].split(',').map(v => parseInt(v.trim()));
         if (!isNaN(h) && !isNaN(s) && !isNaN(l) && h>=0 && h<=360 && s>=0 && s<=100 && l>=0 && l<=100) { 
            currentHsl = {h,s,l};
            currentRgb = hslToRgb(h,s,l);
            currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        } else return null;
    } else {
        return null;
    }
     return { hex: currentHex, rgb: currentRgb, hsl: currentHsl };
};


// Text Formatting
export const formatText = (text: string, action: 'prettify_json' | 'minify_json' | 'prettify_xml' | 'minify_xml' | 'indent' | 'outdent' | 'remove_line_breaks' | 'one_liner' | 'sort_asc' | 'sort_desc' | 'remove_duplicates' | 'trim_lines', options?: { indentSize?: number }): string => {
  const indentSize = options?.indentSize || 2;
  const indentStr = ' '.repeat(indentSize);

  if ((action === 'prettify_xml' || action === 'minify_xml') && 
      (!window.xmljs || typeof window.xmljs.xml2js !== 'function' || typeof window.xmljs.js2xml !== 'function')) {
    throw new Error('XML 라이브러리(xml-js)가 로드되지 않았습니다. 페이지를 새로고침하거나 네트워크 연결을 확인하세요.');
  }


  switch (action) {
    case 'prettify_json':
      try { return JSON.stringify(JSON.parse(text), null, indentSize); }
      catch (e) { throw new Error('JSON 예쁘게 만들기에 잘못된 형식입니다.'); }
    case 'minify_json':
      try { return JSON.stringify(JSON.parse(text)); }
      catch (e) { throw new Error('JSON 축소에 잘못된 형식입니다.'); }
    case 'prettify_xml':
       try {
        const jsObj = window.xmljs.xml2js(text, { compact: false }); 
        return window.xmljs.js2xml(jsObj, { spaces: indentSize });
      } catch (e: any) { throw new Error(`XML 예쁘게 만들기에 잘못된 형식입니다: ${e.message}`); }
    case 'minify_xml': 
      try {
        const jsObj = window.xmljs.xml2js(text, { compact: true }); // xml2js to parse
        return window.xmljs.js2xml(jsObj, { compact: true });    // js2xml to stringify compactly
      } catch (e: any) { throw new Error(`XML 축소에 잘못된 형식입니다: ${e.message}`); }
    case 'indent':
      return text.split('\n').map(line => indentStr + line).join('\n');
    case 'outdent':
      return text.split('\n').map(line => line.startsWith(indentStr) ? line.substring(indentSize) : line).join('\n');
    case 'remove_line_breaks':
      return text.replace(/(\r\n|\n|\r)/gm, '');
    case 'one_liner':
      return text.split(/(\r\n|\n|\r)/gm).map(line => line.trim()).filter(Boolean).join(' ');
    case 'sort_asc':
      return text.split('\n').sort((a,b) => a.localeCompare(b, 'ko')).join('\n');
    case 'sort_desc':
      return text.split('\n').sort((a,b) => b.localeCompare(a, 'ko')).join('\n');
    case 'remove_duplicates':
      return [...new Set(text.split('\n'))].join('\n');
    case 'trim_lines':
      return text.split('\n').map(line => line.trim()).join('\n');
    default:
      return text;
  }
};

// Case Converter
export const convertCase = (text: string, caseType: CaseType): string => {
  switch (caseType) {
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    case 'capitalize': 
      return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    case 'sentence': 
      return text.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/gm, char => char.toUpperCase());
    case 'title': 
      const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via|은|는|이|가|과|와|의|에|에게|께|에서|로|으로|을|를)$/i;
      return text.toLowerCase().split(' ').map((word, index, arr) => {
        if (index === 0 || index === arr.length -1 || !smallWords.test(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      }).join(' ');
    case 'toggle':
      return text.split('').map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('');
    default:
      return text;
  }
};

// Counter
export const countText = (text: string): { characters: number; words: number; lines: number; bytes: number } => {
  const characters = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+|(?<=[^\s])(?=[A-Za-z\uAC00-\uD7A3])|(?<=[A-Za-z\uAC00-\uD7A3])(?=[^\sA-Za-z\uAC00-\uD7A3])/).filter(Boolean).length;
  const lines = text.split('\n').filter(line => line.length > 0).length || (text.length > 0 ? 1 : 0);
  if (text === '') return { characters: 0, words: 0, lines: 0, bytes: 0 }; 
  const bytes = new TextEncoder().encode(text).length;
  return { characters, words, lines, bytes };
};

// Regex
export const applyRegex = (text: string, pattern: string, flags: string, replacement: string, action: 'find' | 'replace'): string | RegExpMatchArray[] => {
  try {
    const regex = new RegExp(pattern, flags);
    if (action === 'find') {
      const matches: RegExpMatchArray[] = [];
      let match;
      if (regex.global) {
        while ((match = regex.exec(text)) !== null) {
          matches.push(match);
        }
      } else {
        match = text.match(regex);
        if (match) matches.push(match);
      }
      return matches;
    } else { 
      return text.replace(regex, replacement);
    }
  } catch (e: any) {
    throw new Error(`정규식 오류: ${e.message}`);
  }
};
