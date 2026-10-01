"""
Phase Diagram & Lever Rule Module
Used by MIT 3.022 / 3.012 Topic: Phase Diagrams & the Lever Rule (Fe-C)

For any two-phase region of a binary diagram, the overall alloy composition
C0 lies between the two phase compositions found by the tie line; the lever
rule gives the mass fraction of each phase from those three numbers.
"""

from typing import Dict

# Fe-C (Fe-Fe3C) invariant-point compositions, textbook values (Callister).
C_FERRITE_MAX = 0.022   # wt% C, max solubility of C in ferrite (alpha) at 727 C
C_EUTECTOID = 0.76      # wt% C, eutectoid composition (pearlite)
C_CEMENTITE = 6.70      # wt% C, Fe3C
C_AUSTENITE_MAX = 2.14  # wt% C, max solubility of C in austenite at 1147 C
T_EUTECTOID = 727.0     # deg C


def lever_rule(c0: float, c_a: float, c_b: float) -> Dict:
    """
    Generic lever rule on a tie line from phase A (low C) to phase B (high C).

    W_A = (C_B - C0)/(C_B - C_A),  W_B = (C0 - C_A)/(C_B - C_A)
    """
    if c_b <= c_a:
        raise ValueError("Phase B composition must exceed phase A composition")
    if not c_a <= c0 <= c_b:
        raise ValueError("Alloy composition must lie between the two tie-line ends")
    w_a = (c_b - c0) / (c_b - c_a)
    return {'fraction_a': float(w_a), 'fraction_b': float(1.0 - w_a)}


def compute_phase_diagram(carbon: float) -> Dict:
    """
    Equilibrium (slow-cooled) microstructure of a plain-carbon steel just
    below the eutectoid temperature.

    Args:
        carbon: Alloy carbon content C0 in wt% C (0 < C0 <= 2.14, steel range)

    Returns:
        Steel class, total phase fractions (ferrite / cementite) from the
        lever rule across the alpha + Fe3C tie line, and the microconstituent
        split (proeutectoid phase + pearlite) from the lever rule applied
        just above 727 C.
    """

    if carbon <= 0:
        raise ValueError("Carbon content must be positive")
    if carbon > C_AUSTENITE_MAX:
        raise ValueError(
            "Carbon content above 2.14 wt% is cast iron (ledeburite); "
            "this module covers steels (up to 2.14 wt% C)"
        )

    # Total phases below 727 C: tie line alpha (0.022) -> Fe3C (6.70).
    # Below 0.022 wt% C the alloy is single-phase ferrite.
    if carbon <= C_FERRITE_MAX:
        w_ferrite, w_cementite = 1.0, 0.0
    else:
        tie = lever_rule(carbon, C_FERRITE_MAX, C_CEMENTITE)
        w_ferrite, w_cementite = tie['fraction_a'], tie['fraction_b']

    # Microconstituents: tie line just above 727 C
    if carbon <= C_FERRITE_MAX:
        steel_class = 'Ferritic iron (single-phase alpha)'
        proeutectoid_name, w_proeutectoid, w_pearlite = 'None', 0.0, 0.0
    elif carbon < C_EUTECTOID:
        steel_class = 'Hypoeutectoid steel'
        proeutectoid_name = 'Proeutectoid ferrite'
        # tie line alpha (0.022) -> gamma (0.76)
        tie = lever_rule(carbon, C_FERRITE_MAX, C_EUTECTOID)
        w_proeutectoid, w_pearlite = tie['fraction_a'], tie['fraction_b']
    elif carbon == C_EUTECTOID:
        steel_class = 'Eutectoid steel (100% pearlite)'
        proeutectoid_name, w_proeutectoid, w_pearlite = 'None', 0.0, 1.0
    else:
        steel_class = 'Hypereutectoid steel'
        proeutectoid_name = 'Proeutectoid cementite'
        # tie line gamma (0.76) -> Fe3C (6.70)
        tie = lever_rule(carbon, C_EUTECTOID, C_CEMENTITE)
        w_pearlite, w_proeutectoid = tie['fraction_a'], tie['fraction_b']

    # Ferrite and cementite lamellae inside the pearlite (fixed 0.76 wt% C)
    pearlite_ferrite = lever_rule(C_EUTECTOID, C_FERRITE_MAX, C_CEMENTITE)['fraction_a']

    return {
        'carbon': carbon,
        'steel_class': steel_class,
        'ferrite_fraction': float(w_ferrite),
        'cementite_fraction': float(w_cementite),
        'proeutectoid_name': proeutectoid_name,
        'proeutectoid_fraction': float(w_proeutectoid),
        'pearlite_fraction': float(w_pearlite),
        'ferrite_in_pearlite': float(pearlite_ferrite),
        'eutectoid_temperature': T_EUTECTOID,
    }


def compute_tie_line(c0: float, c_a: float, c_b: float) -> Dict:
    """Generic binary tie-line lever rule (any two-phase region)."""
    result = lever_rule(c0, c_a, c_b)
    return {
        'overall': c0,
        'phase_a_composition': c_a,
        'phase_b_composition': c_b,
        'fraction_a': result['fraction_a'],
        'fraction_b': result['fraction_b'],
    }
