import { DefaultEntityInstance } from "../default-entity-instance";
import { Characteristic } from "./default-characteristic";

export interface ValuesCollection extends Characteristic {
    values: Array<DefaultEntityInstance | string | number>;

    indexOf(value: string): number;
}
