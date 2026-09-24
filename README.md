# SimMec: Interactive Mechanical Engineering Platform

## 🚀 Project Kick-off

Building an interactive web platform for learning mechanical engineering through visual demonstrations, based on MIT's curriculum.

**Status:** Development Started  
**Tech Stack:** React 18 + TypeScript | FastAPI | Python (NumPy/SciPy/Manim)  
**Target:** 50+ interactive topics, 8 semesters of ME curriculum  

---

## 🎨 Color Scheme

**Primary Colors:**
- Light Blue: `#e8f4f8` (backgrounds, accents)
- Darker Blue: `#4a9bb5` (headings, active states)
- Light Gray: `#f5f7fa` (secondary backgrounds)
- Dark Gray: `#2c3e50` (text, strong elements)

**Usage:**
- Light Blue: Interactive elements, hover states
- Light Gray: Card backgrounds, dividers
- Dark Gray: Text, typography
- Accent Colors: Green (#10b981) for success, Red (#ef4444) for alerts

---

## 📁 Project Structure

```
SimMec/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── InteractiveFormula.tsx
│   │   │   ├── Visualization3D.tsx
│   │   │   ├── Graph2D.tsx
│   │   │   └── TopicCard.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CoursePage.tsx
│   │   │   ├── TopicPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── hooks/
│   │   │   ├── useSimulation.ts
│   │   │   └── useTheme.ts
│   │   ├── styles/
│   │   │   └── theme.ts       # Color theme
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # FastAPI server
│   ├── app.py
│   ├── routes/
│   │   ├── topics.py
│   │   ├── simulations.py
│   │   └── users.py
│   ├── models/
│   │   └── database.py
│   └── requirements.txt
│
├── python-engine/            # Computation engine
│   ├── topics/
│   │   ├── mechanics.py      # Stress, strain, forces
│   │   ├── dynamics.py       # Kinematics, vibration
│   │   ├── thermal.py        # Heat transfer
│   │   ├── fluids.py         # Flow, CFD basics
│   │   └── control.py        # Control systems
│   ├── animations/           # Manim scripts
│   │   ├── mechanics/
│   │   ├── dynamics/
│   │   └── thermal/
│   ├── utils/
│   │   ├── math_utils.py
│   │   └── visualization.py
│   └── requirements.txt
│
├── content/                  # Course content
│   ├── mechanics/
│   │   └── 2.001-stress-strain/
│   │       ├── metadata.json
│   │       ├── description.md
│   │       └── animations/
│   ├── dynamics/
│   └── thermal/
│
├── docs/                     # Documentation
│   ├── architecture.md
│   ├── adding-topics.md
│   └── api-reference.md
│
├── CLAUDE.md                 # Developer guide
├── docker-compose.yml
└── .env.example
```

---

## 🎯 MVP Phase Deliverables

**Week 1-2:** Project Setup & Architecture
- [ ] Frontend scaffold (React + Vite)
- [ ] Backend scaffold (FastAPI)
- [ ] Database models
- [ ] Color theme system
- [ ] Component library started

**Week 2-4:** Stress-Strain Topic (Full Pipeline)
- [ ] Python: NumPy stress-strain calculator
- [ ] Manim: Hooke's Law animation
- [ ] FastAPI: `/api/stress-strain` endpoint
- [ ] React: Parameter controls + 3D visualization
- [ ] Deploy & test

**Week 4-6:** 4 More MVP Topics
- [ ] 4-Bar Linkage Kinematics
- [ ] Heat Transfer (Fourier's Law)
- [ ] Bernoulli Equation & Flow
- [ ] PID Control Systems

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)

### Setup Development Environment

```bash
# 1. Clone/navigate to project
cd SimMec

# 2. Frontend setup
cd frontend
npm install
npm run dev

# 3. In another terminal: Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload

# 4. In another terminal: Python engine (optional for now)
cd ../python-engine
pip install -r requirements.txt
```

### Or use Docker

```bash
docker-compose up
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 📚 Learning Resources

- **MIT ME Curriculum:** See `/CLAUDE.md`
- **Architecture Guide:** See `docs/architecture.md`
- **Adding Topics:** See `docs/adding-topics.md`
- **Color System:** See `frontend/src/styles/theme.ts`

---

## 🎨 Design System

### Typography
- Headings: Bold, Dark Gray (#2c3e50)
- Body: Regular, Dark Gray
- Accent: Light Blue (#4a9bb5)

### Components
- Cards: Light Gray (#f5f7fa) background, subtle shadow
- Buttons: Light Blue background, darker on hover
- Inputs: Light Blue border, Light Gray background
- Sliders: Light Blue track, darker handle

### Spacing
- Padding: 8px, 16px, 24px, 32px
- Gap: 12px between elements
- Margin: 16px, 24px between sections

---

## 🛠️ Development Tips

1. **Component Structure:** Keep components pure and testable
2. **Type Safety:** Use TypeScript everywhere
3. **Performance:** Use React.memo for expensive renders
4. **Testing:** Write tests as you go
5. **Color Consistency:** Always use theme tokens, not hardcoded colors

---

## 📖 Documentation

- [Architecture](docs/architecture.md)
- [Adding New Topics](docs/adding-topics.md)
- [API Reference](docs/api-reference.md)
- [Color Theme System](frontend/src/styles/theme.ts)
- [Component Library](frontend/src/components/)

---

## 👥 Team

**Started:** September 2026  
**Status:** Phase 1 - Foundation Building

---

## 📝 License

Educational Project - MIT Curriculum Based

---

## 🔗 References

- MIT Mechanical Engineering: https://meche.mit.edu/
- Manim: https://github.com/3b1b/manim
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/

---

**Next:** Start Phase 1 implementation with Stress-Strain topic 🚀
