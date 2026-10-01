"""
Manim scene for the "Newton's Second Law & Work-Energy Methods" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates a car braking to a stop under friction, then shows the same
result found two ways: F = ma (deceleration + kinematics) and the
work-energy theorem (kinetic energy removed by the work friction does).

Render with:
    manim -qh --format=mp4 -o newton-work-energy newton_work_energy_scene.py NewtonWorkEnergyScene
"""

from manim import (
    DOWN,
    RIGHT,
    UP,
    Create,
    FadeIn,
    FadeOut,
    Line,
    Rectangle,
    Scene,
    Text,
    VGroup,
    ValueTracker,
    Write,
    config,
)

PAPER = "#FAF3EC"
INK = "#201A2B"
ACCENT = "#F1491E"
BLUE = "#0EA5D9"
SUCCESS = "#2FAE7A"

config.background_color = PAPER


class NewtonWorkEnergyScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Newton's Second Law & Work-Energy Methods", font_size=34, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        ground = Line([-5.5, -1.3, 0], [5.5, -1.3, 0], color=INK, stroke_width=4)
        self.play(Create(ground))

        car = Rectangle(width=1.6, height=0.7, color=INK, fill_color=BLUE, fill_opacity=0.25)
        car.move_to([-3.8, -0.9, 0])
        self.play(FadeIn(car))

        v_label = Text("v1 = 25 m/s", font_size=26, color=ACCENT).next_to(car, UP, buff=0.3)
        self.play(Write(v_label))

        x_tracker = ValueTracker(-3.8)
        car.add_updater(lambda m: m.move_to([x_tracker.get_value(), -0.9, 0]))

        friction_note = Text("Friction force F = mu m g decelerates the car", font_size=22, color=INK)
        friction_note.to_edge(DOWN).shift(UP * 0.6)
        self.play(FadeIn(friction_note))

        self.play(x_tracker.animate.set_value(3.0), run_time=2.8, rate_func=lambda t: 1 - (1 - t) ** 2)
        car.clear_updaters()
        self.play(FadeOut(v_label))
        stop_label = Text("v2 = 0", font_size=26, color=SUCCESS).next_to(car, UP, buff=0.3)
        self.play(Write(stop_label))
        self.wait(0.4)

        self.play(FadeOut(friction_note), FadeOut(stop_label))

        # --- Two routes to the same answer ---
        route_title = Text("Two routes to the stopping distance", font_size=28, color=INK)
        route_title.next_to(car, DOWN, buff=1.0)
        self.play(Write(route_title))

        route_a = VGroup(
            Text("Route A: F = ma", font_size=24, color=ACCENT),
            Text("a = mu g -> d = v1^2 / (2a)", font_size=22, color=INK),
        ).arrange(DOWN, buff=0.2)
        route_b = VGroup(
            Text("Route B: Work-Energy", font_size=24, color=BLUE),
            Text("F d = 1/2 m v1^2 -> d = m v1^2 / (2F)", font_size=22, color=INK),
        ).arrange(DOWN, buff=0.2)

        routes = VGroup(route_a, route_b).arrange(RIGHT, buff=1.2)
        routes.next_to(route_title, DOWN, buff=0.4)
        self.play(FadeIn(route_a), FadeIn(route_b))
        self.wait(1.0)

        agree = Text("Same distance, every time — the theorem is just F = ma, pre-integrated", font_size=22, color=SUCCESS)
        agree.next_to(routes, DOWN, buff=0.5)
        self.play(Write(agree))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
