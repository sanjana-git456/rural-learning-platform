export function OfflineBadge({ isOnline = true }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isOnline ? "bg-green-100 text-green-700 online-badge" : "bg-red-100 text-red-700 offline-badge"
      }`}
    >
      {isOnline ? "🟢 Online" : "🔴 Offline"}
    </div>
  )
}
