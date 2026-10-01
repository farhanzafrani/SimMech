"""
Manim scene for the "Failure Theories: Von Mises & Tresca" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Plots the
Tresca hexagon and von Mises ellipse in principal-stress space (they touch at
the same six points and the ellipse always bulges outside the hexagon between
them), then places the worked example's stress state (σ1=150, σ2=-50 MPa,
σ_y=350 MPa) to show both theories call it safe, with Tresca more conservative.

Render with:
    manim -qh --format=mp4 -o failure-theories failure_theories_scene.py FailureTheoriesScene
"""

import numpy as np
from manim import (
    Axes,
    Create,
    DOWN,
    Dot,
    FadeIn,
    FadeOut,
    RIGHT,
    Scene,
    Text,
    UP,
    VMobject,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
LEAF = "#2FAE7A"

config.background_color = PAPER


class FailureTheoriesScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Two Rules for Yielding Under Combined Stress", font_size=32, color=INK).to_edge(UP)
        self.play(Write(title))

        axes = Axes(
            x_range=[-3, 3, 3],
            y_range=[-3, 3, 3],
            x_length=6,
            y_length=6,
            axis_config={"color": INK, "stroke_width": 2, "include_tip": True},
        ).move_to([0, -0.4, 0])
        s1_label = Text("σ_1", font_size=24, color=INK).next_to(axes.x_axis.get_end(), RIGHT, buff=0.15)
        s2_label = Text("σ_2", font_size=24, color=INK).next_to(axes.y_axis.get_end(), UP, buff=0.15)
        self.play(Create(axes), Write(s1_label), Write(s2_label))

        # Tresca hexagon — yield strength sits at 2 units on each axis.
        hex_pts = [(2, 0), (2, 2), (0, 2), (-2, 0), (-2, -2), (0, -2)]
        hexagon = VMobject(color=ACCENT, stroke_width=4)
        hexagon.set_points_as_corners([axes.c2p(x, y) for x, y in hex_pts] + [axes.c2p(*hex_pts[0])])
        hex_tag = Text("Tresca", font_size=22, color=ACCENT).next_to(axes.c2p(2, 2), RIGHT, buff=0.15)
        self.play(Create(hexagon), Write(hex_tag))
        self.wait(0.3)

        # Von Mises ellipse — touches the hexagon at the same six vertices, bulges outside between them.
        c = 2.0
        a = np.sqrt(2) * c
        b = np.sqrt(2 / 3) * c
        ts = np.linspace(0, 2 * np.pi, 200)
        ellipse_pts = []
        for t in ts:
            u, v = a * np.cos(t), b * np.sin(t)
            s1 = (u + v) / np.sqrt(2)
            s2 = (u - v) / np.sqrt(2)
            ellipse_pts.append(axes.c2p(s1, s2))
        ellipse = VMobject(color=BLUE, stroke_width=4)
        ellipse.set_points_as_corners(ellipse_pts)
        ellipse_tag = Text("Von Mises", font_size=22, color=BLUE).next_to(axes.c2p(0, 2.9), UP, buff=0.05)
        self.play(Create(ellipse), Write(ellipse_tag))
        self.wait(0.5)

        note = Text("The ellipse always sits outside the hexagon — Tresca predicts yield first", font_size=22, color=INK)
        note.next_to(axes, DOWN, buff=0.5)
        self.play(FadeIn(note))
        self.wait(0.8)

        # The worked example's stress state: σ1=150, σ2=-50, σ_y=350 → 175 MPa per unit.
        point = axes.c2p(150 / 175, -50 / 175)
        dot = Dot(point, color=LEAF, radius=0.09)
        dot_label = Text("this part's stress state", font_size=20, color=LEAF).next_to(dot, DOWN, buff=0.2)
        self.play(FadeIn(dot), Write(dot_label))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
