# SimMec Design Decisions Document

**Date:** September 2026  
**Status:** APPROVED  
**Last Updated:** 2026-09-24

---

## 1. PROJECT SCOPE & OBJECTIVES

### Decision: Full MIT ME Curriculum Coverage
**Rationale:** Comprehensive curriculum provides credibility and maximum educational value  
**Impact:** 50+ interactive topics across 8 semesters  
**Alternatives Rejected:** Single topic, limited courses  
**Commitment:** Phase 1 (MVP), Phase 2 (Foundation), Phase 3 (Advanced)

---

## 2. TECHNOLOGY STACK

### Frontend: React 18 + TypeScript + Vite
**Decision:** React for interactive UI, TypeScript for type safety, Vite for fast dev server  
**Rationale:**
- React: Component-based, fast re-renders, large ecosystem
- TypeScript: Catch bugs at compile time, better DX
- Vite: Instant HMR, fast builds

**Locked In:** ✅
```
React 18+
TypeScript 5+
Vite 4+
```

### Visualization: Three.js + Babylon.js (3D), Plotly.js + D3.js (2D)
**Decision:** GPU-accelerated WebGL for 3D, proven charting libraries for 2D  
**Rationale:**
- Three.js: Popular, performant, good for engineering visuals
- Babylon.js: Alternative, more physics-friendly (optional Phase 2+)
- Plotly.js: Interactive, real-time capable
- D3.js: Custom mechanical diagrams

**Locked In:** ✅
```
Three.js 150+
Plotly.js 2.26+
D3.js 7.8+
```

### Backend: FastAPI
**Decision:** Python web framework with async support  
**Rationale:**
- Async/await for WebSocket real-time updates
- Seamless integration with NumPy/SciPy (Python compute engine)
- Auto-generated API documentation (Swagger)
- Fast performance

**Locked In:** ✅
```
FastAPI 0.100+
Uvicorn (ASGI server)
SQLAlchemy (ORM for Phase 2)
```

### Python Compute Engine: NumPy + SciPy + Manim
**Decision:** NumPy for math, SciPy for advanced algorithms, Manim for animations  
**Rationale:**
- NumPy: Vectorized operations (10-100x faster than loops)
- SciPy: ODE solvers, linear algebra, optimization
- Manim: 3Blue1Brown-quality mathematical animations

**Locked In:** ✅
```
NumPy 1.24+
SciPy 1.10+
Manim 0.18+
```

### Performance Optimization (Phase 2+): Rust + C++
**Decision:** Use compiled languages for compute-heavy operations  
**Rationale:**
- FEA Solver: Rust with nalgebra (10-25x speedup)
- CFD Solver: C++ with OpenFOAM (100x+ speedup)
- PyO3/CFFI for Python bindings

**Locked In:** ⚠️ (Deferred to Phase 2)
```
Rust 1.70+ (PyO3 bindings)
C++ 17+ (CFFI bindings)
```

### Database: PostgreSQL
**Decision:** Relational database for user data, progress tracking  
**Rationale:**
- Proven reliability
- JSONB support for flexible schemas
- Full-text search capabilities

**Locked In:** ⚠️ (Phase 2)
```
PostgreSQL 14+
SQLAlchemy ORM
```

### Caching: Redis
**Decision:** In-memory cache for session data and computed results  
**Rationale:**
- Sub-millisecond access
- Session management
- Real-time feature support

**Locked In:** ⚠️ (Phase 2)
```
Redis 7.0+
```

---

## 3. DESIGN SYSTEM & COLOR PALETTE

### Color Scheme: Light Gray + Light Blue
**Decision:** Professional, accessible, modern  
**Locked In:** ✅

**Primary Colors:**
```css
--light-blue-500: #4a9bb5  /* Main accent */
--light-blue-100: #e0f2f9  /* Hover/highlight */
--light-gray-100: #f5f7fa  /* Card backgrounds */
--dark-gray-800: #2c3e50   /* Text */
```

**Semantic Colors:**
```css
--success: #10b981   /* Valid, elastic region */
--warning: #f59e0b   /* Plastic deformation */
--error: #ef4444     /* Failure, fracture */
--info: #4a9bb5      /* Information boxes */
```

### Typography: Modern, Eye-catching
**Decision:** Professional headings + clean body text  
**Locked In:** ✅

```
Headings: "Poppins" or "Inter" (bold, modern)
Body: "Inter" (clean, readable)
Code: "JetBrains Mono" or "Fira Code" (professional)
```

### Component Library
**Decision:** Build reusable component library from day one  
**Locked In:** ✅

Core Components:
- `InteractiveFormula` - Parameter controls
- `Visualization3D` - Three.js canvas wrapper
- `Graph2D` - Plotly chart wrapper
- `TopicCard` - Topic selection cards
- `MaterialBox` - 3D deformation cube

---

## 4. API DESIGN

### REST API Standard
**Decision:** RESTful endpoints with JSON payloads  
**Rationale:** Stateless, cacheable, widely understood  
**Locked In:** ✅

### Authentication (Phase 2)
**Decision:** JWT tokens for stateless auth  
**Rationale:** Works with distributed systems, no server state needed  
**Deferred:** ⚠️ Phase 2

### WebSocket Support
**Decision:** Real-time parameter updates → instant visualization  
**Rationale:** <100ms response time for interactive features  
**Deferred:** ⚠️ Phase 2 (optional, HTTP polling sufficient for MVP)

---

## 5. ARCHITECTURE PATTERNS

### Component Architecture: React
**Pattern:** Pure functional components with hooks  
**Decision:** Modern React best practices  
**Locked In:** ✅

Rules:
- No class components
- Use TypeScript interfaces
- Memoize expensive renders
- Custom hooks for logic reuse

### Backend Architecture: Layered
**Pattern:** Routes → Services → Business Logic → Data Models  
**Decision:** Separation of concerns, testability  
**Locked In:** ✅

```
FastAPI Routes (app.py)
    ↓
Domain Services (topics/mechanics.py)
    ↓
Business Logic (NumPy/SciPy)
    ↓
Data Models (Pydantic)
```

### Python Compute Engine: Modular
**Pattern:** One module per domain (mechanics.py, dynamics.py, thermal.py, etc.)  
**Decision:** Easy to extend, testable  
**Locked In:** ✅

```
python-engine/topics/
├── mechanics.py     (stress, strain, forces)
├── dynamics.py      (kinematics, vibration)
├── thermal.py       (heat transfer)
├── fluids.py        (flow, CFD)
└── control.py       (control systems)
```

### Content Organization
**Pattern:** JSON metadata + Markdown descriptions  
**Decision:** Version-controllable, flexible  
**Locked In:** ✅

```
content/
└── mechanics/
    └── 2.001-stress-strain/
        ├── metadata.json      (course info)
        ├── description.md     (learning content)
        ├── examples.json      (worked problems)
        └── animations/        (Manim videos)
```

---

## 6. DATA FLOW & COMMUNICATION

### Interactive Formula Workflow
**Pattern:** Parameter Change → HTTP POST → Python Compute → JSON Response → Visualization Update  
**Latency Target:** <100ms  
**Locked In:** ✅

```
User adjusts slider (React state)
    ↓
useSimulation hook fires POST request
    ↓
FastAPI receives /api/stress-strain/compute
    ↓
Python: numpy computation (instant)
    ↓
JSON response with results
    ↓
Three.js + Plotly update visualization
```

### Manim Animation Workflow
**Pattern:** Pre-rendered videos + parameter overlays  
**Decision:** Pre-render for speed, add interactive labels in Phase 3  
**Locked In:** ✅

```
Manim scene → render to MP4
Store in: content/[topic]/animations/
Load from: <video src="/content/..." />
```

---

## 7. PERFORMANCE TARGETS

### MVP Phase Minimums
**Locked In:** ✅

- Page Load: < 2 seconds
- Graph Update: < 100ms after parameter change
- 3D Animation: 60 FPS smooth
- Formula Accuracy: ±0.1% vs textbook
- API Response: < 200ms

### Optimization Strategy
1. **Phase 1 (MVP):** NumPy sufficient for all calculations
2. **Phase 2:** Add Rust for eigenvalue/ODE problems (if needed)
3. **Phase 3:** Add C++ for FEA/CFD solvers

**Decision:** Don't optimize until proven necessary  
**Locked In:** ✅

---

## 8. DEPLOYMENT & INFRASTRUCTURE

### Development Environment
**Decision:** Docker + Docker Compose for reproducible dev  
**Locked In:** ✅ (compose file coming)

### Staging Environment
**Decision:** Automatic deployment from `main` branch  
**Deferred:** ⚠️ Phase 2

### Production Hosting (Phase 2+)
**Options Considered:**
- Vercel (Frontend only)
- Railway or Render (Full stack)
- AWS/GCP/Azure (Enterprise option)

**Decision:** Defer to Phase 2, prioritize MVP correctness  
**Locked In:** ⚠️ (Not decided yet)

---

## 9. TESTING STRATEGY

### Unit Tests
**Decision:** Python backend tests with pytest  
**Coverage Target:** 80%+  
**Locked In:** ✅ (Will implement Phase 2)

### Integration Tests
**Decision:** FastAPI test client  
**Locked In:** ✅ (Will implement Phase 2)

### Component Tests
**Decision:** React Testing Library + Vitest  
**Locked In:** ✅ (Will implement Phase 2)

### Visual Regression
**Decision:** Playwright for UI testing  
**Deferred:** ⚠️ Phase 2

---

## 10. SECURITY CONSIDERATIONS

### CORS Policy
**Decision:** Allow only localhost in dev, restrict in production  
**Locked In:** ✅

### Input Validation
**Decision:** Pydantic models enforce at API boundary  
**Locked In:** ✅

### Authentication (Phase 2)
**Decision:** JWT tokens, HTTPS only  
**Deferred:** ⚠️ Phase 2

---

## 11. CONTENT DECISIONS

### Topics Covered
**Decision:** MIT mechanical engineering curriculum  
**Coverage:**
- Phase 1 MVP: 5 topics (stress-strain + 4 others)
- Phase 2: 20-30 topics (foundation courses)
- Phase 3: 50+ topics (advanced courses)

**Locked In:** ✅

### Accuracy Standard
**Decision:** All formulas verified against textbooks  
**Locked In:** ✅

### Accessibility
**Decision:** WCAG 2.1 AA compliant  
**Implementation:** Phase 1 (basic), Phase 2+ (enhanced)  
**Locked In:** ✅

---

## 12. DECISION MATRIX: ALTERNATIVES REJECTED

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Frontend | React | Vue, Svelte | Larger ecosystem, easier hiring |
| Backend | FastAPI | Django, Flask | Async support, auto docs |
| Math | NumPy | MATLAB, Julia | Open source, Python ecosystem |
| 3D | Three.js | Babylon.js | Maturity, better docs (optional Phase 2) |
| Charts | Plotly | Chart.js, ECharts | Interactive by default |
| Animations | Manim | Custom WebGL | Professional quality |
| Deploy | TBD | Heroku (deprecated) | Evaluating at Phase 2 |

---

## 13. KEY COMMITMENTS

✅ **Locked In - Cannot Change Without Decision Board Approval:**
1. React + TypeScript frontend
2. FastAPI backend
3. NumPy/SciPy compute engine
4. Light Blue + Light Gray design
5. MIT curriculum scope
6. REST API design
7. JSON + Markdown content structure

⚠️ **Deferred Until Phase 2:**
1. Production hosting platform
2. PostgreSQL + Redis infrastructure
3. User authentication
4. Rust/C++ optimization
5. Advanced WebSocket features

---

## 14. CHANGE LOG

| Date | Decision | Status |
|------|----------|--------|
| 2026-09-24 | Tech stack finalized | APPROVED |
| 2026-09-24 | Color scheme locked | APPROVED |
| 2026-09-24 | Architecture patterns set | APPROVED |
| 2026-09-24 | MVP scope defined | APPROVED |

---

## 15. NEXT CHECKPOINT

**Before Phase 2:** Revisit hosting, auth, and database decisions based on Phase 1 learnings

**Approval Required From:** Project Lead, Technical Lead  
**Review Date:** End of Phase 1 (Week 6)

---

**This document is the source of truth for all technical decisions. Any changes must be documented here.**
