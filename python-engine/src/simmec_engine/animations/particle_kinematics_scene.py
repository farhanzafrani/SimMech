"""
Manim scene for the "Kinematics of Particles" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates a particle moving along a circular arc, showing how its
acceleration splits into a tangential component (speeding up) and a
normal component (turning toward the center of curvature). Geometry is
computed analytically (angle -> position) rather than by introspecting a
Manim path object, which keeps the tangent/normal directions exact.

Render with:
    manim -qh --format=mp4 -o particle-kinematics particle_kinematics_scene.py ParticleKinematicsScene
"""

import numpy as np
from manim import (
    DOWN,
    RIGHT,
    UP,
    Arc,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
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

CENTER = np.array([1.8, -0.3, 0.0])
RADIUS = 2.6
START_ANGLE = 2.7
SWEEP = 1.9


def point_on_arc(t: float) -> np.ndarray:
    """t in [0, 1] -> position along the arc."""
    angle = START_ANGLE + SWEEP * t
    return CENTER + RADIUS * np.array([np.cos(angle), np.sin(angle), 0.0])


def tangent_dir(t: float) -> np.ndarray:
    angle = START_ANGLE + SWEEP * t
    d = np.array([-np.sin(angle), np.cos(angle), 0.0])
    return d / np.linalg.norm(d)


class ParticleKinematicsScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Kinematics of Particles", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        path = Arc(radius=RADIUS, start_angle=START_ANGLE, angle=SWEEP, arc_center=CENTER, color=INK, stroke_width=3)
        self.play(Create(path))

        center_dot = Dot(CENTER, color=INK, radius=0.05)
        center_label = Text("center of curvature", font_size=20, color=INK).next_to(center_dot, DOWN, buff=0.15)
        self.play(FadeIn(center_dot), FadeIn(center_label))

        t_tracker = ValueTracker(0.0)
        particle = Dot(point_on_arc(0.0), color=INK, radius=0.11)
        particle.add_updater(lambda m: m.move_to(point_on_arc(t_tracker.get_value())))
        self.play(FadeIn(particle))

        note = Text("v (tangent direction) — the path shows where the particle has been", font_size=22, color=INK)
        note.to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(note))

        def a_t_line():
            p = point_on_arc(t_tracker.get_value())
            tan = tangent_dir(t_tracker.get_value())
            return Line(p, p + tan * 0.9, color=ACCENT, stroke_width=6)

        def a_n_line():
            p = point_on_arc(t_tracker.get_value())
            nrm = (CENTER - p) / np.linalg.norm(CENTER - p)
            return Line(p, p + nrm * 0.9, color=BLUE, stroke_width=6)

        def a_res_line():
            p = point_on_arc(t_tracker.get_value())
            tan = tangent_dir(t_tracker.get_value())
            nrm = (CENTER - p) / np.linalg.norm(CENTER - p)
            return Line(p, p + tan * 0.9 + nrm * 0.9, color=INK, stroke_width=4)

        a_t_vec = a_t_line()
        a_n_vec = a_n_line()
        a_res_vec = a_res_line()
        a_t_label = Text("a_t", font_size=26, color=ACCENT).next_to(a_t_vec.get_end(), UP, buff=0.1)
        a_n_label = Text("a_n", font_size=26, color=BLUE).next_to(a_n_vec.get_end(), RIGHT, buff=0.1)
        a_label = Text("a", font_size=24, color=INK).next_to(a_res_vec.get_end(), RIGHT, buff=0.1)
        self.play(
            Create(a_t_vec), Create(a_n_vec), Create(a_res_vec),
            Write(a_t_label), Write(a_n_label), Write(a_label),
        )
        self.wait(0.6)
        self.play(FadeOut(a_t_vec), FadeOut(a_n_vec), FadeOut(a_res_vec), FadeOut(a_t_label), FadeOut(a_n_label), FadeOut(a_label))

        self.play(t_tracker.animate.set_value(1.0), run_time=3.0, rate_func=lambda t: t)
        particle.clear_updaters()
        self.wait(0.3)

        formula = Text("a = (dv/dt) e_t + (v^2 / rho) e_n", font_size=28, color=INK)
        formula.next_to(note, DOWN, buff=0.35)
        self.play(FadeOut(note), Write(formula))
        self.wait(1.2)

        caption = Text("Turning always costs acceleration — even at constant speed", font_size=24, color=SUCCESS)
        caption.next_to(formula, DOWN, buff=0.3)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
