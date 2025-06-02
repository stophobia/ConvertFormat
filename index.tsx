import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import xmljs from 'xml-js';

// 외부 라이브러리를 window 객체에 추가
window.xmljs = xmljs;

// 라이브러리 로드 상태 확인 및 알림
document.addEventListener('DOMContentLoaded', () => {
  // xml-js 라이브러리 확인
  if (!window.xmljs) {
    console.error('XML 라이브러리(xml-js)가 로드되지 않았습니다.');
  } else {
    console.log('XML 라이브러리(xml-js) 로드 완료');
  }
  
  // js-yaml 라이브러리 확인
  if (!window.jsyaml) {
    console.error('YAML 라이브러리(js-yaml)가 로드되지 않았습니다.');
  } else {
    console.log('YAML 라이브러리(js-yaml) 로드 완료');
  }
  
  // date-fns 라이브러리 확인
  if (!window.dateFns) {
    console.error('날짜 라이브러리(date-fns)가 로드되지 않았습니다.');
  } else {
    console.log('날짜 라이브러리(date-fns) 로드 완료');
  }
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
