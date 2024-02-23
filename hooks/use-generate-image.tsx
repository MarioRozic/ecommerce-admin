import axios from "axios"
import { useEffect, useState } from "react"

interface ImageData {
  author: string
  download_url: string
  height: number
  id: string
  url: string
  width: number
}

export default function useGenerateImage() {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<ImageData | null>(null)
  useEffect(() => {
    const getPhotos = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          "https://picsum.photos/v2/list?limit=100"
        )

        const images: ImageData[] = response.data
        setImage(images[Math.floor(Math.random() * images.length)])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getPhotos()
  }, [])

  return {
    loading,
    image,
  }
}
