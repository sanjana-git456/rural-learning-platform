import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Utility for checking online status
export function isOnline() {
  return navigator.onLine
}

// Utility for registering service worker
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registered successfully:", registration)
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}

// Utility for text-to-speech
export function speak(text, lang = "en") {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.8 // Slower for children
    utterance.pitch = 1.1 // Slightly higher pitch
    speechSynthesis.speak(utterance)
  }
}

// Utility for storing data offline
export function storeOfflineData(key, data) {
  try {
    localStorage.setItem(
      `offline_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    )
  } catch (error) {
    console.error("Failed to store offline data:", error)
  }
}

// Utility for retrieving offline data
export function getOfflineData(key) {
  try {
    const stored = localStorage.getItem(`offline_${key}`)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to retrieve offline data:", error)
    return null
  }
}
