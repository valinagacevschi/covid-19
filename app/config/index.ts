const config = {
  develop: 'https://d735ee744ca4.ngrok.io',
  staging: 'https://example.com'
};

console.disableYellowBox = true;

export const getConfig = () => 
  ({ url: `${__DEV__ ? config.develop : config.staging}/api/v2` });

export const getHost = () => __DEV__ ? config.develop : config.staging;

export const minor = 4
export const version = `1.0.0(${minor})`;

export default {
  useFixture: false
}

export const UK = "United Kingdom";