"""Gas and vapour power cycles — ideal Rankine and Brayton cycles.

Both cycles are four-process loops (pump/compressor, heat addition,
turbine, heat rejection). Their efficiency is set by how the average
temperature of heat addition compares with that of heat rejection, which is
why raising boiler pressure, turbine inlet temperature, or compressor
pressure ratio helps.

Rankine uses real steam properties from a frozen IAPWS-IF97 table (see
steam_properties.py). Brayton uses the cold-air-standard model: air as an
ideal gas with constant specific heats.
"""

from typing import Dict, List

import numpy as np

from . import steam_properties as steam
from .steam_table_data import SAT_T, SAT_SF, SAT_SG


def _check_eff(name: str, value: float) -> None:
    if not (0 < value <= 1):
        raise ValueError(f"{name} must be in (0, 1]")


def compute_rankine(
    boiler_pressure: float,
    turbine_inlet_temp: float,
    condenser_pressure: float,
    turbine_efficiency: float = 1.0,
    pump_efficiency: float = 1.0,
) -> Dict:
    """
    Compute the simple Rankine cycle (state 1 = saturated liquid leaving the
    condenser, 2 = pump exit, 3 = turbine inlet, 4 = turbine exit).

    Args:
        boiler_pressure: Boiler pressure, in MPa (0.1-20).
        turbine_inlet_temp: Turbine inlet temperature, in deg C. At or below
            the saturation temperature the inlet is saturated vapour.
        condenser_pressure: Condenser pressure, in MPa (0.005-boiler).
        turbine_efficiency: Turbine isentropic efficiency (1.0 = ideal).
        pump_efficiency: Pump isentropic efficiency (1.0 = ideal).

    Returns:
        Dictionary with state enthalpies/entropies, specific works and
        heats (kJ/kg), thermal efficiency, back-work ratio, steam rate
        (kg/kWh), turbine exit quality, and a T-s diagram path.

    Formulas:
        w_pump    = v1 (p_b - p_c) / eta_pump
        h2        = h1 + w_pump
        x4s       = (s3 - sf) / (sg - sf);   h4s = hf + x4s (hg - hf)
        h4        = h3 - eta_t (h3 - h4s)
        q_in      = h3 - h2;   w_net = (h3 - h4) - w_pump
        eta       = w_net / q_in
    """

    if boiler_pressure <= condenser_pressure:
        raise ValueError("boiler_pressure must exceed condenser_pressure")
    if condenser_pressure < steam.P_MIN:
        raise ValueError(f"condenser_pressure must be at least {steam.P_MIN} MPa")
    if boiler_pressure < 0.1 or boiler_pressure > steam.P_MAX:
        raise ValueError(f"boiler_pressure must be within 0.1-{steam.P_MAX:.0f} MPa")
    if turbine_inlet_temp > steam.T_MAX or turbine_inlet_temp <= 0:
        raise ValueError(f"turbine_inlet_temp must be within 0-{steam.T_MAX:.0f} deg C")
    _check_eff('turbine_efficiency', turbine_efficiency)
    _check_eff('pump_efficiency', pump_efficiency)

    sat_c = steam.saturation(condenser_pressure)
    sat_b = steam.saturation(boiler_pressure)

    # 1: saturated liquid leaving the condenser
    h1, s1, v1 = sat_c['hf'], sat_c['sf'], sat_c['vf']
    # pump work: v dp is in kPa*m3/kg = kJ/kg once p is in kPa
    w_pump_s = v1 * (boiler_pressure - condenser_pressure) * 1000.0
    w_pump = w_pump_s / pump_efficiency
    h2 = h1 + w_pump

    # 3: turbine inlet
    h3, s3 = steam.superheated(boiler_pressure, turbine_inlet_temp)
    t3 = max(turbine_inlet_temp, sat_b['t_sat'])

    # 4: turbine exit
    if s3 > sat_c['sg']:
        raise ValueError(
            "turbine exit would be superheated at this condenser pressure; "
            "lower the turbine inlet temperature or raise the condenser pressure"
        )
    x4s = (s3 - sat_c['sf']) / (sat_c['sg'] - sat_c['sf'])
    h4s = sat_c['hf'] + x4s * (sat_c['hg'] - sat_c['hf'])
    h4 = h3 - turbine_efficiency * (h3 - h4s)
    exit_superheated = h4 > sat_c['hg']
    x4 = None if exit_superheated else (h4 - sat_c['hf']) / (sat_c['hg'] - sat_c['hf'])
    # Entropy at the real turbine exit, for the T-s plot (saturated mixture only)
    s4 = s3 if turbine_efficiency == 1.0 else (
        sat_c['sg'] if exit_superheated else sat_c['sf'] + x4 * (sat_c['sg'] - sat_c['sf'])
    )

    w_turbine = h3 - h4
    q_in = h3 - h2
    q_out = h4 - h1
    w_net = w_turbine - w_pump
    eta = w_net / q_in

    # T-s path of the cycle (entropy s, temperature T in deg C)
    path: List[Dict[str, float]] = []
    t_c = sat_c['t_sat']
    path.append({'s': s1, 'T': t_c})                                   # 1
    s2 = s1 + (w_pump - w_pump_s) / (t_c + 273.15) if pump_efficiency < 1 else s1
    t2 = t_c + (w_pump - w_pump_s) / 4.18 if pump_efficiency < 1 else t_c
    path.append({'s': s2, 'T': t2})                                    # 2
    # liquid heating to saturation, approximating compressed-liquid s by sf(T)
    for tt in np.linspace(t2, sat_b['t_sat'], 8)[1:]:
        path.append({'s': float(np.interp(tt, SAT_T, SAT_SF)), 'T': float(tt)})
    path.append({'s': sat_b['sg'], 'T': sat_b['t_sat']})               # boiling
    if turbine_inlet_temp > sat_b['t_sat']:
        for tt in np.linspace(sat_b['t_sat'], turbine_inlet_temp, 8)[1:]:
            _, ss = steam.superheated(boiler_pressure, float(tt))
            path.append({'s': ss, 'T': float(tt)})
    path.append({'s': s4, 'T': t_c})                                   # 4
    path.append({'s': s1, 'T': t_c})                                   # back to 1

    return {
        'boiler_pressure': boiler_pressure,
        'turbine_inlet_temp': turbine_inlet_temp,
        'condenser_pressure': condenser_pressure,
        't_sat_boiler': sat_b['t_sat'],
        't_sat_condenser': t_c,
        'h1': h1, 'h2': h2, 'h3': h3, 'h4': h4,
        's3': s3,
        'quality_exit': x4,
        'exit_superheated': bool(exit_superheated),
        'w_pump': w_pump,
        'w_turbine': w_turbine,
        'w_net': w_net,
        'q_in': q_in,
        'q_out': q_out,
        'thermal_efficiency': eta,
        'back_work_ratio': w_pump / w_turbine,
        'steam_rate': 3600.0 / w_net,
        'carnot_efficiency': 1.0 - (t_c + 273.15) / (t3 + 273.15),
        'ts_path': path,
        'dome': {
            's_liquid': SAT_SF.tolist(),
            's_vapor': SAT_SG.tolist(),
            'T': SAT_T.tolist(),
        },
    }


def compute_brayton(
    inlet_temp: float,
    pressure_ratio: float,
    turbine_inlet_temp: float,
    cp: float = 1.005,
    k: float = 1.4,
    compressor_efficiency: float = 1.0,
    turbine_efficiency: float = 1.0,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the simple Brayton cycle with the cold-air-standard model
    (state 1 = compressor inlet, 2 = compressor exit, 3 = turbine inlet,
    4 = turbine exit).

    Args:
        inlet_temp: Compressor inlet temperature T1, in K.
        pressure_ratio: r_p = p2/p1 (> 1).
        turbine_inlet_temp: Turbine inlet temperature T3, in K.
        cp: Specific heat at constant pressure, in kJ/(kg*K).
        k: Specific heat ratio cp/cv (> 1).
        compressor_efficiency: Compressor isentropic efficiency.
        turbine_efficiency: Turbine isentropic efficiency.
        num_curve_points: Points on the efficiency / net-work vs r_p sweep.

    Formulas:
        T2s = T1 r_p^((k-1)/k);  T4s = T3 / r_p^((k-1)/k)
        T2  = T1 + (T2s - T1)/eta_c;  T4 = T3 - eta_t (T3 - T4s)
        w_net = cp[(T3 - T4) - (T2 - T1)];  q_in = cp (T3 - T2)
        ideal eta = 1 - r_p^(-(k-1)/k)
        r_p at maximum ideal net work = (T3/T1)^(k / (2(k-1)))
    """

    if inlet_temp <= 0 or turbine_inlet_temp <= 0:
        raise ValueError("temperatures must be positive (use an absolute scale, e.g. kelvin)")
    if pressure_ratio <= 1:
        raise ValueError("pressure_ratio must be greater than 1")
    if turbine_inlet_temp <= inlet_temp:
        raise ValueError("turbine_inlet_temp must exceed inlet_temp")
    if cp <= 0:
        raise ValueError("cp must be positive")
    if k <= 1:
        raise ValueError("k must be greater than 1")
    _check_eff('compressor_efficiency', compressor_efficiency)
    _check_eff('turbine_efficiency', turbine_efficiency)

    t1, t3 = inlet_temp, turbine_inlet_temp
    r = cp * (k - 1.0) / k          # gas constant, kJ/(kg K)

    def cycle(rp: float):
        e = (k - 1.0) / k
        t2s = t1 * rp ** e
        t4s = t3 / rp ** e
        t2 = t1 + (t2s - t1) / compressor_efficiency
        t4 = t3 - turbine_efficiency * (t3 - t4s)
        w_c = cp * (t2 - t1)
        w_t = cp * (t3 - t4)
        q = cp * (t3 - t2)
        return t2, t4, w_c, w_t, q

    t2, t4, w_c, w_t, q_in = cycle(pressure_ratio)
    if q_in <= 0:
        raise ValueError("turbine_inlet_temp must exceed the compressor exit temperature")
    w_net = w_t - w_c
    eta = w_net / q_in
    eta_ideal = 1.0 - pressure_ratio ** (-(k - 1.0) / k)
    rp_opt = (t3 / t1) ** (k / (2.0 * (k - 1.0)))

    # T-s path (entropy relative to state 1, kJ/(kg K))
    s_2 = cp * np.log(t2 / t1) - r * np.log(pressure_ratio)
    s_3 = s_2 + cp * np.log(t3 / t2)
    s_4 = s_3 + cp * np.log(t4 / t3)
    path = [{'s': 0.0, 'T': t1}, {'s': s_2, 'T': t2}]
    for tt in np.linspace(t2, t3, 10)[1:]:
        path.append({'s': float(s_2 + cp * np.log(tt / t2)), 'T': float(tt)})
    path.append({'s': s_4, 'T': t4})
    for tt in np.linspace(t4, t1, 10)[1:]:
        path.append({'s': float(s_4 + cp * np.log(tt / t4)), 'T': float(tt)})

    # Sweep r_p
    rps = np.linspace(1.5, max(30.0, 1.5 * pressure_ratio), num_curve_points)
    sweep_eta, sweep_w = [], []
    for rp in rps:
        _, _, wc_i, wt_i, q_i = cycle(float(rp))
        if q_i <= 0:
            sweep_eta.append(0.0)
            sweep_w.append(0.0)
        else:
            sweep_eta.append(max((wt_i - wc_i) / q_i, 0.0))
            sweep_w.append(max(wt_i - wc_i, 0.0))

    return {
        'inlet_temp': t1,
        'pressure_ratio': pressure_ratio,
        'turbine_inlet_temp': t3,
        't2': t2,
        't4': t4,
        'w_compressor': w_c,
        'w_turbine': w_t,
        'w_net': w_net,
        'q_in': q_in,
        'q_out': cp * (t4 - t1),
        'thermal_efficiency': eta,
        'ideal_efficiency': eta_ideal,
        'back_work_ratio': w_c / w_t,
        'optimal_pressure_ratio': rp_opt,
        'ts_path': path,
        'sweep': {
            'pressure_ratio': rps.tolist(),
            'efficiency': sweep_eta,
            'net_work': sweep_w,
        },
    }
