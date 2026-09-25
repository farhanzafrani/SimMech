"""
Manim scene for the "Torsion in Circular Shafts" topic.

No LaTeX distribution is available in this environment, so labels use Manim's
Pango-backed `Text` (not `MathTex`/`Tex`) — the site itself renders the real
typeset equations via KaTeX, this animation only needs to carry the physical
intuition: a shaft twists, and shear stress grows linearly from the center
outward.

Render with:
    manim -qh --format=mp4 -o torsion torsion_scene.py TorsionScene
"""

from manim import (
    BLUE_D,
    DOWN,
    LEFT,
    ORANGE,
    RIGHT,
    UP,
    Circle,
    Create,
    FadeIn,
    FadeOut,
    Line,
    ManimColor,
    Rectangle,
    Scene,
    Text,
    Transform,
    VGroup,
    ValueTracker,
    Write,
    config,
    interpolate_color,
)

PAPER = "#F3F0E8"
INK = "#16191D"
ACCENT = "#C2410C"
BLUE = "#1E4E8C"
BORDER = "#D6D1C4"

config.background_color = PAPER


class TorsionScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Torsion in a Circular Shaft", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.3)

        # --- Part 1: shaft fixed at a wall, straight grid lines ---------------
        shaft_left, shaft_right = -4.5, 3.0
        shaft = Rectangle(width=shaft_right - shaft_left, height=1.6, color=INK, fill_color=BLUE, fill_opacity=0.12)
        shaft.move_to([(shaft_left + shaft_right) / 2, 0, 0])

        wall = Line(UP * 1.4, DOWN * 1.4, color=INK, stroke_width=6).move_to([shaft_left, 0, 0])
        hatch = VGroup(*[
            Line([shaft_left - 0.35, y, 0], [shaft_left, y + 0.25, 0], color=INK, stroke_width=3)
            for y in [-1.2, -0.7, -0.2, 0.3, 0.8, 1.3]
        ])

        n_lines = 9
        xs = [shaft_left + (shaft_right - shaft_left) * i / (n_lines - 1) for i in range(n_lines)]
        straight_lines = VGroup(*[Line([x, -0.8, 0], [x, 0.8, 0], color=INK, stroke_width=2) for x in xs])

        self.play(Create(shaft), Create(wall), Create(hatch))
        self.play(Create(straight_lines))
        self.wait(0.3)

        torque_arrow = VGroup(
            Circle(radius=0.35, color=ACCENT, stroke_width=5).move_to([shaft_right + 0.5, 0, 0]),
            Text("T", font_size=32, color=ACCENT).move_to([shaft_right + 0.5, 0.65, 0]),
        )
        self.play(FadeIn(torque_arrow))

        # --- Part 2: twist the grid lines proportional to distance from wall --
        twist = ValueTracker(0.0)

        def make_twisted_lines():
            group = VGroup()
            for x in xs:
                frac = (x - shaft_left) / (shaft_right - shaft_left)
                shear = twist.get_value() * frac
                top = [x + shear, 0.8, 0]
                bottom = [x - shear, -0.8, 0]
                group.add(Line(bottom, top, color=INK, stroke_width=2))
            return group

        twisted_lines = make_twisted_lines()
        twisted_lines.add_updater(lambda m: m.become(make_twisted_lines()))

        self.remove(straight_lines)
        self.add(twisted_lines)
        self.play(twist.animate.set_value(0.9), run_time=2.0)
        twisted_lines.clear_updaters()
        self.wait(0.3)

        note = Text("Every fiber shears against its neighbor", font_size=26, color=INK).next_to(shaft, DOWN, buff=0.6)
        self.play(FadeIn(note))
        self.wait(0.8)
        self.play(FadeOut(note), FadeOut(torque_arrow))

        # --- Part 3: cross-section shear-stress distribution ------------------
        self.play(
            *[FadeOut(m) for m in (twisted_lines, shaft, wall, hatch)],
            title.animate.become(Text("Shear Stress Distribution τ(r)", font_size=36, color=INK).to_edge(UP)),
        )

        cross_section = Circle(radius=2.2, color=INK, stroke_width=3)
        cross_section.move_to([0, -0.3, 0])
        self.play(Create(cross_section))

        n_rings = 10
        rings = VGroup()
        for i in range(n_rings, 0, -1):
            r = 2.2 * i / n_rings
            color = interpolate_color(ManimColor(BLUE), ManimColor(ACCENT), i / n_rings)
            rings.add(Circle(radius=r, color=color, fill_color=color, fill_opacity=0.85, stroke_width=0).move_to(cross_section.get_center()))
        self.play(FadeIn(rings), run_time=1.2)

        radius_line = Line(cross_section.get_center(), cross_section.get_center() + RIGHT * 2.2, color=INK, stroke_width=4)
        tau_max_label = Text("τ_max at r = d/2", font_size=24, color=INK).next_to(radius_line, UP, buff=0.15)
        zero_label = Text("τ = 0 at center", font_size=22, color=INK).move_to(cross_section.get_center() + DOWN * 0.5)

        self.play(Create(radius_line), Write(tau_max_label))
        self.play(Write(zero_label))
        self.wait(1.0)

        formula = Text("τ(r) = T r / J   —   grows linearly with r", font_size=28, color=INK)
        formula.next_to(cross_section, DOWN, buff=0.9)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
