const CACHE_NAME = "rural-learning-v1"
const OFFLINE_URL = "/offline"

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/auth",
  "/student",
  "/teacher",
  "/admin",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
]

const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: ["/icon-", "/manifest.json", ".css", ".js"],
  // Network first for API calls
  api: ["/api/"],
  // Stale while revalidate for pages
  pages: ["/student", "/teacher", "/admin", "/auth"],
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(event.request))
    return
  }

  // Handle static assets
  if (CACHE_STRATEGIES.static.some((pattern) => url.pathname.includes(pattern))) {
    event.respondWith(handleStaticAsset(event.request))
    return
  }

  // Handle page requests
  event.respondWith(handlePageRequest(event.request))
})

async function handleApiRequest(request) {
  try {
    // Try network first for API calls
    const response = await fetch(request)

    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This request will be synced when online",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

async function handleStaticAsset(request) {
  // Cache first strategy for static assets
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response("Asset not available offline", { status: 404 })
  }
}

async function handlePageRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)

    // Cache successful page responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match(OFFLINE_URL)
    }

    return new Response("Page not available offline", { status: 404 })
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData())
  }
})

async function syncOfflineData() {
  try {
    console.log("[v0] Starting background sync...")

    // Open IndexedDB and sync queued actions
    const request = indexedDB.open("RuralLearningDB", 1)

    request.onsuccess = async (event) => {
      const db = event.target.result
      const transaction = db.transaction(["offline_queue"], "readonly")
      const store = transaction.objectStore("offline_queue")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = async () => {
        const queueItems = getAllRequest.result
        const unsynced = queueItems.filter((item) => !item.synced)

        console.log(`[v0] Found ${unsynced.length} items to sync`)

        for (const item of unsynced) {
          try {
            const response = await fetch(item.endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item.data),
            })

            if (response.ok) {
              // Mark as synced
              const updateTransaction = db.transaction(["offline_queue"], "readwrite")
              const updateStore = updateTransaction.objectStore("offline_queue")
              item.synced = true
              updateStore.put(item)

              console.log(`[v0] Synced: ${item.type}`)
            }
          } catch (error) {
            console.error(`[v0] Failed to sync ${item.type}:`, error)
          }
        }
      }
    }
  } catch (error) {
    console.error("[v0] Background sync failed:", error)
  }
}
