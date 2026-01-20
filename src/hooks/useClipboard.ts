import { useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    if (!text) {
      console.warn('No text to copy');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback method for older browsers or when clipboard API fails
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return true;
        }
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      return false;
    }
  };

  return { copy, copied };
}
