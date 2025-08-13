export interface Action {
    name?: string;
    description?: string[];
    traits?: string[];
    ep_cost?: number | string;
    options?: Option[];
    roll_the_die?: RollResult[];
}

export interface Ability {
    name: string;
    description?: string[];
    actions?: Action[];
    roll_the_die?: RollResult[];
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
}

export interface Option {
    name: string;
    description?: string[];
}

export interface Pattern {
    name: string;
    chassis: number;
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
    description?: string[];
    ep_cost?: number | string;
    system_slots?: number;
    module_slots?: number;
    actions?: Action[];
    roll_the_die?: RollResult[];
}

export interface RollResult {
    roll: string;
    result: string;
}
