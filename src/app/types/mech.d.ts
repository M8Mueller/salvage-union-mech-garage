export interface Action {
    name?: string;
    description?: string;
    traits?: string[];
    ep_cost?: string | number;
    options?: Option[];
    roll_results?: RollResult[];
}

export interface Ability {
    name: string;
    description?: string | string[];
    actions?: Action[];
    roll_results?: RollResult[];
}

export interface Chassis {
    id: number;
    name: string;
    structure_pts: number;
    energy_pts: number;
    heat_cap: number;
    system_slots: number;
    module_slots: number;
    cargo_cap: number;
    tech_level: number;
    salvage_value: number;
    abilities?: Ability[];
    patterns?: Pattern[];
}

export interface Option {
    name: string;
    description?: string;
}

export interface Pattern {
    id: number;
    name: string;
    systems: number[];
    modules: number[];
}

export interface MechComponent {
    id: number;
    name: string;
    tech_level: number;
    slots: number;
    salvage_value: number;
    traits?: string[];
    ep_cost?: string | number;
    system_slots?: number;
    module_slots?: number;
    actions?: Action[];
    roll_results?: RollResult[];
}

export interface RollResult {
    roll: string;
    result: string;
}
