"""
Manim scene for the "Pipe Flow Losses & Convective Heat Transfer" topic.

No LaTeX distribution is available — uses Pango-backed `Text` only (see
torsion_scene.py / stress_strain_scene.py for the established pattern).
Animates fluid moving through a straight pipe, losing pressure to wall
friction along its length while heat flows inward from a hot wall.

Render with:
    manim -qh --format=mp4 -o pipe-flow-heat-transfer pipe_flow_heat_transfer_scene.py PipeFlowHeatTransferScene
"""

from manim import (
    DOWN,
    RIGHT,
    UP,
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

PIPE_LEFT = -4.5
PIPE_RIGHT = 4.5
PIPE_TOP = 0.9
PIPE_BOT = -0.9


class PipeFlowHeatTransferScene(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        title = Text("Pipe Flow & Convective Heat Transfer", font_size = 34, color=INK)
        title.to_edge(UP)
        self.play(Write(title))

        top_wall = Line([PIPE_LEFT, PIPE_TOP, 0], [PIPE_RIGHT, PIPE_TOP, 0], color=INK, stroke_width=4)
        bot_wall = Line([PIPE_LEFT, PIPE_BOT, 0], [PIPE_RIGHT, PIPE_BOT, 0], color=INK, stroke_width=4)
        self.play(Create(top_wall), Create(bot_wall))

        wall_label = Text("hot wall, Ts", font_size=20, color=ACCENT).next_to(top_wall, UP, buff=0.15)
        self.play(Write(wall_label))

        # Heat arrows from the wall into the fluid.
        heat_arrows = VGroup(*[
            Line([x, PIPE_TOP - 0.05, 0], [x, PIPE_TOP - 0.5, 0], color=ACCENT, stroke_width=3)
            for x in [-3.0, -1.0, 1.0, 3.0]
        ])
        self.play(Create(heat_arrows))

        # Particles flowing left to right, slowly fading toward the accent
        # color to suggest they're picking up heat as they travel.
        particles = VGroup(*[Dot(color=BLUE, radius=0.09) for _ in range(4)])
        starts = [PIPE_LEFT + 0.3, PIPE_LEFT - 1.2, PIPE_LEFT - 2.7, PIPE_LEFT - 4.2]
        trackers = [ValueTracker(s) for s in starts]

        def make_updater(tr, idx):
            def updater(m):
                x = tr.get_value()
                y = -0.3 + 0.2 * (idx % 2)
                m.move_to([max(PIPE_LEFT + 0.2, min(PIPE_RIGHT - 0.2, x)), y, 0])
            return updater

        for i, (p, tr) in enumerate(zip(particles, trackers)):
            p.add_updater(make_updater(tr, i))
        self.add(particles)

        note = Text("Friction along the wall drains pressure as the fluid moves", font_size=22, color=INK)
        note.to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(note))

        self.play(
            *[tr.animate.set_value(tr.get_value() + 9.0) for tr in trackers],
            run_time=3.0,
            rate_func=lambda t: t,
        )
        for p in particles:
            p.clear_updaters()
        self.play(FadeOut(particles), FadeOut(note))

        formula = Text("Re = V D / nu          h_L = f (L/D)(V^2 / 2g)          q'' = h (Ts - Tinf)", font_size=22, color=INK)
        formula.next_to(bot_wall, DOWN, buff=1.0)
        self.play(Write(formula))
        self.wait(1.2)

        caption = Text("Reynolds number decides laminar vs. turbulent — and how steep the loss is", font_size=22, color=SUCCESS)
        caption.next_to(formula, DOWN, buff=0.3)
        self.play(Write(caption))
        self.wait(1.5)

        self.play(*[FadeOut(m) for m in self.mobjects])
