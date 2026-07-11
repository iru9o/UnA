export function getJakartaDateString(): string {
  const d = new Date()
  const tzDate = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  const year = tzDate.getFullYear()
  const month = String(tzDate.getMonth() + 1).padStart(2, '0')
  const day = String(tzDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getJakartaDayName(): string {
  const day = new Date().toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' })
  return day.charAt(0).toUpperCase() + day.slice(1)
}
