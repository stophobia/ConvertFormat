
import React, { useEffect, useCallback } from 'react';
import { ToolType } from '../types';

interface ClipboardHandlerProps {
  onSuggestion: (toolType: ToolType, content: string) => void;
}

// Basic type detection heuristics
const detectType = (text: string): ToolType | null => {
  if (!text || text.trim() === '') return null;

  // Trim text for more reliable detection
  const trimmedText = text.trim();

  // JSON (object or array)
  if ((trimmedText.startsWith('{') && trimmedText.endsWith('}')) || (trimmedText.startsWith('[') && trimmedText.endsWith(']'))) {
    try {
      JSON.parse(trimmedText);
      return ToolType.JSON_YAML; // Or XML_JSON if preferred
    } catch (e) { /* Not valid JSON */ }
  }

  // XML
  if (trimmedText.startsWith('<') && trimmedText.endsWith('>')) {
     // A more robust check could involve trying to parse, but this is a simple heuristic
    if (trimmedText.includes('</') || trimmedText.includes('/>')) {
        return ToolType.XML_JSON;
    }
  }
  
  // Base64 (common pattern, but can have false positives)
  // Regex: checks for Base64 characters, optional padding.
  // Length should be multiple of 4 if padded correctly.
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (base64Regex.test(trimmedText) && trimmedText.length % 4 === 0 && trimmedText.length > 10) { // Heuristic for length
     try {
        atob(trimmedText); // Check if it's valid base64
        return ToolType.BASE64;
     } catch (e) { /* Not valid base64 */ }
  }

  // URL Encoded string (contains %xx)
  if (/%[0-9A-Fa-f]{2}/.test(trimmedText)) {
    return ToolType.URL_ENCODE_DECODE;
  }

  // HTML Entities (contains &...;)
  if (/&[a-zA-Z0-9#]+;/.test(trimmedText)) {
    return ToolType.HTML_ENTITY;
  }

  // Timestamp (numeric, within a reasonable range for seconds or ms)
  const num = Number(trimmedText);
  if (!isNaN(num)) {
    const nowSec = Date.now() / 1000;
    const nowMs = Date.now();
    // Assuming timestamps are likely around current time +- 50 years
    // Check for seconds (typically 10 digits) or milliseconds (typically 13 digits)
    if ((trimmedText.length >= 9 && trimmedText.length <= 11 && Math.abs(num - nowSec) < 1.6e9) || // Approx 50 years in seconds
        (trimmedText.length >= 12 && trimmedText.length <= 14 && Math.abs(num - nowMs) < 1.6e12) // Approx 50 years in ms
    ) {
      return ToolType.TIMESTAMP_DATE;
    }
  }

  // Color Hex
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmedText)) return ToolType.COLOR_CONVERTER;
  // Color RGB/RGBA
  if (/^rgba?\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*(,\s*(0|1|0?\.\d+))?\s*\)$/i.test(trimmedText)) return ToolType.COLOR_CONVERTER;
  // Color HSL/HSLA
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*(0|1|0?\.\d+))?\s*\)$/i.test(trimmedText)) return ToolType.COLOR_CONVERTER;

  return null; // Default to no specific type or perhaps TEXT_FORMATTER
};


export const ClipboardHandler: React.FC<ClipboardHandlerProps> = ({ onSuggestion }) => {
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText) {
      const detected = detectType(pastedText);
      if (detected) {
        // Check if the active element is an input or textarea to avoid overly aggressive suggestions
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
           // Potentially only suggest if it's a generic paste area or based on focus.
           // For this implementation, we'll be less aggressive if already in an input.
           console.log("Paste detected in an input field, suggestion suppressed for now.");
           return;
        }
        onSuggestion(detected, pastedText);
      }
    }
  }, [onSuggestion]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return null; // This is a non-rendering component
};
