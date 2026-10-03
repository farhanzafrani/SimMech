"""
Manim scene for the "Helical Compression Spring Design" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Animates
a helical spring (zig-zag side profile) compressing under an axial force,
then highlights where shear stress peaks in the wire cross-section — the
inner fiber closest to the coil's center, which is what the Wahl factor
corrects for.

Render with:
    manim -qh --format=mp4 -o spring-design spring_design_scene.py SpringDesignScene
"""

import numpy as np
from manim import (
    Circle,
    Create,
    DOWN,
    FadeIn,
    FadeOut,
    Line,
    Rectangle,
    Scene,
    Text,
    UP,
    VGroup,
    VMobject,
    ValueTracker,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"

config.background_color = PAPER


class SpringDesignScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Helical Spring Under Load", font_size=36, color=INK).to_edge(UP)
        self.play(Write(title))

        n_coils = 8
        width = 1.1
        top_y = ValueTracker(1.8)
        bottom_y = -1.8

        def spring_shape():
            top = top_y.get_value()
            ys = np.linspace(top, bottom_y, n_coils * 2 + 1)
            pts = [[width if i % 2 == 0 else -width, y, 0] for i, y in enumerate(ys)]
            path = VMobject(color=BLUE, stroke_width=5)
            path.set_points_as_corners(pts)
            return path

        top_plate = Rectangle(width=3, height=0.15, color=INK, fill_color=INK, fill_opacity=1)
        top_plate.add_updater(lambda m: m.move_to([0, top_y.get_value() + 0.1, 0]))
        bottom_plate = Rectangle(width=3, height=0.15, color=INK, fill_color=INK, fill_opacity=1)
        bottom_plate.move_to([0, bottom_y - 0.1, 0])

        spring = spring_shape()
        spring.add_updater(lambda m: m.become(spring_shape()))
        self.play(Create(spring), FadeIn(top_plate), FadeIn(bottom_plate))

        top_anchor = [0, 2.6, 0]
        force_arrow = Line(top_anchor, [0, top_y.get_value() + 0.3, 0], color=ACCENT, stroke_width=6)
        force_arrow.add_updater(lambda m: m.put_start_and_end_on(top_anchor, [0, top_y.get_value() + 0.3, 0]))
        force_label = Text("F", font_size=30, color=ACCENT).next_to(top_anchor, UP, buff=0.1)
        self.play(Create(force_arrow), Write(force_label))
        self.wait(0.3)

        self.play(top_y.animate.set_value(0.4), run_time=1.8)
        self.wait(0.3)

        note = Text("δ = F / k — the coils pull closer together under load", font_size=24, color=INK)
        note.next_to(bottom_plate, DOWN, buff=0.5)
        self.play(FadeIn(note))
        self.wait(1.2)

        spring.clear_updaters()
        top_plate.clear_updaters()
        force_arrow.clear_updaters()
        group = VGroup(spring, top_plate, bottom_plate, force_arrow, force_label, note)
        self.play(FadeOut(group))

        # --- Part 2: peak stress at the inner fiber of the coil ----------------
        self.play(title.animate.become(Text("Peak Stress at the Inner Fiber", font_size=34, color=INK).to_edge(UP)))

        wire = Circle(radius=1.6, color=INK, stroke_width=3)
        self.play(Create(wire))

        hotspot = VMobject(color=ACCENT, stroke_width=10)
        arc_pts = [[1.6 * np.cos(a), 1.6 * np.sin(a), 0] for a in np.linspace(2.6, 3.7, 20)]
        hotspot.set_points_as_corners(arc_pts)
        hot_label = Text("stress peaks here — closest to the coil's center", font_size=22, color=ACCENT)
        hot_label.next_to(wire, DOWN, buff=1.0)
        self.play(Create(hotspot), Write(hot_label))
        self.wait(1.2)

        formula = Text("τ = K_w · 8FD / (π d³) — K_w corrects for this curvature effect", font_size=22, color=INK)
        formula.next_to(hot_label, DOWN, buff=0.4)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
