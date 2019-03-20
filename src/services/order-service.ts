import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class OrderService{ 
    orderCollection: AngularFirestoreCollection<any>;
    constructor(private afs: AngularFirestore){
        this.orderCollection = afs.collection<any>('work-orders');
    }
    getOrders(){
        return this.orderCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, ...data};
            }))
          );;
    }
}