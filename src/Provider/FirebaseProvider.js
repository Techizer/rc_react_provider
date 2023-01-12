import firebase from '../Chat/config1';
import Firebase from 'firebase';
import { MessageFunctions, MessageTexts, MessageHeadings, localStorage } from './utilslib/Utils'
global.FirebaseUserJson = [];
global.FirebaseGroupJson = [];
global.FirebaseInboxJson = [];
global.update_firebase_check = 0;
global.count_inbox = 0;
global.inboxoffcheck = 0;
class FirebaseProvider {
	//-------------------
	blockuserfunction = (user_id, other_user_id, status) => {
		var user_id_send = 'u_' + user_id;
		var other_user_id_send = 'u_' + other_user_id;
		var inbox_id_me = 'u_' + other_user_id;
		var inbox_id_other = 'u_' + user_id;
		console.log('inbox_id', inbox_id_me)
		console.log('inbox_id_other', inbox_id_other)
		//---------------------- this code for create inbox in first time -----------
		console.log('FirebaseInboxJsonChck', FirebaseInboxJson);
		var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);
		console.log('find_inbox_index chat', find_inbox_index);
		console.log('other_user_id chat', other_user_id);
		if (find_inbox_index != -1) {
			var jsonUserDataMe = {
				block_status: status,
			};
			this.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
			console.log('FirebaseUserJson', FirebaseUserJson);
		}

	}


	getAllUsers = async () => {
		console.log('getAllUsers');
		FirebaseUserJson = [];
		//------------------------------ firbase code get user inbox ---------------
		var queryUsers = firebase.database().ref('users');

		// var queryOffLoginUsers = firebase.database().ref('users');
		// queryOffLoginUsers.off('users');

		queryUsers.on('child_added', function (data) {
			console.log('users child_added', data.toJSON());
			FirebaseUserJson.push(data.toJSON());
			//alert('FirebaseUserJson 1 time='+FirebaseUserJson.length);
		});

		//console.log('FirebaseUserJson child_added',FirebaseUserJson);
		//console.log('FirebaseUserContactsJson child_added',FirebaseUserContactsJson);
		queryUsers.on('child_changed', function (data) {
			console.log('users child_changed', data.toJSON());

			//FirebaseGroupJson.push(data.toJSON());
			//console.log('FirebaseUserJson len',FirebaseUserJson.length);

			var user_id = data.val().user_id;
			var name = data.val().name;
			var email = data.val().email;
			var images = data.val().image;
			var onlineStatus = data.val().onlineStatus;
			var player_id_get = data.val().player_id;
			var chat_room_id = data.val().chat_room_id;
			var user_type = data.val().user_type;
			var myInbox = data.val().myInbox;
			var login_type = data.val().login_type
			var login_type = data.val().login_type


			for (var i = 0; i < FirebaseUserJson.length; i++) {
				if (FirebaseUserJson[i].user_id == user_id) {
					FirebaseUserJson[i].name = name;
					FirebaseUserJson[i].email = email;
					FirebaseUserJson[i].login_type = login_type
					FirebaseUserJson[i].image = images;
					FirebaseUserJson[i].myInbox = myInbox;
					FirebaseUserJson[i].onlineStatus = onlineStatus;
					FirebaseUserJson[i].player_id = player_id_get;
					FirebaseUserJson[i].chat_room_id = chat_room_id;
					FirebaseUserJson[i].user_type = user_type;
					return false;
				}
				console.log('firebase', FirebaseUserJson)
			}

			//console.log('FirebaseUserJson child_changed',FirebaseUserJson);
		});



		//--------------------------------- remove data in inbox --------------
		//var queryUpdate = firebase.database().ref('users/'+id+'/myInbox/');
		queryUsers.on('child_removed', function (data) {
			//console.log('inbox update removed',data.toJSON());	
			//console.log('inbox update removed user_id',data.val().user_id);	
			//console.log('FirebaseUserJson check',FirebaseUserJson);
			var user_id = data.val().user_id;
			for (var i = 0; i < FirebaseUserJson.length; i++) {
				if (FirebaseUserJson[i].user_id === user_id) {
					FirebaseUserJson.splice(i, 1);
					//console.log('FirebaseUserJson check removed',FirebaseUserJson);
					return false;
				}
			}

		});


	}



	DeleteAllFirebaseData = () => {
		console.log('DeleteAllFirebaseData');
		var userRef = firebase.database().ref('users');
		userRef.remove();
		var userMsgRef = firebase.database().ref('message');
		userMsgRef.remove();
	}

	messagecountforfooter = async () => {

		console.log('getMyInboxAllDatagetinboxaccount');
		userdata = await localStorage.getItemObject('user_arr')
		//------------------------------ firbase code get user inbox ---------------
		if (userdata != null) {
			// alert("himanshu");
			var id = 'u_' + userdata.user_id;
			if (inboxoffcheck > 0) {
				console.log('getMyInboxAllDatainboxoffcheck');
				var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
				//queryOff.off('child_added');
				queryOffinbox.off('child_changed');
			}

			var queryUpdatemyinbox = firebase.database().ref('users/' + id + '/myInbox/');
			queryUpdatemyinbox.on('child_changed', (data) => {
				console.log('inboxkachildchange', data.toJSON())
				//  this.showUserInbox()
				this.firebaseUserGetInboxCount();
			})
		}
	}
	getMyInboxAllData = async () => {

		console.log('getMyInboxAllData');
		userdata = await localStorage.getItemObject('user_arr')
		//------------------------------ firbase code get user inbox ---------------

		if (userdata != null) {
			// alert("himanshu");
			var id = 'u_' + userdata.user_id;

			var queryOffLogin = firebase.database().ref('users/').child(id).child('/myInbox/');
			queryOffLogin.off('child_added');


			//---------------------------- inbox get first time all ---------------
			var query = firebase.database().ref('users/' + id + '/myInbox/');

			query.on('child_added', (data) => {

				console.log('child_added_nielsh');
				;

				FirebaseInboxJson.push(data.toJSON());
				//console.log('FirebaseInboxJson-1',FirebaseInboxJson);
			});

			//--------------------------------- update code --------------
			var queryUpdate = firebase.database().ref('users/' + id + '/myInbox/');
			queryUpdate.on('child_changed', (data) => {
				// this.firebaseUserGetInboxCount()

				console.log('inbox update child_changed', data.toJSON());

				var inboxKeyName = data.key.charAt(0);
				console.log('inboxKeyName', inboxKeyName);


				var count = data.val().count;
				var lastMsg = data.val().lastMsg;
				var lastMsgTime = data.val().lastMsgTime;
				var lastMessageType = data.val().lastMessageType;
				var user_id = data.val().user_id;
				var block_status = data.val().block_status
				var match_status = data.val().match_status
				var onlineStatus = data.val().onlineStatus
				// var order_id=data.val().order_id;
				// var order_number=data.val().order_number;
				var chat_type = data.val().chat_type;

				for (var i = 0; i < FirebaseInboxJson.length; i++) {
					if (FirebaseInboxJson[i].user_id == user_id) {
						FirebaseInboxJson[i].count = count;
						FirebaseInboxJson[i].lastMsg = lastMsg;
						FirebaseInboxJson[i].lastMsgTime = lastMsgTime;
						FirebaseInboxJson[i].lastMessageType = lastMessageType;
						FirebaseInboxJson[i].block_status = block_status;
						FirebaseInboxJson[i].match_status = match_status;
						FirebaseInboxJson[i].onlineStatus = onlineStatus;
						// FirebaseInboxJson[i].order_number = order_number;
					}
				}

				//--------------------- this code  run only index page curremt page -------------
				/*	var user_id_me=userdata.user_id;
					var other_user_id=user_id;
					console.log('other_user_id',other_user_id);
			
					var user_check_inbox_count = FirebaseUserJson.findIndex(x => x.user_id==other_user_id);
					console.log("user_check_inbox_count",user_check_inbox_count);		
					if(user_check_inbox_count >=0){
						console.log('FirebaseUserJson',FirebaseUserJson[user_check_inbox_count]);
						var userData=FirebaseUserJson[user_check_inbox_count];
						console.log("userDataMeuserDataMe",userData);
						 
						var userImage=URLAPI_img_200X200+userData.image;
						  
						var userName=userData.name;
						var onlineStatus=userData.onlineStatus;
						var chat_room_id_other=userData.chat_room_id;
						
						var lastMsgShow='';
						if(lastMessageType == 'text'){
							lastMsgShow=lastMsg;
						}if(lastMessageType == 'pdf'){
							lastMsgShow='PDF';
						}else if(lastMessageType == 'image'){
							lastMsgShow='Photo';
						}else if(lastMessageType == 'video'){
							lastMsgShow='Video';
						}else if(lastMessageType == 'audio'){
							lastMsgShow='Audio';
						}
						
						var imgOnline='';
						if(onlineStatus == 'true'){
							var imgOnline='<img src="img/msg_green_dot.png" class="msg_green_dot">';
						}
						
						if(lastMsgTime != ''){
							var lastMsgTimeShow=convertTimeAllFormat(lastMsgTime,'date_time');
							
							var countHtml='';
							if(count>0){
								countHtml='<abbr>'+count+'</abbr>';
							}
					console.log('otheruseridashish',other_user_id);
			
							   console.log('lastMsgShowlastMsgShow',lastMsgShow);
			
							// var htmlData = '<li id="chat_list_'+other_user_id+'_'+order_number+'" data-position="'+lastMsgTime+'">'+
							// 			  '<a href="/chat/'+other_user_id+'/'+order_id+'/'+order_number+'/'+chat_type+'/">'+
							// 				'<span class="id_sec">#'+order_number+'</span>'+
							// 				'<div class="left">'+
							// 				  '<img src="'+userImage+'" onerror="this.src='+error_img_user+';">'+
							// 				'</div>'+
							// 				'<div class="right">'+
							// 				  '<h3>'+userName+'</h3>'+
							// 				  '<p>'+lastMsgShow+'</p>'+
							// 				'</div>'+
							// 				countHtml+
							// 			  '</a>'+
							// 			  '<time>'+lastMsgTimeShow+'</time>'+
							// 			'</li>';
							//  if(inboxKeyName == 'o'){           
							// 	$('#chat_list_'+other_user_id+'_'+order_number).hide();
							// 	$('#chat_list_'+other_user_id+'_'+order_number).remove();
			
							// 	$('#chat_meassage_inbox_list').append(htmlData);
							// 	$('#chat_meassage_inbox_list li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list');
							// }else if(inboxKeyName == 's'){           
							// 	$('#chat_list_'+other_user_id+'_'+order_number).hide();
							// 	$('#chat_list_'+other_user_id+'_'+order_number).remove();
			
							// 	$('#chat_meassage_inbox_list_service').append(htmlData);
							// 	$('#chat_meassage_inbox_list_service li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list_service');
							// }
						}
			
						
					}*/

			});



		}

	}//function closed


	firebaseUserCreate = async () => {
		console.log('firebaseUserCreate');
		var user_arr = await localStorage.getItemObject('user_arr')
		console.log('user_arr', user_arr)
		var user_id = user_arr.user_id;
		var name = user_arr.name;
		var notification_status = user_arr.User_notification;
		var user_type = user_arr.user_type;
		var email = user_arr.email;
		var player_id_me = player_id_me1;
		var image = user_arr.image;
		var login_type = user_arr.login_type
		var user_role  = user_arr.user_role
		var id = 'u_' + user_id;
		console.log('image', image)
		var jsonUserDataMe = {
			name: name,
			email: email,
			image: image,
			onlineStatus: 'true',
			player_id: player_id_me,
			user_id: parseInt(user_id),
			user_type: user_type,
			notification_status: notification_status,
			chat_room_id: 'no',
			login_type: login_type,
			user_role:user_role
		};
		this.CreateUser(id, jsonUserDataMe);
	}
	CreateUser = (id, jsonUserData) => {
		console.log('id', id);
		console.log('CreateUser', jsonUserData);
		firebase.database().ref('users/' + id).update(jsonUserData).then(() => {
			console.log("CreateUser success.");
			var onlineStatusRef = firebase.database().ref('users/' + id + '/onlineStatus/');
			onlineStatusRef.onDisconnect().set("false");
			var chat_room_id_ref = firebase.database().ref('users/' + id + '/chat_room_id/');
			chat_room_id_ref.onDisconnect().set(id);
			console.log('update_firebase_check', update_firebase_check)
			if (update_firebase_check <= 0) {
				this.firebaseUserCreateUpdatePlayerId();
			}
		}).catch(function (error) {
			console.log("CreateUser error: " + error.message);
			//MessageFunctions.alert('Error CreateUser',error.message);
		});
	}

	CreateGroup = async (id, jsonUserData, jsonUserDataMe, user_id_me) => {
		console.log('CreateGroup');
		firebase.database().ref('groups/' + id).update(jsonUserData).then(() => {
			console.log("Update inbox succeeded.");


			//-------------------- code for add in my inbox this group---------------
			var jsonUserDataInboxMe = {};
			// var user_arr = await localStorage.getItemObject('user_arr');
			// console.log("user_arr",user_arr)
			// var user_id_me='u_'+user_arr.user_id;
			jsonUserDataInboxMe[id] = {
				group_id: id,
				count: 0,
				group_joining_time: Firebase.database.ServerValue.TIMESTAMP,
				type: "group"
			};
			this.CreateUserInbox(user_id_me, jsonUserDataInboxMe);

			//-------------------- code for add in all user inbox this group---------------
			var jsonUserDataInboxMe = {};
			jsonUserDataMe.map((value_ass, index_ass) => {

				var user_id_new = 'u_' + value_ass.user_id;
				jsonUserDataInboxMe[id] = {
					group_id: id,
					count: 0,
					group_joining_time: Firebase.database.ServerValue.TIMESTAMP,
					type: "group"
				};
				this.CreateUserInbox(user_id_new, jsonUserDataInboxMe);
			});

		})
			.catch(function (error) {
				console.log("CreateGroup error: " + error.message);
				// MessageFunctions.alert('Error CreateGroup',error.message);
			});
	}

	CreateUserInbox = async (id, jsonUserData) => {
		console.log('CreateUserInbox', jsonUserData);
		firebase.database().ref().child('users/' + id + '/myInbox/').update(jsonUserData).then(() => {
			console.log("Update inbox succeeded.");
		})
			.catch(function (error) {
				console.log("Update Inbox failed: " + error.message);
				// MessageFunctions.alert('Error CreateUserInbox',error.message);
			});
	}

	CreateGroupMembers = async (id, jsonUserData) => {
		console.log('CreateGroupMembers', jsonUserData);
		firebase.database().ref('groups/' + id + '/members/').update(jsonUserData).then(() => {
			console.log("Update inbox succeeded.");
		})
			.catch((error) => {
				console.log("Update Inbox failed: " + error.message);
				// MessageFunctions.alert('Error CreateGroupMembers',error.message);
			});
	}

	UpdateGroupData(id, jsonUserData) {
		firebase.database().ref('groups/' + id).update(jsonUserData).then(() => {
		})
			.catch((error) => {
				console.log("Update Inbox failed: " + error.message);
			});
	}

	getAllGroups = async () => {
		console.log('getAllGroups');
		FirebaseGroupJson = [];


		//------------------------------ firbase code get user inbox ---------------
		//var id='u_'+userProvider.getMe().user_id;


		var queryOffLoginGroup = firebase.database().ref('groups');
		queryOffLoginGroup.off('child_added');

		var queryGroup = firebase.database().ref('groups');
		queryGroup.on('child_added', (data) => {
			console.log('group child_added', data.toJSON());
			FirebaseGroupJson.push(data.toJSON());

			console.log('FirebaseGroupJson child_added', FirebaseGroupJson);
		});

		queryGroup.on('child_changed', (data) => {
			console.log('group child_changed', data.toJSON());
			//FirebaseGroupJson.push(data.toJSON());
			console.log('FirebaseGroupJson len', FirebaseGroupJson.length);

			var group_id = data.val().group_id;
			var active_flag = data.val().active_flag;
			var count = data.val().count;
			var lastMsgType = data.val().lastMsgType;
			var lastMsg = data.val().lastMsg;
			var lastMsgTime = data.val().lastMsgTime;
			var members = data.val().members;
			var user_id = data.val().user_id;

			// var user_id_me=userProvider.getMe().user_id;		
			//----------------- check this group me or not ---------------	
			console.log('FirebaseGroupJsonFirebaseGroupJson', FirebaseGroupJson);
			var get_index = FirebaseGroupJson.findIndex(x => x.group_id == group_id);
			console.log("get_index", get_index);
			if (get_index >= 0) {
				console.log('FirebaseGroupJson', FirebaseGroupJson[get_index]);

				for (var i = 0; i < FirebaseGroupJson.length; i++) {
					if (FirebaseGroupJson[i].group_id === group_id) {
						FirebaseGroupJson[i].active_flag = active_flag;
						FirebaseGroupJson[i].count = count;
						FirebaseGroupJson[i].lastMsgType = lastMsgType;
						FirebaseGroupJson[i].lastMsg = lastMsg;
						FirebaseGroupJson[i].lastMsgTime = lastMsgTime;
						FirebaseGroupJson[i].members = members;
						FirebaseGroupJson[i].user_id = user_id;

					}
				}

			}
		});
		console.log('FirebaseGroupJson child_changed', FirebaseGroupJson);

		//--------------------------------- remove data in inbox --------------
		//var queryUpdate = firebase.database().ref('users/'+id+'/myInbox/');
		queryGroup.on('child_removed', (data) => {

			console.log('inbox update removed', data.toJSON());
			console.log('inbox update removed group_id', data.val().group_id);

			console.log('FirebaseGroupJson check', FirebaseGroupJson);
			var group_id = data.val().group_id;
			for (var i = 0; i < FirebaseGroupJson.length; i++) {
				if (FirebaseGroupJson[i].group_id === group_id) {
					FirebaseGroupJson.splice(i, 1);

					$('#group_id_' + group_id).hide();
					$('#group_id_' + group_id).remove();


					console.log('FirebaseGroupJson check removed', FirebaseGroupJson);
					return false;
				}
			}
		});

	}
	//getAllGroups();

	firebaseUserGetInboxCount = async () => {
		console.log('firebaseUserGetInboxCount');
		var user_arr = await localStorage.getItemObject('user_arr');
		console.log('user_arr', user_arr);
		if (user_arr != null && user_arr != 'null') {
			var user_id = user_arr.user_id;
			var user_id_me = user_arr.user_id;
			let global_count_inbox = 0;
			//    $('.global_count_inbox').attr('message-count',0);
			count_inbox = 0;

			var id = 'u_' + user_id_me;
			var queryAllUser = firebase.database().ref('users/' + id + '/myInbox');
			queryAllUser.once('value', (data) => {
				global_count_inbox = 0;
				console.log('FirebaseInboxJson get in-box121', FirebaseInboxJson);
				var len = FirebaseInboxJson.length;
				console.log('FirebaseInboxJson len', len);

				if (len > 0) {
					console.log('user all data', data.toJSON());
					// var allUserArr=data.toJSON();
					// console.log('allUserArr',allUserArr);
					var allUserArr = Object.values(data.toJSON());
					console.log('allUserArr', allUserArr);

					//   $.each(allUserArr, function(index, keyValue)
					allUserArr.map((keyValue, index) => {

						var count = keyValue.count;
						var indexGet = index;
						console.log('indexGet', indexGet);
						console.log('indexGet', index);
						console.log('countt', count);
						// console.log('indexGet charAt',indexGet.charAt(0));
						// var indexGetType=indexGet.charAt(0);
						// if(indexGetType == 'u' || indexGetType == 'g'){
						global_count_inbox = global_count_inbox + parseInt(count);
						// }
					});
				}
				//var global_count_inbox= 2;
				console.log('global_count_inbox', global_count_inbox);
				if (global_count_inbox > 0) {
					console.log('global_count_inbox show iff');
					if (parseInt(global_count_inbox) >= 10) {
						count_inbox = 10
						//    $('.global_count_inbox').attr('message-count','9+');
					} else {
						count_inbox = global_count_inbox;
						// $('.global_count_inbox').attr('message-count',global_count_inbox);
					}
				} else {
					count_inbox = 0;
					//    $('.global_count_inbox').attr('message-count',0);
				}
			});
		}
	}

	firebaseProviderGetMsgCount = async (user_id,provider_arr) => {
		console.log('firebaseProviderGetMsgCount');
		var pro_count = 0;
			var user_id_me = user_id;
			var id = 'u_' + user_id_me;
			var queryAllUser = firebase.database().ref('users/' + id + '/myInbox');
			queryAllUser.once('value', (data) => {
				console.log('FirebaseInboxJson get in-box121', FirebaseInboxJson);
				var len = FirebaseInboxJson.length;
				console.log('FirebaseInboxJson len', len);

				if (len > 0) {
					console.log('user all data', data.toJSON());
					var allUserArr = Object.values(data.toJSON());
					console.log('allUserArr', allUserArr);
					for (let index = 0; index < provider_arr.length; index++) {
						var user_data_other = allUserArr.findIndex(x => x.user_id == provider_arr[index].provider_user_id);
						console.log("user_data_other", user_data_other);
						if (user_data_other != -1) {
							pro_count = allUserArr[user_data_other].count
							provider_arr[index]['chat_count'] = pro_count;
						}
						
					}
				
				}
				console.log('provider_arr',provider_arr);
				// if (pro_count > 0) {
				// 	console.log('pro_count show iff');
				// 	if (parseInt(pro_count) >= 10) {
				// 		pro_count = 10
				// 	} else {
				// 		pro_count = pro_count;
				// 	}
				// } else {
				// 	pro_count = 0;
				// }
				//return pro_count;
			});
		
	}

	firebaseUserCreateUpdatePlayerId = async () => {
		var user_arr = await localStorage.getItemObject('user_arr')
		console.log('user_arr', user_arr)
		var user_id = user_arr.user_id;
		update_firebase_check = 1;
		console.log('firebaseUserCreateUpdatePlayerId');
		console.log('firebaseUserCreateUpdatePlayerId update_firebase_check', update_firebase_check);
		var user_id_me = user_id;
		var player_id_me = player_id_me1;

		var queryAllUser = firebase.database().ref('users');
		queryAllUser.once('value', (data) => {
			console.log('user all data', data.toJSON());
			var allUserArr = Object.values(data.toJSON());
			console.log('allUserArr', allUserArr);


			var find_inbox_index = allUserArr.findIndex(x => x.player_id == player_id_me);
			console.log('find_inbox_index firebaseUserCreateUpdatePlayerId', find_inbox_index);
			if (find_inbox_index >= 0) {
				var other_user_id = allUserArr[find_inbox_index].user_id;
				var player_id_other = allUserArr[find_inbox_index].player_id;

				console.log('other_user_id', other_user_id);
				if (user_id_me != other_user_id) {
					if (player_id_me == player_id_other) {
						console.log('player id update', other_user_id);
						var id = 'u_' + other_user_id;
						var jsonUserDataMe = {
							player_id: 'no',
						};
						this.CreateUser(id, jsonUserDataMe);
					}
				}
			}
		});
	}
	
	CreateUserInboxOther = async (id, jsonUserData) => {
		console.log('CreateUserInboxOther', jsonUserData);
		firebase.database().ref().child('users/' + id + '/myInbox/').update(jsonUserData).then(function () {
			console.log("Update inbox succeeded.");
		})
			.catch(function (error) {
				console.log("Update Inbox failed: " + error.message);
				MessageFunctions.alert('Error CreateUserInboxOther', error.message);
			});
	}

	UpdateUserInboxMe = (id, otherId, jsonUserData) => {
		console.log('jsonUserData', jsonUserData);
		firebase.database().ref('users/' + id + '/myInbox/' + otherId).update(jsonUserData).then(function () {
			console.log("Update inbox succeeded.");
		})
			.catch(function (error) {
				console.log("Update Inbox failed: " + error.message);
				MessageFunctions.alert('Error UpdateUserInboxMe', error.message);
			});
	}


	UpdateGroupDataMember = (id, jsonUserData, member_id) => {
		firebase.database().ref('groups/' + id + '/members/' + member_id).update(jsonUserData).then(() => {
		})
			.catch(function (error) {
				console.log("Update Inbox failed: " + error.message);
			});
	}

	getJsonSearch = async (obj, key, val) => {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(this.getJsonSearch(obj[i], key, val));
			} else
				//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
				if (i == key && obj[i] == val || i == key && val == '') { //
					objects.push(obj);
				} else if (obj[i] == val && key == '') {
					//only add if the object is not already in the array
					if (objects.lastIndexOf(obj) == -1) {
						objects.push(obj);
					}
				}
		}
		return objects;
	}

	SendUserMessage = (messageId, messageJson, messageType, inputId) => {
		console.log('SendUserMessage messageId', messageId);

		firebase.database().ref('message' + '/' + messageId).push().set(messageJson).then(function () {
			console.log("SendUserMessage succeeded.");

		})
			.catch(function (error) {
				console.log("Update Inbox failed: " + error.message);
				MessageFunctions.alert('Error SendUserMessage', error.message);
			});

		if (messageType == 'text') {
			// $('#'+inputId).val('');
			// $('#'+inputId).focus();
		}
	}
	UpdateUserInboxOther = (id, otherId, jsonUserData2) => {
		console.log('UpdateUserInboxOther id', id);
		console.log('UpdateUserInboxOther otherId', otherId);
		console.log('UpdateUserInboxOther', jsonUserData2);
		firebase.database().ref('users/' + id + '/myInbox/' + otherId).update(jsonUserData2).then(() => {
			console.log("Update inbox succeeded.");
		})
			.catch((error) => {
				console.log("Update Inbox failed: " + error.message);
				MessageFunctions.alert('Error UpdateUserInboxOther', error.message);
			});
	}

	convertTimeAllFormat = (time11, format) => {
		time11 = parseInt(time11);

		var date1 = new Date(time11);

		var curr_day = date1.getDay();
		var curr_date = date1.getDate();
		var curr_month = date1.getMonth(); //Months are zero based
		var curr_year = date1.getFullYear();

		var hours = date1.getHours();
		var minutes = date1.getMinutes();

		// console.log('hours',hours);
		// console.log('minutes',minutes);

		if (format == 12) {
			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
		} else if (format == 24) {
			var ampm = hours >= 12 ? 'PM' : 'AM';
			//hours = hours < 10 ? '0'+hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes;
		} else if (format == 'other') {

			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTimeAll = hours + ':' + minutes + ' ' + ampm;
			var strTime = curr_date + '. ' + m_names_sort[curr_month] + ' ' + curr_year + ' ' + strTimeAll;
		} else if (format == 'ago') {
			var strTime = timeSince(new Date(time11));
			//console.log(new Date(time11));
		} else if (format == 'date_time') {
			var date = new Date(time11);

			var seconds = Math.floor((new Date() - date) / 1000);
			var interval = Math.floor(seconds / 3600);
			if (interval <= 24) {
				var ampm = hours >= 12 ? 'PM' : 'AM';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + ':' + minutes + ' ' + ampm;
			} else {
				var curr_month = date1.getMonth() + 1; //Months are zero based
				var curr_year = date1.getFullYear();
				var curr_year_small = String(curr_year);
				console.log('curr_year_small', curr_year_small);
				curr_year_small = curr_year_small.substring(2, 4);
				console.log('curr_year_small', curr_year_small);
				var strTime = curr_month + '/' + curr_date + '/' + curr_year_small;
			}

		} else if (format == 'date_time_full') {
			var date = new Date(time11);

			var seconds = Math.floor((new Date() - date) / 1000);
			var interval = Math.floor(seconds / 3600);
			if (interval <= 24) {
				var ampm = hours >= 12 ? 'PM' : 'AM';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + ':' + minutes + ' ' + ampm;
			} else {
				var curr_month = date1.getMonth() + 1; //Months are zero based
				var curr_year = date1.getFullYear();
				var curr_year_small = String(curr_year);
				console.log('curr_year_small', curr_year_small);
				curr_year_small = curr_year_small.substring(2, 4);
				console.log('curr_year_small', curr_year_small);

				var ampm = hours >= 12 ? 'PM' : 'AM';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTimeAll = hours + ':' + minutes + ' ' + ampm;

				var strTime = curr_month + '/' + curr_date + '/' + curr_year_small + ' ' + strTimeAll;
			}

		}

		return strTime;
	}


}

export const firebaseprovider = new FirebaseProvider();

