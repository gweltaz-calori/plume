import SuperString from "../string/SuperString";

const WEBKIT = "-webkit-";
const aliases = {
  justifyContent: value => [
    {
      key: `${WEBKIT}justify-content`,
      value
    }
  ],
  alignItems: value => [
    {
      key: `${WEBKIT}align-items`,
      value
    }
  ],
  flex: value => [
    {
      key: `${WEBKIT}flex`,
      value
    }
  ],
  borderRadius: value => [
    {
      key: `${WEBKIT}border-radius`,
      value
    }
  ],
  transform: value => [
    {
      key: `${WEBKIT}transform`,
      value
    }
  ],
  transition: value => [
    {
      key: `${WEBKIT}transition`,
      value: value
        .replace("transform", `${WEBKIT}transform`)
        .replace("border-radius", `${WEBKIT}border-radius`)
    }
  ],
  flexWrap: value => [
    {
      key: `${WEBKIT}flex-wrap`,
      value
    }
  ],
  display: value => [
    {
      key: `display`,
      value:
        value === "flex" || value === "inline-flex"
          ? `${WEBKIT}${value}`
          : value
    }
  ]
};

export default class AutoPrefixer {
  static prefix(css) {
    for (let propertyName in css) {
      const property = css[propertyName];
      if (!aliases[propertyName]) {
        continue;
      }

      const propertyAliases = aliases[propertyName](property);
      for (let i = 0; i < propertyAliases.length; i++) {
        const alias = propertyAliases[i];
        css[SuperString.camelCase(alias.key)] = alias.value;
      }
    }

    return css;
  }
}
