"""
Manim scene for the "Bolted Joint Design & Preload" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Shows a
preloaded bolt clamping two plates, then a bar chart comparing the preload,
the resultant bolt load, and the resultant plate load from the worked example
— making visible that most of the external load unloads the plates rather
than stretching the bolt further.

Render with:
    manim -qh --format=mp4 -o bolted-joints bolted_joints_scene.py BoltedJointsScene
"""

from manim import (
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
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"

config.background_color = PAPER


class BoltedJointsScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Preloaded Bolted Joint", font_size=36, color=INK).to_edge(UP)
        self.play(Write(title))

        # --- Part 1: bolt clamping two plates -----------------------------------
        plate_top = Rectangle(width=3.4, height=0.7, color=INK, fill_color=BLUE, fill_opacity=0.15).move_to([0, 0.5, 0])
        plate_bottom = Rectangle(width=3.4, height=0.7, color=INK, fill_color=BLUE, fill_opacity=0.15).move_to([0, -0.5, 0])
        bolt_shaft = Line([0, 1.6, 0], [0, -1.6, 0], color=ACCENT, stroke_width=10)
        bolt_head = Rectangle(width=0.6, height=0.25, color=ACCENT, fill_color=ACCENT, fill_opacity=1).move_to([0, 1.7, 0])
        nut = Rectangle(width=0.5, height=0.25, color=ACCENT, fill_color=ACCENT, fill_opacity=1).move_to([0, -1.7, 0])
        self.play(Create(plate_top), Create(plate_bottom), Create(bolt_shaft), FadeIn(bolt_head), FadeIn(nut))

        preload_label = Text("Tightened: bolt in tension, plates in compression", font_size=22, color=INK)
        preload_label.next_to(plate_bottom, DOWN, buff=0.6)
        self.play(FadeIn(preload_label))
        self.wait(1.0)

        p_arrow = Line([-2.4, 2.3, 0], [-2.4, 1.8, 0], color=BLUE, stroke_width=6)
        p_label = Text("P (external load)", font_size=22, color=BLUE).next_to(p_arrow, UP, buff=0.1)
        self.play(FadeOut(preload_label), Create(p_arrow), Write(p_label))
        self.wait(0.8)

        diagram = VGroup(plate_top, plate_bottom, bolt_shaft, bolt_head, nut, p_arrow, p_label)
        self.play(diagram.animate.scale(0.55).to_edge(UP, buff=1.3))

        # --- Part 2: bar chart — preload vs. resultant loads --------------------
        base_y = -2.6
        bars = [
            ("F_i (preload)", 36.7, ACCENT),
            ("F_b (bolt, loaded)", 41.7, ACCENT),
            ("F_m (plates, loaded)", 21.7, BLUE),
        ]
        chart = VGroup()
        x0 = -3.6
        for i, (label, value, color) in enumerate(bars):
            x = x0 + i * 3.6
            height = value / 48.9 * 2.2
            bar = Rectangle(width=0.9, height=height, color=color, fill_color=color, fill_opacity=0.85)
            bar.move_to([x, base_y + height / 2, 0])
            val_label = Text(f"{value:.1f} kN", font_size=20, color=INK).next_to(bar, UP, buff=0.1)
            name_label = Text(label, font_size=18, color=INK).next_to(bar, DOWN, buff=0.15)
            chart.add(bar, val_label, name_label)

        self.play(FadeIn(chart))
        self.wait(1.0)

        caption = Text("Most of P unloads the plates — the bolt barely notices it", font_size=22, color=INK)
        caption.next_to(chart, DOWN, buff=0.6)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
