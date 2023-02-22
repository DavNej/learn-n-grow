export function encodeFileToDataUri(
  file: File,
  callback: (dataUrl: string) => void
) {
  const reader = new FileReader()

  reader.readAsDataURL(file)

  reader.onloadend = () => {
    const uri = reader.result as string
    callback(uri)
  }
}

export function encodeJsonToDataUri(json: object): string {
  const data = encodeURIComponent(JSON.stringify(json))
  return `data:application/json;charset=utf-8,${data}`
}

export function decodeDataUriToJson(dataUri: string): object | null {
  const match = dataUri.match(/^data:application\/json;charset=utf-8,(.*)$/)
  if (!match) return null
  const data = decodeURIComponent(match[1])
  return JSON.parse(data)
}
