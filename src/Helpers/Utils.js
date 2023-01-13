import {config} from '../Provider/configProvider';
import {Dimensions, Platform, StatusBar} from 'react-native';
import {localStorage} from '../Provider/localStorageProvider';
import {LanguageConfiguration} from './LanguageProvider';
import {
  MessageFunctions,
  MessageHeadings,
  MessageTexts
} from './Message';
import Cameragallery from '../Components/Cameragallery';
import {Media} from './MediaProvider';
import {API} from './API';
import {Colors, Font} from '../Provider/Colorsfont';

const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)


export {
  config,
  
  API,
  Colors,
  Font,
  mobileH,
  mobileW,
  Media,
  Cameragallery,
  localStorage,
  LanguageConfiguration,
  MessageFunctions,
  MessageHeadings,
  MessageTexts,
  windowHeight,
  windowWidth,
  deviceHeight,
  StatusbarHeight
};
