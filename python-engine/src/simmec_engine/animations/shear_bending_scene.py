"""
Manim scene for the "Shear Force & Bending Moment Diagrams" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
stress_strain_scene.py for the established pattern). Animates a simply
supported beam with a midspan point load, then its shear (V) and bending
moment (M) diagrams — a step function and a triangle, matching the worked
example (L = 6 m, P = 12 kN, M_max = 18 kN·m at midspan).

Render with:
    manim -qh --format=mp4 -o shear-bending-diagrams shear_bending_scene.py ShearBendingScene
"""

from manim import (
    Axes,
    Create,
    DOWN,
    FadeIn,
    FadeOut,
    LEFT,
    Line,
    RIGHT,
    Scene,
    Text,
    Triangle,
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


def support_triangle(x, color=INK):
    tri = Triangle(color=color, fill_color=color, fill_opacity=0.85).scale(0.22)
    tri.move_to([x, -0.22, 0])
    return tri


class ShearBendingScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("A Simply Supported Beam", font_size=38, color=INK).to_edge(UP)
        self.play(Write(title))

        # --- Part 1: beam, point load, and reactions ---------------------------
        beam = Line([-4, 0, 0], [4, 0, 0], color=INK, stroke_width=6)
        support_a = support_triangle(-4)
        support_b = support_triangle(4)
        self.play(Create(beam), FadeIn(support_a), FadeIn(support_b))

        load_arrow = Line([0, 1.3, 0], [0, 0.15, 0], color=ACCENT, stroke_width=6)
        load_label = Text("P", font_size=30, color=ACCENT).next_to(load_arrow, UP, buff=0.1)
        self.play(Create(load_arrow), Write(load_label))

        ra_arrow = Line([-4, -0.9, 0], [-4, -0.05, 0], color=BLUE, stroke_width=5)
        ra_label = Text("R_A", font_size=22, color=BLUE).next_to(ra_arrow, DOWN, buff=0.1)
        rb_arrow = Line([4, -0.9, 0], [4, -0.05, 0], color=BLUE, stroke_width=5)
        rb_label = Text("R_B", font_size=22, color=BLUE).next_to(rb_arrow, DOWN, buff=0.1)
        self.play(Create(ra_arrow), Write(ra_label), Create(rb_arrow), Write(rb_label))
        self.wait(0.5)

        note = Text("Cut anywhere along the beam: what keeps the two halves in balance?", font_size=22, color=INK)
        note.next_to(beam, DOWN, buff=1.7)
        self.play(FadeIn(note))
        self.wait(1.0)

        beam_group = VGroup(beam, support_a, support_b, load_arrow, load_label, ra_arrow, ra_label, rb_arrow, rb_label, note)
        self.play(FadeOut(beam_group))

        # --- Part 2: shear diagram V(x) -----------------------------------------
        self.play(title.animate.become(Text("Shear Diagram  V(x)", font_size=38, color=INK).to_edge(UP)))

        v_axes = Axes(
            x_range=[-3.3, 3.3, 3.3],
            y_range=[-1.6, 1.6, 1.6],
            x_length=7.6,
            y_length=3.2,
            axis_config={"color": INK, "stroke_width": 2, "include_tip": False},
        ).move_to([0, -0.3, 0])
        self.play(Create(v_axes))

        v_left = Line(v_axes.c2p(-3, 1), v_axes.c2p(0, 1), color=BLUE, stroke_width=5)
        v_drop = Line(v_axes.c2p(0, 1), v_axes.c2p(0, -1), color=BLUE, stroke_width=2).set_stroke(opacity=0.5)
        v_right = Line(v_axes.c2p(0, -1), v_axes.c2p(3, -1), color=BLUE, stroke_width=5)
        ra_tag = Text("+R_A", font_size=22, color=BLUE).next_to(v_left.get_start(), UP, buff=0.15)
        drop_tag = Text("ΔV = −P", font_size=20, color=ACCENT).next_to(v_drop, LEFT, buff=0.2)
        neg_tag = Text("−R_B", font_size=22, color=BLUE).next_to(v_right.get_end(), DOWN, buff=0.15)

        self.play(Create(v_left), Write(ra_tag))
        self.play(Create(v_drop), Write(drop_tag))
        self.play(Create(v_right), Write(neg_tag))
        self.wait(1.2)

        v_group = VGroup(v_axes, v_left, v_drop, v_right, ra_tag, drop_tag, neg_tag)
        self.play(FadeOut(v_group))

        # --- Part 3: bending moment diagram M(x) --------------------------------
        self.play(title.animate.become(Text("Bending Moment Diagram  M(x)", font_size=36, color=INK).to_edge(UP)))

        m_axes = Axes(
            x_range=[-3.3, 3.3, 3.3],
            y_range=[0, 2, 2],
            x_length=7.6,
            y_length=3.2,
            axis_config={"color": INK, "stroke_width": 2, "include_tip": False},
        ).move_to([0, -0.3, 0])
        self.play(Create(m_axes))

        rise = Line(m_axes.c2p(-3, 0), m_axes.c2p(0, 1.6), color=ACCENT, stroke_width=5)
        fall = Line(m_axes.c2p(0, 1.6), m_axes.c2p(3, 0), color=ACCENT, stroke_width=5)
        self.play(Create(rise), Create(fall))

        peak_label = Text("M_max = 18 kN·m", font_size=24, color=ACCENT).next_to(m_axes.c2p(0, 1.6), UP, buff=0.2)
        zero_label = Text("V = 0 exactly where M peaks", font_size=22, color=INK).next_to(m_axes, DOWN, buff=0.5)
        self.play(Write(peak_label))
        self.play(Write(zero_label))
        self.wait(1.0)

        formula = Text("dM/dx = V(x) — the shear is the slope of the moment diagram", font_size=24, color=INK)
        formula.next_to(zero_label, DOWN, buff=0.4)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
