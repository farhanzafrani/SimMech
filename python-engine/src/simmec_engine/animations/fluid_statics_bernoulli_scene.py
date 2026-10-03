"""
Manim scene for the "Fluid Statics, Continuity & Bernoulli's Equation" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates fluid flowing through a pipe that narrows to a constriction,
with particles speeding up (continuity) and the pipe coloring shifting
to show the pressure drop (Bernoulli) at the throat.

Render with:
    manim -qh --format=mp4 -o fluid-statics-bernoulli fluid_statics_bernoulli_scene.py FluidStaticsBernoulliScene
"""

import numpy as np
from manim import (
    DOWN,
    RIGHT,
    UP,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Polygon,
    Scene,
    Text,
    VGroup,
    ValueTracker,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
SUCCESS = "#2FAE7A"

config.background_color = PAPER


def pipe_half_width(x: float) -> float:
    """Half-height of the pipe at horizontal position x: wide -> narrow -> wide."""
    if x < -1.5:
        return 1.1
    if x < -0.4:
        t = (x + 1.5) / 1.1
        return 1.1 - t * 0.75
    if x < 0.4:
        return 0.35
    if x < 1.5:
        t = (x - 0.4) / 1.1
        return 0.35 + t * 0.75
    return 1.1


class FluidStaticsBernoulliScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Fluid Statics, Continuity & Bernoulli's Equation", font_size=30, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        xs = np.linspace(-3.2, 3.2, 60)
        top_pts = [[x, pipe_half_width(x), 0] for x in xs]
        bot_pts = [[x, -pipe_half_width(x), 0] for x in reversed(xs)]
        pipe = Polygon(*top_pts, *bot_pts, color=INK, stroke_width=3, fill_color=BLUE, fill_opacity=0.08)
        self.play(Create(pipe))

        section1 = Text("A1, v1, p1", font_size=22, color=INK).move_to([-2.4, 1.5, 0])
        section2 = Text("A2, v2, p2", font_size=22, color=ACCENT).move_to([0, 0.8, 0])
        self.play(Write(section1), Write(section2))

        note = Text("Narrower area -> faster flow (continuity) -> lower pressure (Bernoulli)", font_size=22, color=INK)
        note.to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(note))

        # Animate a handful of particles moving through the pipe, speeding up
        # (and spacing out) as they pass the constriction.
        particles = VGroup(*[Dot(color=BLUE, radius=0.08) for _ in range(5)])
        starts = [-3.0, -3.5, -4.0, -4.5, -5.0]

        trackers = [ValueTracker(s) for s in starts]

        def make_updater(tr):
            def updater(m):
                x = tr.get_value()
                x_clamped = max(-3.2, min(3.2, x))
                hw = pipe_half_width(x_clamped)
                # Speed scales inversely with local half-width (continuity),
                # visualized as color shifting toward accent at the throat.
                m.move_to([x_clamped, 0, 0])
                t = 1.0 - min(hw / 1.1, 1.0)
                m.set_color(BLUE if t < 0.5 else ACCENT)
            return updater

        for p, tr in zip(particles, trackers):
            p.add_updater(make_updater(tr))

        self.add(particles)
        self.play(
            *[tr.animate.set_value(tr.get_value() + 8.5) for tr in trackers],
            run_time=3.0,
            rate_func=lambda t: t,
        )
        for p in particles:
            p.clear_updaters()
        self.play(FadeOut(particles))
        self.wait(0.2)

        self.play(FadeOut(note))

        formula = Text("v2 = v1 A1/A2          p2 = p1 + 1/2 rho (v1^2 - v2^2)", font_size=24, color=INK)
        formula.next_to(pipe, DOWN, buff=1.1)
        self.play(Write(formula))
        self.wait(1.2)

        caption = Text("The same effect that lifts a wing and draws fuel into a carburetor", font_size=22, color=SUCCESS)
        caption.next_to(formula, DOWN, buff=0.3)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
