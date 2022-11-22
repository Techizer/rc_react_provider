import React, {Component} from 'react';
import { Text, View,ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput, FlatList, Keyboard} from 'react-native';
import {Colors,Font,mobileH,Mapprovider,msgProvider,msgText,config,mobileW,localStorage,localimag, consolepro, handleback, Lang_chg, apifuntion, msgTitle,} from './Provider/utilslib/Utils';
// import Footer from './src/Provider/Footer';

import Styles from './Styles';
import {  AppHeader,  AppHeader2,  Appheading,  Searchbarandicon,} from './Allcomponents';
import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';


export default class HomeHealthcareServiceAppointmentsdetails extends Component {
  _didFocusSubscription; 
  _willBlurSubscription; 

   constructor(props){ 
    super(props) 
    this.state = {
      pass_status:this.props.route.params.pass_status,
      nurse_data:'',
      message:'',
      notification_count:'',
      provider_name:''
    }
    screens='Login';
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
        this.get_Services()
        this.get_all_notification()
     });    
  }
  get_all_notification=async()=>{
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details',user_details)
    let  user_id=user_details['user_id']
   
    let url = config.baseURL + "api-notification-count";
 
    var data = new FormData();
    data.append('login_user_id',user_id)
   
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data,1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status==true) {
        this.setState({notification_count:obj.result})
   
    
    
      
    } else {
    
     
    return false;
    }
    }).catch((error)=>{
      
    console.log("-------- error ------- " + error);
    })
    
    }

  get_Services=async()=>{
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let url = config.baseURL+"api-patient-service-provider-list";  
    console.log("url",url)
   
    var data = new FormData();        
    data.append('login_user_id',user_id)
    data.append('provider_name',this.state.provider_name)
    data.append('service_type',this.state.pass_status)
    data.append('work_area',user_details['work_area'])
    data.append('page_count',1)
 
    consolepro.consolelog('data',data)
    apifuntion.postApi(url, data).then((obj) => {
    consolepro.consolelog("obj",obj)
   
          if (obj.status == true) {
            console.log('obj.result',obj.result)
            
            this.setState({nurse_data:obj.result,message:obj.message,availability_arr:obj.result.availability})
            console.log('obj.result',obj.result)
            let hour_task =obj.result  
            if(obj.result !=null && obj.result !=''){
              for(let k=0;k<obj.result.length;k++){
                let availability =hour_task[k].availability  
                for(let l=0;l<availability.length;l++){
                  hour_task[k].availability[l]= availability[l].slot_day

                }
                hour_task[k].new_availablity= hour_task[k].availability.toString()
               }}
            console.log('musaknfg', hour_task)
            this.setState({nurse_data:hour_task})
          
         } else {
        
          this.setState({nurse_data:obj.result,message:obj.message})
             return false;
        }
       }).catch((error) => {
           consolepro.consolelog("-------- error ------- " + error);
       
       });
  
  }
  render() {
    return (
      <View style={Styles.container1}>
     
          <View style={{backgroundColor:'#f1f2f4',flex:1}}>
            {/* <Text>Home</Text> */}
            <View style={{ backgroundColor:'#fff',
    paddingVertical:mobileW*2/100,
    borderBottomWidth:1,
    borderBottomColor:Colors.LIGHT_CLIENT_BORDER}}>
      <View
        style={{
          padding: (mobileW * 2.5) / 100,
          flexDirection: 'row',
          width: '99%',
          alignSelf: 'center',
          paddingTop: (mobileW * 3) / 100,
          backgroundColor:Colors.white_color,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '10%',
            // backgroundColor: 'pink',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
             this.props.navigation.goBack();
            }}>
            <Image
            
            source={config.textalign=='right'?localimag.arabic_back:localimag.backarrow}
              style={{
                resizeMode: 'contain',
                width: (mobileW * 9) / 100,
                alignSelf: 'center',
                height: (mobileW * 9) / 100,
              }}></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: 'yellow',
            width: '80%',
          }}>
          <Text style={{ textAlign: 'center',
    fontFamily: Font.fontmedium,
    fontSize: (mobileW * 4) / 100,}}>{this.state.pass_status=='nurse'?
                Lang_chg.Nurse[config.language]:
                this.state.pass_status=='physiotherapy'?
                Lang_chg.Physiotherapist[config.language]:
                this.state.pass_status=='caregiver'?
                Lang_chg.Nurse_assistant[config.language]:
                Lang_chg.Babysitter[config.language]
                }</Text>
        </View>
        <View
          style={{
            width: '10%',
            alignSelf: 'center',
            // backgroundColor: 'red',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Notifications');
            }}>
            <Image
              // tintColor="#fff"
              source={this.state.notification_count>0? localimag.notifications: localimag.notifications_sec}
              style={{
                alignSelf: 'center',
                resizeMode: 'contain',
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>

           
   {/* <ScrollView
          style={Styles.container2}
     
         > */}
       
         <View style={{backgroundColor: '#f1f2f4'}}>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginTop:mobileW*1.5/100,
          marginBottom:mobileW*2/100,
          alignSelf: 'center',
          backgroundColor: Colors.textwhite,
          padding: (mobileW * 1) / 100,
          borderRadius: (mobileW * 1) / 100,
          alignItems:'center'
        }}>
        {/* search box */}

     
          <TextInput
            placeholder={this.state.pass_status=='nurse'?
                Lang_chg.SearchNurse[config.language]:
                this.state.pass_status=='physiotherapy'?
                Lang_chg.Searchphysi[config.language]:
                this.state.pass_status=='caregiver'?
                Lang_chg.Searchseassistent[config.language]:
                Lang_chg.SearchBabysitter[config.language]
                }
        
            placeholderTextColor={Colors.searchPlaceholder}
            onChangeText={(txt) => { this.setState({provider_name: txt }) }}
            returnKeyLabel='done'
            returnKeyType='done'
            onSubmitEditing={() => { Keyboard.dismiss() }}
            style={[{
              color:'#000',
             
              width:'88%',
              marginLeft:mobileW*1/100,
                fontFamily:Font.fontregular,
             paddingVertical:mobileW*2/100,
            
              textAlign: config.textalign,
            },this.state.pass_status=='physiotherapy'||'caregiver'?{fontSize:mobileW*3.7/100}:{ fontSize:mobileW*4/100}]}>

            </TextInput>
            <View style={{width:'2%'}}></View>
      <TouchableOpacity onPress={()=>{this.get_Services()}}>
        <View style={{alignSelf: 'center'}}>
       
          <Image
            source={localimag.searchiocn2}
            style={{
              width: (mobileW * 8) / 100,
              height: (mobileW * 8) / 100,
              // (mobileW * 5.5) / 100,
              borderRadius: (mobileW * 1.5) / 100,
              alignSelf: 'center',
            }}></Image>
           
        </View>
        </TouchableOpacity>
      </View>
    </View>
    {this.state.nurse_data=='' || this.state.nurse_data==null &&
             <View style={{marginTop:mobileW*50/100,}}>

             <Text style={{fontFamily: Font.fontregular,fontSize: Font.name,textAlign:'center',color:Colors.theme_color}}>{this.state.message}</Text>
             </View>
             
             }
            
            <FlatList
             data={this.state.nurse_data}
              contentContainerStyle={{paddingBottom:mobileW*25/100}}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
       
                if(this.state.nurse_data!='' && this.state.nurse_data!=null )
               {
                return (
                  <View style={{width:mobileW*100/100,backgroundColor:'#fff', alignSelf:'center', alignItems:'center',marginTop:mobileW*2/100}}>
                  <View style={{width:mobileW*90/100,alignSelf:'center',paddingVertical:mobileW*2/100, alignItems:'center'}}>
                     <View style={{width:'99%',flexDirection:'row',alignSelf:'center'}}>
                     <View style={{width: '30%'}}>
                          <TouchableOpacity
                            onPress={() =>
                               this.props.navigation.navigate('Nursedetails',{pass_status:this.state.pass_status,nurse_id:item.user_id})
                             }
                             style={{width:'100%'}}>
                            <Image
                              source={item.image == 'NA' || item.image == null ||  item.image == ''? require('./icons/No-Image3x.png'):{uri:config.img_url3+item.image}}
                               style={{
                               // alignSelf: 'center',
                                 borderWidth:1,
                                 borderColor:'#0888D1',
                                width: (mobileW * 22) / 100,
                                 height: (mobileW * 22) / 100,
                                 borderRadius: (mobileW * 11) / 100,
                               }}></Image>
                           </TouchableOpacity>
                        </View>
                       <View style={{width:'62%',  marginTop: (mobileW * 1) / 100}}>
                       
                           <Text onPress={()=>{this.props.navigation.navigate('Nursedetails',{pass_status:this.state.pass_status,nurse_id:item.user_id})}}
                            style={{
                              fontFamily: Font.fontmedium,
                               fontSize: Font.name,
                               textAlign:config.textRotate
                             }}>
                           {item.provider_name}
                         </Text>
                         {item.speciality!='' && item.speciality!=null &&
                           <Text
                             style={{
                              fontFamily: Font.fontregular,
                               color: Colors.theme_color,
                               fontSize: Font.subtext,
                               textAlign:config.textRotate,
                               paddingVertical: (mobileW * 0.5) / 100,
                             }}>
                             {item.speciality}
                           </Text>
                         }
                           <Text
                             style={{
                               paddingVertical: (mobileW * 0.5) / 100,
                               fontFamily: Font.fontregular,
                               fontSize: Font.ssubtext,
                               textAlign:config.textRotate,
                               color: Colors.cardlighgray,
                             }}>
                            {item.experience} | {item.qualification}
                           </Text>
                           <View
                             style={[{
                             
                              flexDirection: 'row',
                              // alignItems: 'center',
                             
                              
                            // justifyContent:'center',
                              
                           
                               marginTop: (mobileW * 1) / 100,
                             }]}>
                               <View style={{paddingRight:mobileW*3/100, borderRadius: (mobileW * 1) / 100, paddingHorizontal: (mobileW * 1) / 100,
                              paddingVertical: (mobileW * 1.4) / 100, backgroundColor:Colors.gray6,flexDirection:'row'}}>
                             <Image
                              source={localimag.location}
                              style={{
                                resizeMode: 'contain',
                                width: (mobileW * 4) / 100,
                                height: (mobileW * 4) / 100,
                                marginLeft:mobileW*1.5/100,
                                 tintColor: Colors.theme_color,
                               }}></Image>
                             <Text
                               style={{
                                marginLeft: (mobileW * 1) / 100,
                                fontFamily: Font.fontregular,
                                 fontSize: Font.ssubtext,
                                 textAlign:config.textRotate,
                                 color: Colors.regulartextcolor,
                              }}>{item.loc_text},
                              
                              <Text
                             style={{
                                  color: Colors.theme_color,
                                fontFamily: Font.fontregular,
                                textAlign:config.textRotate,
                                fontSize: Font.ssubtext,
                              }}> {item.distance}
                              </Text>
                            </Text>
                            </View>
                           </View>

                          <View
                             style={{
                              width: '100%',
                               flexDirection: 'row',
                              paddingVertical: (mobileW * 2) / 100,
                               borderRadius: (mobileW * 1) / 100,
                               alignItems:'center',
                             }}>
                         {config.language==0?   <Image
                              source={localimag.clock}
                               style={{
                                 resizeMode: 'contain',
                                width: (mobileW * 4) / 100,
                                 height: (mobileW * 4) / 100,
                               }}></Image>:
                                  <Image
                              source={localimag.clock_arabic_gray}
                              style={{
                                resizeMode: 'contain',
                                width: (mobileW * 4) / 100,
                                height: (mobileW * 4) / 100,
                              }}></Image>}
                             <Text
                              style={{
                                
                                 fontFamily: Font.fontregular,
                                fontSize:mobileW*2.5/100,
                                 color: Colors.regulartextcolor,
                                 marginLeft:mobileW*1.5/100,
                               }}>{item.av_text}
                               
                            </Text>

                           
                            <View style={{alignSelf:'center',marginTop:mobileW*0.4/100}}>
                    
           
          
                              <Text
                            style={{
                              color: Colors.theme_color,
                              fontFamily: Font.fontmedium,
                              fontSize:mobileW*2.5/100,
                              marginLeft:mobileW*1/100,
                            }}>
                              {item.new_availablity}
                          </Text>
                            </View>
                           
                           </View>
                         </View>
                       </View>
                       <View
                        style={{
                          width: '100%',

                          borderRadius: (mobileW * 2) / 100,
                         
                          alignItems:'center',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          paddingBottom: (mobileW * 2) / 100,
                        }}>
                        <View
                          style={{
                            width: '12%',
                            alignSelf: 'center',
                            backgroundColor: Colors.buttoncolorhgreen,
                            flexDirection: 'row',
                            // paddingHorizontal: (mobileW * 1.5) / 100,
                            paddingVertical: (mobileW * 0.5) / 100,
                            borderRadius:4,
                            alignItems:'center'
                          }}>
                          <Image
                            source={localimag.starrating}
                            style={{
                              tintColor: '#fff',
                              width: (mobileW * 3) / 100,
                              height: (mobileW * 3) / 100,
                              alignSelf: 'center',
                              marginLeft: (mobileW * 1) / 100,
                            }}></Image>
                          <Text
                            style={{
                              fontFamily: Font.fontregular,
                              fontSize: (mobileW * 3) / 100,
                              color: Colors.white_color,
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            {item.avg_rating}.0
                          </Text>
                        </View>

                     
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 1.5) / 100,
                            }}>
                            {item.booking_count}
                          </Text>
                     
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: Colors.white_color,
                          paddingVertical: (mobileW * 2) / 100,
                          borderTopWidth: (mobileW * 0.3) / 100,
                          borderColor: Colors.bordercolor,
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flex:1,
                            paddingVertical: (mobileW * 2) / 100,
                          }}>
                          <Text
                            style={{
                              color: Colors.buttoncolorhgreen,
                              fontSize: (mobileW * 3) / 100,
                              fontFamily: Font.fontmedium,
                              textAlign:config.textRotate
                            }}>{item.bavi_text}
                            
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('Booking', {
                             pass_status:this.state.pass_status,nurse_id:item.user_id
                            })
                          }
                          style={{
                            backgroundColor: Colors.buttoncolorblue2,
                            borderRadius: (mobileW * 1) / 100,
                            justifyContent: 'center',
                           paddingHorizontal:mobileW*2/100,
                            paddingVertical: (mobileW * 0.5) / 100,
                          }}>
                          <Text
                            style={{
                              color: Colors.white_color,
                              fontSize: (mobileW * 2.5) / 100,
                              fontFamily: Font.fontmedium,
                              textAlign:'center',
                              
                            }}>{Lang_chg.BOOKAPPOINTMENT [config.language]}
                       
                          </Text>
                        </TouchableOpacity>
                      </View>
                      </View>
                   
                </View>
   
                     
                    
                );
               }
              }}
            />


               
            {/* </ScrollView> */}
          </View>
       
        <HideWithKeyboard>
          <Footer
            activepage="Home"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                fname:Lang_chg.home_footer[config.language],
                countshow: false,
                image: localimag.Home,
                activeimage: localimag.Home,
              },
              {
                name: 'Appointment',
                fname:Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: localimag.Appointment,
                activeimage: localimag.Appointment,
              },
              {
                name: 'Cart',
                fname:Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: localimag.Cart,
                activeimage: localimag.Cart,
              },
              {
                name: 'More',
                fname:Lang_chg.More_footer[config.language],
                countshow: false,
                image: localimag.More,
                activeimage: localimag.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width:25,
              height:25,
              paddingBottom: (mobileW * 5.4) / 100,
              backgroundColor: 'white',
              countcolor: 'red',
              countbackground: 'red',
            }}
          />
        </HideWithKeyboard>
      </View>
    );
  }
}
