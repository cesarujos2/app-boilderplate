import { IMeasures } from "../interface/general";
import { IEnviromentalMeasure } from "../models/fta.interface";


export const envMeasureAdapter = (data: IMeasures[]) => {
    const dataFormatted: IEnviromentalMeasure[] = data.map( x => {
        return {
            selected: true,
            code: x.code,
            stage: x.value3,
            activities: x.value5,
            component: x.value4,
            description: x.value1,
            preventiveMeasures: x.name,
            frecuency: x.value7,
            verification: x.value6,
        }
    });

    return dataFormatted
}