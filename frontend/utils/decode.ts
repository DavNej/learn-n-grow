export function decodeJsonDataURI(dataURI: string | undefined) {
  if (!dataURI) return null

  const base64String = dataURI.replace('data:application/json;base64,', '')
  const buffer = Buffer.from(base64String, 'base64')
  const jsonString = buffer.toString()

  try {
    return JSON.parse(jsonString)
  } catch (err) {
    console.error(err)
  }

  return
}

export function decodeImageDataURI(dataURI: string) {
  const base64String = dataURI.replace('data:image/svg+xml;base64,', '')
  const buffer = Buffer.from(base64String, 'base64')
  const svg = buffer.toString()

  return svg
}
