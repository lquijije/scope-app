import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IUser } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    orderCollection: AngularFirestoreCollection<IUser>;
    constructor(private afs: AngularFirestore) {
        this.orderCollection = afs.collection<IUser>('work-orders');
    }
    getUsers() {
        return this.orderCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as IUser;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    getUserByEmail(email: string) {
        let userByEmailCollection: AngularFirestoreCollection<IUser>;
        userByEmailCollection = this.afs.collection<IUser>('users',
            ref => ref.where('email', '==', email));
        return userByEmailCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as IUser;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }
}