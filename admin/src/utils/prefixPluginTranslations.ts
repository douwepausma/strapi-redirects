import { PLUGIN_ID } from '../pluginId';

type TradOptions = Record<string, string>;

const prefixPluginTranslations = (trad: TradOptions): TradOptions => {
  if (!PLUGIN_ID) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${PLUGIN_ID}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};

export { prefixPluginTranslations };
