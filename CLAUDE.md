# CLAUDE.md - SimMec Project Guide

## Project Overview

**SimMec** is an interactive web platform for learning mechanical engineering through visual, graphical, and interactive demonstrations. Built on MIT's mechanical engineering curriculum, it uses Python for computational power and React for interactive web visualization.

**Goal:** Make mechanical engineering concepts intuitive and practical through interactive 3D visualizations and formula manipulation.

## Quick Facts

- **Curriculum:** MIT Mechanical Engineering (8 semesters, 500+ credit hours)
- **Technology:** React + FastAPI + Python (NumPy, SciPy, Matplotlib, Mayavi)
- **Target:** 50+ interactive topics covering all core ME courses
- **Development:** 3 phases over ~6 months

## Architecture

### Three-Tier System

```
Frontend (React/TypeScript)
    ↓ (HTTP/WebSocket)
Backend API (FastAPI)
    ↓ (Python subprocess/direct)
Python Compute Engine (NumPy/SciPy)
```

### Frontend
- **Technology:** React 18+, TypeScript, Three.js, Plotly.js
- **Responsibility:** UI, parameter controls, 3D/2D visualization rendering
- **No heavy math:** All computation deferred to backend

### Backend
- **Technology:** FastAPI + WebSockets
- **Responsibility:** Route requests, manage sessions, orchestrate Python simulations
- **Location:** `backend/` directory

### Python Engine
- **Technology:** NumPy, SciPy, Matplotlib, Mayavi, SimPy, Control
- **Responsibility:** All mathematical computation, 3D model generation
- **Location:** `python-engine/` directory

## Project Structure

```
SimMec/
├── frontend/                 # React application
│   ├── components/          # Reusable UI components
│   │   ├── InteractiveFormula.tsx
│   │   ├── Visualization3D.tsx
│   │   ├── Graph2D.tsx
│   │   └── TopicCard.tsx
│   ├── pages/
│   │   ├── CoursePage.tsx    # Browse courses
│   │   ├── TopicPage.tsx     # Interactive lesson
│   │   └── Dashboard.tsx     # Progress tracking
│   ├── hooks/
│   │   └── useSimulation.ts  # API integration
│   ├── types/               # TypeScript interfaces
│   └── config/             # Topic definitions
│
├── backend/                  # FastAPI server
│   ├── app.py
│   ├── routes/
│   │   ├── topics.py         # Topic endpoints
│   │   ├── simulations.py    # Computation requests
│   │   └── users.py          # User management
│   └── models/               # Database models
│
├── python-engine/            # Computation engine
│   ├── utils/
│   │   ├── math_utils.py
│   │   └── visualization.py  # 3D generation
│   ├── topics/               # Topic implementations
│   │   ├── mechanics.py      # Stress, strain, forces
│   │   ├── dynamics.py       # Kinematics, vibration
│   │   ├── fluids.py         # Flow, CFD
│   │   ├── thermal.py        # Heat transfer
│   │   └── control.py        # System response
│   └── solvers/              # Numerical solvers
│       ├── ode_solver.py
│       └── eigenvalue.py
│
├── content/                  # Lesson content (JSON/Markdown)
│   ├── mechanics/
│   │   └── 2.001-stress-strain/
│   │       ├── metadata.json
│   │       ├── description.md
│   │       └── examples/
│   ├── dynamics/
│   ├── thermal/
│   └── fluids/
│
├── docs/                     # Documentation
│   ├── architecture.md
│   ├── adding-topics.md
│   └── python-backends.md
│
└── deploy/                   # Deployment config
    ├── Dockerfile
    ├── docker-compose.yml
    └── .env.example
```

## Adding a New Interactive Topic

### Process

1. **Define the Topic** - What concept to teach? What parameters?
2. **Create Python Backend** - Write computation code in `python-engine/topics/`
3. **Build React Component** - Create visualization in `frontend/components/`
4. **Connect via API** - Route in `backend/routes/simulations.py`
5. **Test Full Pipeline** - Verify parameter → computation → visualization

### Example: Adding "Beam Bending"

**1. Python Backend** (`python-engine/topics/mechanics.py`)
```python
def compute_beam_bending(length, force, E, I):
    """
    Compute beam deflection, stress distribution
    Returns: deflection_curve, stress_field, 3D_mesh
    """
    # NumPy computation
    x = np.linspace(0, length, 100)
    y = (force / (6 * E * I)) * x * (3 * length**2 - x**2)
    
    # 3D mesh generation (Matplotlib)
    mesh = create_beam_mesh(length, y)
    
    return {
        'deflection': y,
        'stress': compute_stress(y, E, I),
        'mesh_vertices': mesh['vertices'],
        'mesh_faces': mesh['faces']
    }
```

**2. FastAPI Route** (`backend/routes/simulations.py`)
```python
@router.post("/beam-bending")
async def beam_bending(params: BeamBendingParams):
    result = compute_beam_bending(
        params.length, params.force, params.E, params.I
    )
    return result
```

**3. React Component** (`frontend/components/BeamBending.tsx`)
```typescript
export const BeamBending = () => {
  const [force, setForce] = useState(1000);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/beam-bending', {
      method: 'POST',
      body: JSON.stringify({ force, length: 1.0, E: 210000, I: 0.001 })
    }).then(r => r.json()).then(setData);
  }, [force]);

  return (
    <div>
      <Slider value={force} onChange={setForce} />
      <Canvas>
        <Mesh vertices={data?.mesh_vertices} />
      </Canvas>
      <Plot data={data?.deflection} />
    </div>
  );
};
```

## Development Guidelines

### When Working with Python Computation

- **Use NumPy for arrays**, not lists (much faster for math)
- **Vectorize everything** - avoid explicit loops when possible
- **Profile before optimizing** - use `cProfile` for bottlenecks
- **Keep computation stateless** - each request is independent
- **Cache 3D mesh generation** - don't regenerate on every request if parameters didn't change

### When Writing React Components

- **Keep components pure** - same props → same render
- **Use TypeScript** - catch bugs early with strict types
- **Handle loading states** - show spinner while waiting for Python backend
- **Error boundaries** - wrap visualization components
- **Memoize expensive renders** - `React.memo()` for 3D components

### Topic Implementation Checklist

Before committing a new topic:
- [ ] Python backend computes correctly (verify against textbook formulas)
- [ ] API endpoint returns properly formatted JSON
- [ ] React component renders without errors
- [ ] Visualization updates in real-time as params change (< 200ms)
- [ ] Edge cases handled (division by zero, negative values, etc.)
- [ ] Content describes concept clearly
- [ ] Example problem worked out step-by-step
- [ ] Mobile responsive design tested

## Common Commands

```bash
# Start development stack
docker-compose up

# Run tests
pytest python-engine/tests/
npm test

# Add new topic
# 1. Add computation code in python-engine/topics/
# 2. Add API route in backend/routes/
# 3. Add React component in frontend/components/
# 4. Update content/*/metadata.json

# Deploy
docker build -t simmec .
docker push <registry>/simmec
```

## Useful Python Libraries

| Library | Use | Example |
|---------|-----|---------|
| NumPy | Array math, linear algebra | `stress = force / area` |
| SciPy | ODE solving, optimization | Simulating system dynamics |
| Matplotlib | 2D plotting | Stress-strain curves |
| Mayavi | 3D visualization | Deformed structures |
| SimPy | Discrete event simulation | Manufacturing processes |
| Control | Control system design | PID tuning, pole placement |

## File Naming Conventions

- Python files: `snake_case.py`
- React components: `PascalCase.tsx`
- Content directories: `topic-code-name/` (e.g., `2.001-stress-strain/`)
- API endpoints: `/api/topic-name` (kebab-case)

## Deployment

See `deploy/README.md` for Docker & cloud setup instructions.

## Common Issues & Solutions

**Issue:** Python computation is slow
→ **Solution:** Profile with `cProfile`, vectorize with NumPy, cache results

**Issue:** 3D visualization doesn't update
→ **Solution:** Ensure WebSocket connection open, check console for errors, verify data format

**Issue:** Formula doesn't match textbook
→ **Solution:** Add unit tests against known solutions, check derivation, verify assumptions

## References

- **MIT Curriculum:** See `/memory/mit-curriculum-mapping.md`
- **Architecture Decision:** See `/memory/tech-stack-decision.md`
- **Implementation Plan:** See primary artifact (interactive dashboard)

## Contact & Support

For questions about adding topics or extending the platform, refer to the implementation plan document or documentation in `docs/`.
