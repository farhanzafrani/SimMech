"""Steam property lookups for the ideal Rankine cycle.

Backed by a frozen IAPWS-IF97 table (see steam_table_data.py). All pressures
are in MPa, temperatures in degrees C, enthalpy in kJ/kg, entropy in
kJ/(kg*K), specific volume in m^3/kg.

Interpolation is linear in ln(p) between tabulated pressures and linear in T
between tabulated temperatures, with the saturated-vapour state added as the
first node of every superheated row so lookups right next to the saturation
line stay anchored to exact values. Against the full IF97 formulation the
saturation properties agree to better than ~1 percent (typically 0.1-0.4 percent)
and the superheated h and s to better than ~0.7 percent over 0.1-20 MPa and up to
650 C; the error vanishes at tabulated pressures and temperatures.
"""

from typing import Dict, Tuple

import numpy as np

from .steam_table_data import (
    SAT_P, SAT_T, SAT_VF, SAT_HF, SAT_SF, SAT_HG, SAT_SG, SH_T, SH_H, SH_S,
)

P_MIN = float(SAT_P[0])
P_MAX = float(SAT_P[-1])
T_MAX = float(SH_T[-1])

_LNP = np.log(SAT_P)


def _check_p(p: float) -> None:
    if not (P_MIN <= p <= P_MAX):
        raise ValueError(f"pressure must be within {P_MIN}-{P_MAX} MPa for the steam table")


def saturation(p: float) -> Dict[str, float]:
    """Saturation properties at pressure p (MPa)."""
    _check_p(p)
    lp = np.log(p)
    return {
        't_sat': float(np.interp(lp, _LNP, SAT_T)),
        'vf': float(np.interp(lp, _LNP, SAT_VF)),
        'hf': float(np.interp(lp, _LNP, SAT_HF)),
        'sf': float(np.interp(lp, _LNP, SAT_SF)),
        'hg': float(np.interp(lp, _LNP, SAT_HG)),
        'sg': float(np.interp(lp, _LNP, SAT_SG)),
    }


def _row(k: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Temperature / h / s nodes for grid pressure index k, saturated vapour first."""
    t = [float(SAT_T[k])]
    h = [float(SAT_HG[k])]
    s = [float(SAT_SG[k])]
    for tt, hh, ss in zip(SH_T, SH_H[k], SH_S[k]):
        if hh is not None:
            t.append(float(tt))
            h.append(hh)
            s.append(ss)
    return np.array(t), np.array(h), np.array(s)


def superheated(p: float, t: float) -> Tuple[float, float]:
    """(h, s) of steam at pressure p (MPa) and temperature t (C).

    A temperature at or below saturation returns the saturated-vapour state.
    """
    _check_p(p)
    if t > T_MAX:
        raise ValueError(f"temperature must not exceed {T_MAX:.0f} C for the steam table")
    k_hi = int(np.searchsorted(SAT_P, p))
    k_hi = min(max(k_hi, 1), len(SAT_P) - 1)
    k_lo = k_hi - 1
    vals = []
    for k in (k_lo, k_hi):
        tt, hh, ss = _row(k)
        t_eff = max(t, tt[0])
        vals.append((float(np.interp(t_eff, tt, hh)), float(np.interp(t_eff, tt, ss))))
    w = (np.log(p) - _LNP[k_lo]) / (_LNP[k_hi] - _LNP[k_lo])
    h = vals[0][0] * (1 - w) + vals[1][0] * w
    s = vals[0][1] * (1 - w) + vals[1][1] * w
    return h, s
