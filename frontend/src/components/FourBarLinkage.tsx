/**
 * 4-Bar Linkage Kinematics - Interactive Topic
 * MVP Component #2
 *
 * Students can adjust link lengths and input angle
 * to see real-time mechanism animation and performance metrics
 */

import { useState, useEffect } from 'react'
import { apiClient, ApiError } from '../lib/api-client'
import { theme } from '../styles/theme'

interface Joint {
  x: number
  y: number
}

interface LinkageState {
  status: string
  joints?: {
    A: Joint
    B: Joint
    C: Joint
    D: Joint
  }
  angles?: {
    input_theta2: number
    output_theta4: number
    coupler_theta3: number
  }
  performance?: {
    transmission_angle_deg: number
    mechanical_advantage: number
    input_crank_speed: number
    output_follower_speed: number
  }
  links: {
    L1: number
    L2: number
    L3: number
    L4: number
  }
}

export default function FourBarLinkage() {
  const [L1, setL1] = useState(4.0)
  const [L2, setL2] = useState(1.0)
  const [L3, setL3] = useState(4.5)
  const [L4, setL4] = useState(3.5)
  const [theta2, setTheta2] = useState(0)
  const [data, setData] = useState<LinkageState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Fetch linkage computation
  useEffect(() => {
    const fetchLinkage = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await apiClient.post<LinkageState>('/api/4bar-linkage/compute', {
          L1,
          L2,
          L3,
          L4,
          theta2_deg: theta2,
        })

        setData(result)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Failed to compute linkage')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLinkage()
  }, [L1, L2, L3, L4, theta2])

  // Scale factor for SVG visualization (to fit in viewport)
  const scale = 50
  const viewBoxWidth = (L1 + 2) * scale
  const viewBoxHeight = Math.max(L1, L2 + L3, L4) * scale * 1.5

  // Color based on transmission angle
  const getTransmissionColor = () => {
    if (!data?.performance) return theme.colors.gray[300]
    const angle = data.performance.transmission_angle_deg
    if (angle > 45 && angle < 135) return theme.colors.success
    if (angle > 30 && angle < 150) return theme.colors.warning
    return theme.colors.error
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: theme.spacing[6] }}>
        <h1
          style={{
            fontFamily: theme.typography.fontFamily.heading,
            fontSize: '32px',
            fontWeight: 800,
            color: theme.colors.lightBlue[700],
            margin: 0,
            marginBottom: theme.spacing[2],
          }}
        >
          4-Bar Linkage Kinematics
        </h1>
        <p style={{ color: theme.colors.text.secondary, margin: 0 }}>
          Explore how mechanism link lengths and input angle affect output motion and efficiency
        </p>
      </div>

      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          {/* Link Lengths */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3
              style={{
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.lightBlue[500],
                margin: 0,
                marginBottom: theme.spacing[3],
              }}
            >
              Link Dimensions {editMode ? '✏️' : ''}
            </h3>

            <button
              onClick={() => setEditMode(!editMode)}
              className={editMode ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ width: '100%', marginBottom: theme.spacing[3] }}
            >
              {editMode ? 'Lock Dimensions' : 'Edit Dimensions'}
            </button>

            {editMode && (
              <div>
                <div style={{ marginBottom: theme.spacing[3] }}>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>L1 (Ground)</span>
                    <span style={{ color: theme.colors.lightBlue[500] }}>{L1.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.1"
                    value={L1}
                    onChange={(e) => setL1(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div style={{ marginBottom: theme.spacing[3] }}>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>L2 (Crank)</span>
                    <span style={{ color: theme.colors.lightBlue[500] }}>{L2.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={L2}
                    onChange={(e) => setL2(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div style={{ marginBottom: theme.spacing[3] }}>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>L3 (Coupler)</span>
                    <span style={{ color: theme.colors.lightBlue[500] }}>{L3.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.1"
                    value={L3}
                    onChange={(e) => setL3(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div style={{ marginBottom: theme.spacing[3] }}>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>L4 (Follower)</span>
                    <span style={{ color: theme.colors.lightBlue[500] }}>{L4.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={L4}
                    onChange={(e) => setL4(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>
            )}

            {!editMode && (
              <div style={{ display: 'grid', gap: theme.spacing[2] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>L1 (Ground)</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {L1.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>L2 (Crank)</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {L2.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>L3 (Coupler)</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {L3.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>L4 (Follower)</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {L4.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Angle Control */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <div style={{ marginBottom: theme.spacing[3] }}>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Input Crank Angle</span>
                <span style={{ color: theme.colors.lightBlue[500], fontWeight: 700 }}>
                  {theta2.toFixed(1)}°
                </span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={theta2}
              onChange={(e) => setTheta2(parseFloat(e.target.value))}
              className="slider"
              disabled={loading}
            />
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <h3
              style={{
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.lightBlue[500],
                margin: 0,
                marginBottom: theme.spacing[3],
              }}
            >
              Performance
            </h3>

            {loading && !data?.performance && (
              <div style={{ color: theme.colors.text.secondary }}>
                <span className="spinner"></span>
                Computing...
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {data?.performance && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <div
                  style={{
                    padding: theme.spacing[2],
                    backgroundColor: getTransmissionColor(),
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  Transmission Angle: {data.performance.transmission_angle_deg.toFixed(1)}°
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Mechanical Advantage</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {data.performance.mechanical_advantage.toFixed(3)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Output Speed Ratio</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {data.performance.output_follower_speed.toFixed(3)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          {/* Mechanism Diagram */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3
              style={{
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.lightBlue[500],
                margin: 0,
                marginBottom: theme.spacing[3],
              }}
            >
              Mechanism Animation
            </h3>

            {data?.joints && (
              <svg
                width="100%"
                height="400"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}
              >
                {/* Ground line */}
                <line
                  x1={data.joints.A.x * scale}
                  y1={viewBoxHeight / 2}
                  x2={data.joints.B.x * scale}
                  y2={viewBoxHeight / 2}
                  stroke={theme.colors.gray[400]}
                  strokeWidth="3"
                />

                {/* Links */}
                <line
                  x1={data.joints.A.x * scale}
                  y1={viewBoxHeight / 2 - data.joints.A.y * scale}
                  x2={data.joints.C.x * scale}
                  y2={viewBoxHeight / 2 - data.joints.C.y * scale}
                  stroke={theme.colors.lightBlue[500]}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <line
                  x1={data.joints.C.x * scale}
                  y1={viewBoxHeight / 2 - data.joints.C.y * scale}
                  x2={data.joints.D.x * scale}
                  y2={viewBoxHeight / 2 - data.joints.D.y * scale}
                  stroke={theme.colors.lightBlue[400]}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  strokeLinecap="round"
                />

                <line
                  x1={data.joints.B.x * scale}
                  y1={viewBoxHeight / 2 - data.joints.B.y * scale}
                  x2={data.joints.D.x * scale}
                  y2={viewBoxHeight / 2 - data.joints.D.y * scale}
                  stroke={theme.colors.warning}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Joints */}
                <circle cx={data.joints.A.x * scale} cy={viewBoxHeight / 2} r="6" fill={theme.colors.gray[400]} />
                <circle cx={data.joints.B.x * scale} cy={viewBoxHeight / 2} r="6" fill={theme.colors.gray[400]} />
                <circle cx={data.joints.C.x * scale} cy={viewBoxHeight / 2 - data.joints.C.y * scale} r="5" fill={theme.colors.lightBlue[500]} />
                <circle cx={data.joints.D.x * scale} cy={viewBoxHeight / 2 - data.joints.D.y * scale} r="5" fill={theme.colors.warning} />

                {/* Labels */}
                <text x={data.joints.A.x * scale - 15} y={viewBoxHeight / 2 + 25} fontSize="12" fill={theme.colors.text.primary}>
                  A
                </text>
                <text x={data.joints.B.x * scale + 5} y={viewBoxHeight / 2 + 25} fontSize="12" fill={theme.colors.text.primary}>
                  B
                </text>
                <text x={data.joints.C.x * scale - 20} y={viewBoxHeight / 2 - data.joints.C.y * scale - 10} fontSize="12" fill={theme.colors.text.primary}>
                  C
                </text>
                <text x={data.joints.D.x * scale - 20} y={viewBoxHeight / 2 - data.joints.D.y * scale - 10} fontSize="12" fill={theme.colors.text.primary}>
                  D
                </text>
              </svg>
            )}
          </div>

          {/* Angles Display */}
          {data?.angles && (
            <div className="card">
              <h3
                style={{
                  fontFamily: theme.typography.fontFamily.heading,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: theme.colors.lightBlue[500],
                  margin: 0,
                  marginBottom: theme.spacing[3],
                }}
              >
                Angles
              </h3>
              <div style={{ display: 'grid', gap: theme.spacing[2] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Input θ₂</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {data.angles.input_theta2.toFixed(1)}°
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Coupler θ₃</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {data.angles.coupler_theta3.toFixed(1)}°
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Output θ₄</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono, fontWeight: 600 }}>
                    {data.angles.output_theta4.toFixed(1)}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
