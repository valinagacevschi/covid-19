import styled from 'styled-components';
import { Colors, Metrics, Fonts } from '../../themes';

export const SafeView = styled.SafeAreaView`
  flex: 1;
  alignItems: ${props => props.wide ? 'stretch' : 'center'};
  justifyContent: space-evenly;
  backgroundColor:${Colors.page};
`; 

export const CardView = styled.View`
  backgroundColor: ${Colors.whiteText};
  width: ${Metrics.screenWidth - 30};
  borderRadius: 15px;
  shadowColor: rgba(30,30,30,0.5);
  shadowOffset: 0px 3px;
  shadowOpacity:0.5;
  padding: 20px 20px;
  marginTop: 0px;
  alignSelf: center;
  marginTop: ${props => props.marginTop || '0'}
`;

export const Title = styled.Text`
  marginBottom: 0px;
  color: ${Colors.text};
  fontWeight: bold;
  fontSize: ${Fonts.size.h4};
  lineHeight: ${Fonts.size.h4 * 1.8};
  textAlign: ${props => (props.center ? 'center' : 'left')};
  alignSelf: ${props => (props.center ? 'center' : 'flex-start')};
  width: ${props => (props.center ? '100%' : 'auto')};
`;

export const H1 = styled.Text`
  color: ${Colors.text};
  fontSize: 24;
  lineHeight: 32;
  textAlign: center;
`;

export const H2 = styled.Text`
  color: ${Colors.text};
  fontSize: ${Fonts.size.h2};
  lineHeight: ${Fonts.size.h2 *  1.8};
  textAlign: center;
`;

export const H3 = styled.Text`
  color: ${Colors.text};
  fontSize: ${Fonts.size.h6};
  lineHeight: 26;
  textAlign: center;
`;

export const Summary = styled.Text `
  fontSize: ${Fonts.size.h6};
  color: ${Colors.text};
  lineHeight: ${Fonts.size.h6 *  1.4};
  textAlign: ${props => (props.center ? 'center' : 'left')};
  paddingBottom: 10;
`;

export const Info = styled.Text`
  fontSize: ${Fonts.size.h5};
  lineHeight: ${Fonts.size.h5 *  1.4};
  textAlign: ${props => (props.center ? 'center' : 'left')};
`;


export const Loader = styled.ActivityIndicator`
  position: absolute; 
  top: ${Metrics.screenHeight / 2 - 36};
  left: ${Metrics.screenWidth / 2 - 16};
`;

export const Loading = styled.View`
  position: absolute; 
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backgroundColor: #22222255;
  justifyContent: center;
  alignItems: center;
`;

export const Bold = styled.Text`fontWeight: bold`;
export const Italic = styled.Text`fontStyle: italic`;

export const ImageIcon = styled.Image`
  width: 42;
  height: 42;
  position: absolute;
  left: 20;
  top: 40;
`;

// export const HeaderView = styled.View`
//   paddingTop: ${Metrics.headerPadding};
//   height: ${Metrics.headerSize};
//   alignItems: center;
//   justifyContent: center;
//   backgroundColor: ${props => props.clear ? Colors.clear : 'white'};
//   shadowColor: ${props => props.clear ? Colors.clear : '#22222266'};
//   shadowOffset: 0px 3px;
//   shadowOpacity: ${props => props.shadow ? 0.5 : 0};
//   zIndex: 9999;
// `;

// export const HeaderTitle = styled.Text`
//   color: ${Colors.text};
//   fontSize: ${Fonts.size.h4};
// `;

// export const BigButton = styled.TouchableOpacity`
//   position: relative;
//   minHeight: ${Metrics.screenHeight / 4};
//   width: ${Metrics.screenWidth - 80};
//   alignItems: center;
//   justifyContent: center;
//   backgroundColor: ${Colors.banner};
//   shadowColor: #22222266;
//   shadowOffset: 0px 5px;
//   shadowOpacity:0.85;
//   marginVertical: 20;
//   borderRadius: 40;
// `;

export const ButtonBar = styled.View`
  flexDirection: row;
  justifyContent: space-around
`;

// export const Separator = styled.View`
//   borderColor: ${Colors.coal};
//   borderBottomWidth: 0.7;
// `;

export const Row = styled.View`
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
`;
