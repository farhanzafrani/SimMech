"""
Manim scene for the "Rigid-Body Planar Kinematics" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates a wheel rolling without slipping, showing the instantaneous
center at the ground contact point, and how the velocity of points on
the rim scales with their distance from that point (top moves at 2x the
center's speed, the contact point itself is momentarily at rest).

Render with:
    manim -qh --format=mp4 -o rigid-body-planar-kinematics rigid_body_planar_kinematics_scene.py RigidBodyPlanarKinematicsScene
"""

import numpy as np
from manim import (
    DOWN,
    RIGHT,
    UP,
    Circle,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
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

RADIUS = 1.4
GROUND_Y = -1.6


class RigidBodyPlanarKinematicsScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Rigid-Body Planar Kinematics", font_size = 36, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        ground = Line([-5.5, GROUND_Y, 0], [5.5, GROUND_Y, 0], color=INK, stroke_width=4)
        self.play(Create(ground))

        center_x = ValueTracker(-3.0)
        wheel = Circle(radius=RADIUS, color=INK, stroke_width=3)
        wheel.move_to([center_x.get_value(), GROUND_Y + RADIUS, 0])
        spoke = Line(wheel.get_center(), wheel.get_top(), color=INK, stroke_width=2)
        wheel_group = VGroup(wheel, spoke)
        self.play(Create(wheel_group))

        ic_dot = Dot(color=BLUE, radius=0.08)
        ic_dot.add_updater(lambda m: m.move_to([center_x.get_value(), GROUND_Y, 0]))
        ic_label = Text("IC (v = 0)", font_size=20, color=BLUE)
        ic_label.add_updater(lambda m: m.next_to(ic_dot, DOWN, buff=0.15))
        self.play(FadeIn(ic_dot), FadeIn(ic_label))

        note = Text("Rolling without slipping: the contact point is momentarily at rest", font_size=22, color=INK)
        note.to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(note))

        def update_wheel(grp):
            cx = center_x.get_value()
            wheel_mob, spoke_mob = grp
            wheel_mob.move_to([cx, GROUND_Y + RADIUS, 0])
            # Rolling without slipping: rotation angle = distance traveled / radius.
            angle = (cx - (-3.0)) / RADIUS
            spoke_mob.put_start_and_end_on(
                wheel_mob.get_center(),
                wheel_mob.get_center() + RADIUS * np.array([np.sin(angle), np.cos(angle), 0.0]),
            )

        wheel_group.add_updater(update_wheel)

        self.play(center_x.animate.set_value(1.5), run_time=3.0, rate_func=lambda t: t)
        wheel_group.clear_updaters()
        self.wait(0.3)

        self.play(FadeOut(note))

        # Velocity vectors at top, center, and contact point (IC).
        cx = center_x.get_value()
        top = np.array([cx, GROUND_Y + 2 * RADIUS, 0])
        mid = np.array([cx, GROUND_Y + RADIUS, 0])
        bot = np.array([cx, GROUND_Y, 0])

        v_top = Line(top, top + RIGHT * 1.6, color=ACCENT, stroke_width=6)
        v_mid = Line(mid, mid + RIGHT * 0.8, color=INK, stroke_width=5)
        v_top_label = Text("2 v_c (top)", font_size=22, color=ACCENT).next_to(v_top, UP, buff=0.1)
        v_mid_label = Text("v_c (center)", font_size=20, color=INK).next_to(v_mid, UP, buff=0.1)
        v_bot_label = Text("0 (contact)", font_size=20, color=BLUE).next_to(bot, DOWN, buff=0.35)

        self.play(
            Create(v_top), Create(v_mid),
            Write(v_top_label), Write(v_mid_label), Write(v_bot_label),
        )
        self.wait(1.0)

        formula = Text("v = omega x (distance from IC)", font_size=26, color=INK)
        formula.next_to(ground, DOWN, buff=1.0)
        self.play(Write(formula))
        self.wait(1.2)

        caption = Text("Every point moves at a different speed — same body, same instant", font_size=22, color=SUCCESS)
        caption.next_to(formula, DOWN, buff=0.3)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
