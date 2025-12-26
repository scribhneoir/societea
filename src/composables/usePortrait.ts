// Composable for portrait management and Art Institute API
import { ref } from 'vue'
import type { PortraitData } from '../stores/character'

interface ArtworkData {
  id: number
  title: string
  artist_display: string
  image_id: string
  date_display: string
}

export function usePortrait() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getImageUrl = (imageId: string, size: number = 400): string => {
    return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`
  }

  const fetchRandomArtwork = async (gender: string = ''): Promise<ArtworkData | null> => {
    try {
      // Build search query - search for "portrait" and optionally add gender
      let searchQuery = `oil portrait${gender ? `of a ${gender}` : ''}`

      // Get a random page to add variety
      const randomPage = Math.floor(Math.random() * 20) + 1

      // Use the search API with public domain filter
      const searchUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
        searchQuery
      )}&query[term][is_public_domain]=true&page=${randomPage}&limit=50&fields=id,title,artist_display,image_id,date_display`

      const response = await fetch(searchUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch artworks')
      }

      const data = await response.json()

      if (!data.data || data.data.length === 0) {
        throw new Error('No artworks found')
      }

      // Filter for artworks that have images
      const artworksWithImages = data.data.filter((artwork: any) => artwork.image_id)

      if (artworksWithImages.length === 0) {
        // If no images on this page, try again with a different page
        return fetchRandomArtwork(gender)
      }

      // Pick a random artwork from the filtered results
      const randomIndex = Math.floor(Math.random() * artworksWithImages.length)
      const artwork = artworksWithImages[randomIndex]

      return {
        id: artwork.id,
        title: artwork.title || 'Untitled',
        artist_display: artwork.artist_display || 'Unknown Artist',
        image_id: artwork.image_id,
        date_display: artwork.date_display || '',
      }
    } catch (err) {
      console.error('Error fetching artwork:', err)
      return null
    }
  }

  const loadRandomPortrait = async (gender: string = ''): Promise<PortraitData | null> => {
    isLoading.value = true
    error.value = null

    const artwork = await fetchRandomArtwork(gender)

    if (artwork) {
      const imageUrl = getImageUrl(artwork.image_id)

      const portraitData: PortraitData = {
        artworkId: artwork.id,
        title: artwork.title,
        artist: artwork.artist_display,
        imageId: artwork.image_id,
        imageUrl: imageUrl,
        dateDisplay: artwork.date_display,
      }

      isLoading.value = false
      return portraitData
    } else {
      error.value = 'Failed to fetch portrait'
      isLoading.value = false
      return null
    }
  }

  return {
    isLoading,
    error,
    getImageUrl,
    fetchRandomArtwork,
    loadRandomPortrait,
  }
}

