import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IWorkOrder } from '../models/order-work';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Rx';


@Injectable()
export class OrderService{ 
  orderCollection: AngularFirestoreCollection<IWorkOrder>;
  orderDoc: AngularFirestoreDocument<IWorkOrder>;
  combineOrders: Observable<IWorkOrder[]>;
  index: number = 0;
  constructor(private afs: AngularFirestore){
    this.orderCollection = afs.collection<IWorkOrder>('work-orders');
  }
  setIndex(i: number) {
    this.index = i;
  }
  getIndex() {
    return this.index;
  }
  getOrders(){
      return this.orderCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder; 
          const id = a.payload.doc.id;
          return {id, ...data};
        }))
      );
  }

  getOrdersByUserId(user: any) {
    let ordCollectionCreated: AngularFirestoreCollection<IWorkOrder>;
    let ordCollectionInitialize: AngularFirestoreCollection<IWorkOrder>;
    let ordCollectionInProgress: AngularFirestoreCollection<IWorkOrder>;

    ordCollectionCreated = this.afs.collection<IWorkOrder>('work-orders',
      ref => ref.where('estado', '==', {
        id: 'eNyPUyFqo8SrwkKvDAgD',
        nombre: 'CREADA'
      }).where('mercaderista', '==', user));

    ordCollectionInitialize = this.afs.collection<IWorkOrder>('work-orders',
      ref => ref.where('estado', '==', {
        id: 'LT4ytmo1DoCbXR3cj8k2',
        nombre: 'INICIADA'
      }).where('mercaderista', '==', user));
    
    ordCollectionInProgress = this.afs.collection<IWorkOrder>('work-orders',
      ref => ref.where('estado', '==', {
        id: 'rYPNu37CXYaD2EHDGS6u',
        nombre: 'EN PROGRESO'
      }).where('mercaderista', '==', user));

    this.combineOrders = Observable
      .combineLatest(
        ordCollectionCreated.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ),
        ordCollectionInitialize.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as IWorkOrder;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
      ),
        ordCollectionInProgress.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as IWorkOrder;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        )
      )
      .switchMap(orders => {
        const [created, initialized, inprogress ] = orders;
        const combined = created.concat(initialized).concat(inprogress);
        return Observable.of(combined);
      });

    return this.combineOrders;
  }
  updateOrder(worder: IWorkOrder){
    this.orderDoc = this.afs.doc(`work-orders/${worder.id}`);
    return this.orderDoc.update(worder);
  }
}