"""
Manim scene for the "Fatigue Analysis: S-N Curves & the Goodman Diagram" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Draws the
modified Goodman line from S_e to S_ut, plots the worked example's operating
point (σ_m=90, σ_a=60 MPa), and extends a ray through it to the line to show
the factor of safety n ≈ 2.78 as a distance ratio.

Render with:
    manim -qh --format=mp4 -o fatigue-analysis fatigue_analysis_scene.py FatigueAnalysisScene
"""

from manim import (
    Axes,
    Create,
    DOWN,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    LEFT,
    Line,
    Scene,
    Text,
    UP,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"

config.background_color = PAPER


class FatigueAnalysisScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("The Modified Goodman Diagram", font_size=36, color=INK).to_edge(UP)
        self.play(Write(title))

        axes = Axes(
            x_range=[0, 700, 700],
            y_range=[0, 300, 300],
            x_length=8,
            y_length=4.2,
            axis_config={"color": INK, "stroke_width": 2, "include_tip": False},
        ).move_to([0, -0.6, 0])
        xlabel = Text("mean stress σ_m", font_size=22, color=INK).next_to(axes.c2p(0, 0), DOWN, buff=0.3).align_to(axes.c2p(0, 0), LEFT)
        ylabel = Text("amplitude σ_a", font_size=22, color=INK).next_to(axes.y_axis.get_end(), UP, buff=0.15)
        self.play(Create(axes), Write(xlabel), Write(ylabel))

        se_point = axes.c2p(0, 280)
        sut_point = axes.c2p(620, 0)
        goodman = Line(se_point, sut_point, color=ACCENT, stroke_width=5)
        se_label = Text("S_e = 280 MPa", font_size=20, color=ACCENT).next_to(se_point, LEFT, buff=0.1).shift(UP * 0.15)
        sut_label = Text("S_ut = 620 MPa", font_size=20, color=ACCENT).next_to(sut_point, DOWN, buff=0.15)
        self.play(Create(goodman), Write(se_label), Write(sut_label))
        self.wait(0.3)

        op_point = axes.c2p(90, 60)
        op_dot = Dot(op_point, color=BLUE, radius=0.09)
        op_label = Text("σ_m=90, σ_a=60", font_size=20, color=BLUE).next_to(op_dot, UP, buff=0.2)
        self.play(FadeIn(op_dot), Write(op_label))
        self.wait(0.3)

        limit_point = axes.c2p(250.4, 166.9)
        ray = DashedLine(axes.c2p(0, 0), limit_point, color=INK, stroke_width=2)
        limit_dot = Dot(limit_point, color=INK, radius=0.06)
        self.play(Create(ray), FadeIn(limit_dot))
        self.wait(0.5)

        n_label = Text("n = (distance to the line) / (distance to the point) ≈ 2.78", font_size=22, color=INK)
        n_label.next_to(xlabel, DOWN, buff=0.35)
        self.play(Write(n_label))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
