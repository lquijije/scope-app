import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { IWorkOrder } from '../../models/order-work';
import { OrderService } from '../../services/order-service';
import { ImageService } from '../../services/image-service';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions  } from '@ionic-native/camera';
/**
 * Generated class for the OrderWorkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-work',
  templateUrl: 'order-work.html',
})
export class OrderWorkPage {
  item;
  index: number = 0;
  imgSeq: number = 0;
  imageResponse: any;
  options: any;
  lockValue: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private  os: OrderService,
    public toast: ToastController,
    public imgs: ImageService,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private alert: AlertController) {
    this.item = this.navParams.data.item;
  }
  ionViewDidLoad() {
    if (this.item['estado'].nombre == 'CREADA') {
      this.item['estado'] = {
        id: 'LT4ytmo1DoCbXR3cj8k2',
        nombre: 'INICIADA'
      }
      const d = new Date();
      const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      this.item['iniciada'] = datestring;
      this.os.updateOrder(this.item)
        .catch(err => { });
      this.item['sku'].forEach(e => {
        e['current'] = false;
        e['saved'] = false;
        e['inicial'] = '';
        e['final'] = '';
        e['caras'] = '';
        e['sugerido'] = '';
        e['observacion'] = '';
       });
      this.item['sku'][0].current = true;
      this.index = 0;
    }
    if (this.item['estado'].nombre == 'INICIADA') {
      this.item['sku'].forEach(e => {
        e['current'] = false;
        e['saved'] = false;
        e['inicial'] = '';
        e['final'] = '';
        e['caras'] = '';
        e['sugerido'] = '';
        e['observacion'] = '';
      });
    }
    if (!this.item['fotos']) {
      this.item['fotos'] = [];
    }
    if (this.item['sku'][this.index].bloqueado) {
      this.lockValue = true;
    }
    if (!this.item['sku'][this.index].bloqueado) {
      this.lockValue = false;
    }
    // if (this.item['estado'].nombre == 'INICIADA' ||
    //   this.item['estado'].nombre == 'EN PROGRESO') {
    //   if (this.os.getIndex()) {
    //     this.index = this.os.getIndex();
    //     this.item['sku'][this.index].current = true;
    //   }
    // }
  }
  ionViewDidLeave() {
    this.os.setIndex(this.index);
  }
  back() {
    if (this.index > 0) {
      this.index--;
      this.item['sku'].forEach(e => {
        e['current'] = false;
      });
      this.item['sku'][this.index].current = true;
      if (this.item['sku'][this.index].bloqueado) {
        this.lockValue = true;
      }
      if (!this.item['sku'][this.index].bloqueado) {
        this.lockValue = false;
      }
    }
  }
  forward() {
    if (this.index < (this.item['sku'].length-1)) {
      this.index++;
      this.item['sku'].forEach(e => {
        e['current'] = false;
      });
      this.item['sku'][this.index].current = true;
      if (this.item['sku'][this.index].bloqueado) {
        this.lockValue = true;
      }
      if (!this.item['sku'][this.index].bloqueado) {
        this.lockValue = false;
      }
    }
  }
  saveOne(){   
    const i = this.item['sku'][this.index];
    if (i.inicial.trim() == '') {
      this.alerta('Scope App', 'Ingrese Cantidad Inicial').present();
      return false;
    }
    if (i.final.trim() == '') {
      this.alerta('Scope App', 'Ingrese Cantidad Final').present();
      return false;
    }

    if (i.caras.trim() == '') {
      this.alerta('Scope App', 'Ingrese # de Caras').present();
      return false;
    }
    if (i.sugerido.trim() == '') {
      i.sugerido = 0;
    }    
    if (this.item['estado'].nombre == 'INICIADA') {
      this.item['estado'] = {
        id: 'rYPNu37CXYaD2EHDGS6u', 
        nombre: 'EN PROGRESO'
      }
      const d = new Date();
      const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      this.item['inprogress'] = datestring;
    }
    this.item['sku'][this.index].saved = true;
    this.os.updateOrder(this.item).then(r =>{
      this.toast.create({
        message: `Se grabó correctamente`,
        duration: 3000
      }).present();
    }).catch(err => { });
  }
  saveOneLock() {
    if (this.item['estado'].nombre == 'INICIADA') {
      this.item['estado'] = {
        id: 'rYPNu37CXYaD2EHDGS6u',
        nombre: 'EN PROGRESO'
      }
      const d = new Date();
      const datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      this.item['inprogress'] = datestring;
    }
    this.item['sku'][this.index].saved = true;
    this.os.updateOrder(this.item).then(r => {
    }).catch(err => { });
  }
  finalize() {
    let pending = false;
    this.item['sku'].forEach(e => {
      if(!e.saved) {
        pending = true;
      }
    });
    if (!pending) {
      this.item['estado'] = {
        id: 'kq5JBF6UyK26E2S7fEz1',
        nombre: 'FINALIZADA'
      };
      const d = new Date();
            const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      this.item['finalizada'] = datestring;
      this.os.updateOrder(this.item).then(r => {
        this.toast.create({
          message: `Se finalizó la orden`,
          duration: 3000
        }).present();
        this.navCtrl.pop();
      }).catch(err => { });
    } else {
      this.toast.create({
        message: `Aún no ha guardado todos los SKU's`,
        duration: 3000
      }).present();
    }
  }
  
  // uploadImageToFirebase(image) {
  //   image = normalizeURL(image);

  //   //uploads img to firebase storage
  //   this.imgs.uploadImage(image)
  //     .then(photoURL => {
  //       this.item['sku'][this.index].imageUrl = photoURL;
  //       this.toast.create({
  //         message: 'Image was updated successfully',
  //         duration: 3000 
  //       }).present();
  //     })
  // }
  // getImages() {
  //   this.options = {
  //     width: 200,
  //     quality: 25,
  //     outputType: 1
  //   };
  //   this.imageResponse = [];
  //   this.imagePicker.getPictures(this.options).then((results) => {
  //     for (var i = 0; i < results.length; i++) {
  //       this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
  //     }
  //   }, (err) => {
  //     alert(err);
  //   });
  // }
  // openImagePicker(){
  //   this.imagePicker.hasReadPermission().then(
  //     (result) => {
  //       if(result == false){
  //         // no callbacks required as this opens a popup which returns async
  //         this.imagePicker.requestReadPermission();
  //       }
  //       else if(result == true){
  //         this.imagePicker.getPictures({
  //           maximumImagesCount: 1
  //         }).then(
  //           (results) => {
  //             for (var i = 0; i < results.length; i++) {
  //               this.uploadImageToFirebase(results[i]);
  //             }
  //           }, (err) => console.log(err)
  //         );
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     });
  // }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      const d = new Date();
      const datestring = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "_" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
      const date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
      const imgName = this.item['numero'] + '_' + datestring;
      this.imgs.svImage(base64Image, imgName)
        .then(photoURL => {
          this.item['fotos'].push(
            {
              nombre: imgName,
              url: photoURL,
              fecha: date
            }
          );
          this.os.updateOrder(this.item).then(r => {
          }).catch(err => { });
          this.toast.create({
            message: 'Imagen fué guardada en archivo',
            duration: 3000
          }).present();
        });
    }, (err) => {
      // Handle error
    });
  }

  saveImage() {
    const img ="data:image/jpg;base64,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XVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdURKACl1REoAKXVESgApdUXZ4gP8PXKkH6nj5lPwAAAAASUVORK5CYII=";
    const d = new Date();
    const datestring = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "_" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
    const date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' +  ("0" + d.getSeconds()).slice(-2);
    const imgName = this.item['numero'] + '_' + datestring;
    this.imgs.svImage(img, imgName)
      .then(photoURL => {
        this.item['fotos'].push(
          {
            nombre: imgName,
            url: photoURL,
            fecha: date
          }
        );
        this.os.updateOrder(this.item).then(r => {
          
        }).catch(err => { });
        this.toast.create({
          message: 'Imagen fué guardada en archivo',
          duration: 3000
        }).present();
      });
  }
  lockItem(e) {
    if (this.lockValue) {
      this.item['sku'][this.index].bloqueado = true;
      this.item['sku'][this.index].inicial = '';
      this.item['sku'][this.index].final = '';
      this.item['sku'][this.index].caras = '';
      this.item['sku'][this.index].sugerido = '';
      this.item['sku'][this.index].observacion = 'Bloqueado por ' + this.item['mercaderista'].nombre;
    } else {
      this.item['sku'][this.index].bloqueado = false;
    }
    this.saveOneLock();
  }
  alerta(title: string, msg: string) {
    return this.alert.create({
      title: title,
      message: msg,
      buttons: [{
        text: 'Ok'
      }]
    });
  }
  delete(item: any) {
    const ix = this.item['fotos'].indexOf(item);
    this.item['fotos'].splice(ix,1);
    this.os.updateOrder(this.item).then(r => {
    }).catch(err => { });
  }
}
