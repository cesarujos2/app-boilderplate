import { IMeasures } from "../interface/general";
import { IContingencyMeasure } from "../models/fta.interface";

export const contMeasureAdapter = (data: IMeasures[]) => {
    return data.map(x => {
        return {
            selected: false,
            code: x.code,
            risk: x.name,
            contingencyMeasure: x.value1,
        } as IContingencyMeasure
    });
}