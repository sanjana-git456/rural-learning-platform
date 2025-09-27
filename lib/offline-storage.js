// IndexedDB wrapper for offline data storage
class OfflineStorage {
  constructor() {
    this.dbName = "RuralLearningDB"
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores
        if (!db.objectStoreNames.contains("lessons")) {
          const lessonStore = db.createObjectStore("lessons", { keyPath: "id" })
          lessonStore.createIndex("subject", "subject", { unique: false })
          lessonStore.createIndex("grade", "grade", { unique: false })
        }

        if (!db.objectStoreNames.contains("assessments")) {
          const assessmentStore = db.createObjectStore("assessments", { keyPath: "id" })
          assessmentStore.createIndex("lessonId", "lessonId", { unique: false })
        }

        if (!db.objectStoreNames.contains("progress")) {
          const progressStore = db.createObjectStore("progress", { keyPath: "id" })
          progressStore.createIndex("userId", "userId", { unique: false })
          progressStore.createIndex("lessonId", "lessonId", { unique: false })
        }

        if (!db.objectStoreNames.contains("attendance")) {
          const attendanceStore = db.createObjectStore("attendance", { keyPath: "id" })
          attendanceStore.createIndex("date", "date", { unique: false })
          attendanceStore.createIndex("studentId", "studentId", { unique: false })
        }

        if (!db.objectStoreNames.contains("offline_queue")) {
          const queueStore = db.createObjectStore("offline_queue", { keyPath: "id", autoIncrement: true })
          queueStore.createIndex("timestamp", "timestamp", { unique: false })
          queueStore.createIndex("type", "type", { unique: false })
        }
      }
    })
  }

  async store(storeName, data) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async get(storeName, key) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async getAll(storeName) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async delete(storeName, key) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async addToQueue(action) {
    const queueItem = {
      ...action,
      timestamp: Date.now(),
      synced: false,
    }
    return this.store("offline_queue", queueItem)
  }

  async getQueueItems() {
    return this.getAll("offline_queue")
  }

  async markSynced(id) {
    const item = await this.get("offline_queue", id)
    if (item) {
      item.synced = true
      return this.store("offline_queue", item)
    }
  }
}

export const offlineStorage = new OfflineStorage()
