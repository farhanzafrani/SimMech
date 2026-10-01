"""Forced convection in tubes and heat-exchanger rating (LMTD and effectiveness-NTU).

The tube-side convection coefficient comes from an internal-flow Nusselt
correlation; combined with an outside coefficient it gives the overall
coefficient U, and U*A feeds the effectiveness-NTU method to predict the
exchanger's heat duty and outlet temperatures. The log-mean temperature
difference (LMTD) method is evaluated on the result as an independent check.

Units: lengths in mm unless noted, temperatures in deg C, flow rates in kg/s,
cp in J/(kg*K), mu in Pa*s, k in W/(m*K), h and U in W/(m^2*K), duty in W.

The cold stream flows inside N identical tubes (heated, so the Dittus-Boelter
exponent is n = 0.4). The hot stream is on the shell side with a given
coefficient h_o. Tube wall resistance and fouling are neglected, and U is
referred to the inside tube area.
"""

from typing import Dict, List

import numpy as np

ARRANGEMENTS = ('counterflow', 'parallel', 'shell_tube')


def tube_flow_nusselt(re: float, pr: float) -> Dict:
    """Internal-flow Nusselt number for fully developed flow in a circular tube, heated fluid.

    Re < 2300          laminar, constant wall temperature: Nu = 3.66
    2300 <= Re < 1e4   Gnielinski (valid 3000 < Re < 5e6, used as a
                       transitional estimate from 2300)
    Re >= 1e4          Dittus-Boelter: Nu = 0.023 Re^0.8 Pr^0.4
    """
    f = (0.790 * np.log(re) - 1.64) ** -2 if re > 1 else 0.0
    nu_gn = ((f / 8.0) * (re - 1000.0) * pr / (1.0 + 12.7 * np.sqrt(f / 8.0) * (pr ** (2.0 / 3.0) - 1.0))) if re > 1000 else 0.0
    nu_db = 0.023 * re ** 0.8 * pr ** 0.4
    if re < 2300:
        return {'nu': 3.66, 'regime': 'laminar', 'correlation': 'Nu = 3.66 (constant wall T)', 'nu_dittus_boelter': nu_db, 'nu_gnielinski': nu_gn}
    if re < 1e4:
        regime = 'transitional' if re < 3000 else 'turbulent'
        return {'nu': nu_gn, 'regime': regime, 'correlation': 'Gnielinski', 'nu_dittus_boelter': nu_db, 'nu_gnielinski': nu_gn}
    return {'nu': nu_db, 'regime': 'turbulent', 'correlation': 'Dittus-Boelter (n = 0.4)', 'nu_dittus_boelter': nu_db, 'nu_gnielinski': nu_gn}


def effectiveness(arrangement: str, ntu: float, cr: float) -> float:
    """Heat-exchanger effectiveness for the given flow arrangement."""
    if arrangement == 'counterflow':
        if abs(1.0 - cr) < 1e-9:
            return ntu / (1.0 + ntu)
        e = np.exp(-ntu * (1.0 - cr))
        return (1.0 - e) / (1.0 - cr * e)
    if arrangement == 'parallel':
        return (1.0 - np.exp(-ntu * (1.0 + cr))) / (1.0 + cr)
    # one shell pass, 2, 4, ... tube passes
    s = np.sqrt(1.0 + cr * cr)
    e = np.exp(-ntu * s)
    return 2.0 / (1.0 + cr + s * (1.0 + e) / (1.0 - e))


def lmtd_correction(p: float, r: float) -> float:
    """LMTD correction factor F for one shell pass / even tube passes."""
    if p <= 0:
        return 1.0
    s = np.sqrt(r * r + 1.0)
    if abs(r - 1.0) < 1e-9:
        num = s * p / (1.0 - p)
        den = np.log((2.0 / p - 1.0 + s) / (2.0 / p - 1.0 - s))
        return float(num / den)
    num = (s / (r - 1.0)) * np.log((1.0 - p) / (1.0 - p * r))
    den = np.log((2.0 / p - 1.0 - r + s) / (2.0 / p - 1.0 - r - s))
    return float(num / den)


def compute_convection_heat_exchanger(
    arrangement: str,
    tube_diameter: float,
    tube_length: float,
    num_tubes: int,
    m_cold: float,
    t_cold_in: float,
    rho: float,
    mu: float,
    k_fluid: float,
    cp_cold: float,
    h_outside: float,
    m_hot: float,
    cp_hot: float,
    t_hot_in: float,
    num_curve_points: int = 41,
) -> Dict:
    """
    Rate a tube heat exchanger: tube-side h, overall U, then NTU method,
    with the LMTD method as a cross-check.

    Formulas:
        Re = 4 m_tube / (pi D mu);   Pr = cp mu / k;   h_i = Nu k / D
        U = 1 / (1/h_i + 1/h_o);   A = N pi D L;   UA
        C = m cp;  C_min, C_max;  C_r = C_min/C_max;  NTU = UA / C_min
        Q = eps C_min (T_h,in - T_c,in)
        counterflow:  eps = (1 - e^{-NTU(1-Cr)}) / (1 - Cr e^{-NTU(1-Cr)})
        parallel:     eps = (1 - e^{-NTU(1+Cr)}) / (1 + Cr)
        1-shell:      eps = 2 / {1 + Cr + sqrt(1+Cr^2) (1+e^{-NTU sqrt(1+Cr^2)})
                                 / (1-e^{-NTU sqrt(1+Cr^2)})}
        LMTD check:   Q = U A F dT_lm
    """

    if arrangement not in ARRANGEMENTS:
        raise ValueError("arrangement must be 'counterflow', 'parallel' or 'shell_tube'")
    if tube_diameter <= 0 or tube_length <= 0:
        raise ValueError("tube dimensions must be positive")
    if num_tubes < 1:
        raise ValueError("num_tubes must be at least 1")
    if min(m_cold, m_hot) <= 0:
        raise ValueError("mass flow rates must be positive")
    if min(rho, mu, k_fluid, cp_cold, cp_hot, h_outside) <= 0:
        raise ValueError("fluid properties and h_outside must be positive")
    if t_hot_in <= t_cold_in:
        raise ValueError("t_hot_in must exceed t_cold_in")

    d = tube_diameter / 1000.0
    length = tube_length / 1000.0
    n = int(num_tubes)

    m_tube = m_cold / n
    area_flow = np.pi * d * d / 4.0
    velocity = m_tube / (rho * area_flow)
    re = 4.0 * m_tube / (np.pi * d * mu)
    pr = cp_cold * mu / k_fluid
    nu = tube_flow_nusselt(re, pr)
    h_in = nu['nu'] * k_fluid / d
    u = 1.0 / (1.0 / h_in + 1.0 / h_outside)
    area = n * np.pi * d * length
    ua = u * area

    c_c = m_cold * cp_cold
    c_h = m_hot * cp_hot
    c_min, c_max = min(c_c, c_h), max(c_c, c_h)
    cr = c_min / c_max
    ntu = ua / c_min
    eps = float(effectiveness(arrangement, ntu, cr))
    q_max = c_min * (t_hot_in - t_cold_in)
    q = eps * q_max
    t_cold_out = t_cold_in + q / c_c
    t_hot_out = t_hot_in - q / c_h

    # LMTD cross-check
    if arrangement == 'parallel':
        dt1, dt2 = t_hot_in - t_cold_in, t_hot_out - t_cold_out
    else:
        dt1, dt2 = t_hot_in - t_cold_out, t_hot_out - t_cold_in
    if abs(dt1 - dt2) < 1e-9 * max(abs(dt1), 1.0):
        lmtd = dt1
    else:
        lmtd = (dt1 - dt2) / np.log(dt1 / dt2)
    if arrangement == 'shell_tube':
        p = (t_cold_out - t_cold_in) / (t_hot_in - t_cold_in)
        r = (t_hot_in - t_hot_out) / (t_cold_out - t_cold_in)
        f_corr = lmtd_correction(float(p), float(r))
    else:
        f_corr = 1.0
    q_lmtd = ua * f_corr * lmtd

    # Axial temperature profiles (counter / parallel only)
    profile: Dict[str, List[float]] = {'x': [], 'hot': [], 'cold': []}
    if arrangement in ('counterflow', 'parallel'):
        xs = np.linspace(0.0, 1.0, num_curve_points)
        if arrangement == 'parallel':
            a = ua * (1.0 / c_h + 1.0 / c_c)
            qx = (t_hot_in - t_cold_in) * (1.0 - np.exp(-a * xs)) / (1.0 / c_h + 1.0 / c_c)
            hot = t_hot_in - qx / c_h
            cold = t_cold_in + qx / c_c
        else:
            b = ua * (1.0 / c_h - 1.0 / c_c)
            dt0 = t_hot_in - t_cold_out
            g = xs if abs(b) < 1e-12 else (1.0 - np.exp(-b * xs)) / b
            hot = t_hot_in - (ua / c_h) * dt0 * g
            cold = t_cold_out - (ua / c_c) * dt0 * g
        profile = {'x': xs.tolist(), 'hot': hot.tolist(), 'cold': cold.tolist()}

    # eps-NTU curve at the current C_r
    ntus = np.linspace(0.0, 5.0, num_curve_points)
    eps_curve = [0.0 if v == 0 else float(effectiveness(arrangement, float(v), cr)) for v in ntus]

    return {
        'arrangement': arrangement,
        'velocity': float(velocity),
        'reynolds': float(re),
        'prandtl': float(pr),
        'regime': nu['regime'],
        'correlation': nu['correlation'],
        'nusselt': float(nu['nu']),
        'h_inside': float(h_in),
        'u_overall': float(u),
        'area': float(area),
        'ua': float(ua),
        'c_hot': float(c_h),
        'c_cold': float(c_c),
        'c_ratio': float(cr),
        'ntu': float(ntu),
        'effectiveness': eps,
        'q': float(q),
        'q_max': float(q_max),
        't_cold_out': float(t_cold_out),
        't_hot_out': float(t_hot_out),
        'lmtd': float(lmtd),
        'f_correction': float(f_corr),
        'q_lmtd': float(q_lmtd),
        'profile': profile,
        'eps_curve': {'ntu': ntus.tolist(), 'effectiveness': eps_curve},
    }
