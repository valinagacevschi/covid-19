import React from 'react';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { SafeView, Loader } from '../../components/shared';
import { WebView } from 'react-native-webview';
import { Colors } from '../../themes';
import { getHost } from '../../config';
 
export const HelpScreen = (props: NavigationStackScreenProps) => {  
  const page = props.navigation.state.routeName;
  return (
    <SafeView wide>
      <WebView
        originWhitelist={['*']}
        source={{ uri: `${getHost()}/pandemic/${page}.html` }}
        startInLoadingState={true}
        renderLoading={() => <Loader size='large' color={Colors.coal} />}
        style={{
          backgroundColor: Colors.whiteText
        }}
      />
    </SafeView>
  );
}

export default HelpScreen;