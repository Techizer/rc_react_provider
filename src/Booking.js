import React, {Component} from 'react';
import {Text, View,ScrollView,StyleSheet,StatusBar,SafeAreaView,Image,TouchableOpacity,ImageBackground, TextInput, Keyboard,FlatList,Modal} from 'react-native';
import { Colors, Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, localimag, consolepro, handleback,Lang_chg, apifuntion, msgTitle,} from './Provider/utilslib/Utils';
// import Footer from './src/Provider/Footer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Styles from './Styles';
import { AppHeader, AppHeader2, Appheading, Searchbarandicon, Inactivecard, Taskbooking, Appcheckedbox,Appuncheckedbox, Appbtn,} from './Allcomponents';
import Footer from './Footer';

import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { Icons } from './icons/IReferences';




const timedata = [
  {
    id: 0,
    time: '10:30 AM',
  },
  {
    id: 2,
    time: '11:00 AM',
  },
  {
    id: 1,
    time: '11:30 AM',
  },
  {
    id: 1,
    time: '12:00 AM',
  },
  {
    id: 1,
    time: '12:30 PM',
  },
  {
    id: 1,
    time: '01:00 PM',
  },
  {
    id: 1,
    time: '01:30 PM',
  },
  {
    id: 1,
    time: '02:00 PM',
  },
];


export default class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass_status:this.props.route.params.pass_status,
      nurse_id:this.props.route.params.nurse_id,
      display: 'taskbooking',
      task_base_task:'',
      task_base_task1:'',
      new_task_arr:'',
      set_date:'',
      timedata:timedata,
      distance_fare_pass:'',
      person_arr:'',
      modalVisible3:false,
      Error_popup:false,
      select_task:'',
      time_add:'',
      time_take:'',
      notification_count:'',
      task_price_total:'',
      sub_total_price:'',
      total_price:'',
      family_member_id:'',
      time_take_data:'',
      time_take_data_hour:'',
      total_price_show:'',
      hour_id:'',
      only_vatprice_show:'',
      hour_total_amount:'',
      hour_time:'',
      active_status:true,
      vat_price_show:'',
      final_total_price:'',
      hour_total_price:'',
      vat_price_show_hourly:'',
      vat_price_show_display:'',
      currency_symbol:'',

    };
    screens='Booking';
  }
  componentDidMount() {
    if (this.props.route.params.display != undefined) {
      let display = this.props.route.params.display;
     
      this.setState({display:display});
      
      console.log("display",display)
    }
    this.props.navigation.addListener('focus', () => {
   
      this.get_Services()
      this.get_day()
      this.get_all_notification()
      this.get_person()
     });    
  }
  get_all_notification=async()=>{
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details',user_details)
    let  user_id=user_details['user_id']
 

    let url = config.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id',user_id)
   
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data,1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status==true) {
        this.setState({notification_count:obj.result})
        console.log('obj nationaltity',obj)
    
    
      
    } else {
    
     
    return false;
    }
    }).catch((error)=>{
      
    console.log("-------- error ------- " + error);
    })
    
    }
  get_day=()=>{
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+28);
    let datenew_show=today.getDate()
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'];
    let month_show=today.getMonth()+1
     let year_show=today.getFullYear()
     let show_month1=''
     let show_get_date=''
     if(month_show<=9)
     {
      show_month1="0"+month_show
     }
     else{
      show_month1=month_show
     }
     if(datenew_show<=9)
     {
      show_get_date="0"+datenew_show
     }
     else{
      show_get_date=datenew_show
     }
     let date1_show=year_show+'-'+show_month1+'-'+show_get_date
    this.setState({set_date:date1_show,check_currentdate:date1_show})
   
    for(var arr=[],dt=new Date(today); dt<=new Date(nextweek); dt.setDate(dt.getDate()+1)){
       
        let date_final=new Date(dt)
        let month=date_final.getMonth()+1
        let year=date_final.getFullYear()
        var dayName = days[date_final.getDay()];
        let final_date=date_final.getDate()
        let datenew=''
        let show_month=''
        if(final_date<=9)
       {
        datenew="0"+final_date
       }
       else{
        datenew=final_date
       }
       if(month<=9)
       {
        show_month="0"+month
       }
       else{
        show_month=month
       }
        let date1=year+'-'+show_month+'-'+datenew
        let tick=0
        if(date1== date1_show){
          tick=1
        }

        arr.push({date1:date1,datenew:datenew,day:dayName,tick:tick});
    }
    this.setState({date_array:arr})
    console.log("check date muskan",arr)
};


get_time_date=async()=>{
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']
  
  let url = config.baseURL+"api-patient-next-date-time";  
  console.log("url",url)
 
  var data = new FormData();        
  data.append('provider_id',this.state.nurse_id)
 data.append('date',this.state.set_date)
 data.append(' task_type',this.state.set_task)
  data.append('service_type',this.state.pass_status)
 

  consolepro.consolelog('data',data)
  apifuntion.postApi(url, data).then((obj) => {
 console.log('misdhfbs ',obj)
 
        if (obj.status == true) {
 
          consolepro.consolelog("obj.result",obj.result)
          if(obj.result.task_time!='')
          {
          var names = obj.result.task_time;
          var nameArr = names.split(',');
      
      
      console.log("Arr2",Arr2);
       
        
        const new_time_dlot=[];
        const Arr1=[];
        const Arr2=[];
        if(obj.result.task_time!=''){
        for(let l=0;l<nameArr.length;l++){
            if(this.state.check_currentdate==this.state.set_date)
            {
              const timeStr = nameArr[l];
           
              const convertTime = timeStr => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                   hours = '00';
                }
                if (modifier === 'PM') {
                   hours = parseInt(hours, 10) + 12;
                }
                return `${hours}:${minutes}`;
              };
             var finaltime= convertTime(timeStr);
             if(finaltime>=this.state.timcurrent_for_check)
             {
              new_time_dlot.push({time:nameArr[l],time_status:false});
              if ((l+2)%2==0) {

                Arr1.push({time:nameArr[l],time_status:false});
                     }
        
                else {
                    Arr2.push({time:nameArr[l],time_status:false});
                }
             }
            }
          else{
        new_time_dlot.push({time:nameArr[l],time_status:false});
        if ((l+2)%2==0) {

          Arr1.push({time:nameArr[l],time_status:false});
               }
  
          else {
              Arr2.push({time:nameArr[l],time_status:false});
          }
          }  }}
          
          this.setState({time_Arr:new_time_dlot,final_one:Arr1,final_arr2:Arr2})
     
            }
            else{
              this.setState({time_Arr:obj.result.task_time,})
            }
           

              if(obj.result.hourly_time!='')
              {
              var names_time = obj.result.hourly_time;
              var nameArr_time = names_time.split(',');
       
              }
            
        
            const new_time_hourl=[];
            const hour_Arr1=[];
            const hour_Arr2=[];
            if(obj.result.hourly_time!=''){
            for(let m=0;m<nameArr_time.length;m++){
              const timeStr_hour = nameArr_time[m];
              if(this.state.check_currentdate==this.state.set_date)
              {
              const convertTime_hour = timeStr_hour => {
                const [time, modifier] = timeStr_hour.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                   hours = '00';
                }
                if (modifier === 'PM') {
                   hours = parseInt(hours, 10) + 12;
                }
                return `${hours}:${minutes}`;
              };
              var finaltime_hour=convertTime_hour(timeStr_hour);
              if(finaltime_hour>=this.state.timcurrent_for_check)
              {
             new_time_hourl.push({time:nameArr_time[m],time_status:false});
             if ((m+2)%2==0) {

              hour_Arr1.push({time:nameArr_time[m]});
                   }
      
              else {
                hour_Arr2.push({time:nameArr_time[m]});
              }
          
            
            } }
             else{
              new_time_hourl.push({time:nameArr_time[m],time_status:false});
              if ((m+2)%2==0) {

                hour_Arr1.push({time:nameArr_time[m]});
                     }
        
                else {
                  hour_Arr2.push({time:nameArr_time[m]});
                }
           
            }}
                 this.setState({hour_time:new_time_hourl,final_hour_one:hour_Arr1,final_hour_two:hour_Arr2})
                }

            else{
 
              this.setState({hour_time:obj.result.hourly_time,final_hour_one:hour_Arr1,final_hour_two:hour_Arr2})
            }


        
       } else {
    
           return false;
      }
     }).catch((error) => {
         consolepro.consolelog("-------- error ------- " + error);
     
     });

}


get_person=async()=>{
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']
  let url = config.baseURL+"api-patient-family-member";  
  console.log("url",url)
 
  var data = new FormData();        
  data.append('user_id',user_id)

 

  consolepro.consolelog('data',data)
  apifuntion.postApi(url, data,1).then((obj) => {
  consolepro.consolelog("obj",obj)
 
        if (obj.status == true) {

         console.log('hello hello',obj.result)
          
         this.setState({person_arr:obj.result})


        
       } else {
        this.setState({person_arr:obj.result})
           return false;
      }
     }).catch((error) => {
         consolepro.consolelog("-------- error ------- " + error);
     
     });

}

  
delete_click=async()=>{
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']
  let url = config.baseURL+"api-delete-patient-family-member";  
  console.log("url",url)
 
  var data = new FormData();        
  data.append('id',this.state.id)
  consolepro.consolelog('data',data)
  apifuntion.postApi(url, data,1).then((obj) => {
  consolepro.consolelog("obj",obj)
 
        if (obj.status == true) {

         console.log('hello hello',obj.result)
        
      
          this.get_person()
         

        
       } else {
        msgProvider.toast(obj.message,'center')
           return false;
      }
     }).catch((error) => {
         consolepro.consolelog("-------- error ------- " + error);
     
     });

}

  get_Services=async()=>{
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    this.setState({name:user_details['first_name'],currency_symbol:user_details['currency_symbol']}) 
   
    var cureent = new Date();
    var timcurrent = cureent.getHours() + ":" + cureent.getMinutes() ;
    this.setState({timcurrent_for_check:timcurrent})
  if(user_details.image != null){
      this.setState({
          profile_img:user_details['image'],
      })  
  }
    let url = config.baseURL+"api-patient-booking-init-details";  
    console.log("url",url)
   
    var data = new FormData();        
    data.append('provider_id',this.state.nurse_id)
   data.append('lgoin_user_id',user_id)
    data.append('service_type',this.state.pass_status)
   
 
    consolepro.consolelog('data',data)
    apifuntion.postApi(url, data).then((obj) => {
    console.log('dsiuvuhg bd',obj)
   
          if (obj.status == true) {
            if(obj.result.task_time!='')
            {
            var names = obj.result.task_time;
            var nameArr = names.split(',');
     
            }
          
      
          const new_time_dlot=[];
          const Arr2=[];
          const Arr1=[];
          if(obj.result.task_time!=''){
          for(let l=0;l<nameArr.length;l++){
           
            const timeStr = nameArr[l];
           
            const convertTime = timeStr => {
              const [time, modifier] = timeStr.split(' ');
              let [hours, minutes] = time.split(':');
              if (hours === '12') {
                 hours = '00';
              }
              if (modifier === 'PM') {
                 hours = parseInt(hours, 10) + 12;
              }
              return `${hours}:${minutes}`;
            };
           var finaltime= convertTime(timeStr);
           if(finaltime>=timcurrent)
           {
            new_time_dlot.push({time:nameArr[l],time_status:false});

            if ((l+2)%2==0) {

            Arr1.push({time:nameArr[l],time_status:false});
                 }
    
            else {
                Arr2.push({time:nameArr[l],time_status:false});
            }
        
          
          }
            
            }}



               if(obj.result.hourly_time!='' && obj.result.hourly_time!= null)
               {
               var names_time = obj.result.hourly_time;
               var nameArr_time = names_time.split(',');
        
               }
             
               const hour_Arr2=[];
               const hour_Arr1=[];
             const new_time_hourl=[];
             if(obj.result.hourly_time!='' && obj.result.hourly_time!=null){
               
             for(let m=0;m<nameArr_time.length;m++){
              const timeStr_hour = nameArr_time[m];
           
              const convertTime_hour = timeStr_hour => {
                const [time, modifier] = timeStr_hour.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                   hours = '00';
                }
                if (modifier === 'PM') {
                   hours = parseInt(hours, 10) + 12;
                }
                return `${hours}:${minutes}`;
              };
              var finaltime_hour=convertTime_hour(timeStr_hour);
              if(finaltime_hour>=timcurrent)
              {
              new_time_hourl.push({time:nameArr_time[m],time_status:false});
            
              if ((m+2)%2==0) {

                hour_Arr1.push({time:nameArr_time[m]});
                     }
        
                else {
                  hour_Arr2.push({time:nameArr_time[m]});
                }
            
            
            }   }}
              let real_total=''
              let  real_total_show=''
              let  real_total_final=''
              let show_real_price= ''
              let vat_price_new =obj.result.vat_price
              // vat_price_new=15
              if(vat_price_new!=0 )
              {
                if(obj.result.distance_fare!=0){
                // real_total_show = (obj.result.distance_fare/100)*vat_price_new
                // real_total_final=  real_total_show.toFixed(2)
                real_total= Number(obj.result.distance_fare)
                show_real_price=(parseFloat(vat_price_new)).toFixed(1)
                }
                else{
                  real_total_show = (obj.result.distance_fare/100)*vat_price_new
                  real_total_final=  real_total_show.toFixed(2)
                  real_total= Number(real_total_final)
                  show_real_price=(parseFloat(vat_price_new)).toFixed(1)
                }
              }
              else{
                real_total=(parseFloat(vat_price_new)+parseFloat(obj.result.distance_fare)).toFixed(1)
                show_real_price=(parseFloat(vat_price_new)).toFixed(1)
               
              }
              let sun_total=parseFloat(real_total).toFixed(1)
            this.setState({vat_price_show_display:0.0, booking_data:obj.result,message:obj.message,task_base_task:obj.result.task_base_task,task_base_task1:obj.result.task_base_task,task_time:obj.result.task_time,time_Arr:new_time_dlot,vat_price:vat_price_new,distance_fare:obj.result.distance_fare,final_total_price:sun_total,hour_total_price:sun_total, vat_percent_used:obj.result.vat_text,hour_time:new_time_hourl,vat_price_show:real_total,vat_price_show_hourly:0.0,distance_fare_pass:obj.result.distance_fare,final_one:Arr1,final_arr2:Arr2,final_hour_one:hour_Arr1,final_hour_two:hour_Arr2,only_vatprice_show:show_real_price})
          
          console.log('muskan',real_total)
          
            if(obj.result.hour_base_enable==0 && obj.result.task_base_enable==1)
            {
              this.setState({display:'hourlybooking'})
            }
          
         
            
            let time_slot = obj.result.task_base_task
            if(obj.result.task_base_task!=null){
              for(let j=0;j<obj.result.task_base_task.length;j++){
                time_slot[j].status=false
                
               }}  
              
            let hour_task =obj.result.hour_base_task     
            if(obj.result.hour_base_task !=null && obj.result.hour_base_task !=''){
              for(let k=0;k<obj.result.hour_base_task.length;k++){
                hour_task[k].status=false
                

               }} 
              
          
          
        
            this.setState({task_base_task:time_slot,hour_base_task:hour_task})
           
          
         } else {
       
          msgProvider.toast(obj.message,'center')
             return false;
        }
       }).catch((error) => {
        setTimeout(() => {
          this.setState({Error_popup:true})
           },700);
      
        consolepro.consolelog("-------- error ------- " + error);
           
       });
  
  }
  submit_btn = async()=>{
  
    Keyboard.dismiss()
    if (this.state.select_task.length <= 0) {
      msgProvider.toast(msgText.Emptytask[config.language], 'center')
      return false;
    }

    if (this.state.time_take_data.length <= 0) {
      msgProvider.toast(msgText.EmptyTime[config.language], 'center')
      return false;
    }
     

      let user_details = await localStorage.getItemObject('user_arr');
      let user_id = user_details['user_id']
    
  let url = config.baseURL + "api-patient-insert-cart";
  console.log('url', url)
  var data = new FormData();
  console.log('data',data)

  data.append('service_type',this.state.pass_status)
  data.append('login_user_id',user_id)
  data.append('family_member_id',this.state.family_member_id)
  data.append('provider_id',this.state.nurse_id)
  data.append('task_id',this.state.final_data)
  data.append('task_price',this.state.set_price)
  data.append('task_type','task_base')
  data.append('from_date',this.state.set_date)
  data.append('from_time',this.state.time_take_data)
  data.append('appointment_type','online')
  data.append('vat_percent_used',this.state.vat_price)

  data.append('vat_price',this.state.vat_price_show)
  data.append('distance_fare',this.state.distance_fare_pass)
  data.append('task_price_total',this.state.total_price_show)
  data.append('sub_total_price',this.state.total_price_show)
  data.append('total_price',this.state.final_total_price)
   apifuntion.postApi(url,data).then((obj) => {
      consolepro.consolelog("obj",obj)
      consolepro.consolelog("obj",obj.status)
       if (obj.status == true) {
 
     
        console.log('hello')
     
        // msgProvider.toast(msgText.sucess_message_login[config.language], 'center')
        setTimeout(() => {
          this.props.navigation.navigate('Cart');
           },700);
       
     

   } else {
      // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
      //   usernotfound.loginFirst(this.props, obj.msg[config.language])
      // } else {
        setTimeout(() => {
       msgProvider.alert('',obj.message, false);
      },700);
      // }
      return false;
    }
    }).catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
  
  }

  submit_btn_hourly = async()=>{
    Keyboard.dismiss()
    if (this.state.hour_id.length <= 0) {
      msgProvider.toast(msgText.Emptytask[config.language], 'center')
      return false;
    }

    if (this.state.time_take_data_hour.length <= 0) {
      msgProvider.toast(msgText.EmptyTime[config.language], 'center')
      return false;
    }
     

      let user_details = await localStorage.getItemObject('user_arr');
      let user_id = user_details['user_id']
     
  let url = config.baseURL + "api-patient-insert-cart";
  console.log('url', url)
  var data = new FormData();
  console.log('data',data)

  data.append('service_type',this.state.pass_status)
  data.append('login_user_id',user_id)
  data.append('family_member_id',this.state.family_member_id)
  data.append('provider_id',this.state.nurse_id)
  data.append('task_id',this.state.hour_id)
  data.append('task_price',this.state.hour_price)
  data.append('task_type','hour_base')
  data.append('from_date',this.state.set_date)
  data.append('from_time',this.state.time_take_data_hour)
  data.append('appointment_type','online')
  data.append('vat_percent_used',this.state.vat_price)

  data.append('vat_price',this.state.vat_price_show_hourly)
  data.append('distance_fare',this.state.distance_fare_pass)
  data.append('task_price_total',this.state.hour_total_amount)
  data.append('sub_total_price',this.state.hour_total_amount)
  data.append('total_price',this.state.hour_total_price)
  console.log('hello data',data)
  //return false
   apifuntion.postApi(url,data).then((obj) => {
      consolepro.consolelog("obj",obj)
      consolepro.consolelog("obj",obj.status)
       if (obj.status == true) {
 
     
        console.log('hello')
     
        // msgProvider.toast(msgText.sucess_message_login[config.language], 'center')
        setTimeout(() => {
          this.props.navigation.navigate('Cart');
           },700);
       
     

   } else {
      // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
      //   usernotfound.loginFirst(this.props, obj.msg[config.language])
      // } else {
        setTimeout(() => {
       msgProvider.alert('',obj.message, false);
      },700);
      // }
      return false;
    }
    }).catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
  
  }



  SearchFilterFunction = (text) => {
    this.setState({name_new: text })
    
  //  let task_base_task1=this.state.task_base_task
    let data1 = this.state.task_base_task1
    console.log('this.state.task_base_task1',this.state.task_base_task1)
    if (data1 != '') {
      
        const newData = data1.filter((item)=> {
            //applying filter for the inserted text in search bar


            const textData = text.toLowerCase();
            return (
               item.name.toLowerCase().indexOf(textData) >= 0 
            )
        });
        consolepro.consolelog("newdataa",newData)
        if (newData.length > 0) {
            this.setState({ task_base_task:newData })
        } else if (newData.length <= 0) {
            this.setState({task_base_task: '' })
        }
    }
  }

  check_all=(item,index)=>
{
  let data=this.state.task_base_task;
  let comma_arr =[];
  let price_arr =[];
  if(data[index].status==true)
  {
      data[index].status=false
  }
  else
  {
    if(data[index].status==false)
    {
        data[index].status=true
    }
 }
 for(let i=0;i<data.length;i++)
      {
 if(data[i].status==true)
{
  comma_arr.push(data[i].id)
  price_arr.push(data[i].price)
  
}
 }

  let result = price_arr.map(i=>Number(i));
  let sum =0
  
  
   for (let k = 0; k < result.length; k++) {
     sum +=result[k];
   
     
 }
 let real_total=''
  let  real_total_show=''
  let  real_total_final=''
  let show_total_price
  
    
     if(this.state.only_vatprice_show==0 || this.state.only_vatprice_show=='0.0')
  {

    real_total=(parseFloat(this.state.vat_price_show_display)).toFixed(1)
    show_total_price=parseFloat(parseInt(this.state.distance_fare_pass)+sum).toFixed(1)
   
               
  }
  else{
    let vat_sum_per=sum
     real_total_show = (vat_sum_per/100)*this.state.vat_price
                real_total_final=  real_total_show.toFixed(2)
                real_total= Number( real_total_final)
                show_total_price=parseFloat(parseInt(this.state.distance_fare_pass)+parseFloat(real_total)+sum).toFixed(1)
  
  }


 
 let final_data= comma_arr.toString();
 let  set_price =price_arr.toString();
 let total_sum= parseInt(sum)
 
 this.setState({task_base_task:data,new_task_arr:data,select_task:comma_arr,final_data:final_data,set_price:set_price,sum_arr:price_arr,total_price_show:total_sum,vat_price_show:real_total,vat_price_show_display:real_total,distance_fare:show_total_price,final_total_price:show_total_price})

}

hourbooking=(item,index)=>
{
  let data=this.state.hour_base_task;
   console.log('new data',data)

      for(let i=0;i<data.length;i++)
      {
          if(i==index)
          {
              data[i].status=true;
          }
          else{
            data[i].status=false;
          }
      }

     
      let prize = Number(item.price)
      let real_total=''
      let  real_total_show=''
      let  real_total_final=''
      let show_total_price
      let hour_add=''
    console.log('helool hello ',this.state.vat_price_show)
    
    if(this.state.only_vatprice_show==0 || this.state.only_vatprice_show==0.0)
    {
        show_total_price=this.state.vat_price_show
        hour_add=parseFloat(parseInt(this.state.distance_fare_pass)+parseInt(prize)+parseFloat(this.state.vat_price_show)).toFixed(1)
      
      }
      else{
        let vat_sum_per=prize
        real_total_show = (vat_sum_per/100)*this.state.vat_price
                   real_total_final=  real_total_show.toFixed(2)
                   real_total= Number( real_total_final)
                   show_total_price= real_total 
                   hour_add=parseFloat(parseInt(this.state.distance_fare_pass)+parseInt(prize)+parseFloat(show_total_price)).toFixed(1)
            
                  }
      console.log('dnhcnfby',show_total_price)
    
  // }
  this.setState({hour_base_task:data,hour_base_task_new:data,hour_total_amount:prize,vat_price_show_hourly:show_total_price,hour_total_price:hour_add})
 
}

check_date=(item,index)=>
{
  let data=this.state.date_array;
   console.log('new data',data)

      for(let i=0;i<data.length;i++)
      {
          if(i==index)
          {
              data[i].tick=1;
            
          }
          else{
            data[i].tick=0;
          }
       }
  // }
  this.setState({date_array:data})
 
}


time_tick=(item,index)=>
{
  let data=this.state.time_Arr;
   console.log('new data',data)
  // if(data[index].time_status==true)
  // {
  //     data[index].time_status=false
  // }
  // else
  // {
      for(let i=0;i<data.length;i++)
      {
          if(i==index)
          {
              data[i].time_status=true;
          }
          else{
            data[i].time_status=false;
          }
      // }
  }
  this.setState({time_Arr:data})
 
}
hour_time_tick=(item,index)=>
{
  let data=this.state.hour_time;
   console.log('new data',data)

      for(let i=0;i<data.length;i++)
      {
          if(i==index)
          {
              data[i].time_status=true;
          }
          else{
            data[i].time_status=false;
          }
    
  }
  this.setState({hour_time:data})
 
}

check_all_false=(item,index)=>
{
  let price_arr =[];
  let data=this.state.new_task_arr;
   
  if(data[index].status==true)
  {
      data[index].status=false
  }
  else
  {
    if(data[index].status==false)
    {
        data[index].status=true
    }
 }
  console.log('data',data)
  for(let i=0;i<data.length;i++)
  {
if(data[i].status==false)
{

price_arr.push(data[i].price)

}
}

let result = price_arr.map(i=>Number(i));
var sum =0

for (let k = 0; k < result.length; k++) {
 sum -=result[k];
}
console.log('muska test',sum)
  this.setState({task_base_task:data,new_task_arr:data,total_price_show:sum})
 
}


  render() {
    if(this.state.booking_data!='' && this.state.booking_data!=null)
    {
 
      var item = this.state.booking_data
     
    return (
    
      <View style={Styles.container1}>
     
          <View style={Styles.container3}>

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
            
            source={config.textalign=='right'?Icons.arabic_back:Icons.backarrow}
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
    fontFamily: Font.Medium,
    fontSize: (mobileW * 4) / 100,}}>{Lang_chg.Booking[config.language]}</Text>
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
              source={this.state.notification_count>0? Icons.notifications: Icons.notifications_sec}
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
            
                <ScrollView
          style={Styles.container2}
          contentContainerStyle={{paddingBottom:mobileW*30/100}}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor:'#F1F2F4',
               
                paddingVertical: (mobileW * 5) / 100,
              }}>

                <View style={{width:'95%',alignSelf:'center',
                flexDirection: 'row',alignItems:'center'}}>           
                   <View style={{width: '25%',}}>
                <Image
                  source={item.image == 'NA' || item.image == null  || item.image == ''? Icons.p1:{uri:config.img_url3+item.image}}
                  style={{
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 20) / 100,
                    borderWidth: 1,
                    borderColor: Colors.theme_color,
                    borderRadius: (mobileW * 10) / 100,alignSelf:'center'
                  }}></Image>
              </View>
              <View style={{width: '70%',marginLeft:mobileW*2/100}}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.name,
                    textAlign:config.textRotate
                  }}>{item.provider_name}
                 
                </Text>
                <Text
                  style={{
                    textAlign:config.textRotate,
                    paddingVertical: (mobileW * 1.5) / 100,
                    fontFamily: Font.ques_fontfamily,
                    fontSize: Font.subtext,
                    color: Colors.theme_color,
                  }}>
                  {item.dispaly_provider_type} - {item.experience}
                </Text>
                <Text
                  style={{
                    textAlign:config.textRotate,
                    fontFamily: Font.ques_fontfamily,
                    fontSize: Font.subtext,
                    color:'#515C6F'
                  }}>{item.qualification}
                
                </Text>
              </View>

              </View>
  
            </View>

            {/* contact flatlist */}
            <View
              style={{
                backgroundColor: Colors.white_color,
                padding: (mobileW * 3) / 100,
                flexDirection: 'row',
                // justifyContent:'space-between'
              }}>
              <TouchableOpacity onPress={()=>{this.setState({active_status:true,family_member_id:0})}}
                style={[{
                  width: (mobileW * 20) / 100,
                  height: (mobileW * 24) / 100,
                  borderRadius: (mobileW * 2) / 100,
                   paddingVertical:mobileW*3/100, 
                  borderColor: Colors.theme_color,
                  justifyContent: 'center',
                 
                },this.state.active_status==true?{backgroundColor: '#d1e9f6'}:{backgroundColor: '#fff'}]}>
                <Image
                 
                  source={this.state.profile_img == 'NA' || this.state.profile_img == null? Icons.user_img:{uri:config.img_url3+this.state.profile_img}}
                  style={{
                    alignSelf: 'center',
                    width: (mobileW * 16) / 100,
                    height: (mobileW * 14) / 100,
                    borderRadius:mobileW*2/100,
                    borderColor: Colors.theme_color,
                    marginTop:mobileW*2/100,
                  }}></Image>
                <Text style={{alignSelf: 'center',fontFamily:Font.Medium,paddingBottom:mobileW*2/100,marginTop:mobileW*1/100,paddingHorizontal:mobileW*0.5/100}} numberOfLines={1}>{this.state.name}</Text>
              </TouchableOpacity>
              <View style={{width:'60%',alignSelf:'center',marginLeft:mobileW*3/100,alignItems:'flex-start'}}>
              <FlatList
                
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.person_arr}
                renderItem={({item, index}) => {
                  
                  if(this.state.person_arr!='' || this.state.person_arr!=null)
                {
                  return(
                    <TouchableOpacity onPress={()=>{this.setState({family_member_id:item.id,active_status:false})}}
                style={[{
                  width: (mobileW * 20) / 100,
                  height: (mobileW * 24) / 100,
                  borderRadius: (mobileW * 2) / 100,
                   paddingVertical:mobileW*3/100, 
                  borderColor: Colors.theme_color,
                  justifyContent: 'center',
                  paddingHorizontal:mobileW*0.2/100,
                  marginRight:mobileW*1/100,
                  // backgroundColor: '#d1e9f6',
                },this.state.family_member_id==item.id?{backgroundColor: '#d1e9f6'}:{backgroundColor: '#fff'}]}>
                <View style={{ borderWidth:2,
                    borderColor: Colors.theme_color,
                    width: (mobileW * 14) / 100,
                       alignItems:'center',
                       marginLeft:mobileW*2.5/100,
                    
                  borderRadius:mobileW*3/100,alignItems:'center',marginTop:mobileW*2/100}}>
                <ImageBackground
                
                  imageStyle={{borderRadius:mobileW*2.5/100}}
                  source={item.image == 'NA' || item.image == null? Icons.user_img:{uri:config.img_url3+item.image}}
                  style={{
                    alignSelf: 'center',
                    width: (mobileW * 13) / 100,
                    height: (mobileW * 13) / 100,
                    alignSelf:'center',
              
                  
                   
                   
                  }}>
                  <TouchableOpacity onPress={()=>{this.setState({modalVisible3:true}),this.setState({id:item.id,first_name:item.first_name, last_name:item. last_name})}}>
                    <Image style={{width:20,height:20,alignSelf:'flex-end',top:0}} source={Icons.crossimg}></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                  </View>
                <Text style={{fontFamily:Font.Light,paddingBottom:mobileW*2/100,textAlign:'center',marginTop:mobileW*1.2/100,fontSize:mobileW*3.2/100}} numberOfLines={1}>{item.first_name}</Text>
              </TouchableOpacity>

                  )}
                }}></FlatList>
             
              </View>
            
           

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AddPatient');
                }}
                style={{
                  width: (mobileW * 16) / 100,
                  height: (mobileW * 20) / 100,
                  borderRadius: (mobileW * 2) / 100,
                  borderColor: Colors.theme_color,
                  justifyContent: 'center',
                  backgroundColor: '#d1e9f6',
                  alignSelf:'center',
                  right:-10,
                
                  
                 
                }}>
                <Image
                  resizeMode="contain"
                  source={Icons.addicon}
                  style={{
                   
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 10) / 100,
                    marginLeft:mobileW*3/100,marginRight:mobileW*3/100,
                    borderColor: Colors.theme_color,
                  }}></Image>
                <Text style={{fontFamily:Font.Regular,fontSize:mobileW*3/100,textAlign:'center',marginTop:mobileW*2/100}}>{Lang_chg.Add[config.language]}</Text>
              </TouchableOpacity>
            </View>

        
            <View
              style={{
                backgroundColor: '#F1F2F4',
                width: '100%',
                 
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {item.task_base_enable==0 &&
              <TouchableOpacity
                onPress={() => {
                  this.setState({display: 'taskbooking'});
                }}
                style={{width: '50%', alignSelf: 'center'}}>
                <View style={{width: '100%'}}>
                  <Text
                    style={
                      this.state.display == 'taskbooking'
                        ? {
                            color: Colors.textblue,

                            fontFamily:Font.Medium,
                            fontSize:mobileW*4/100,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                        : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.Medium,
                            fontSize:mobileW*4/100,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                    }>{Lang_chg.TaskBooking[config.language]}
                   
                  </Text>

                  <View
                    style={
                      this.state.display == 'taskbooking'
                        ? {
                            width: (mobileW * 42) / 100,
                            alignSelf: 'center',
                            paddingVertical:1,
                            borderWidth:1,borderColor:Colors.bordercolorblue,
                            backgroundColor:Colors.bordercolorblue,
                            borderTopLeftRadius:mobileW*2/100,borderTopRightRadius:mobileW*2/100
                          }
                        : {
                            width: (mobileW * 42) / 100,
                            alignSelf: 'center',
                            borderWidth:2,
                            borderColor:Colors.tab_background_color,
                            backgroundColor:Colors.tab_background_color,
                           
                          }
                    }></View>
                </View>
              </TouchableOpacity>
              }
  {item.hour_base_enable==0 &&
              <TouchableOpacity
                onPress={() => {
                  this.setState({display: 'hourlybooking'});
                }}
                style={{width: '50%', alignSelf: 'center'}}>
                <View style={{width: '100%'}}>
                  <Text
                    style={
                      this.state.display == 'hourlybooking'
                        ? {
                            color: Colors.textblue,

                            fontFamily:Font.Medium,
                            fontSize:mobileW*4/100,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                        : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.Medium,
                            fontSize:mobileW*4/100,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                    }>{Lang_chg.HourlyBooking[config.language]}
                   
                  </Text>

                  <View
                    style={
                      this.state.display == 'hourlybooking'
                        ? {
                            width: (mobileW * 42) / 100,
                            alignSelf: 'center',
                            paddingVertical:1,
                            borderWidth:1,borderColor:Colors.bordercolorblue,
                            backgroundColor:Colors.bordercolorblue,
                            borderTopLeftRadius:mobileW*2/100,borderTopRightRadius:mobileW*2/100
                          }
                        : {
                            width: (mobileW * 42) / 100,
                            alignSelf: 'center',
                            borderWidth:2,
                            borderColor:Colors.tab_background_color,
                            backgroundColor:Colors.tab_background_color,
                           
                          }
                    }></View>
                </View>
              </TouchableOpacity>
              }
            </View>

            {this.state.display == 'taskbooking' && (
                     <View style={{width:'100%',alignSelf:'center',backgroundColor:'#fff',}}>
              <View style={{width:'95%',backgroundColor:'#fff',right:0,alignSelf:'flex-end'}}>
              <FlatList
                
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.new_task_arr}
                renderItem={({item, index}) => {
            
                  if(this.state.new_task_arr!='')
                {
                  return(
                    <View style={{alignSelf:'center'}}>
{item.status==true &&
                  <View
          style={{
        backgroundColor: Colors.theme_color,
        paddingVertical: (mobileW * 0.8) / 100,
        flexDirection: 'row',
        paddingHorizontal: (mobileW * 1.5) / 100,
        marginTop:mobileW*2/100,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: (mobileW * 1) / 100,
        marginRight: (mobileW * 2) / 100,
        
      }}>
      <Text
        style={{
          color: Colors.white_color,
          fontSize: Font.textsize,
          fontFamily: Font.Light,

          
         // paddingHorizontal: (mobileW * 2) / 100,
        }}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={()=>{this.check_all_false(item,index)}} >
      <Image
        source={Icons.cross2}
        style={{
          alignSelf: 'center',
          width: (mobileW * 2) / 100,
          height: (mobileW * 2) / 100,
          marginLeft:mobileW*3.5/100,
        
      
        }}></Image>
        </TouchableOpacity>
    </View>
}
</View>
  
                   ) }}}></FlatList>
                  </View>
                
                <View
                  style={{ width:'100%',
                    alignSelf: 'center',
                    backgroundColor:Colors.tab_background_color,
                    alignItems:'center',
                     marginTop:mobileW*3/100,
                  }}>
                   
<View style={{width:'98%',alignSelf:'center',flexDirection:'row'}}>
                   <TextInput
                  ref={(text)=>{this.textdata=text}}
                      maxLength={50}
                      onChangeText={(text)=>{this.SearchFilterFunction(text)}}
                     returnKeyLabel='done'
                     returnKeyType='done'
                     onSubmitEditing={() => { Keyboard.dismiss() }}
                     style={{fontSize:mobileW*4/100,fontFamily:Font.ques_fontfamily,color:'#8F98A7',width:'90%',paddingVertical:mobileW*3.5/100,textAlign:config.textalign}}
                     placeholderTextColor={'#8F98A7'}
                     placeholder={Lang_chg.Searchtask[config.language]}>
                      </TextInput>
              
                  <View style={{width:'10%',alignSelf:'center'}}>
                  <Image
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                      tintColor:'#8F98A7',
                      // backgroundColor:'red',
                      alignSelf:'center'
                    }}
                    source={Icons.search2}></Image>
                    </View>
                    </View>
                </View>
               
                
               { this.state.task_base_task!='' && this.state.task_base_task!=null &&
                   
                <View style={[{width:'100%',alignSelf:'center',marginTop:mobileW*2/100},this.state.task_base_task.length>=4?{height:200}:null]}>
                 <FlatList
                   data={this.state.task_base_task}
                   scrollEnabled={true}
  
                   nestedScrollEnabled={true}
                   renderItem={({item, index}) => {
                    if(this.state.task_base_task!='')
                    {
                     return (
                       <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.check_all(item,index)}}
                        style={{
                        alignItems: 'center',width:'100%',
                        alignSelf: 'center',
                        backgroundColor:'#F8F8F8',
                        paddingVertical: (mobileW * 1.7) / 100,
                        flexDirection: 'row',
                     marginTop:mobileW*0.3/100,
                        // alignItems: 'center',
                        // justifyContent: 'space-between',
                      }}>
                      <View style={{alignSelf: 'center',width:'11%'}}>
                      {item.status==true ?
                        <Image
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                            borderRadius: (mobileW * 0.4) / 100,
                            marginRight: (mobileW * 2) / 100,
                            marginLeft: (mobileW * 3) / 100,
                            resizeMode: 'contain',
                            alignSelf: 'flex-start',
                         
                          }}
                          source={Icons.remembertick}></Image>:
                          <Image
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                            borderRadius: (mobileW * 0.4) / 100,
                            marginRight: (mobileW * 2) / 100,
                            marginLeft: (mobileW * 3) / 100,
                            resizeMode: 'contain',
                            alignSelf: 'flex-start',
                        
                          }}
                          source={require('./icons/graycheckbox.png')}></Image>
                      }
                      </View>
                      <Text
                        style={{
                          width: '59%',
                          textAlign:config.textRotate,
                          alignSelf: 'center',
                          fontSize:mobileW*3.6/100,
                          fontFamily: Font.Regular,
                        
                          color:'#000',
                      
                         
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                    
                          width: '25%',
                       
                          fontSize:mobileW*3.6/100,
                          fontFamily: Font.Regular,
                          color:'#000',
               
                         textAlign: 'right',
                         
                        }}>
                        {item.price} {this.state.currency_symbol}
                      </Text>
                    </TouchableOpacity>
                    );
                  }}}></FlatList> 
              
              </View>
    }
                
                  
          
               
              </View>
            )}

            {this.state.display == 'hourlybooking' && 
            <View style={{width:'100%',backgroundColor:'#fff', 
                       
                        paddingVertical:mobileW*3/100,
                        marginBottom:mobileW*1/100,
                       }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={item.hour_base_task}
                  renderItem={({item, index}) => {
                   
                    return (
                      <TouchableOpacity onPress={()=>{this.hourbooking(item,index),this.get_time_date(), this.setState({hour_id:item.id,hour_price:item.price,time_take_data_hour:''})}} style={[{
                            borderRadius: (mobileW * 2) / 100,
                            marginLeft:mobileW*2/100,
                            width:mobileW*35/100,backgroundColor:'#fff',},item.status==true?{borderColor:Colors.theme_color,borderWidth:2}: {borderColor:'#DFDFDF',borderWidth:1}]}>
                      <View
                          style={{
                            backgroundColor:'#0168B3',
                            borderTopLeftRadius:(mobileW *1.1) / 100,
                            borderTopRightRadius:(mobileW *1.1) / 100,
                            width:'100%',
                           
                           
                          }}>
                          <Text
                            style={{
                              // backgroundColor:'red',
                              // paddingHorizontal: (mobileW * 5) / 100,
                              paddingVertical: (mobileW * 1.5) / 100,
                              color: Colors.white_color,
                              fontFamily:Font.Medium,
                              fontSize: mobileW*3/100,
                              textTransform: 'uppercase',
                              textAlign: 'center',
                            }}>
                            {item.duration} 
                          </Text>
                          </View>
                          
                          <Text
                            style={{
                             
                            
                              paddingVertical: (mobileW * 2) / 100,
                              fontFamily: Font.Medium,
                              textAlign:'center',
                              fontSize: Font.sregulartext_size,
                            }}>
                            {item.price} {this.state.currency_symbol}
                          </Text>
                      </TouchableOpacity>
                     
                    );
                  }}></FlatList>
            </View>
            }

         
                      <View style={{width:'100%', 
                        shadowOpacity: 0.3,
                        shadowColor: '#000',
                        // padding:mobileW*0.2/100,
                        shadowOffset: {width: 2, height: 2},
                        elevation:2,
                        shadowRadius:2,
                        marginTop:mobileW*1.5/100,
                        marginBottom:mobileW*1.5/100,
                        backgroundColor:'#fff'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems:'center',
              
                width: '93%',
                alignSelf: 'center',
                paddingTop: (mobileW * 4) / 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.name,
                  width: '65%',
                  textAlign:config.textRotate,
                  fontSize:mobileW*3.5/100
                 
                }}>{Lang_chg.Appoinmentschedule[config.language]}
                
              </Text>
              <View style={{flexDirection:'row',alignItems:'center',width:'35%',justifyContent:'flex-end'}}>
              <View style={{width:'20%',alignSelf:'center'}}>              
                <Image
                    style={{
                      width:mobileW*5/100,
                      height:mobileW*5/100,
                     // resizeMode:'contain',
                      alignSelf:'center'
                    }}
                    source={Icons.calendarimg}></Image>
                        </View>




              <Text
                style={{
                  color: Colors.theme_color,
                  fontFamily: Font.Medium,
                  fontSize: Font.name,alignSelf:'center',
                  marginLeft:mobileW*1/100,
                  // width:'75%',
                  // backgroundColor:'red',
                  textAlign:'right'
                }}>{this.state.set_date}
               
              </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth:1,
                borderColor: Colors.gainsboro,
               width:'100%',
               marginTop:mobileW*1.5/100,
               marginBottom:mobileW*1.5/100
              }}></View>


                     <View
                style={{
                  width: '93%',
                  alignSelf: 'center',
                  paddingBottom: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.subtext,
                    textAlign:config.textRotate,
                    color:'#000'
                  }}>{Lang_chg.SelectDate[config.language]}
                 
                </Text>
             {this.state.display=='taskbooking' ?
                <View style={{width: '100%'}}>
             
                  <FlatList
                     horizontal={true}
                    data={this.state.date_array}
                   showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                   
                        return (
                          <TouchableOpacity onPress={()=>{this.setState({set_date:item.date1,set_task:'task_base',time_take_data:''}), this.get_time_date(),this.check_date(item,index)}} style={{width:mobileW*15/100,}}>
                          <Text
                            style={{
                              marginRight: (mobileW * 3) / 100,
                              marginTop: (mobileW * 3) / 100,
                              backgroundColor:item.tick==1?'#0787D2':Colors.gray6,
                              color: item.tick==1?'white':'black',
                              textAlign:'center',
                              paddingVertical:mobileW*2/100,
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                            
                              lineHeight:mobileW*5/100,
                           
                            }}>
                            {item.day}{"\n"}  
                            
                            {item.datenew}
                          </Text>
                          </TouchableOpacity>
                        );
                    
                    }}></FlatList>
                </View>:
                <View style={{width: '100%'}}>
             
             <FlatList
                horizontal={true}
               data={this.state.date_array}
              showsHorizontalScrollIndicator={false}
               renderItem={({item, index}) => {
              
                   return (
                     <TouchableOpacity onPress={()=>{this.setState({set_date:item.date1,set_task:'hour_base',time_take_data_hour:''}),this.get_time_date(),this.check_date(item,index)}} style={{width:mobileW*15/100,}}>
                     <Text
                       style={{
                         marginRight: (mobileW * 3) / 100,
                         marginTop: (mobileW * 3) / 100,
                         backgroundColor:item.tick==1?'#0787D2':Colors.gray6,
                         color: item.tick==1?'white':'black',
                         textAlign:'center',
                         paddingVertical:mobileW*2/100,
                         fontFamily: Font.ques_fontfamily,
                         fontSize: Font.sregulartext_size,
                       
                         lineHeight:mobileW*5/100,
                      
                       }}>
                       {item.day}{"\n"}  
                       
                       {item.datenew}
                     </Text>
                     </TouchableOpacity>
                   );
               
               }}></FlatList>
           </View>}

              </View>

              <View
              style={{
                borderWidth:1,
                borderColor: Colors.gainsboro,
               width:'100%',
               marginTop:mobileW*1.5/100,
               marginBottom:mobileW*1.5/100
              }}></View>


                     <View
                style={{
                  width: '93%',
                  alignSelf: 'center',
                  paddingBottom: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.subtext,
                    color:'#000',
                    textAlign:config.textRotate,
                  }}>{Lang_chg.Select_start_time[config.language]}
                
                </Text>

 <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{width: '100%',alignItems:'center'}}>
                 {this.state.display=='taskbooking' ?
                 <View style={{width:'100%',alignItems:'center'}}>
                   {this.state.time_Arr!='' ?
                 <View style={{width:'100%',alignItems:'center'}}>
                <View style={{width:'100%',}}>
                        <FlatList
                    horizontal={true}
                  
                   showsHorizontalScrollIndicator={false}
                    data={this.state.final_one}
                    renderItem={({item, index}) => {
              
                        return (
                          <TouchableOpacity onPress={()=>{this.setState({time_take_data:item.time})}}>
                          <Text
                            style={[{
                              marginRight: (mobileW * 3) / 100,
                              marginTop: (mobileW * 3) / 100,
                  
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                              padding: (mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 3.3) / 100,
                            },item.time==this.state.time_take_data?{ backgroundColor:Colors.theme_color,color:'#fff'}:{backgroundColor:Colors.gray6,color:'#000'}]}>
                            {item.time}
                          </Text>
                          </TouchableOpacity>
                        );
                      }
                    }></FlatList>
                    </View>
                     <View style={{width:'100%',}}>
                    <FlatList
                      horizontal={true}
                    
                     showsHorizontalScrollIndicator={false}
                      data={this.state.final_arr2}
                      renderItem={({item, index}) => {
                
                          return (
                            <TouchableOpacity onPress={()=>{this.setState({time_take_data:item.time})}}>
                            <Text
                              style={[{
                                marginRight: (mobileW * 3) / 100,
                                marginTop: (mobileW * 3) / 100,
                    
                                fontFamily: Font.ques_fontfamily,
                                fontSize: Font.sregulartext_size,
                                padding: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 3.3) / 100,
                              },item.time==this.state.time_take_data?{ backgroundColor:Colors.theme_color,color:'#fff'}:{backgroundColor:Colors.gray6,color:'#000'}]}>
                              {item.time}
                            </Text>
                            </TouchableOpacity>
                          );
                        }
                      }></FlatList>
                      </View>
                      </View>:
                    <Text style={{fontFamily:Font.MediumItalic,fontSize:mobileW*4/100,alignSelf:'center',paddingVertical:mobileW*3/100,textAlign:'center',marginLeft:mobileW*32/100}}>{Lang_chg.no_data_Found[config.language]}</Text>}
                    </View>:
                     
                     <View style={{width:'100%',alignItems:'center'}}>
                    {this.state.hour_time!=''?
                 <View style={{width:'100%',alignItems:'center'}}>
                <View style={{width:'100%',}}>
                        <FlatList
                    horizontal={true}
                  
                   showsHorizontalScrollIndicator={false}
                    data={this.state.final_hour_one}
                    renderItem={({item, index}) => {
              
                        return (
                          <TouchableOpacity onPress={()=>{this.setState({time_take_data_hour:item.time})}}>
                          <Text
                            style={[{
                              marginRight: (mobileW * 3) / 100,
                              marginTop: (mobileW * 3) / 100,
                  
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                              padding: (mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 3.3) / 100,
                            },item.time==this.state.time_take_data_hour?{ backgroundColor:Colors.theme_color,color:'#fff'}:{backgroundColor:Colors.gray6,color:'#000'}]}>
                            {item.time}
                          </Text>
                          </TouchableOpacity>
                        );
                      }
                    }></FlatList>
                    </View>
                     <View style={{width:'100%',}}>
                    <FlatList
                      horizontal={true}
                    
                     showsHorizontalScrollIndicator={false}
                      data={this.state.final_hour_two}
                      renderItem={({item, index}) => {
                
                          return (
                            <TouchableOpacity onPress={()=>{this.setState({time_take_data_hour:item.time})}}>
                            <Text
                              style={[{
                                marginRight: (mobileW * 3) / 100,
                                marginTop: (mobileW * 3) / 100,
                    
                                fontFamily: Font.ques_fontfamily,
                                fontSize: Font.sregulartext_size,
                                padding: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 3.3) / 100,
                              },item.time==this.state.time_take_data_hour?{ backgroundColor:Colors.theme_color,color:'#fff'}:{backgroundColor:Colors.gray6,color:'#000'}]}>
                              {item.time}
                            </Text>
                            </TouchableOpacity>
                          );
                        }
                      }></FlatList>
                      </View>
                      </View>:
                    <Text style={{fontFamily:Font.MediumItalic,fontSize:mobileW*4/100,alignSelf:'center',paddingVertical:mobileW*3/100,textAlign:'center',marginLeft:mobileW*32/100}}>{Lang_chg.no_data_Found[config.language]}</Text>}
                    </View>
                      
                  }
                </View>
                </ScrollView>   
             


              </View>
            {/* border */}
          
              </View>
            <View style={{}}>
       

              {/* border */}
            

              {/* Payment section */}
             {this.state.display=='taskbooking' &&
              <View style={{width:'100%', 
                        shadowOpacity: 0.3,
                        shadowColor: '#000',
                            paddingVertical:mobileW*3/100,
                        shadowOffset: {width: 2, height: 2},
                        marginTop:mobileW*1.5/100,
                        elevation:2,marginBottom:mobileW*3/100,backgroundColor:'#fff'}}>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                 
                  
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.headingfont,
                        color: Colors.theme_color,
                        textAlign:config.textRotate,
                      }}>{Lang_chg.Payment[config.language]}
                    
                    </Text>
                  </View>
         {this.state.new_task_arr!='' &&
                  <FlatList
                
              
             
                data={this.state.new_task_arr}
                renderItem={({item, index}) => {
      
                  if(this.state.new_task_arr!='')
                {
                  return(
                  
                      <View>
                       {item.status==true &&
                      <View
                    style={{
                      flexDirection: 'row',
                     width:'100%',
                     justifyContent:'space-between',
                     marginTop:mobileW*1.5/100,
                    
                
                      alignSelf:'center'
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                        width:'70%',
                        textAlign:config.textRotate
                      
                   
                       
                      }}>{item.name}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                        width:'30%',
                        textAlign:'right'
                       
                       
                      }}>{item.price} {this.state.currency_symbol}
                     
                    </Text>
                  </View> }
                  </View>
               
                  );
                
                }
                
              }}></FlatList>
         }
                 
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 2) / 100,
                     borderTopWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                      marginTop:mobileW*2/100,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{item.distance_fare_text}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>
                      {item.distance_fare}.0 {this.state.currency_symbol}
                    
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                     
                      // borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,marginBottom:mobileW*2/100
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{item.vat_text}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{this.state.vat_price_show_display} {this.state.currency_symbol}
                     
                    </Text>
                  </View>


<View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems:'center',
                      borderTopWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                      marginBottom:mobileW*2/100,
                      paddingVertical:mobileW*2/100
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize:mobileW*3.7/100,
                        color: Colors.theme_color,
                      }}>{Lang_chg.Total[config.language]}
                   
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize:mobileW*3.7/100,
                        color: Colors.theme_color,
                      }}>
                       {this.state.final_total_price} {this.state.currency_symbol}
                    
                    </Text>
                  </View>

                  <Appbtn
                    onPresshandler={() => {
                      this.submit_btn();
                    }}
                    title={Lang_chg.PROCEEDTOcheckout[config.language]}
                  />
                </View>
              </View>
             }
             {this.state.display=='hourlybooking' &&
              <View style={{width:'100%', 
                        shadowOpacity: 0.3,
                        shadowColor: '#000',
                            paddingVertical:mobileW*3/100,
                        shadowOffset: {width: 2, height: 2},
                        marginTop:mobileW*1.5/100,
                        elevation:2,marginBottom:mobileW*3/100,backgroundColor:'#fff'}}>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                 
                  
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.headingfont,
                        color: Colors.theme_color,
                        textAlign:config.textRotate,
                      }}>{Lang_chg.Payment[config.language]}
                    
                    </Text>
                  </View>
         {this.state.hour_base_task_new!='' &&
                  <FlatList
                
              
             
                data={this.state.hour_base_task_new}
                renderItem={({item, index}) => {
                
                  if(this.state.hour_base_task_new!='')
                {
                  return(
                  
                      <View>
                       {item.status==true &&
                      <View
                    style={{
                      flexDirection: 'row',
                     width:'100%',
                      paddingVertical: (mobileW * 3) / 100,
                     
                      justifyContent:'space-between',
                
                      alignSelf:'center'
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                        textAlign:config.textRotate
                        
                        }}>{item.duration}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                        width:'30%',
                        textAlign:'right',
                       
                       
                      }}>{item.price} {this.state.currency_symbol}
                     
                    </Text>
                  </View> }
                  </View>
               
                  );
                
                }
                
              }}></FlatList>
         }
                 
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 2) / 100,
                      borderTopWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                      marginTop:mobileW*2/100,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{item.distance_fare_text}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>
                      {item.distance_fare}.0 {this.state.currency_symbol}
                    
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                     
                      // borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,marginBottom:mobileW*2/100
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{item.vat_text}
                     
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.ques_fontfamily,
                        fontSize: Font.sregulartext_size,
                        color:'#000',
                      }}>{this.state.vat_price_show_hourly} {this.state.currency_symbol}
                     
                    </Text>
                  </View>


<View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems:'center',
                      borderTopWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                      marginBottom:mobileW*2/100,
                      paddingVertical:mobileW*2/100
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize:mobileW*3.7/100,
                        color: Colors.theme_color,
                      }}>{Lang_chg.Total[config.language]}
                   
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize:mobileW*3.7/100,
                        color: Colors.theme_color,
                      }}>{this.state.hour_total_price} {this.state.currency_symbol}
                   
                    </Text>
                  </View>

                  <Appbtn
                    onPresshandler={() => {
                      this.submit_btn_hourly();
                    }}
                    title={Lang_chg.PROCEEDTOcheckout[config.language]}
                  />
                </View>
              </View>
             }
          
          
            </View>
         </ScrollView>
         <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible3}

                        onRequestClose={() => { this.setState({modalVisible3: false }) }}>
                        <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.setState({modalVisible3: false })}} style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                            <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
                                networkActivityIndicatorVisible={true} />
                            <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

                                <View style={{ backgroundColor:'#fff', borderRadius: 2, width: "100%", }}>

                                    <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100,flexDirection:'row',alignItems:'center' }}>
                                       <Image style={{width:mobileW*6/100,height:mobileW*6/100}}  source={require('./icons/logo.png')}></Image>
                                        <Text style={{ fontFamily:Font.Medium, color: '#000', fontSize: mobileW * 5 / 100,paddingLeft:mobileW*4/100,width:'90%',textAlign:config.textRotate }} numberOfLines={2}>{Lang_chg.DeleteMember[config.language]} {this.state.first_name} {this.state.last_name}</Text>
                                    </View>

                                    <View style={{  paddingLeft: mobileW * 4 / 100,width:'95%',alignSelf:'center' }}>
                                        <Text style={{ fontFamily: Font.Regular, color:'#000', fontSize: mobileW * 4.4 / 100,textAlign:config.textRotate }}>{Lang_chg.delete_msg[config.language]}</Text>
                                    </View>

                                    <View style={{
                                       paddingBottom: mobileW * 5 / 100,marginTop:mobileW*9/100,
                                         alignSelf: 'flex-end',flexDirection:'row',alignItems:'center',paddingHorizontal:mobileW*3/100
                                    }}>
                                         <TouchableOpacity onPress={() => {this.setState({modalVisible3:false}) }}
                    
                                         
                                            style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                                            <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color:Colors.theme_color, alignSelf: 'center',textAlign:config.textalign }}>{Lang_chg.no_txt[config.language]}</Text>
                                        </TouchableOpacity>
                                       
                                       
                                       
                                        <TouchableOpacity onPress={() => { 
                                        setTimeout(() => {this.setState({ modalVisible3: false }), this.delete_click()}, 200)
                                         }}
                                            style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                                            <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color:Colors.theme_color, alignSelf: 'center',textAlign:config.textalign }}>{Lang_chg.Delete[config.language]}</Text>
                                        </TouchableOpacity>
                                        
                                       
                                    </View>

                                </View>

                            </View>
                        </TouchableOpacity>
                    </Modal>


     
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
                image: Icons.Home,
                activeimage: Icons.Home,
              },
              {
                name: 'Appointment',
                fname:Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: Icons.Appointment,
                activeimage: Icons.Appointment,
              },
              {
                name: 'Cart',
                fname:Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: Icons.Cart,
                activeimage: Icons.Cart,
              },
              {
                name: 'More',
                fname:Lang_chg.More_footer[config.language],
                countshow: false,
                image: Icons.More,
                activeimage: Icons.More,
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
          else{
            return(
              <View>
                  {/* ============================error================================= */}
<Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.Error_popup}

                        onRequestClose={() => { this.setState({Error_popup: false }) }}>
                        <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                            <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
                                networkActivityIndicatorVisible={true} />
                            <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

                                <View style={{ backgroundColor:'#fff', borderRadius: 4, width: "100%",paddingVertical:mobileW*6/100 }}>

                                 
                                       <Image style={{width:mobileW*15/100,height:mobileW*15/100,alignSelf:'center'}}  source={require('./icons/logo.png')}></Image>
                                       <Text style={{ fontFamily: Font.Medium, fontSize: mobileW * 5 / 100, color:Colors.theme_color, alignSelf: 'center',marginTop:mobileW*6/100 }}>{Lang_chg.we_wii_back[config.language]}</Text>
                                    {config.language==0 &&
                                       <Text style={{ fontFamily: Font.Medium, fontSize: mobileW * 5 / 100, color:Colors.theme_color, alignSelf: 'center', }}>{Lang_chg.promise[config.language]}</Text>
                                    }
                                   
                                        <Text style={{ fontFamily: Font.Light, color:'#000', fontSize: mobileW *3.8 / 100,textAlign:'center',marginTop:mobileW*3/100,width:'90%',alignSelf:'center',}}>{Lang_chg.our_sincere[config.language]}</Text>
                                        <Text style={{ fontFamily:Font.Regular, color:'#000', fontSize: mobileW * 5 / 100,textAlign:'center',marginTop:mobileW*5/100  }}>{Lang_chg.Bad_gateway[config.language]}</Text>

                                    
                                        <TouchableOpacity style={{paddingHorizontal:mobileW*2/100,paddingVertical:mobileW*2/100,alignSelf:'center',borderWidth:1,borderColor:'#000',borderRadius:4,marginTop:mobileW*6/100}} onPress={() => { this.setState({Error_popup: false })
                                        setTimeout(() => {this.props.navigation.goBack()}, 200)
                                         }}>
                                            <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, alignSelf: 'center',color:'#000' }}>{Lang_chg.Go_back[config.language]}</Text>
                                        </TouchableOpacity>
                                        
                                       
                                   

                                </View>

                            </View>
                        </View>
                    </Modal>
     
     
              </View>
            )
          }
  }
}

const styles = StyleSheet.create({
  agencydetailsheading: {
    backgroundColor: Colors.input_field_digi,

    fontFamily: Font.ques_fontfamily,
    borderRadius: (mobileW * 1) / 100,
    color: '#4E4E4E',
    fontSize:mobileW*3.5/100,
  },
});