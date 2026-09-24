import { useState } from 'react'
import StressStrainAnalysis from './components/StressStrainAnalysis'
import FourBarLinkage from './components/FourBarLinkage'
import { theme } from './styles/theme'
import './styles/global.css'

function App() {
  const [activeTopic, setActiveTopic] = useState<'stress-strain' | '4bar-linkage'>('stress-strain')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Header with Topic Selector */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.lightBlue[500]} 0%, ${theme.colors.lightBlue[600]} 100%)`,
          color: 'white',
          padding: '30px 24px',
          marginBottom: '30px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: '32px',
              fontWeight: 800,
              margin: 0,
              marginBottom: '20px',
            }}
          >
            SimMec - Interactive Mechanical Engineering
          </h1>
          <p style={{ margin: 0, marginBottom: '20px', opacity: 0.95 }}>
            Learn mechanical engineering concepts through interactive visualizations
          </p>

          {/* Topic Tabs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTopic('stress-strain')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTopic === 'stress-strain' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: `2px solid ${activeTopic === 'stress-strain' ? 'white' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              📊 Stress-Strain Analysis
            </button>
            <button
              onClick={() => setActiveTopic('4bar-linkage')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTopic === '4bar-linkage' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: `2px solid ${activeTopic === '4bar-linkage' ? 'white' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              ⚙️ 4-Bar Linkage
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 24px', paddingBottom: '60px' }}>
        {activeTopic === 'stress-strain' && <StressStrainAnalysis />}
        {activeTopic === '4bar-linkage' && <FourBarLinkage />}
      </div>
    </div>
  )
}

export default App
