"""
Manim scene for the "Stress-Strain Analysis" topic.

Uses Pango-backed `Text` only (no LaTeX distribution available) — the site
renders the real typeset equations via KaTeX; this animation carries the
physical intuition: a bar stretches under load, and the stress-strain curve
has an elastic region, a yield point, and a plastic region before fracture.

Render with:
    manim -qh --format=mp4 -o stress_strain stress_strain_scene.py StressStrainScene
"""

from manim import (
    Axes,
    Create,
    Dot,
    DOWN,
    FadeIn,
    FadeOut,
    LEFT,
    Line,
    RIGHT,
    Rectangle,
    Scene,
    Text,
    UP,
    VGroup,
    ValueTracker,
    Write,
    config,
)

PAPER = "#F3F0E8"
INK = "#16191D"
ACCENT = "#C2410C"
BLUE = "#1E4E8C"
SUCCESS = "#2F6F4E"
WARNING = "#B8400C"
ERROR = "#9A3412"

config.background_color = PAPER


class StressStrainScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Stress-Strain Behavior", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        # --- Part 1: bar fixed at a wall, stretched by a force ----------------
        wall = Line(UP * 1.2, DOWN * 1.2, color=INK, stroke_width=6).move_to([-4.5, 0, 0])
        hatch = VGroup(*[
            Line([-4.85, y, 0], [-4.5, y + 0.25, 0], color=INK, stroke_width=3)
            for y in [-1.1, -0.6, -0.1, 0.4, 0.9]
        ])

        bar = Rectangle(width=4.5, height=1.0, color=INK, fill_color=BLUE, fill_opacity=0.15)
        bar.move_to([-2.2, 0, 0])
        bar.align_to(wall, LEFT)

        self.play(Create(wall), Create(hatch), Create(bar))

        force_label = Text("F", font_size=32, color=ACCENT)
        force_arrow = Line(bar.get_right(), bar.get_right() + RIGHT * 1.2, color=ACCENT, stroke_width=6)
        force_label.next_to(force_arrow, UP, buff=0.15)
        self.play(Create(force_arrow), Write(force_label))
        self.wait(0.3)

        stretch = ValueTracker(0.0)
        original_width = bar.width

        def stretch_bar(b):
            new_width = original_width + stretch.get_value()
            b.stretch_to_fit_width(new_width)
            b.align_to(wall, LEFT)

        bar.add_updater(stretch_bar)

        def move_force(grp):
            arrow, label = grp
            arrow.put_start_and_end_on(bar.get_right(), bar.get_right() + RIGHT * 1.2)
            label.next_to(arrow, UP, buff=0.15)

        force_group = VGroup(force_arrow, force_label)
        force_group.add_updater(move_force)

        self.play(stretch.animate.set_value(1.3), run_time=1.8)
        bar.clear_updaters()
        force_group.clear_updaters()

        note = Text("The bar elongates under load", font_size=26, color=INK).next_to(bar, DOWN, buff=0.8)
        self.play(FadeIn(note))
        self.wait(0.8)
        self.play(FadeOut(note), FadeOut(force_group), FadeOut(bar), FadeOut(wall), FadeOut(hatch))

        # --- Part 2: the stress-strain curve -----------------------------------
        self.play(title.animate.become(Text("The Stress-Strain Curve", font_size=40, color=INK).to_edge(UP)))

        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 8, 1],
            x_length=8,
            y_length=5,
            axis_config={"color": INK, "include_tip": True, "stroke_width": 2},
        ).move_to([0, -0.3, 0])

        x_label = Text("strain", font_size=24, color=INK).next_to(axes.x_axis.get_end(), DOWN, buff=0.2)
        y_label = Text("stress", font_size=24, color=INK).next_to(axes.y_axis.get_end(), LEFT, buff=0.2)
        self.play(Create(axes), Write(x_label), Write(y_label))

        # Elastic region (linear), then plastic region (flattening) to fracture.
        def curve_point(t):
            # t in [0, 1] maps to a stylised stress-strain curve.
            if t < 0.35:
                x = t / 0.35 * 3.0
                y = t / 0.35 * 6.0
            elif t < 0.85:
                u = (t - 0.35) / 0.5
                x = 3.0 + u * 5.0
                y = 6.0 + u * 1.2 - (u**2) * 0.9
            else:
                u = (t - 0.85) / 0.15
                x = 8.0 + u * 0.6
                y = 6.3 - u * 6.3
            return axes.c2p(x, max(y, 0))

        tracker = ValueTracker(0.0)
        dot = Dot(color=ACCENT, radius=0.1)
        dot.add_updater(lambda m: m.move_to(curve_point(tracker.get_value())))

        def region_color(t):
            if t < 0.35:
                return SUCCESS
            if t < 0.85:
                return WARNING
            return ERROR

        dot.add_updater(lambda m: m.set_color(region_color(tracker.get_value())))

        path_points = [curve_point(t) for t in [i / 200 for i in range(201)]]
        full_curve = VGroup(*[
            Line(path_points[i], path_points[i + 1], color=BLUE, stroke_width=3)
            for i in range(len(path_points) - 1)
        ])

        yield_marker = Dot(curve_point(0.35), color=INK, radius=0.06)
        yield_label = Text("yield", font_size=20, color=INK).next_to(yield_marker, UP, buff=0.15)

        self.add(dot)
        self.play(
            Create(full_curve),
            tracker.animate.set_value(1.0),
            run_time=2.5,
            rate_func=lambda t: t,
        )
        self.play(FadeIn(yield_marker), Write(yield_label))
        self.wait(0.3)

        elastic_label = Text("Elastic", font_size=22, color=SUCCESS).move_to(axes.c2p(1.2, 3.2))
        plastic_label = Text("Plastic", font_size=22, color=WARNING).move_to(axes.c2p(5.5, 7.0))
        fracture_label = Text("Fracture", font_size=22, color=ERROR).move_to(axes.c2p(8.6, 1.5))
        self.play(Write(elastic_label), Write(plastic_label), Write(fracture_label))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
