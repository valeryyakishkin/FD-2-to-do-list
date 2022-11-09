import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc
} from 'firebase/firestore';
import { API_KEY } from "../../constants/envValues";

export class Database {
    constructor() {
        const firebaseConfig = {
            apiKey: API_KEY,
            authDomain: "it-todo-list-83c08.firebaseapp.com",
            projectId: "it-todo-list-83c08",
            storageBucket: "it-todo-list-83c08.appspot.com",
            messagingSenderId: "105836709473",
            appId: "1:105836709473:web:b078c0aaf37f3ae05d4c20",
            measurementId: "G-4TNDSE4W25"
        };

        const app = initializeApp(firebaseConfig);
        this._database = getFirestore(app);
    }

    create(collectionKey, body) {
        const collectionRef = collection(this._database, collectionKey);
        return addDoc(collectionRef, body);
    }

    read(collectionKey) {
        const collectionRef = collection(this._database, collectionKey);
        return getDocs(collectionRef).then((documents) => {
            return documents.docs.map((doc) =>({ ...doc.data(), id: doc.id }))
        });
    }

    update(collectionKey, id, body) {
        const document = doc(this._database, collectionKey, id);
        return updateDoc(document, body);
    }

    delete(collectionKey, id) {
        const document = doc(this._database, collectionKey, id);
        return deleteDoc(document);
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}