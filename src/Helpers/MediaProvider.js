import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
class MediaProvider {
   ShareImage = async (file_url, message1, subject) => {
      let dirs = RNFetchBlob.fs.dirs
      let imagePath = null;
      RNFetchBlob.Configurations({
         fileCache: true
      })
         .fetch("GET", file_url)
         // the image is now dowloaded to device's storage
         .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
         })
         .then(async base64Data => {
            var base64Data = `data:image/png;base64,` + base64Data;
            // here's base64 encoded image
            await Share.open({ url: base64Data, title: message1, subject: subject, message: message1 });
            // remove the file from storage
            // return dirs.unlink(imagePath);
         });
   }
   launchCamera = async (crop) => {
      let cropvalue = crop == null ? false : crop
      return new Promise((resolve, reject) => {
         ImagePicker.openCamera({
            width: 200,
            height: 200,
            cropping: cropvalue,
            includeBase64: true,
            includeExif: true,
            compressImageQuality: 0.4,
         }).then((res) => {
            resolve(res);
         }).catch((error) => {
            reject(error);
         });
      })
   }
   launchGellery = async (crop) => {
      let cropvalue = !!crop
      return new Promise((resolve, reject) => {
         ImagePicker.openPicker({
            // width: 200,
            // height: 200,
            cropping: false,
            includeBase64: true,
            includeExif: true,
            compressImageQuality: 0.5,
            // multiple: true
         }).then((res) => {
            resolve(res);
         }).catch((error) => {
            reject(error);
         });
      });
   }
   MultipleselectGellery = async (crop) => {
      let cropvalue = crop == null ? false : crop
      return new Promise((resolve, reject) => {
         ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: cropvalue,
            includeBase64: true,
            includeExif: true,
            multiple: true,
            maxFiles: 10,
            showsSelectedCount: true,
            compressImageQuality: 0.4,
         }).then((res) => {
            resolve(res);
         }).catch((error) => {
            reject(error);
         });
      });
   }
   vedioRecorder = async (crop) => {
      let cropvalue = crop == null ? false : crop
      return new Promise((resolve, reject) => {
         ImagePicker.openCamera({
            mediaType: 'video',
            width: 200,
            height: 200,
            includeBase64: true,
            duration: 3,
            cropping: cropvalue,
         }).then((res) => {
            resolve(res);
         }).catch((error) => {
            reject(error);
         });
      });
   }
   launchDocumentGellery = async (crop) => {
      let cropvalue = crop == null ? false : crop
      return new Promise(async (resolve, reject) => {

         try {
            const res = await DocumentPicker.pick({
               type: [
                  //DocumentPicker.types.images,
                  // DocumentPicker.types.audio
                  //  DocumentPicker.types.pdf
                  DocumentPicker.types.allFiles
               ],
            });
            console.log('resresresres', res);
            resolve(res[0]);
            // console.log(
            //    res.uri,
            //    res.type, // mime type
            //    res.name,
            //    res.size
            // );

            // const source = {
            //    fileName: res.name, //"speech_file.mp3", 
            //    type: res.type,
            //    uri: res.uri,
            //    serverFileName: "assignmentfile" //"upload_audio" //
            //    //imageData: response.data
            // };

            // console.log('source', source);

            // this.setState({
            //     imageSource: source,
            // }, () => {
            //     //this.handleUploadFile();
            // });

         } catch (err) {
            if (DocumentPicker.isCancel(err)) {
               // User cancelled the picker, exit any dialogs or menus and move on
               reject(err);
            } else {
               console.log('errerr', err);
               reject(err);
               // throw err;
            }
         }






         // ImagePicker.openPicker({
         //    width: 200,
         //    height: 200,
         //    cropping: cropvalue,
         //    includeBase64: true,
         //    includeExif: true,
         //    compressImageQuality: 0.4,
         // }).then((res) => {
         //    resolve(res);
         // }).catch((error) => {
         //    reject(error);
         // });
      });
   }
}

export const Media = new MediaProvider();

