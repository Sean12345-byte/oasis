"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  /** 是否禁用（例如在動畫進行中） */
  disabled?: boolean;
}

// 擴充 Window 型別以支援 SpeechRecognition API
// SpeechRecognition 是瀏覽器原生 API，TypeScript 預設型別不包含
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

// 使用 any 避免複雜的型別依賴
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any;

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);

  // 檢查瀏覽器支援
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "zh-TW";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
        setInterimText(interimTranscript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (event: any) => {
        console.warn("[Oasis] Speech recognition error:", event.error);
        setIsListening(false);
        setInterimText("");
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      setRecognition(rec);
    }
    // 瀏覽器不支援時：不顯示任何錯誤，麥克風按鈕自動隱藏
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition || disabled) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setInterimText("");
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        // 已在聆聽中，忽略
      }
    }
  }, [recognition, isListening, disabled]);

  // 清理
  useEffect(() => {
    return () => {
      recognition?.abort();
    };
  }, [recognition]);

  // 瀏覽器不支援 → 不渲染任何東西
  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-300
          ${
            isListening
              ? "bg-oasis-sage/15 text-oasis-sage border border-oasis-sage/30"
              : "text-oasis-muted/50 hover:text-oasis-muted border border-oasis-border/20 hover:border-oasis-border/40"
          }
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
        title={isListening ? "點擊停止錄音" : "語音輸入"}
      >
        {isListening ? (
          <>
            <MicOff size={14} className="animate-pulse-soft" />
            <span>錄音中...</span>
          </>
        ) : (
          <>
            <Mic size={14} />
            <span>語音</span>
          </>
        )}
      </button>

      {/* 即時辨識文字 */}
      {isListening && interimText && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-oasis-surface2 border border-oasis-border/30 z-10">
          <p className="text-xs text-oasis-text/50 italic">
            {interimText}
            <Loader2 size={10} className="inline ml-1 animate-spin text-oasis-sage/50" />
          </p>
        </div>
      )}

      {/* 語音隱私提示 */}
      {isListening && (
        <p className="mt-2 text-[10px] text-oasis-muted/25 text-center">
          語音僅用於即時轉換文字，不會被保存
        </p>
      )}
    </div>
  );
}
