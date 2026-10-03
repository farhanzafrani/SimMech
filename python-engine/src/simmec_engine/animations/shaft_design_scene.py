"""
Manim scene for the "Shaft Design Under Combined Bending and Torsion" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only. Shows a
stepped shaft with a fillet carrying both an alternating bending moment and a
steady torque at the same stress-concentration point, then the resulting
minimum-diameter sizing result from the worked example (30.2 mm → 32 mm stock).

Render with:
    manim -qh --format=mp4 -o shaft-design shaft_design_scene.py ShaftDesignScene
"""

from manim import (
    ArcBetweenPoints,
    Create,
    DOWN,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    PI,
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
ERROR = "#E23F3F"
LEAF = "#2FAE7A"

config.background_color = PAPER


class ShaftDesignScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Shaft Shoulder Under Combined Loading", font_size=32, color=INK).to_edge(UP)
        self.play(Write(title))

        # --- Part 1: stepped shaft with a fillet, bending + torque at the step -
        left_top = Line([-4, 0.5, 0], [-0.3, 0.5, 0], color=INK, stroke_width=8)
        left_bottom = Line([-4, -0.5, 0], [-0.3, -0.5, 0], color=INK, stroke_width=8)
        right_top = Line([-0.1, 0.85, 0], [3.5, 0.85, 0], color=INK, stroke_width=8)
        right_bottom = Line([-0.1, -0.85, 0], [3.5, -0.85, 0], color=INK, stroke_width=8)
        fillet_top = Line([-0.3, 0.5, 0], [-0.1, 0.85, 0], color=INK, stroke_width=8)
        fillet_bottom = Line([-0.3, -0.5, 0], [-0.1, -0.85, 0], color=INK, stroke_width=8)
        shaft = VGroup(left_top, left_bottom, right_top, right_bottom, fillet_top, fillet_bottom)
        self.play(Create(shaft))

        hotspot = Dot([-0.2, 0.67, 0], color=ERROR, radius=0.22)
        hotspot.set_opacity(0.55)
        hotspot_label = Text("stress concentration at the fillet", font_size=22, color=ERROR).next_to(hotspot, UP, buff=0.3)
        self.play(FadeIn(hotspot), Write(hotspot_label))
        self.wait(0.5)

        m_arrow = ArcBetweenPoints([1.5, 0.55, 0], [1.5, -0.55, 0], angle=PI * 0.9, color=ACCENT, stroke_width=5)
        m_arrow.add_tip(tip_length=0.18)
        m_label = Text("M_a", font_size=24, color=ACCENT).next_to(m_arrow, UP, buff=0.15)
        t_arrow = ArcBetweenPoints([2.6, 0.4, 0], [2.6, -0.4, 0], angle=PI * 1.6, color=BLUE, stroke_width=5)
        t_arrow.add_tip(tip_length=0.18)
        t_label = Text("T_m", font_size=24, color=BLUE).next_to(t_arrow, DOWN, buff=0.15)
        self.play(Create(m_arrow), Write(m_label), Create(t_arrow), Write(t_label))
        self.wait(1.0)

        note = Text("Alternating bending + steady torque, both magnified by the same fillet", font_size=22, color=INK)
        note.next_to(shaft, DOWN, buff=1.3)
        self.play(FadeIn(note))
        self.wait(1.2)

        self.play(*[FadeOut(m) for m in self.mobjects])

        # --- Part 2: the sizing result ------------------------------------------
        self.play(title.animate.become(Text("Solving for the Minimum Diameter", font_size=34, color=INK).to_edge(UP)))

        bar_axis = Line([-4, -0.5, 0], [4, -0.5, 0], color=INK, stroke_width=3)
        req_x, stock_x = 0.3, 1.1
        req_tick = Line([req_x, -0.75, 0], [req_x, -0.25, 0], color=ACCENT, stroke_width=4)
        req_label = Text("needs ≥ 30.2 mm", font_size=22, color=ACCENT).next_to(req_tick, UP, buff=0.2)
        stock_tick = Line([stock_x, -0.75, 0], [stock_x, -0.25, 0], color=LEAF, stroke_width=4)
        stock_label = Text("use 32 mm stock", font_size=22, color=LEAF).next_to(stock_tick, DOWN, buff=0.2)
        self.play(Create(bar_axis))
        self.play(Create(req_tick), Write(req_label))
        self.play(Create(stock_tick), Write(stock_label))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
