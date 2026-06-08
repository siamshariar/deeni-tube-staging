"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LanguagePromptProps {
  open: boolean
  onSave: (languages: string[]) => void
  onSkip: () => void
}

const languageList = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
]

export default function LanguagePrompt({ open, onSave, onSkip }: LanguagePromptProps) {
  const [selected, setSelected] = useState<string[]>(["en"])

  const toggle = (code: string) => {
    setSelected(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    )
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Choose Your Language
          </DialogTitle>
          <DialogDescription>
            Select languages to personalize your content feed. You can change this later in Settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border rounded-lg divide-y">
            {languageList.map((lang) => {
              const isSelected = selected.includes(lang.code)
              return (
                <button
                  key={lang.code}
                  onClick={() => toggle(lang.code)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span
                    className={`h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onSkip}>
              Skip for now
            </Button>
            <Button className="flex-1" onClick={() => onSave(selected)}>
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}