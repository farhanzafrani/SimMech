"""
Manim scene for the "Beam Deflection" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Animates
a simply supported beam sagging into its elastic curve under a midspan load,
then a small gauge comparing the actual deflection against a serviceability
limit (L/360), matching the worked example's "comfortably inside the limit"
result.

Render with:
    manim -qh --format=mp4 -o beam-deflection beam_deflection_scene.py BeamDeflectionScene
"""

import numpy as np
from manim import (
    Create,
    DashedLine,
    DOWN,
    FadeIn,
    FadeOut,
    Line,
    RIGHT,
    Scene,
    Text,
    Triangle,
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
LEAF = "#2FAE7A"

config.background_color = PAPER


def support_triangle(x, color=INK):
    tri = Triangle(color=color, fill_color=color, fill_opacity=0.85).scale(0.22)
    tri.move_to([x, -0.22, 0])
    return tri


class BeamDeflectionScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Beam Deflection Under Load", font_size=38, color=INK).to_edge(UP)
        self.play(Write(title))

        # --- Part 1: the beam sags into its elastic curve -----------------------
        half = 3.8
        original = Line([-half, 0, 0], [half, 0, 0], color=INK, stroke_width=2)
        original.set_stroke(opacity=0.3)
        support_a = support_triangle(-half)
        support_b = support_triangle(half)
        self.play(Create(original), FadeIn(support_a), FadeIn(support_b))

        load_arrow = Line([0, 1.1, 0], [0, 0.15, 0], color=ACCENT, stroke_width=6)
        load_label = Text("P", font_size=28, color=ACCENT).next_to(load_arrow, UP, buff=0.1)
        self.play(Create(load_arrow), Write(load_label))

        sag = ValueTracker(0.0)

        def curve():
            xs = np.linspace(-half, half, 60)
            pts = [[x, -sag.get_value() * np.sin(np.pi * (x + half) / (2 * half)), 0] for x in xs]
            path = VMobject(color=BLUE, stroke_width=5)
            path.set_points_as_corners(pts)
            return path

        deflected = curve()
        self.add(deflected)
        deflected.add_updater(lambda m: m.become(curve()))
        self.play(sag.animate.set_value(1.1), run_time=1.8)
        deflected.clear_updaters()

        delta_line = DashedLine([0, 0, 0], [0, -1.1, 0], color=INK, stroke_width=2)
        delta_label = Text("δ", font_size=26, color=INK).next_to(delta_line, RIGHT, buff=0.12).shift(DOWN * 0.3)
        self.play(Create(delta_line), Write(delta_label))
        self.wait(0.5)

        note = Text("EI y″ = M(x) — curvature follows the bending moment", font_size=24, color=INK)
        note.next_to(VGroup(original, support_a, support_b), DOWN, buff=1.7)
        self.play(FadeIn(note))
        self.wait(1.2)

        scene_group = VGroup(note, delta_line, delta_label, deflected, load_arrow, load_label, original, support_a, support_b)
        self.play(FadeOut(scene_group))

        # --- Part 2: checking a serviceability limit ----------------------------
        self.play(title.animate.become(Text("Checking a Deflection Limit", font_size=38, color=INK).to_edge(UP)))

        bar_axis = Line([-4, -1, 0], [4, -1, 0], color=INK, stroke_width=3)
        limit_x = 2.2
        limit_tick = Line([limit_x, -1.25, 0], [limit_x, -0.75, 0], color=ACCENT, stroke_width=4)
        limit_label = Text("L / 360 limit", font_size=22, color=ACCENT).next_to(limit_tick, UP, buff=0.2)
        self.play(Create(bar_axis), Create(limit_tick), Write(limit_label))

        actual_x = 0.9
        fill_bar = Line([-4, -1, 0], [actual_x, -1, 0], color=LEAF, stroke_width=10)
        actual_tick = Line([actual_x, -1.25, 0], [actual_x, -0.75, 0], color=LEAF, stroke_width=4)
        actual_label = Text("actual δ ≈ 4.05 mm", font_size=22, color=LEAF).next_to(actual_tick, DOWN, buff=0.2)
        self.play(Create(fill_bar), Create(actual_tick), Write(actual_label))
        self.wait(0.3)

        pass_label = Text("Well inside the ~16.7 mm limit — this beam passes", font_size=26, color=LEAF)
        pass_label.next_to(bar_axis, DOWN, buff=1.0)
        self.play(Write(pass_label))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
