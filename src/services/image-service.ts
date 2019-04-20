import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ImageSettings } from '../models/image-settings';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()
export class ImageService {
    settingsCollection: AngularFirestoreCollection<ImageSettings>;
    settingsDoc: AngularFirestoreDocument<ImageSettings>;
    constructor(private afs: AngularFirestore) {
        this.settingsCollection = afs.collection<ImageSettings>('image-settings');
    }
    getImageSettings(){
        return this.settingsCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as ImageSettings; 
            const id = a.payload.doc.id;
            return {id, ...data};
          }))
        );
    }
    svImage(image64: string, name: string) {
        return new Promise<any>((resolve, reject) => {
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child('scope-app').child('fotos').child(name);
        imageRef.putString(image64, 'data_url')
            .then(snapshot => {
                resolve(snapshot.ref.getDownloadURL())
            }, err => {
                reject(err);
            });
        });
    }
    delImage(name: string) {
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child('scope-app').child('fotos').child(name);
        return imageRef.delete();
    }
}