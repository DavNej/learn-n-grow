export function decodeJsonDataURI(dataURI: string) {
  const base64String = dataURI.replace('data:application/json;base64,', '')
  const buffer = Buffer.from(base64String, 'base64')
  const jsonString = buffer.toString()

  return JSON.parse(jsonString)
}

export function decodeImageDataURI(dataURI: string) {
  const base64String = dataURI.replace('data:image/svg+xml;base64,', '')
  const buffer = Buffer.from(base64String, 'base64')
  const svg = buffer.toString()

  return svg
}
