import { Injectable, inject } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    setPersistence,
    browserLocalPersistence,
    getAuth,
    initializeAuth,
    indexedDBLocalPersistence
} from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Auth as AngularFireAuth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth;
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor() {
        // Obtener la instancia de Firebase App
        const app = inject(FirebaseApp);

        // Inicializar Auth con persistencia
        this.auth = initializeAuth(app, {
            persistence: indexedDBLocalPersistence
        });

        // Configurar el observador de estado de autenticación
        onAuthStateChanged(this.auth, (user) => {
            console.log('Auth state changed:', user?.email); // Para debugging
            this.userSubject.next(user);
        });
    }

    // Get current user
    get currentUser(): Observable<User | null> {
        return this.user$;
    }

    // Register with email and password
    async register(email: string, password: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    // Sign in with email and password
    async login(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    // Sign out
    async logout(): Promise<void> {
        try {
            await signOut(this.auth);
            this.userSubject.next(null);
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    }
} 