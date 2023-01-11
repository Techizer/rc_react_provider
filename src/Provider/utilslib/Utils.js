import {config} from '../configProvider';
import {Dimensions, Platform, StatusBar} from 'react-native';
import {localStorage} from '../localStorageProvider';
import {Lang_chg} from '../Language_provider';
import {
  msgProvider,
  msgTitle,
  msgText,
  FlushMsg
} from '../Messageconsolevalidationprovider/messageProvider';
import {validation} from '../Messageconsolevalidationprovider/Validation_provider';
import {Currentltlg} from '../Curentlatlong';
import Cameragallery from '../../Components/Cameragallery';
import {mediaprovider} from '../Mediaprovider/Mediaprovider';
import {apifuntion} from '../Apicallingprovider/apiProvider';
import {Colors, Font} from '../Colorsfont';
import Otpprovider from '../Otpprovider';
import Footer from '../Footer';

const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)


export {
  config,
  Otpprovider,
  
  apifuntion,
  Colors,
  Footer,
  Font,
  validation,
  mobileH,
  mobileW,
  mediaprovider,
  Cameragallery,
  localStorage,
  Lang_chg,
  
  msgProvider,
  FlushMsg,
  msgTitle,
  msgText,
  Currentltlg,
  windowHeight,
  windowWidth,
  deviceHeight,
  StatusbarHeight
};
