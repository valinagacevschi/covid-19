import { isIphoneV, isIphoneX } from "./Metrics";
import { Platform } from "react-native";

const type = {
  base: 'Avenir-Book',
  bold: 'Avenir-Black',
  emphasis: 'HelveticaNeue-Italic'
}

const size = {
  h1: 38,
  ...Platform.select({
    ios: {
      h2: isIphoneV() ? 24 : 32,
      h3: isIphoneV() ? 20 : 30,
      h4: isIphoneV() ? 18 : 24,
      h5: isIphoneV() || isIphoneX() ? 16 : 18,
      h6: isIphoneV() || isIphoneX() ? 14 : 16,
      stats: isIphoneX() ? 17 : isIphoneV() ? 20 : 22,
      heading: isIphoneV() || isIphoneX() ? 14 : 17,
      button: isIphoneV() || isIphoneX() ? 13 : 16,
      label: isIphoneX() ? 16 : isIphoneV() ? 12 : 14,
      regular: isIphoneV() || isIphoneX() ? 12 : 14,
      medium: isIphoneV() || isIphoneX() ? 11 : 13,
      small: isIphoneX() || isIphoneV() ? 11 : 12,
    },
    android: {
      h2: 24,
      h3: 20,
      h4: 16,
      h5: 16,
      h6: 12,
      stats: 16,
      heading: 14,
      button: 13,
      label: 12,
      regular: 10,
      medium: 10,
      small: 10,
    },
  }),
  tiny: 8.5
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
}

export default {
  type,
  size,
  style
}
