import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIphoneX = () => (
  Platform.OS === 'ios' && (isIphoneXSize() || isIphoneXrSize())
);

export const isIphoneXSize = () => ( height == 812 || width == 812);
export const isIphoneXrSize = () => ( height == 896 || width == 896);
export const isIphoneV = () => (( height == 568 || width == 320) && Platform.OS === 'ios');

export const HEADER_SIZE = Platform.OS === 'ios' ? (isIphoneX() ? 60 : 50) : 15;
export const HEADER_PADDING = isIphoneV() ? 15 : isIphoneX() ? 40 : 15;
const OFFSET = -80;

const graphHeight = Platform.OS === 'ios' ? (
  isIphoneX() ? 
    height / 3.6 : 
    isIphoneV() ? 
      height / 4.9 :
      height / 4.5
) : height / 4.5;

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  tabBarHeight: Platform.OS === 'ios' ? (isIphoneV() ? 50 : 60) : 50,
  icons: {
    tiny: 15,
    small: isIphoneV() ? 18 : 23,
    medium: isIphoneV() ? 20 : 25,
    large: 45,
    xl: 50,
    marginTop: isIphoneV() ? 0 : Platform.OS === 'ios' ? -3 : 0
  },
  images: {
    small: Platform.OS === 'ios' ? (isIphoneV() ? 30 : 50) : 35,
    medium: 40,
    large: 60,
    logo: 200
  },
  box: { 
    minHeight: Platform.OS === 'ios' ? (
      isIphoneX() ? 160 : isIphoneV() ? 110 : 130
    ) : 110,
    maxHeight: Platform.OS === 'ios' ? (isIphoneV() ? 150 : 160) : 120,
  },
  progress: {
    height: isIphoneV() ? 6 : 10
  },
  button: {
    paddingHorizontal: isIphoneV() ? 6 : 10
  },
  headerSize: HEADER_SIZE,
  headerPadding: HEADER_PADDING,
  screenOffset: isIphoneX() ? OFFSET : 0,
  isIphoneX: () => isIphoneX(),
  isIphoneV: () => isIphoneV(),
  graphHeight,
  onboardingOffset: isIphoneV() ? 75 : isIphoneX() ? 230 : 130,
  mapHeight: Platform.OS === 'ios' ? (isIphoneX() ? height - 196 : isIphoneV() ? height - 118 : height - 128) : height - 110,
  keyboarOffset: isIphoneX() ? 110 : 80,
  statsTop: isIphoneX() ? 50 : isIphoneV() ? 0 : 0
};

export default metrics;
