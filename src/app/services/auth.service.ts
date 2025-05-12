import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Auth as AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(AngularFireAuth);
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor() {
        // Set up auth state observer
        onAuthStateChanged(this.auth, (user) => {
            this.userSubject.next(user);
        });
    }

    // Get current user
    get currentUser(): Observable<User | null> {
        return this.user$;
    }

    // Register with email and password
    register(email: string, password: string): Promise<User> {
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => userCredential.user);
    }

    // Sign in with email and password
    login(email: string, password: string): Promise<User> {
        return signInWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => userCredential.user);
    }

    // Sign out
    logout(): Promise<void> {
        return signOut(this.auth);
    }
} 