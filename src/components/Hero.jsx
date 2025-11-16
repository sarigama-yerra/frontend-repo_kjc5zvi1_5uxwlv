import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full bg-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90" />
        <div className="relative max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-fuchsia-300 to-cyan-200">
            Generate Stunning AI Videos
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-200/90">
            Type your idea, pick a model (Veo3 or Sora2), and let the AI craft a cinematic clip.
          </p>
        </div>
      </div>
    </section>
  )
}
