export function formatDate(isoString: string): string {
  const date = new Date(isoString)

  const formattedDate = date.toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  })

  return formattedDate.replace(',', ' -')
}
