"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react"
import { offlineSync } from "@/lib/offline-sync"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState("idle") // 'idle', 'syncing', 'complete'
  const [queueCount, setQueueCount] = useState(0)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    const handleSyncComplete = (event) => {
      setSyncStatus("complete")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("offline-sync-complete", handleSyncComplete)

    // Check queue count periodically
    const checkQueue = async () => {
      try {
        const items = await offlineSync.offlineStorage.getQueueItems()
        const unsynced = items.filter((item) => !item.synced)
        setQueueCount(unsynced.length)
      } catch (error) {
        console.error("[v0] Failed to check queue:", error)
      }
    }

    checkQueue()
    const interval = setInterval(checkQueue, 5000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("offline-sync-complete", handleSyncComplete)
      clearInterval(interval)
    }
  }, [])

  const handleManualSync = async () => {
    if (!isOnline) return

    setSyncStatus("syncing")
    try {
      await offlineSync.syncOfflineData()
    } catch (error) {
      console.error("[v0] Manual sync failed:", error)
      setSyncStatus("idle")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Offline
          </>
        )}
      </Badge>

      {queueCount > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {queueCount} pending
        </Badge>
      )}

      {isOnline && queueCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleManualSync}
          disabled={syncStatus === "syncing"}
          className="h-6 px-2"
        >
          {syncStatus === "syncing" ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : syncStatus === "complete" ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  )
}
