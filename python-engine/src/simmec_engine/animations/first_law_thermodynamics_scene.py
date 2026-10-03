"""
Manim scene for the "First Law of Thermodynamics" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates a closed system (a gas cylinder) receiving heat and doing work,
showing the energy balance dU = Q - W as an animated bookkeeping diagram.

Render with:
    manim -qh --format=mp4 -o first-law-thermodynamics first_law_thermodynamics_scene.py FirstLawThermodynamicsScene
"""

from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    FadeIn,
    FadeOut,
    Line,
    ManimColor,
    Rectangle,
    Scene,
    Text,
    VGroup,
    ValueTracker,
    Write,
    config,
    interpolate_color,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
SUCCESS = "#2FAE7A"

config.background_color = PAPER


class FirstLawThermodynamicsScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("First Law of Thermodynamics", font_size=38, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        boundary = Rectangle(width=3.4, height=2.6, color=INK, fill_color=BLUE, fill_opacity=0.12)
        boundary.move_to([0, 0, 0])
        system_label = Text("System", font_size=26, color=INK).move_to(boundary.get_center() + UP * 0.5)
        u_label = Text("dU = Q - W", font_size=22, color=INK).move_to(boundary.get_center() + DOWN * 0.4)
        self.play(Create(boundary), Write(system_label), Write(u_label))

        q_arrow = Line([-4.2, 0, 0], boundary.get_left() + LEFT * 0.1, color=ACCENT, stroke_width=6)
        q_label = Text("Q (heat in)", font_size=24, color=ACCENT).next_to(q_arrow, UP, buff=0.15)
        self.play(Create(q_arrow), Write(q_label))

        heat_tracker = ValueTracker(0.0)

        def color_system(m):
            t = min(heat_tracker.get_value(), 1.0)
            m.set_fill(interpolate_color(ManimColor(BLUE), ManimColor(ACCENT), t), opacity=0.12 + 0.35 * t)

        boundary.add_updater(color_system)
        self.play(heat_tracker.animate.set_value(1.0), run_time=1.4)

        w_arrow = Line(boundary.get_right() + RIGHT * 0.1, [4.2, 0, 0], color=BLUE, stroke_width=6)
        w_label = Text("W (work out)", font_size=24, color=BLUE).next_to(w_arrow, UP, buff=0.15)
        self.play(Create(w_arrow), Write(w_label))
        boundary.clear_updaters()
        self.wait(0.5)

        note = Text("Whatever energy enters as heat, minus whatever leaves as work,", font_size=22, color=INK)
        note2 = Text("shows up as a change in the system's internal energy", font_size=22, color=INK)
        notes = VGroup(note, note2).arrange(DOWN, buff=0.1)
        notes.next_to(boundary, DOWN, buff=1.0)
        self.play(FadeIn(notes))
        self.wait(1.0)

        self.play(FadeOut(notes))

        formula = Text("delta U = Q - W          delta T = delta U / (m c_v)", font_size=26, color=INK)
        formula.next_to(boundary, DOWN, buff=1.0)
        self.play(Write(formula))
        self.wait(1.2)

        caption = Text("Ideal gas: internal energy is just temperature in disguise", font_size=24, color=SUCCESS)
        caption.next_to(formula, DOWN, buff=0.35)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
