'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ByuropassPage() {
  const [iframeUrl, setIframeUrl] = useState(null)
  const [token, setToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const cookieToken = Cookies.get('access_token')
    setToken(cookieToken || null)

    if (!cookieToken) {
      console.error('Token not found in cookies.')
      router.push('/login')
      return
    }

    // Сначала устанавливаем первую ссылку
    // const firstUrl = `https://byuropass.apa.kz/api/api_index?token=${encodeURIComponent(cookieToken)}`
    // setIframeUrl(firstUrl)
    const firstUrl = ``
    setIframeUrl(firstUrl)
    // Через 2 секунды подменяем на нужную
    const timeout = setTimeout(() => {
      setIframeUrl('https://byuropass.apa.kz/api/createdoc')
    }, 500)

    return () => clearTimeout(timeout) // Очистка таймера при размонтировании
  }, [router])

  return (
    <div className="w-full h-screen relative">
      {/* {token && (
        <Link 
          href={`https://byuropass.apa.kz/api/api_index?token=${encodeURIComponent(token)}`}
          className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-10"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть в новой вкладке
        </Link>
      )} */}

      {iframeUrl && (
        <iframe
          src={iframeUrl}
          width="100%"
          height="100%"
          className="border-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          allow="fullscreen"
        />
      )}
    </div>
  )
}
