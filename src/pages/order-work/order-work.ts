import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { ImageSettings } from '../../models/image-settings';
import { OrderService } from '../../services/order-service';
import { ImageService } from '../../services/image-service';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { Subscription } from 'rxjs';
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
  options: CameraOptions;
  lockValue: any;
  imageSettingsSubscription: Subscription;
  loading: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private  os: OrderService,
    public toast: ToastController,
    public imgs: ImageService,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private alert: AlertController,
    private loadCrtl: LoadingController) {
    this.item = this.navParams.data.item;
  }
  ionViewDidLoad() {
    this.options = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.imageSettingsSubscription = this.imgs.getImageSettings().subscribe(d => {
      if (d) {
        const quality = d[0].quality;
        const edit = d[0].allowEdit;
        const saveToPhotoAlbum = d[0].saveToPhotoAlbum;
        const encodingType = ((d[0].imageType == 'PNG') ? this.camera.EncodingType.PNG : this.camera.EncodingType.JPEG);
        const tWidth = d[0].width;
        const tHeight = d[0].height;
        if (tHeight > 0 && tWidth > 0) {
          this.options = {
            quality: quality,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: encodingType,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: saveToPhotoAlbum,
            correctOrientation: true,
            allowEdit: edit,
            targetHeight: tHeight,
            targetWidth: tWidth
          };
        } else {
          this.options = {
            quality: quality,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: encodingType,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: saveToPhotoAlbum,
            correctOrientation: true,
            allowEdit: edit
          };
        }
      }
    });
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
    this.imageSettingsSubscription.unsubscribe();
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
    this.loading = this.loadCrtl.create({
      content: 'Guardando...'
    });
    this.loading.present();
    this.os.updateOrder(this.item).then(r =>{
      this.loading.dismiss();
      this.toast.create({
        message: `Se grabó correctamente`,
        duration: 3000
      }).present();
    }).catch(err => {
      this.loading.dismiss();
      this.toast.create({
        message: err.message,
        duration: 3000
      }).present();
    });
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
    this.loading = this.loadCrtl.create({
      content: 'Guardando...'
    });
    this.loading.present();
    this.os.updateOrder(this.item).then(r => {
      this.loading.dismiss();
    }).catch(err => {
      this.toast.create({
        message: err.message,
        duration: 3000
      }).present();
      this.loading.dismiss();
    });
  }
  finalize() {
    let pending = false;
    this.item['sku'].forEach(e => {
      if(!e.saved) {
        pending = true;
      }
    });
    if (!pending) {
      let dialog = this.alert.create({
        title: 'Agregar Novedades',
        inputs: [
          {
            name: 'novelty',
            placeholder: 'Novedades'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Finalizar',
            handler: promt => {
              this.item['novedades'] = promt.novelty;
              this.item['estado'] = {
                id: 'kq5JBF6UyK26E2S7fEz1',
                nombre: 'FINALIZADA'
              };
              const d = new Date();
                    const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
                    ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
              this.item['finalizada'] = datestring;
              this.loading = this.loadCrtl.create({
                content: 'Finalizando...'
              });
              this.loading.present();
              this.os.updateOrder(this.item).then(r => {
                this.loading.dismiss();
                this.toast.create({
                  message: `Se finalizó la orden`,
                  duration: 3000
                }).present();
                this.navCtrl.pop();
              }).catch(err => {
                this.loading.dismiss();
                this.toast.create({
                  message: err.message,
                  duration: 3000
                }).present();
              });
            }
          }
        ]
      });
      dialog.present();
    } else {
      this.toast.create({
        message: `Aún no ha guardado todos los SKU's`,
        duration: 3000
      }).present();
    }
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      const d = new Date();
      const datestring = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "_" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
      const date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
      const imgName = this.item['numero'] + '_' + datestring;
      // this.loading = this.loadCrtl.create({
      //   content: 'Subiendo Img...'
      // });
      // this.loading.present();
      this.imgs.svImage(base64Image, imgName)
        .then(photoURL => {
          // this.loading.dismiss();
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
      this.item['sku'][this.index].observacion = '';
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
    this.loading = this.loadCrtl.create({
      content: 'Eliminando Img...'
    });
    this.loading.present();
    this.imgs.delImage(item.nombre).then(() => {
      this.loading.dismiss();
      const ix = this.item['fotos'].indexOf(item);
      this.item['fotos'].splice(ix,1);
      this.os.updateOrder(this.item).then(r => {
      }).catch(err => {
        this.alerta('Scope Error', err.message).present();
      });
    }).catch(er => {
      this.alerta('Scope Error', er.message).present();
    });    
  }
  presentPrompt() {
    
  }
}
