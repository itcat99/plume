import IModel, { IAllEffects } from "./model";

export const effects: IAllEffects = {};

export default (models: IModel[]) => {
  models.forEach(model => {
    const { namespace, effect } = model;
    if (effect) {
      for (const key in effect) {
        effects[namespace] = Object.assign({}, effects[namespace], {
          [key]: effect[key],
        });
      }
    }
  });
};
