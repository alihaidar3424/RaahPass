"use client";

import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type QuizSpeechControlsProps = {
  language: Language;
  speakerOn: boolean;
  micOn: boolean;
  speakerSupported: boolean;
  micSupported: boolean;
  listening?: boolean;
  onToggleSpeaker: () => void;
  onToggleMic: () => void;
  onReplay?: () => void;
};

export function QuizSpeechControls({
  language,
  speakerOn,
  micOn,
  speakerSupported,
  micSupported,
  listening = false,
  onToggleSpeaker,
  onToggleMic,
  onReplay,
}: QuizSpeechControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={onToggleSpeaker}
        disabled={!speakerSupported}
        className={cn(
          "inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
          speakerOn
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
          !speakerSupported && "opacity-50",
        )}
        aria-pressed={speakerOn}
        aria-label={t(language, "speechSpeaker")}
        title={t(language, "speechSpeaker")}
      >
        {speakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span>{t(language, "speechSpeaker")}</span>
      </button>

      {speakerOn && onReplay ? (
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex min-h-10 items-center rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted"
        >
          {t(language, "speechReplay")}
        </button>
      ) : null}

      <button
        type="button"
        onClick={onToggleMic}
        disabled={!micSupported}
        className={cn(
          "inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
          micOn
            ? listening
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
          !micSupported && "opacity-50",
        )}
        aria-pressed={micOn}
        aria-label={t(language, "speechMic")}
        title={t(language, "speechMicHint")}
      >
        {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        <span>{t(language, "speechMic")}</span>
      </button>
    </div>
  );
}
