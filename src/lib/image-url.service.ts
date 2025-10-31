export async function convertImagePathToUrl(
  path: string | null
): Promise<string | null> {
  if (!path) return null

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const baseUrl = process.env.IMAGE_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export async function convertImagePathsToUrls(paths: {
  logo_url?: string | null
  icon_url?: string | null
}): Promise<{
  logo_url: string | null
  icon_url: string | null
}> {
  const [logo_url, icon_url] = await Promise.all([
    convertImagePathToUrl(paths.logo_url ?? null),
    convertImagePathToUrl(paths.icon_url ?? null),
  ])

  return { logo_url, icon_url }
}
