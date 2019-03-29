import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { IWorkOrder } from '../../models/order-work';
import { OrderService } from '../../services/order-service';
import { ImageService } from '../../services/image-service';
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private  os: OrderService,
    public toast: ToastController,
    public imgs: ImageService) {
    this.item = this.navParams.data.item;
  }
  ionViewDidLoad() {
    if (this.item['estado'].nombre == 'CREADA') {
      this.item['estado'] = {
        id: 'LT4ytmo1DoCbXR3cj8k2',
        nombre: 'INICIADA'
      }
      this.os.updateOrder(this.item)
        .catch(err => { });
      this.item['sku'].forEach(e => {
        e['current'] = false;
        e['saved'] = false;
        e['inicial'] = 0;
        e['final'] = 0;
        e['caras'] = 0;
        e['sugerido'] = 0;
        e['observacion'] = '';
       });
      this.item['sku'][0].current = true;
      this.index = 0;
    }
    if (this.item['estado'].nombre == 'INICIADA') {
      this.item['sku'].forEach(e => {
        e['current'] = false;
        e['saved'] = false;
        e['inicial'] = 0;
        e['final'] = 0;
        e['caras'] = 0;
        e['sugerido'] = 0;
        e['observacion'] = '';
      });
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
    console.log('leave');
    this.os.setIndex(this.index);

  }
  back() {
    if (this.index > 0) {
      this.index--;
      this.item['sku'].forEach(e => {
        e['current'] = false;
      });
      this.item['sku'][this.index].current = true;
    }
  }
  forward() {
    if (this.index < (this.item['sku'].length-1)) {
      this.index++;
      this.item['sku'].forEach(e => {
        e['current'] = false;
      });
      this.item['sku'][this.index].current = true;
    }
  }
  saveOne(item){
    if (this.item['estado'].nombre == 'INICIADA') {
      this.item['estado'] = {
        id: 'rYPNu37CXYaD2EHDGS6u', 
        nombre: 'EN PROGRESO'
      }
    }
    this.item['sku'][this.index].saved = true;
    this.os.updateOrder(this.item).then(r =>{
      
      this.toast.create({
        message: `Se grabó correctamente`,
        duration: 3000
      }).present();
    }).catch(err => { });
  }
  finalizar() {
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
  openImagePickerCrop() {
    /*this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], { quality: 75 }).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage);
                  },
                  error => console.error("Error cropping image", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });*/
  }
  uploadImageToFirebase(image) {
    //image = normalizeURL(image);

    //uploads img to firebase storage
    this.imgs.uploadImage(image)
      .then(photoURL => {
        this.toast.create({
          message: 'Image was updated successfully',
          duration: 3000 
        }).present();
      })
  }
}
