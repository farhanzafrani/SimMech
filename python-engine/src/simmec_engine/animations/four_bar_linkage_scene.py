"""
Manim scene for the "4-Bar Linkage Kinematics" topic.

Uses Pango-backed `Text` only (no LaTeX distribution available). Animates a
real four-bar mechanism: given the crank angle, the coupler and rocker
positions are solved from the two-circle intersection (standard four-bar
position analysis), not faked — so the motion is physically correct for the
chosen link lengths.

Render with:
    manim -qh --format=mp4 -o four_bar_linkage four_bar_linkage_scene.py FourBarLinkageScene
"""

import numpy as np
from manim import (
    Create,
    Dot,
    DOWN,
    FadeIn,
    FadeOut,
    Line,
    Scene,
    Text,
    TracedPath,
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

config.background_color = PAPER

# Grashof crank-rocker link lengths (shortest link L2 is adjacent to the
# ground link L1, so the crank fully rotates and the rocker oscillates).
L1 = 4.0   # ground (fixed) link, A to D
L2 = 1.4   # crank, A to B
L3 = 3.6   # coupler, B to C
L4 = 3.0   # rocker, D to C


def solve_fourbar(theta2: float):
    """Return (B, C) for a given crank angle theta2, with A=(0,0), D=(L1,0)."""
    A = np.array([0.0, 0.0])
    D = np.array([L1, 0.0])
    B = A + L2 * np.array([np.cos(theta2), np.sin(theta2)])

    d = np.linalg.norm(D - B)
    d = min(max(d, abs(L3 - L4) + 1e-6), L3 + L4 - 1e-6)  # numerical safety
    a = (L3**2 - L4**2 + d**2) / (2 * d)
    h = np.sqrt(max(L3**2 - a**2, 0.0))
    mid = B + a * (D - B) / d
    perp = np.array([-(D - B)[1], (D - B)[0]]) / d
    C = mid + h * perp
    return B, C


class FourBarLinkageScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER
        scale = 1.0
        origin = np.array([-1.5, -0.5, 0])

        def to_scene(p2d):
            return origin + np.array([p2d[0], p2d[1], 0]) * scale

        title = Text("Four-Bar Linkage Kinematics", font_size=40, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        A = to_scene([0, 0])
        D = to_scene([L1, 0])

        ground = Line(A, D, color=INK, stroke_width=5)
        hatch = VGroup(*[
            Line(to_scene([x, -0.15]), to_scene([x - 0.15, -0.4]), color=INK, stroke_width=2)
            for x in np.linspace(0.3, L1 - 0.3, 8)
        ])
        ground_label = Text("ground link (fixed)", font_size=20, color=INK).next_to(ground, DOWN, buff=0.5)

        self.play(Create(ground), Create(hatch), Write(ground_label))

        theta2_tracker = ValueTracker(0.0)

        def get_points():
            B2, C2 = solve_fourbar(theta2_tracker.get_value())
            return to_scene(B2), to_scene(C2)

        crank = Line(A, get_points()[0], color=ACCENT, stroke_width=6)
        coupler = Line(get_points()[0], get_points()[1], color=BLUE, stroke_width=6)
        rocker = Line(D, get_points()[1], color=SUCCESS, stroke_width=6)

        crank.add_updater(lambda m: m.put_start_and_end_on(A, get_points()[0]))
        coupler.add_updater(lambda m: m.put_start_and_end_on(get_points()[0], get_points()[1]))
        rocker.add_updater(lambda m: m.put_start_and_end_on(D, get_points()[1]))

        joint_A = Dot(A, color=INK, radius=0.08)
        joint_D = Dot(D, color=INK, radius=0.08)
        joint_B = Dot(get_points()[0], color=INK, radius=0.07)
        joint_C = Dot(get_points()[1], color=INK, radius=0.07)
        joint_B.add_updater(lambda m: m.move_to(get_points()[0]))
        joint_C.add_updater(lambda m: m.move_to(get_points()[1]))

        crank_label = Text("crank", font_size=20, color=ACCENT)
        coupler_label = Text("coupler", font_size=20, color=BLUE)
        rocker_label = Text("rocker", font_size=20, color=SUCCESS)
        crank_label.add_updater(lambda m: m.move_to((A + get_points()[0]) / 2 + UP * 0.35))
        coupler_label.add_updater(lambda m: m.move_to((get_points()[0] + get_points()[1]) / 2 + UP * 0.35))
        rocker_label.add_updater(lambda m: m.move_to((D + get_points()[1]) / 2 + UP * 0.35))

        self.play(
            Create(crank), Create(coupler), Create(rocker),
            FadeIn(joint_A), FadeIn(joint_D), FadeIn(joint_B), FadeIn(joint_C),
            Write(crank_label), Write(coupler_label), Write(rocker_label),
        )
        self.wait(0.3)

        coupler_trace = TracedPath(joint_C.get_center, stroke_color=BLUE, stroke_width=2, stroke_opacity=0.5)
        self.add(coupler_trace)

        note = Text("The crank spins fully; the rocker only swings back and forth", font_size=22, color=INK)
        note.next_to(ground_label, DOWN, buff=0.4)
        self.play(FadeIn(note))

        self.play(theta2_tracker.animate.set_value(2 * np.pi), run_time=6.0, rate_func=lambda t: t)
        self.wait(0.5)
        self.play(FadeOut(note))

        grashof_note = Text("s + l ≤ p + q  →  the shortest link (crank) can fully rotate", font_size=22, color=INK)
        grashof_note.next_to(ground_label, DOWN, buff=0.4)
        self.play(Write(grashof_note))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
