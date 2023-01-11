import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import AsyncStorage from "@react-native-community/async-storage";
import { config } from "./configProvider";
import RNRestart from 'react-native-restart';
global.language_key = 1;
class Language_provider {

  language_get = async () => {
    var item = await AsyncStorage.getItem('language');
    console.log('check launguage option', item)
    if (item != null) {
      console.log('kya bat h vikas bhai', config.language)
      config.language = item;
    }
    console.log('language_key123', config.language)
  }

  language_set = async (languagem) => {
    // var item = await AsyncStorage.getItem('language');
    //  localStorage.setItemObject('language', 1)
    console.log('I18nManager.isRTL muskan', I18nManager.isRTL)
    if (languagem == 0) {

      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left';
      localStorage.setItemObject('language', 0)
      localStorage.setItemObject('languagecathc', 0)
      config.language = 0
    }
    else {

      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      config.textalign = 'right';
      localStorage.setItemObject('language', 1)
      localStorage.removeItem('languagecathc')
      localStorage.removeItem('languagesetenglish');
      config.language = 1
    }
    // if(I18nManager.isRTL){
    //    console.log('HI Vikas')
    //    I18nManager.forceRTL(false);
    //      I18nManager.allowRTL(false);f
    //      config.textalign='left';
    //      localStorage.setItemObject('language',0)
    //      localStorage.setItemObject('languagecathc',0)
    //      config.language = 0
    //  }else if(!I18nManager.isRTL){
    //   console.log('HI Vaishali')

    //    I18nManager.forceRTL(true);
    //    I18nManager.allowRTL(true);
    //    config.textalign='right';
    //    localStorage.setItemObject('language',1)
    //    localStorage.removeItem('languagecathc')
    //    localStorage.removeItem('languagesetenglish');
    //    config.language = 1
    //  }
    setTimeout(() => {
      RNRestart.Restart()
    }, 500);

    //// I18nManager.forceRTL(false);
    // config.language = value;

  }
  //----------------------------------------------by gunjan
  //------------------login------------------
  Help = ['Help', 'مساعدة']
  Update = ['UPDATE', 'تحديث']
  OK = ['OK', 'موافق  ']
  Login = ['Welcome Back!', ' !أهلاً بعودتك    '];
  Logintext = ['Please sign in to continue ', 'الرجاء تسجيل الدخول للاستمرار '];
  UserTypeText = ['Select User Type', 'الرجاء تسجيل الدخول للاستمرار '];
  Mobileno = ['Email Address', 'البريد الالكتروني / رقم الهاتف المحمول'];
  password = ['Password', 'كلمة المرور  '];
  Remember = ['Remember Me', 'تذكرني  '];
  Forgotpassword = ['Forgot Password ?', 'نسيت كلمة المرور؟'];
  Contiunebtn = ['CONTINUE', ' استمرار '];
  donot = ["Don't have an account?", "ليس لديك حساب؟ "];
  createnewaccountbtn = ['CREATE A NEW ACCOUNT', 'انشاء حساب جديد'];
  swipe_text = ['Swipe right to left', ' اسحب من اليمين إلى اليسار  ']

  //---------------------splash------------------
  Splashtext1 = [
    "The best care, in the best place. We Take Pride In Being The Best.", "أفضل رعاية في أفضل مكان. نحن نفتخر بكوننا الأفضل."];
  Splashtext2 = ["It's our duty to care for your health. We Treat our Clients like Family.", "من واجبنا الاهتمام بصحتك. نتعامل مع عملائنا كعائلة."];

  //-------------------------------------------------------------------------signup------------------------------------------
  Signup = ['Sign up', ' التسجيل  '];
  Signuptext1 = ['Register to open your Account', 'قم بالتسجيل لفتح حسابك   '];
  textinputname = ['Full Name', ' الاسم الكامل  '];
  textinputnumber = ['Mobile Number', 'رقم الهاتف المحمول ']
  //--------------------------------------------change(2-3)

  textinputemails = ['Email Address', 'البريد الالكتروني  '];
  selectcountrytitle = ['Where do you want to give your Medical service?', 'أين تريد تقديم الخدمة الطبية الخاصة بك؟'];
  mobletexttitle = ['Please enter valid mobile number', 'الرجاء إدخال رقم هاتف محمول صحيح'];
  textinputnationalid = ['ID number', 'رقم الهوية'];
  Signuptext2 = ['Provide SA National ID number starting with number (1) or resident ID number starting with number (2) ', 'ادخل رقم الهوية الوطنية تبدأ برقم (1) أو رقم هوية مقيم تبدأ برقم (2)'];
  Signuptext3 = ['Must be at least 8 characters.', ' .يجب أن لا تقل عن 8 أحرف أو أرقام '];
  Signuptext4 = ['Both passwords must match.', ' .يجب أن تتطابق كلمتا المرور  '];
  //--------------------------------------------change(2-3)
  confirmpassword1 = ['Confirm Password', 'تأكيد كلمة المرور '];

  btntext = ['CREATE ACCOUNT', ' إنشاء حساب  '];
  termsandconditiontext1 = ['By creating an account, You agree to our  ', 'من خلال إنشاء حساب ، فإنك توافق على  '];
  termsandconditiontext2 = ['Terms of Service', 'شروط الخدمة  '];
  termsandconditiontext3 = [' and ', 'و'];
  termsandconditiontext4 = ['Privacy Policy', 'سياسة الخصوصية '];
  allreadyhaveaccounttext = ['Already have an account?', 'هل لديك حساب؟ '];
  loginheretext = ['Login Here', 'تسجيل الدخول هنا '];
  CC_code = ['CC', 'CC'];
  Country_code = ['Country Code', 'الرقم الدولي']

  opt = ['OTP Verification Code', 'رمز التحقق لمرة واحدة  '];
  opttext = ['We have sent the code verification to your email', 'لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني  '];
  opttext_forget = ['We have sent the code verification to your email', 'لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني  '];
  submitbtntext = ['SUBMIT', 'تأكيد '];
  signupbtntext = ['SIGN UP', ' التسجيل  ']
  notrectext = ['Not received code?', 'لم يتم استلام الرمز؟  '];
  sendagaintext = ['Send Again', 'أعد الإرسال  ']
  notlogin = ["Can't Login,Need help?", "لا يمكنك تسجيل الدخول ، تحتاج إلى مساعدة؟"];
  postissuetext = ['Post Issue', 'إصدار آخر'];
  create_new_pass = ['Create New Password', 'إنشاء كلمة مرور جديدة  ']
  SearchLocation = ['Search for area, street name..', 'ابحث عن المنطقة واسم الشارع']
  Currentlocation = ['Get Current location', 'الموقع الحالي']
  Using_gpsofyoudevice = ['Using GPS of your device', 'استخدام  نظام تحديد المواقع  بجهازك']
  //---------------home screen----------------
  MyDashboard = ['Home', ' الرئيسية  ']
  SearchDoctorHospitalsorLabetc = ['Search Doctor', 'ابحث عن دكتور'];
  HomeHealthcareServiceAppointments = ['Home Healthcare Service Appointments ', ' مواعيد خدمة الرعاية الصحية المنزلية  ']
  BookaNurse = ['Book a Nurse', 'احجز ممرضة'];
  OpenforHourlyorTaskBasedBooking = ['Open for Hourly or Task Based Booking', 'مفتوح للحجز كل ساعة أو الحجز على أساس المهمة'];
  BookaPhysiotherapist = ['Book a Physiotherapist', 'احجز معالجًا طبيعيًا'];
  for30mins = ['Book a Nurse Assistant', 'حجز مساعد ممرض'];
  BookaNurseAssistant = ['Book a Nurse Assistant', 'حجز مساعد ممرض'];
  BookaNurseAssistant = ['Book a Nurse Assistant', 'حجز مساعد ممرض'];

  DoctorAppointment = ['Doctor Appointment', 'موعد طبيب  '];
  MyAppointments = ['My Appointments', 'واعيدي  '];
  MyAppointmentsSub = ['Pending, Upcoming, Ongoing & Past', 'واعيدي  '];
  CartItem = ['Cart Item', 'عربة التسوق  '];
  BOOKNOW = ['BOOK NOW', 'احجز الآن'];
  Nurse = ['Nurse', 'ممرضة    '];
  SearchNurse = ['Search Nurse near your address', 'Search Nurse near your address'];
  BOOKNOW = ['BOOK NOW', 'احجز الآن'];

  // ------------------------------------------------------------EditProfile-----------------------------------------------

  //profile tab
  EditProfile = ['Edit Your Profile', 'تعديل الحساب  '];
  tabnameprofile = ['Personal', ' شخصي     '];
  tabnamemedical = ['Medical', ' طبي    '];
  tabnamelifestyle = ['Life Style', ' أسلوب الحياة  ']
  dob = ['Date of Birth', 'تاريخ الميلاد '];
  Gender = ['Gender', 'الجنس  '];
  textinputidentity = ['Identity Number', 'رقم الهوية '];
  male = ['Male', 'ذكر ']
  female = ['Female', 'أنثى  ']
  select = ['Select', 'حدد  ']

  //medical tab
  allergies = ['Allergies', 'الحساسية'];
  q1 = ['Are you allergic to anything?', 'هل لديك حساسية من أي شيء؟ '];
  textinputallierdies = ['Enter Allergies', 'أدخل الحساسية '];

  current = ['Current Medication', 'الأدوية الحالية '];
  q2 = ['Are you taking any medicines at the moment? ', 'هل تتناول أي أدوية في الوقت الحالي؟  '];
  textinputcurrent = ['Enter Current Medication', 'أدخل الأدوية الحالية '];

  pastmedication = ['Past Medication', 'الأدوية السابقة  '];
  q3 = ['Have you been on medications in the past?', 'هل كنت تتناول أدوية في الماضي؟  ',];
  textinputpastmedication = ['Enter Past Medication', ' أدخل الأدوية السابقة  '];

  injuries = ['Injuries', ' الاصابات  '];
  q4 = ['Have you hade any injuires in the past?', ' هل تعرضت لأي إصابات في الماضي؟  '];
  textinputinjuries = ['Enter Injuries', 'أدخل الاصابات  '];


  surgeries = ['Surgeries', ' العمليات الجراحية '];
  q5 = ['Have you had any surgeries in the past?', 'هل أجريت أي عمليات جراحية في الماضي؟  '];
  textinputsurgeries = ['Enter surgeries', ' أدخل العمليات الجراحية  '];


  chronic = ['Chronic Diseases', 'الأمراض المزمنة '];
  q6 = ['Have you had chronic diseases in the past?', ' هل عانيت من أي أمراض مزمنة في الماضي؟  '];
  textinputchronic = ['Enter chronic diseases', ' أدخل الأمراض المزمنة  '];


  savebtntext = ['SAVE', 'حفظ  ']
  yes_txt = ['Yes', 'نعم ']
  no_txt = ['NO', 'لا ']
  yes_txt_new = ['Yes', 'Yes']
  no_txt_new = ['No', 'No']
  //lifestyle
  smoking = ['Smoking Habits', 'عادات التدخين  '];
  Alcohol = ['Alcohol Habits', 'عادات تناول الكحول  '];
  blood = ['Blood Group', 'فصيلة الدم  '];
  activity = ['Activity Level', 'مستوى النشاط  '];
  food = ['Food Preference', ' الغذاء المفضل  '];
  occupation = ['Occupation', 'المهنة '];



  //------------------booking


  //28-02 gunjan
  //----------------------------------------------------------------------------------------forgot

  Forgot = ['Forgot Password?', 'نسيت كلمة المرور؟ ']
  Forgottext = ["Enter the email association with your account and we'll send an email with instruction to reset your password.", ".أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل بريدًا إلكترونيًا يحتوي على تعليمات لإعادة تعيين كلمة المرور الخاصة بك "]
  textinputregistered = ['Registered Email', ' بريد الكتروني مسجل ']
  forgotbtn = ['SEND MAIL', 'أرسل رسالة ']


  //-------------------------------------------------------------------------------supportandmore
  dashboardtext = ['Dashboard', ' الدعم & المزيد ']
  supporttext = ['Support & More', ' الدعم & المزيد ']
  version = ['Version 1.0.(1)', 'الإصدار 1.0.()1']
  languagetxt = ['Language Preference', ' اللغة المفضلة  ']
  termtxt = ['Terms and Conditions', 'الشروط والأحكام  ']
  aboutrootcare = ['About Rootscare', 'حول روتس كير ']
  privacy = ['Privacy Policy', 'سياسة الخصوصية  ']
  needsupport = ['Need Support ?', 'تحتاج مساعدة؟  ']
  nationality = ['Nationality', '  الجنسية  ']
  textinputaddress = ['Address', 'العنوان  ']




  // --------------------------------------------------------gunjan  03-03-22
  //----------------------------needsupportpage
  need_text = ['Post your issue here,we will call you in 24-48 business hours. or you if you ave anything urgent call at +44 8978636300 number', ' اكتب مشكلتك هنا، وسوف نتواصل معك في غضون 24–48 ساعة عمل،أو إذا كان لديك أي شيء عاجل اتصل بنا على الرقم  24776 9200']
  text_input_topic = ['Write your issue in details here.', ' اكتب مشكلتك بالتفصيل هنا  ']
  select_topic_text = ['Select a Topic', 'اختر عنوانا ']
  select_issues_text = ['Select issue', 'حدد المشكلة  ']
  //modal
  thank = ['Thank You', 'شكرا لك  ']
  success = ['Successful', 'ناجح  ']
  text_of_modal = ['Congratulation,Roots Care Submission is Successfully done', ' .تهانينا، تم تقديم خدمة روتس كير بنجاح ']
  close_txt = ['Close', 'إغلاق  ']


  //----------------------------------------------drawer
  drawername = ['Sanjay Singh', 'سانجاي سينغ']
  drawerid = ['anant@outlook.com', 'anant@outlook.com']
  draweraddress = ['Riyadh,saudi Arabia', 'رياض,سعودي عربية']




  upcoming_heading = ['Upcoming Appointment', ' الموعد القادم  ']
  upcoming_text = ['Booked, Pending Or Accepted.', ' .محجوزة أو معلقة أو مقبولة ']
  ongoing_heading = ['Ongoing Appointment', 'موعد جاري تنفيذه ']
  ongoing_text = ["Today's, Now Ongoing", ' اليوم، جاري الآن   ']

  past_heading = ['Past Appointment', 'الموعد السابق  ']
  past_text = ['Completed, Closed Or Cancelled.', '.مكتمل أو مغلق أو ملغى ']

  pricelist_heading = ['Price List', 'إعدادت الحساب  ']
  packagelist_heading = ['Manage Tests & Package', 'إعدادت الحساب  ']
  packagelist_subheading = ['Setup service charges', 'إعدادت الحساب  ']
  pricelistsub_heading = ['Setup sevice charges', 'إعدادت الحساب  ']
  scheduleavailability_heading = ['Schedule Availability', 'إعدادت الحساب  ']
  scheduleavailabilitysub_heading = ['Setup your calendar, day & more', 'إعدادت الحساب  ']
  acccount$more_heading = ['Account & More', 'الحساب  & المزيد  ']
  profilesetting_heading = ['Profile Setting', 'إعدادت الحساب  ']
  transactionhistory_heading = ['Transaction History', 'إعدادت الحساب  ']
  reviewrating_heading = ['Review & Rating', 'إعدادت الحساب  ']
  acccountsetting_heading = ['Account Settings', 'إعدادت الحساب  ']
  acccountsupport_heading = ['Support & More', ' الدعم & المزيد ']
  logout_text = ['Logout', 'تسجيل الخروج  ']
  drawerversion = ['RC Version 1.0(1)', 'RC Version 1.0(1)']
  titleexitapp = ['Exit app', 'الخروج من التطبيق'];
  exitappmessage = ['Do you want to exit', 'هل تريد الخروج']
  registration = ['Registration', 'التسجيل  ']
  cancelmedia = ['Cancel', 'Cancel']
  Mediagallery = ['Choose from Gallery', 'Choose from Gallery']
  Documentgallery = ['Choose from Documents', 'Choose from Documents']
  MediaCamera = ['Take Photo', 'Take Photo']
  select_option = ['Choose your option!', 'Choose your option!']
  ENG = ['ENG', 'ENG']
  AR = ['AR', 'AR']
  PrivacyPolicy = ['Privacy Policy', 'سياسة الخصوصية  ']
  TermsandConditions = ['Terms and Conditions', 'الشروط والأحكام  ']
  AboutRootscare = ['About Rootscare', 'حول روتس كير   ']
  logut_msg = ['Are you sure you want to logout?', 'هل أنت متأكد أنك تريد تسجيل الخروج؟  ']
  Logout = ['Logout', 'تسجيل الخروج  ']
  Lang_change = ['Language Change', 'تغير اللغة']
  Lang_change_msg = ['To change language you need to restart the app?', 'لتغيير اللغة تحتاج إلى إعادة تشغيل التطبيق؟  ']
  Restart = ['RESTART', ' اعادة تشغيل  ']
  home_footer = ['Home', ' الرئيسية  ']
  Appointment_footer = ['Appointment', 'المواعيد']
  Cart_footer = ['Cart', 'السلة ']
  More_footer = ['More', 'المزيد ']
  Hospital = ['Hospital', ' مستشفى   ']
  HospitalAppointment = ['Hospital Appointment', 'موعد مستشفى  ']
  ActivityLevel = ['Activity Level', 'مستوى النشاط   ']
  FoodPreference = ['Food Preference', '  الغذاء المفضل   ']
  Occupation = ['Occupation', 'المهنة  ']
  AvailableforBooking = ['Available for Booking', 'تاح للحجز ']
  BOOKAPPOINTMENT = ['BOOK APPOINTMENT', 'حجز موعد ']
  Availability = ['Availability', 'التوفر  ']
  Location = ['Location', 'موقع']
  Physiotherapist = ['Physiotherapist', 'اخصائي العلاج الطبيعي  ']
  Nurse_assistant = ['Nurse Assistant', 'مساعد ممرض    ']
  Babysitter = ['Babysitter', 'جليسه اطفال    ']
  Rating = ['Rating', 'التقييم ']
  Bookings = ['Booking', 'الحجوزات']
  Booking = ['Booking', 'حجز '];
  heading = ['Appointment & Schedules', 'التعيينات   & الحجوزات ']
  Experience = ['Experience', 'الخبرة  ']

  RootsCare = ['Roots Care', 'روتس كير ']
  Howitworks = ['How it works', 'How it works']
  Not_available_for_booking = ['Not Available for Booking', 'غير متاح للحجز ']
  the_best_company = ['The Best Company', ' أفضل شركة']
  for_mediical = ['for Medical Services', 'للخدمات الطبية']
  home_helth = ['& Home Healthcare', '& الرعاية الصحية المنزلية']
 
  BOOKTASKBASEDAPPOINTMENT = ['BOOK TASK BASED APPOINTMENT', 'حجز موعد بنظام المهمة  ']
  BOOKHOURLYAPPOINTMENT = ['BOOK HOURLY APPOINTMENT', 'حجز موعد بنظام الساعة  ']
  AvailableNurse = ["Available Nurse's", " ممرضة متاح "]
  See_all = ['See All', 'عرض الكل  ']
  TaskBooking = [' Task Booking', ' حجز  مُهمة ']
  HourlyBooking = ['Hourly Booking', 'حجز بنظام الساعة ']
  SAR = ['SAR', 'SAR']
  Searchtask = ['Search task', 'بحث عن مهمة  ']
  Appoinmentschedule = ['Appoinment Schedule', 'جدول الموعد ']
  SAVEPATIENT = ['SAVE PATIENT', 'حفظ المريض   ']
  PatientFirstName = ['Patient First Name', 'الاسم الأول للمريض   ']
  PatientLastName = ['Patient Last Name', ' اسم الأخير للمريض   ']
  PatientEmail = ['Patient Email', ' البريد الإلكتروني للمريض   ']
  PatientAge = ['Patient Age', 'عمر المريض   ']
  Total = ['Total', 'المجموع ']
  distanceFare = ['Distance Fare', ' أجور المسافة  ']
  Payment = ['Payment', ' الدفع  ']
  Select_start_time = ['Select start time', 'حدد وقت البدء ']
  no_data_Found = ['No data found', 'لاتوجد بيانات   ']
  SelectDate = [' Select Date', 'حدد التاريخ  ']
  delete_msg = ['Are you sure to delete this family member?', 'هل أنت متأكد من حذف فرد العائلة هذا؟  ']
  DeleteMember = ['Delete ', 'حذف  ']
  Delete = ['DELETE', 'حذف   ']
  Date = ['Date', 'التاريخ ']
  PROCEEDTOPAYMENT = [' PROCEED TO PAYMENT', ' الانتقال إلى الدفع  ']
  confimation = ['Confirmation', 'تأكيد  ']
  remove_msg = ['Are you sure to delete this item ?', 'هل أنت متأكد من حذف هذا العنصر؟ ']
  PROCEEDTOcheckout = ['PROCEED TO CHECKOUT', ' انتقل إلى الدفع  ']
  Time = ['Time', 'الوقت  ']
  we_wii_back = ["We'll be right back.", 'سوف نعود حالاً. وعد   ']
  promise = ['Promise']
  our_sincere = ['Our sincere apologies but this page is temporarily unavailable. Check back soon.', '  .خالص اعتذارنا ولكن هذه الصفحة غير متاحة مؤقتا. حاول مرة أخرى قريبًا  ']
  Bad_gateway = ['Bad gateway', 'بوابة غير صالحة  ']
  Go_back = ['GO BACK', 'الرجوع للخلف  ']
  Bookings_new = ['Bookings', 'الحجوزات  ']
  AddPatient = ['Add Patient', ' أضف المريض    ']
  Booking_detail = ['Booking', 'حجز ']
  Searchphysi = ['Search Physiotherapist near your address', 'Search Physiotherapist near your address']
  Searchseassistent = ['Search Nurse Assistant near your address', 'Search Nurse Assistant near your address']
  SearchBabysitter = ['Search Babysitter near your address', 'Search Babysitter near your address']
  Availablephysotharpst = ["Available Physiotherapist's", ' أخصائي علاج طبيعي متاح ']
  Availablebabysitter = ["Available Babysitter's", ' جليسة أطفال متاح ']
  Availableassistent = ["Available Nurse Assistant's", 'مساعدة ممرضة متاح']
  Add = ['Add', ' إضافة  ']
  appoinment_aucess = ['Your appointment has been booked Successfully.', 'تم حجز موعدك بنجاح.']
  Gotoappointment = ['Go to appointment', ' الذهاب إلى الموعد  ']
  Reschedule = ['Reschedule', 'إعادة جدولة ']
  Booked = ['Booked', 'تم الحجز ']
  Patient = ['Patient', 'المريض   ']
  Doctor = ['Doctor']
  AppointmentDetails = ['Appointment Details', 'تفاصيل الموعد   ']
  BookingID = ['Booking ID', 'رقم الحجز ']
  AppointmentDate = ['Appointment Date', ' تاريخ الموعد   ']
  appointment_schedule = ['Appointment Schedule ', 'جدول الموعد ']
  AppointmentTime = ['Appointment Time', 'وقت الموعد ']
  BookingOn = ['Booked On ', 'تم الحجز في  ']
  SAVECHANGERESCHEDULE = ['SAVE CHANGE & RESCHEDULE', ' حفظ التغيير  & إعادة جدولة  ']
  VIEWDETAILS = ['VIEW DETAILS', ' عرض التفاصيل  ']
  Refunde = ['REFUNDED', 'REFUNDED']
  patient_details = ['Patient Details', 'تفاصيل المريض   ']
  appointment_closed_otp_text = ['OTP entered, Appointment Closed', ' تم إدخال رمز التحقق لمرة واحدة ، وتم إغلاق الموعد ']
  All = ['All', '  الجميع   ']
  NotificationsList = ['Notification', 'الاشعارات  ']
  Notification = ['Notification', ' الاشعارات   ']
  MyAppointments = ['My Appointments', 'مواعيدي  ']
  rated = ['Rated', 'تم التقييم  ']
  rate_appointment = ['Rate Appointment', 'تقييم الموعد ']
  Write_review = ['Write a Review', 'أكتب مراجعة ']
  ProvideUAE = ['Provide UAE Id number starting with number (7)', 'أدخل رقم الهوية الاماراتية يبدأ برقم (7)']
  Delete_account = ['Delete Account', 'حذف الحساب']
  Are_you_sure = ['Are you sure ?', 'هل أنت واثق ؟']
  HealthPackages = ["Health Packages", "الحزم الصحية"]
  TestsIncluded = ["Tests Included", "وشملت الاختبارات"]
  PackageDetails = ["Package detail", "تفاصيل الحزمة"]

  
  SearchScreenNote = ["Customer will be able to see the distance between your and their address after your 'Service Address' is setup successfully.\n\nDistance between a Patient and Medical Health Service Provider is highly important to know before someone completes a booking. Rootscare booking engine have programmed in a manner where we calculate distance fees which will help you travel to customer/patients distance.\n\nWe recommend all of our Medical Health Service Provider to point their address using google map accurately, so they receive bookings from a fair distance.", 
  `سيتمكن العميل من رؤية المسافة بينك وبين عنوانه بعد إعداد "عنوان الخدمة" بنجاح.

  من المهم للغاية معرفة المسافة بين المريض ومقدم الخدمة الصحية الطبية قبل أن يكمل شخص ما الحجز.  لقد تمت برمجة محرك حجز روتس كير بطريقة نحسب فيها رسوم المسافة التي ستساعدك على الذهاب للعملاء / المرضى.
 
  نوصي جميع مزودي خدمات الصحة الطبية لدينا بإضافة عناوينهم باستخدام خريطة جوجل بدقة ، حتى يتلقوا الحجوزات بالدقة المطلوبة.تفاصيل الحزمة`]
}
export const Lang_chg = new Language_provider();

