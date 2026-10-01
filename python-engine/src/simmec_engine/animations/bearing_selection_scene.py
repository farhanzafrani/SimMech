"""
Manim scene for the "Rolling-Element Bearing Selection: L10 Life" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Shows a
ball-bearing cross-section with the balls orbiting between the races, then
the worked example's L10 life computation (C=25kN, P=5kN, k=3 → 125 million
revolutions, about 1,157 hours at 1800 rpm).

Render with:
    manim -qh --format=mp4 -o bearing-selection bearing_selection_scene.py BearingSelectionScene
"""

import numpy as np
from manim import (
    Circle,
    Create,
    DOWN,
    Dot,
    FadeIn,
    FadeOut,
    Rotate,
    Scene,
    Text,
    UP,
    VGroup,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
BLUE = "#0EA5D9"
LEAF = "#2FAE7A"

config.background_color = PAPER


class BearingSelectionScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Inside a Ball Bearing", font_size=38, color=INK).to_edge(UP)
        self.play(Write(title))

        outer = Circle(radius=2.0, color=INK, stroke_width=4)
        inner = Circle(radius=1.1, color=INK, stroke_width=4)
        shaft = Circle(radius=0.35, color=INK, fill_color=INK, fill_opacity=1)
        self.play(Create(outer), Create(inner), FadeIn(shaft))

        n_balls = 10
        balls = VGroup(*[
            Dot(1.55 * np.array([np.cos(a), np.sin(a), 0]), color=BLUE, radius=0.16)
            for a in np.linspace(0, 2 * np.pi, n_balls, endpoint=False)
        ])
        self.play(FadeIn(balls))
        self.wait(0.3)

        self.play(Rotate(balls, angle=2 * np.pi / n_balls * 3, about_point=[0, 0, 0], run_time=2.0))
        self.wait(0.3)

        note = Text("Every rolling contact is a tiny fatigue cycle", font_size=24, color=INK)
        note.next_to(outer, DOWN, buff=0.6)
        self.play(FadeIn(note))
        self.wait(1.0)

        bearing_group = VGroup(outer, inner, shaft, balls, note)
        self.play(FadeOut(bearing_group))

        # --- Part 2: L10 life ----------------------------------------------------
        self.play(title.animate.become(Text("L10 Life: 90% Survive This Long", font_size=34, color=INK).to_edge(UP)))

        formula = Text("L10 = (C / P)^k = (25 / 5)³ = 125 million revolutions", font_size=26, color=INK)
        formula.move_to([0, 1.0, 0])
        self.play(Write(formula))
        self.wait(0.8)

        result = Text("≈ 1,157 hours (~48 days) at 1800 rpm", font_size=30, color=LEAF)
        result.next_to(formula, DOWN, buff=0.6)
        self.play(Write(result))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
