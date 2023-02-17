import { Platform } from "react-native";
import base64 from 'react-native-base64'
import { MessageFunctions, localStorage } from '../Helpers/Utils';
// import {
//     GoogleSignin,
//    } from 'react-native-google-signin';

global.player_id_me1 = '123456';
// global.fcmtoken='123456';
//--------------------------- Config Provider Start -----------------------
class configProvider {
	// baseURL =    'https://teq-dev-var19.co.in/rootscare/'  
	// img_url =    'http://teq-dev-var19.co.in/rootscare/images/200X200/'
	// img_url1 =    'http://teq-dev-var19.co.in/rootscare/images/400X400/'
	// img_url2 =    'http://teq-dev-var19.co.in/rootscare/images/700X700/'
	// img_url3 =    'https://teq-dev-var19.co.in/rootscare/uploads/images/'

	// baseURL = 'https://rootscare.net/'  
	// img_url = 'https://rootscare.net/uploads/images/200X200/'
	// img_url1 = 'https://rootscare.net/uploads/images/400X400/'
	// img_url2 = 'https://rootscare.net/uploads/images/700X700/'
	// img_url3 = 'https://rootscare.net/application/uploads/images/'

	// live url
	baseURL = 'https://rootscare.net/application/'
	img_url = 'https://rootscare.net/application/uploads/images/200X200/'
	img_url1 = 'https://rootscare.net/application/uploads/images/400X400/'
	img_url2 = 'https://rootscare.net/application/uploads/images/700X700/'
	img_url3 = 'https://rootscare.net/application/uploads/images/'

	// New Test Build
	// baseURL =    'https://production.rootscare.net/application/'  
	// img_url =    'https://production.rootscare.net/application/images/200X200/'
	// img_url1 =    'https://production.rootscare.net/application/images/400X400/'
	// img_url2 =    'https://production.rootscare.net/application/images/700X700/'
	// img_url3 =    'https://production.rootscare.net/application/uploads/images/'
	
	term_url_eng = 'https://rootscare.net/application/terms-and-conditions/eng'
	term_url_ar = 'https://rootscare.net/application/terms-and-conditions/ar'
	privacy_url_eng = 'https://rootscare.net/application/privacy-policy/eng'
	privacy_url_ar = 'https://rootscare.net/application/privacy-policy/ar'
	about_url_eng = 'https://rootscare.net/application/about-us/eng'
	about_url_ar = 'https://rootscare.net/application/about-us/ar'

	login_type = '0';
	onesignalappid = 'c0b75db1-bad7-4195-9e2a-3c199f296c37'
	mapkey = 'AIzaSyDy01zIxPpweSuXDx9Bs4g0GZR9ygB46Zw'; //'AIzaSyDkMuwTf82XUx9wlmS32rcTj2718Aa81bY';

	maplanguage = 'en';
	language = 0;
	player_id = '123456';

	countrycode = '966 ';
	player_id_me = '123456';
	fcmtoken_me = '123456'
	device_type = Platform.OS;
	loading_type = false;
	// latitude 	    = 53.4773206;
	// longitude 	    = -2.249042;
	textalign = 'left';
	textRotate = 'left';
	latitude = 55.9550298;
	longitude = -3.1889288;

	address = '';
	login = 0;

	headersapi = {
		'Authorization': 'Basic ' + base64.encode(base64.encode('mario') + ":" + base64.encode('carbonell')),
		Accept: 'application/json',
		'Content-Type': 'multipart/form-data',
		'Cache-Control': 'no-cache,no-store,must-revalidate',
		'Pragma': 'no-cache',
		'Expires': 0,
	}

	GetPlayeridfunctin = (player_id) => {
		console.log(player_id, 'player_id')
		player_id_me1 = player_id
	}

};
export const Configurations = new configProvider();





