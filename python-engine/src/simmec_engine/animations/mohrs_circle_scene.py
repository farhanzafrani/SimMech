"""
Manim scene for the "Combined Loading & Mohr's Circle" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Animates
a stress element under combined normal and shear stress, then constructs
Mohr's circle and reads off the principal stresses, matching the worked
example (σ_x = 80, σ_y = 40, τ_xy = 20 → σ_avg = 60, R ≈ 28.3, σ1 ≈ 88.3,
σ2 ≈ 31.7 MPa).

Render with:
    manim -qh --format=mp4 -o combined-loading-mohrs-circle mohrs_circle_scene.py MohrsCircleScene
"""

from manim import (
    Circle,
    Create,
    DashedLine,
    DOWN,
    Dot,
    FadeIn,
    FadeOut,
    LEFT,
    Line,
    RIGHT,
    Scene,
    Square,
    Text,
    UP,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
VIOLET = "#8B6FE8"

config.background_color = PAPER


class MohrsCircleScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Stress Element Under Combined Loading", font_size=34, color=INK).to_edge(UP)
        self.play(Write(title))

        # --- Part 1: a stress element with normal and shear stress --------------
        square = Square(side_length=2.2, color=INK, fill_color=BLUE, fill_opacity=0.12, stroke_width=3)
        self.play(Create(square))

        sx_r = Line(square.get_right(), square.get_right() + RIGHT * 0.9, color=ACCENT, stroke_width=6)
        sx_l = Line(square.get_left(), square.get_left() + LEFT * 0.9, color=ACCENT, stroke_width=6)
        sx_label = Text("σ_x", font_size=24, color=ACCENT).next_to(sx_r, RIGHT, buff=0.1)
        self.play(Create(sx_r), Create(sx_l), Write(sx_label))

        sy_t = Line(square.get_top(), square.get_top() + UP * 0.9, color=BLUE, stroke_width=6)
        sy_b = Line(square.get_bottom(), square.get_bottom() + DOWN * 0.9, color=BLUE, stroke_width=6)
        sy_label = Text("σ_y", font_size=24, color=BLUE).next_to(sy_t, UP, buff=0.1)
        self.play(Create(sy_t), Create(sy_b), Write(sy_label))

        tau_top = Line(
            square.get_corner(UP + LEFT), square.get_corner(UP + LEFT) + RIGHT * 0.7, color=VIOLET, stroke_width=5
        )
        tau_label = Text("τ_xy", font_size=22, color=VIOLET).next_to(square, LEFT, buff=0.6).shift(UP * 0.8)
        self.play(Create(tau_top), Write(tau_label))
        self.wait(0.6)

        note = Text("Cut it a different way and the mix of stress looks different", font_size=22, color=INK)
        note.next_to(square, DOWN, buff=1.8)
        self.play(FadeIn(note))
        self.wait(1.0)

        element_group = [square, sx_r, sx_l, sx_label, sy_t, sy_b, sy_label, tau_top, tau_label, note]
        self.play(*[FadeOut(m) for m in element_group])

        # --- Part 2: construct Mohr's circle -------------------------------------
        self.play(title.animate.become(Text("Mohr's Circle", font_size=40, color=INK).to_edge(UP)))

        origin_x, origin_y = -1.6, -0.3
        scale = 0.032
        sigma_avg, radius, s1, s2 = 60, 28.3, 88.3, 31.7

        h_axis = Line([origin_x - 1.5, origin_y, 0], [origin_x + 5.5, origin_y, 0], color=INK, stroke_width=2)
        v_axis = Line([origin_x, origin_y - 2.2, 0], [origin_x, origin_y + 2.2, 0], color=INK, stroke_width=2)
        h_label = Text("σ", font_size=24, color=INK).next_to(h_axis, RIGHT, buff=0.15)
        v_label = Text("τ", font_size=24, color=INK).next_to(v_axis, UP, buff=0.15)
        self.play(Create(h_axis), Create(v_axis), Write(h_label), Write(v_label))

        center = [origin_x + sigma_avg * scale, origin_y, 0]
        circle = Circle(radius=radius * scale, color=BLUE, stroke_width=4).move_to(center)
        center_dot = Dot(center, color=INK, radius=0.05)
        self.play(Create(circle), FadeIn(center_dot))

        s1_point = [origin_x + s1 * scale, origin_y, 0]
        s2_point = [origin_x + s2 * scale, origin_y, 0]
        s1_dot = Dot(s1_point, color=ACCENT, radius=0.07)
        s2_dot = Dot(s2_point, color=ACCENT, radius=0.07)
        s1_label = Text("σ_1", font_size=22, color=ACCENT).next_to(s1_dot, UP, buff=0.2)
        s2_label = Text("σ_2", font_size=22, color=ACCENT).next_to(s2_dot, DOWN, buff=0.2)
        self.play(FadeIn(s1_dot), Write(s1_label), FadeIn(s2_dot), Write(s2_label))
        self.wait(0.5)

        radius_line = DashedLine(center, s1_point, color=INK, stroke_width=2)
        self.play(Create(radius_line))

        caption = Text("Where the circle crosses the σ axis: no shear at all", font_size=24, color=INK)
        caption.next_to(h_axis, DOWN, buff=1.6)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
