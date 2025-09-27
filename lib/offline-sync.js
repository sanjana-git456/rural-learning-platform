import { offlineStorage } from "./offline-storage"

class OfflineSync {
  constructor() {
    this.isOnline = navigator.onLine
    this.syncInProgress = false

    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true
      this.syncOfflineData()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  async queueAction(action) {
    if (this.isOnline) {
      // Try to execute immediately if online
      try {
        await this.executeAction(action)
        return { success: true, immediate: true }
      } catch (error) {
        // If failed, queue for later
        await offlineStorage.addToQueue(action)
        return { success: true, queued: true, error }
      }
    } else {
      // Queue for later if offline
      await offlineStorage.addToQueue(action)
      return { success: true, queued: true }
    }
  }

  async executeAction(action) {
    const { type, data, endpoint } = action

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline) return

    this.syncInProgress = true

    try {
      const queueItems = await offlineStorage.getQueueItems()
      const unsynced = queueItems.filter((item) => !item.synced)

      console.log(`[v0] Syncing ${unsynced.length} offline actions`)

      for (const item of unsynced) {
        try {
          await this.executeAction(item)
          await offlineStorage.markSynced(item.id)
          console.log(`[v0] Synced action: ${item.type}`)
        } catch (error) {
          console.error(`[v0] Failed to sync action ${item.type}:`, error)
          // Keep in queue for next sync attempt
        }
      }

      // Dispatch sync complete event
      window.dispatchEvent(
        new CustomEvent("offline-sync-complete", {
          detail: { syncedCount: unsynced.length },
        }),
      )
    } catch (error) {
      console.error("[v0] Offline sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  // Cache lesson data for offline access
  async cacheLessonData(lessons) {
    for (const lesson of lessons) {
      await offlineStorage.store("lessons", lesson)
    }
  }

  // Cache assessment data
  async cacheAssessmentData(assessments) {
    for (const assessment of assessments) {
      await offlineStorage.store("assessments", assessment)
    }
  }

  // Get cached lessons
  async getCachedLessons() {
    return offlineStorage.getAll("lessons")
  }

  // Get cached assessments
  async getCachedAssessments() {
    return offlineStorage.getAll("assessments")
  }

  // Save progress offline
  async saveProgressOffline(progressData) {
    await offlineStorage.store("progress", progressData)

    return this.queueAction({
      type: "save_progress",
      endpoint: "/api/progress",
      data: progressData,
    })
  }

  // Save attendance offline
  async saveAttendanceOffline(attendanceData) {
    await offlineStorage.store("attendance", attendanceData)

    return this.queueAction({
      type: "save_attendance",
      endpoint: "/api/attendance",
      data: attendanceData,
    })
  }

  // Submit assessment offline
  async submitAssessmentOffline(assessmentData) {
    return this.queueAction({
      type: "submit_assessment",
      endpoint: "/api/assessments/submit",
      data: assessmentData,
    })
  }
}

export const offlineSync = new OfflineSync()
