"""
Manim scene for the "Axial Loading" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates: (1) a free bar stretching under a force F, then (2) the same bar
fixed at both ends, heated, and unable to expand — its blocked strain
becomes stress instead.

Render with:
    manim -qh --format=mp4 -o axial_loading axial_loading_scene.py AxialLoadingScene
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

PAPER = "#F3F0E8"
INK = "#16191D"
ACCENT = "#C2410C"
BLUE = "#1E4E8C"
SUCCESS = "#2F6F4E"
ERROR = "#9A3412"

config.background_color = PAPER


def wall(x, color=INK):
    line = Line([x, -1.2, 0], [x, 1.2, 0], color=color, stroke_width=6)
    hatch = VGroup(*[
        Line([x - 0.35, y, 0], [x, y + 0.25, 0], color=color, stroke_width=3)
        for y in [-1.1, -0.6, -0.1, 0.4, 0.9]
    ])
    return VGroup(line, hatch)


class AxialLoadingScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Axial Loading", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        # --- Part 1: a free bar stretches under a force F ---------------------
        left_wall = wall(-4.5)
        bar = Rectangle(width=4.2, height=1.0, color=INK, fill_color=BLUE, fill_opacity=0.15)
        bar.move_to([-2.3, 0, 0])
        bar.align_to(left_wall, LEFT).shift(RIGHT * 0.05)

        self.play(Create(left_wall), Create(bar))

        force_label = Text("F", font_size=32, color=ACCENT)
        force_arrow = Line(bar.get_right(), bar.get_right() + RIGHT * 1.1, color=ACCENT, stroke_width=6)
        force_label.next_to(force_arrow, UP, buff=0.15)
        self.play(Create(force_arrow), Write(force_label))

        stretch = ValueTracker(0.0)
        original_width = bar.width

        def stretch_bar(b):
            b.stretch_to_fit_width(original_width + stretch.get_value())
            b.align_to(left_wall, LEFT).shift(RIGHT * 0.05)

        bar.add_updater(stretch_bar)

        def move_force(grp):
            arrow, label = grp
            arrow.put_start_and_end_on(bar.get_right(), bar.get_right() + RIGHT * 1.1)
            label.next_to(arrow, UP, buff=0.15)

        force_group = VGroup(force_arrow, force_label)
        force_group.add_updater(move_force)

        self.play(stretch.animate.set_value(1.1), run_time=1.6)
        bar.clear_updaters()
        force_group.clear_updaters()

        note = Text("Free to expand: F stretches the bar by δ = FL / (AE)", font_size=24, color=INK)
        note.next_to(bar, DOWN, buff=0.8)
        self.play(FadeIn(note))
        self.wait(1.0)
        self.play(FadeOut(note), FadeOut(force_group), FadeOut(bar), FadeOut(left_wall))

        # --- Part 2: same bar, now fixed at both ends, heated ------------------
        self.play(title.animate.become(Text("Now Fully Constrained", font_size=40, color=INK).to_edge(UP)))

        left_wall2 = wall(-4.0)
        right_wall2 = wall(4.0)
        fixed_bar = Rectangle(width=8.0, height=1.0, color=INK, fill_color=BLUE, fill_opacity=0.15)
        fixed_bar.move_to([0, 0, 0])

        self.play(Create(left_wall2), Create(right_wall2), Create(fixed_bar))

        note2 = Text("Both ends fixed — the bar cannot get any longer", font_size=24, color=INK)
        note2.next_to(fixed_bar, DOWN, buff=1.0)
        self.play(FadeIn(note2))

        # Heat wavy lines above the bar, appearing as ΔT rises.
        heat_lines = VGroup(*[
            VGroup(*[
                Line([x, 0.65, 0], [x + 0.15, 0.65, 0], color=ERROR, stroke_width=2)
                for _ in range(1)
            ])
            for x in [-2.5, -0.8, 0.9, 2.6]
        ])
        heat_label = Text("ΔT rising", font_size=26, color=ERROR).move_to([0, 1.6, 0])
        self.play(FadeIn(heat_label))

        heat_tracker = ValueTracker(0.0)

        def make_heat_marks():
            group = VGroup()
            for x in [-2.5, -0.8, 0.9, 2.6]:
                amp = 0.12 * heat_tracker.get_value()
                pts = [
                    [x - 0.3, 0.65, 0],
                    [x - 0.15, 0.65 + amp, 0],
                    [x, 0.65, 0],
                    [x + 0.15, 0.65 - amp, 0],
                    [x + 0.3, 0.65, 0],
                ]
                for i in range(len(pts) - 1):
                    group.add(Line(pts[i], pts[i + 1], color=ERROR, stroke_width=2))
            return group

        heat_marks = make_heat_marks()
        heat_marks.add_updater(lambda m: m.become(make_heat_marks()))
        self.add(heat_marks)

        def color_bar(b):
            t = min(heat_tracker.get_value() / 3.0, 1.0)
            b.set_fill(interpolate_color(ManimColor(BLUE), ManimColor(ACCENT), t), opacity=0.15 + 0.5 * t)
            b.set_stroke(interpolate_color(ManimColor(INK), ManimColor(ERROR), t))

        fixed_bar.add_updater(color_bar)

        self.play(heat_tracker.animate.set_value(3.0), run_time=2.5)
        fixed_bar.clear_updaters()
        heat_marks.clear_updaters()
        self.wait(0.3)

        caption = Text("Blocked expansion becomes stress instead of strain", font_size=26, color=INK)
        caption.next_to(note2, DOWN, buff=0.5)
        self.play(FadeOut(note2), Write(caption))
        self.wait(0.5)

        formula = Text("σ_T = E α ΔT", font_size=30, color=INK)
        formula.next_to(caption, DOWN, buff=0.5)
        self.play(Write(formula))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
