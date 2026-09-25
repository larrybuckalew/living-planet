import { useState } from 'react'
import { startAmbient, stopAmbient } from '@/lib/ambient'

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SpeakerOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 8v4h2.5L10 15V5L6.5 8H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5.5a6 6 0 0 1 0 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SpeakerOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 8v4h2.5L10 15V5L6.5 8H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m13.5 8 4 4M17.5 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const buttonBase =
  'flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber'

export default function GlobeControls({
  night,
  onToggleNight,
}: {
  night: boolean
  onToggleNight: () => void
}) {
  const [sound, setSound] = useState(false)

  const toggleSound = () => {
    if (sound) {
      stopAmbient()
      setSound(false)
    } else {
      startAmbient().catch(() => setSound(false))
      setSound(true)
    }
  }

  return (
    <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 lg:right-8">
      <button
        type="button"
        onClick={onToggleNight}
        aria-pressed={night}
        aria-label={night ? 'Switch to daylight view' : 'Switch to night-lights view'}
        title={night ? 'Daylight view' : 'Night-lights view'}
        className={`${buttonBase} border-fg/20 bg-pine/70 text-mist hover:text-fg ${
          night ? 'border-amber/70 text-amber' : ''
        }`}
      >
        {night ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={sound}
        aria-label={sound ? 'Turn ambient sound off' : 'Turn ambient sound on'}
        title={sound ? 'Ambient sound on' : 'Ambient sound'}
        className={`${buttonBase} border-fg/20 bg-pine/70 text-mist hover:text-fg ${
          sound ? 'border-amber/70 text-amber' : ''
        }`}
      >
        {sound ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
    </div>
  )
}
