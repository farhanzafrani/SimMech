"""
Manim scene for the "Columns & Buckling" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Animates
a slender pin-pinned column under a growing axial load: it stays straight,
then suddenly bows sideways into its buckled mode shape once the load nears
the Euler critical load — a geometry failure, not a material one.

Render with:
    manim -qh --format=mp4 -o columns-buckling buckling_scene.py BucklingScene
"""

import numpy as np
from manim import (
    Circle,
    Create,
    DOWN,
    FadeIn,
    FadeOut,
    Line,
    Scene,
    Text,
    Triangle,
    UP,
    VMobject,
    ValueTracker,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
ERROR = "#E23F3F"

config.background_color = PAPER


class BucklingScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Slender Column Under Axial Load", font_size=36, color=INK).to_edge(UP)
        self.play(Write(title))

        top_y, bottom_y = 1.7, -1.8

        pin_top = Circle(radius=0.09, color=INK, fill_color=INK, fill_opacity=1).move_to([0, top_y, 0])
        pin_bottom = Circle(radius=0.09, color=INK, fill_color=INK, fill_opacity=1).move_to([0, bottom_y, 0])
        base = Triangle(color=INK, fill_color=INK, fill_opacity=0.85).scale(0.22).move_to([0, bottom_y - 0.22, 0])

        bow = ValueTracker(0.0)

        def column_shape():
            ys = np.linspace(bottom_y, top_y, 60)
            span = top_y - bottom_y
            pts = [[bow.get_value() * np.sin(np.pi * (y - bottom_y) / span), y, 0] for y in ys]
            path = VMobject(color=BLUE, stroke_width=10)
            path.set_points_as_corners(pts)
            return path

        column = column_shape()
        self.play(Create(column), FadeIn(pin_top), FadeIn(pin_bottom), FadeIn(base))

        load_arrow = Line([0, top_y + 0.8, 0], [0, top_y + 0.15, 0], color=ACCENT, stroke_width=6)
        load_label = Text("P", font_size=30, color=ACCENT).next_to(load_arrow, UP, buff=0.1)
        self.play(Create(load_arrow), Write(load_label))

        note = Text("Push harder... and harder...", font_size=24, color=INK).next_to(base, DOWN, buff=0.6)
        self.play(FadeIn(note))
        self.wait(0.6)
        self.play(FadeOut(note))

        # --- The sudden sideways snap at the critical load ----------------------
        snap_note = Text("At P_cr, it suddenly bows sideways", font_size=26, color=ERROR).next_to(base, DOWN, buff=0.6)
        column.add_updater(lambda m: m.become(column_shape()))
        self.play(bow.animate.set_value(1.0), run_time=1.4, rate_func=lambda t: t**3)
        column.clear_updaters()
        self.play(FadeIn(snap_note))
        self.wait(1.0)

        formula = Text("P_cr = π² E I / (K L)² — geometry, not material strength", font_size=24, color=INK)
        formula.next_to(snap_note, DOWN, buff=0.4)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
