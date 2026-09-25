"""
Manim scene for the "Bending Stress in Beams" topic.

No LaTeX distribution is available in this environment, so labels use
Manim's Pango-backed `Text` (not `MathTex`/`Tex`) — the site itself renders
the real typeset equations via KaTeX. This animation carries the physical
intuition: a bent beam's top fibers compress and bottom fibers stretch, and
across the cross-section the bending stress grows linearly away from the
neutral axis.

Render with:
    manim -qh --format=mp4 -o bending_stress bending_stress_scene.py BendingStressScene
"""

import numpy as np
from manim import (
    DOWN,
    RIGHT,
    UP,
    Create,
    FadeIn,
    FadeOut,
    Line,
    ManimColor,
    Scene,
    Text,
    VGroup,
    VMobject,
    ValueTracker,
    Write,
    config,
    interpolate_color,
)

PAPER = "#F3F0E8"
INK = "#16191D"
ACCENT = "#C2410C"
BLUE = "#1E4E8C"

config.background_color = PAPER


class BendingStressScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Bending Stress in a Beam", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.3)

        # --- Part 1: a beam segment bowing under an applied moment ------------
        curvature = ValueTracker(0.0)
        half_len = 4.0

        def beam_shape():
            xs = np.linspace(-half_len, half_len, 40)
            bow = curvature.get_value()
            top = [[x, 0.8 + bow * (1 - (x / half_len) ** 2), 0] for x in xs]
            bottom = [[x, -0.8 - bow * (1 - (x / half_len) ** 2), 0] for x in list(reversed(xs))]
            poly = VMobject(color=INK, fill_color=BLUE, fill_opacity=0.12, stroke_width=2)
            poly.set_points_as_corners(top + bottom + [top[0]])
            return poly

        beam = beam_shape()
        self.play(Create(beam))
        self.wait(0.2)

        beam.add_updater(lambda m: m.become(beam_shape()))
        self.play(curvature.animate.set_value(0.55), run_time=2.0)
        beam.clear_updaters()

        top_label = Text("compression — fibers shorten", font_size=24, color=BLUE).next_to(beam, UP, buff=0.35)
        bottom_label = Text("tension — fibers stretch", font_size=24, color=ACCENT).next_to(beam, DOWN, buff=0.35)
        self.play(Write(top_label), Write(bottom_label))
        self.wait(0.3)

        neutral_axis = Line([-half_len, 0, 0], [half_len, 0, 0], color=INK, stroke_width=1.5)
        neutral_axis.set_stroke(opacity=0.6)
        na_label = Text("neutral axis", font_size=20, color=INK).next_to(neutral_axis, RIGHT, buff=0.3)
        self.play(Create(neutral_axis), Write(na_label))
        self.wait(1.0)

        self.play(*[FadeOut(m) for m in (beam, top_label, bottom_label, neutral_axis, na_label)])

        # --- Part 2: cross-section stress distribution -------------------------
        self.play(title.animate.become(Text("Stress Across the Cross-Section", font_size=36, color=INK).to_edge(UP)))

        section_h = 4.2
        section_w = 2.0
        n_bands = 14
        bands = VGroup()
        for i in range(n_bands):
            frac_top = i / n_bands
            frac_bot = (i + 1) / n_bands
            y_top = section_h / 2 - frac_top * section_h
            y_bot = section_h / 2 - frac_bot * section_h
            t = 1 - (i + 0.5) / n_bands  # 1 at top (compression/blue) -> 0 at bottom (tension/accent)
            color = interpolate_color(ManimColor(ACCENT), ManimColor(BLUE), t)
            band = VMobject(color=color, fill_color=color, fill_opacity=0.9, stroke_width=0)
            band.set_points_as_corners([
                [-section_w / 2, y_top, 0],
                [section_w / 2, y_top, 0],
                [section_w / 2, y_bot, 0],
                [-section_w / 2, y_bot, 0],
                [-section_w / 2, y_top, 0],
            ])
            bands.add(band)

        outline = Line([-section_w / 2, section_h / 2, 0], [section_w / 2, section_h / 2, 0], color=INK)
        section_group = VGroup(bands)
        self.play(FadeIn(section_group), run_time=1.2)

        na_line = Line([-section_w / 2 - 0.6, 0, 0], [section_w / 2 + 2.4, 0, 0], color=INK, stroke_width=1.5)
        na_line2 = Line([section_w / 2, 0, 0], [section_w / 2 + 2.4, 0, 0], color=INK, stroke_width=1.5).set_stroke(opacity=0.6)
        zero_label = Text("σ = 0 at the neutral axis", font_size=22, color=INK).next_to(na_line2, RIGHT, buff=-4.2).shift(UP * 0.4)

        top_arrow = Line([section_w / 2 + 0.2, section_h / 2, 0], [section_w / 2 + 1.0, section_h / 2, 0], color=BLUE, stroke_width=3)
        top_label = Text("+σ_max (compression)", font_size=20, color=BLUE).next_to(top_arrow, RIGHT, buff=0.15)
        bottom_arrow = Line([section_w / 2 + 0.2, -section_h / 2, 0], [section_w / 2 + 1.0, -section_h / 2, 0], color=ACCENT, stroke_width=3)
        bottom_label = Text("−σ_max (tension)", font_size=20, color=ACCENT).next_to(bottom_arrow, RIGHT, buff=0.15)

        self.play(Create(na_line2), Write(zero_label))
        self.play(Create(top_arrow), Write(top_label), Create(bottom_arrow), Write(bottom_label))
        self.wait(1.0)

        formula = Text("σ(y) = M y / I   —   grows linearly away from the neutral axis", font_size=26, color=INK)
        formula.next_to(section_group, DOWN, buff=1.1)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
