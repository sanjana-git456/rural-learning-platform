"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
]

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode)
    setIsOpen(false)

    // In a real app, this would update the app's language context
    console.log("Language changed to:", langCode)

    // Store preference
    localStorage.setItem("preferred_language", langCode)
  }

  const currentLanguage = languages.find((lang) => lang.code === currentLang)

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="h-12 px-4 gap-2 text-base">
        <span className="text-xl">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <span className="text-xs">▼</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-card border rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${
                lang.code === currentLang ? "bg-accent" : ""
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-base">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
