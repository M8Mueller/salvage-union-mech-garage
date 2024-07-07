export interface ChassisAbility {
    name: string;
    description: string;
}

export interface Pattern {
    id: number,
    name: string,
    systems: number[],
    modules: number[]
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
    ability: ChassisAbility;
    patterns: Pattern[];
}

export interface MechComponent {
    id: number;
    name: string;
    ep_cost?: number;
    tech_level: number;
    slots: number;
    salvage_value: number;
    traits?: string[];
    actions?: any[];
}
