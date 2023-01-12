import NetInfo from '@react-native-community/netinfo';

class ApiContainer {
  get = async (url, loding_status = 0) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if (loding_status == 0) {
            global.props.showLoader();
          }
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              'x-api-key': 'Shyam@12345',
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            },
          }).then((response) => response.json())
            .then((obj) => {
              console.log('i am line no 20')
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              resolve(obj);
            })
            .catch((error) => {
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              reject(error);
            });
        } else {
          if (loding_status == 0) {
            global.props.hideLoader();
          }
          reject('noNetwork');
        }
      })
    })
  }

  postRaw = async (url, data, loding_status = 0) => {

    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if (loding_status == 0) {
            global.props.showLoader();
          }
          // global.props.showLoader();
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': 'Shyam@12345',
            },
            body: data
          }).then((response) => response.json())
            .then((obj) => {
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              resolve(obj);
            })
            .catch((error) => {
              console.log('error', error)
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              reject(error);
            });
        } else {
          // global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }

  post = async (url, data, loding_status = 0) => {

    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if (loding_status == 0) {
            global.props.showLoader();
          }
          // global.props.showLoader();
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'x-api-key': 'Shyam@12345',
            },
            body: data
          }).then((response) => response.json())
            .then((obj) => {
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              resolve(obj);
            })
            .catch((error) => {
              console.log('error', error)
              if (loding_status == 0) {
                global.props.hideLoader();
              }
              reject(error);
            });
        } else {
          // global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
}

export const API = new ApiContainer();