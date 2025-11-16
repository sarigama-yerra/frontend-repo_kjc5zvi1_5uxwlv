import React, { useState } from 'react'
import Hero from './components/Hero'
import RequestForm from './components/RequestForm'
import RequestsList from './components/RequestsList'
import VoltChat from './components/VoltChat'

function App() {
  const [lastRequest, setLastRequest] = useState(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <main className="relative z-10 -mt-24">
        <div className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RequestForm onSubmitted={setLastRequest} />
              {lastRequest && (
                <p className="mt-3 text-sm text-gray-300">Queued request: {lastRequest.request_id}</p>
              )}
              <VoltChat />
            </div>
            <div>
              <RequestsList />
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 py-8 text-center text-gray-400">
        Built with a futuristic 3D vibe. Models referenced are placeholders for integration.
      </footer>
    </div>
  )
}

export default App
