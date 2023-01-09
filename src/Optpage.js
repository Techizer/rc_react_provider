import {Text,View,Modal,StatusBar,BackHandler,Alert, SafeAreaView,KeyboardAwareScrollView,ScrollView,styles,TouchableOpacity,Image,TextInput} from 'react-native';
import React, {Component} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import {Colors,Font,mobileH,config,mobileW,Lang_chg,apifuntion,localStorage,msgProvider,msgText,msgTitle,consolepro} from './Provider/utilslib/Utils';
import { Icons } from './icons/IReferences';
export default class Optpage extends Component {
   
  _didFocusSubscription; 
  _willBlurSubscription; 

   constructor(props){ 
    super(props) 
    this.state = {
            name:'',
            email:'',
            mobile:'',
            password:'',
            device_lang:'AR',
            mobile:'',
            country_name:this.props.route.params.country_name,
            fcm_token:123456,
            otp:'',
            modalVisible3:false,
            error_msg:''
    }
    this._didFocusSubscription = props.navigation.addListener('focus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  );
     } 
     componentDidMount() {
     
         this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
      );
    }
    handleBackPress = () => { 
      Alert.alert( 
      'Exit App', 
      'Do you want to exit app' , [{           
      text: 'No', 
      onPress: () => console.log('Cancel Pressed'), 
      style:'Yes', 
      }, { 
      text:'Yes', 
      onPress: () => BackHandler.exitApp() 
      }], { 
      cancelable: false 
      } 
      ); // works best when the goBack is async 
      return true; 
      };

  otpVerify = async () => {
  
     
    if (this.state.otp.length <= 0 || this.state.otp.trim().length <= 0) {
      msgProvider.toast(msgText.emptyOtpMsg[config.language], 'center')
      return false;
    }
    let user_details = await localStorage.getItemObject('user_login');
  
    let item =user_details
    let url = config.baseURL + "api-patient-registration-otp-check";
    console.log("url", url)
    var data = new FormData();
    data.append('first_name', item.name)
    data.append('email',item.email)
    data.append('phone_number', item.phone_number)
    data.append('id_number',item.id_number)
    data.append('work_area',this.state.country_name)
    data.append('code',this.state.otp)
    data.append('password', item.password)
    data.append('last_name','')
    data.append('confirm_password',item.confirm_password)
    data.append('device_type', config.device_type)
    data.append('device_lang',this.state.device_lang)
    data.append('fcm_token',this.state.fcm_token)
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
       
      this.setState({error_msg:obj.message})
 
            setTimeout(() => {
               this.setState({modalVisible3:true})
            },500);          
        
        } 
      else {

        setTimeout(() => {
        msgProvider.toast(obj.message, 'center')
      },500);     
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
  }
  sendagain= async()=>{
    let user_details = await localStorage.getItemObject('user_login');
    let item =user_details
    let url = config.baseURL+"api-resend-otp";  
   
    
    var data = new FormData();        
    data.append('phone_no', item.phone_number)        
    consolepro.consolelog('data',data)
  
        apifuntion.postApi(url, data).then((obj) => {
         consolepro.consolelog("obj",obj)
          if (obj.status == true) {
            
             setTimeout(()=>{
             msgProvider.toast(obj.message,'center')
            //  this.props.navigation.navigate('Otp_forget',{email:email_new}) 
            },300)
         } else {
     
        
        setTimeout(()=>{
             msgProvider.toast(obj.message,'center')
            },300)
            return false;
          }
       }).catch((error) => {
           consolepro.consolelog("-------- error ------- " + error);
         this.setState({ loading: false });
       });
  
  }
  render() {
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: 'white'}}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View>
          <SafeAreaView
            style={{backgroundColor: Colors.statusbar_color, flex: 0}}
          />

          <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.statusbarcolor}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />

          <View style={{paddingBottom: (mobileW * 8) / 100}}>
            <View
              style={{
                width: '50%',
                alignSelf: 'center',
                marginTop: (mobileW * 8) / 100,
                marginBottom: (mobileW * 10) / 100,
              }}>
              <Image
                style={{
                  width: (mobileW * 50) / 100,
                  height: (mobileW * 40) / 100,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  alignItems: 'center',
                }}
                source={Icons.LogoWithText}></Image>
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <Text
                style={{
                  fontSize: mobileW*5.3/100,
                  fontFamily: Font.blackheadingfontfamily,
                  textAlign:config.textRotate
                 
                }}>
                {Lang_chg.opt[config.language]}
              </Text>
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                   
                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.placeholder_text,
                    textAlign:config.textRotate
                  }}>
                  {Lang_chg.opttext[config.language]}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '70%',
           
           //  paddingHorizontal:mobileW*1/100,
             paddingVertical:mobileW*1/100,
                marginTop: (mobileW * 8) / 100,
                marginLeft: (mobileW * 5) / 100,
              }}>
              <OTPTextInput
                style={{
                  height: (mobileW * 14) / 100,
                  width: (mobileW * 14) / 100,
                  color:'#000',
                  alignSelf: 'center',
                  fontFamily:Font.Regular,
                  fontSize: (mobileW * 5) / 100,
                  borderWidth:2,
                  borderColor: '#DFDFDF',
                  borderRadius: (mobileW * 2) / 100,
                  textAlign:'center',
                }}
                ref={e => (this.otpInput = e)}
                numberOfInputs={4}
                cellTextLength={1}
                handleTextChange={text => this.setState({ otp: text })}
               
                tintColor="#f5f5ff"
                offTintColor="#f5f5ff"
                keyboardType={'number-pad'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                this.otpVerify();
              }}
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: (mobileW * 2) / 100,
                backgroundColor: Colors.buttoncolorblue,
                paddingVertical: (mobileW * 4) / 100,
                marginTop: (mobileW * 6) / 100,
                shadowColor: '#000',
                shadowOffset: { width:1, height:1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation:3,
              }}>
              <Text
                style={{
                  color: Colors.textwhite,
                  fontFamily: Font.Medium,
                  fontSize: Font.buttontextsize,
                
                  textAlign: config.textalign,
                  alignSelf: 'center',
                }}>
                {Lang_chg.signupbtntext[config.language]}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: '89%',
                alignSelf: 'center',
                marginTop: (mobileW * 5) / 100,
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between'
              }}>
              <Text
                style={{
                
                  textAlign: config.textalign,
                  fontSize: mobileW*4/100,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.textgray,
                }}>
                {Lang_chg.notrectext[config.language]}
              </Text>
              <Text onPress={()=>{this.sendagain()}}
                style={{
                 
                  textAlign: config.textalign,
                  fontSize: mobileW*4/100,
                  fontFamily: Font.SemiBold,
                  color: Colors.theme_color,
                  
                }}>
                {Lang_chg.sendagaintext[config.language]}
              </Text>
            </View>

        
          </View>
        </View>
        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible3}

                        onRequestClose={() => { this.setState({modalVisible3: false }) }}>
                        <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                            <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
                                networkActivityIndicatorVisible={true} />
                            <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

                                <View style={{ backgroundColor:'#fff', borderRadius: 2, width: "100%", }}>

                                    <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100,flexDirection:'row',alignItems:'center' }}>
                                       <Image style={{width:mobileW*6/100,height:mobileW*6/100}}  source={require('./icons/logo.png')}></Image>
                                        <Text style={{ fontFamily:Font.Medium, color: '#000', fontSize: mobileW * 5 / 100,paddingLeft:mobileW*4/100 }}>{Lang_chg.registration[config.language]}</Text>
                                    </View>

                                    <View style={{  paddingLeft: mobileW * 4 / 100,width:'95%',alignSelf:'center' }}>
                                        <Text style={{ fontFamily: Font.Light, color:'#000', fontSize: mobileW * 4 / 100, }}>{this.state.error_msg}</Text>
                                    </View>

                                    <View style={{
                                       paddingBottom: mobileW * 5 / 100,marginTop:mobileW*9/100,
                                         alignSelf: 'flex-end',
                                    }}>
                                        <TouchableOpacity onPress={() => { 
                                        setTimeout(() => {this.setState({ modalVisible3: false }), this.props.navigation.navigate('Login')}, 200)
                                         }}
                                            style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                                            <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color:Colors.theme_color, alignSelf: 'center',textAlign:config.textalign }}>{Lang_chg.OK[config.language]}</Text>
                                        </TouchableOpacity>
                                        
                                       
                                    </View>

                                </View>

                            </View>
                        </View>
                    </Modal>
      </ScrollView>
    );
  }
}
