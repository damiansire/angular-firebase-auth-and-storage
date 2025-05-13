import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    Timestamp,
    DocumentReference
} from '@angular/fire/firestore';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Employee } from '../models/employee.model';
import { Observable, from, map, catchError, throwError, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly COLLECTION_NAME = 'employees';
    private auth: Auth;

    constructor(private firestore: Firestore) {
        console.log('EmployeeService initialized with Firestore instance:', firestore);
        this.auth = getAuth();

        // Log authentication state changes
        onAuthStateChanged(this.auth, (user) => {
            console.log('Auth state changed in EmployeeService:', user?.email);
        });
    }

    private checkAuth(): Promise<boolean> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                unsubscribe();
                console.log('Auth check in EmployeeService:', user?.email);
                resolve(!!user);
            });
        });
    }

    // Crear un nuevo empleado
    async createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
                throw new Error('User must be authenticated to create employees');
            }

            const now = new Date();
            const employeeData = {
                ...employee,
                createdAt: Timestamp.fromDate(now),
                updatedAt: Timestamp.fromDate(now)
            };

            console.log('Creating employee with data:', employeeData);
            const docRef = await addDoc(collection(this.firestore, this.COLLECTION_NAME), employeeData);
            console.log('Employee created successfully with ID:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('Error creating employee:', error);
            if (error.code) {
                console.error('Firebase error code:', error.code);
            }
            throw error;
        }
    }

    // Obtener todos los empleados
    getEmployees(): Observable<Employee[]> {
        return from(this.checkAuth()).pipe(
            map(async (isAuthenticated) => {
                if (!isAuthenticated) {
                    throw new Error('User must be authenticated to view employees');
                }

                console.log('Getting employees collection...');
                const employeesRef = collection(this.firestore, this.COLLECTION_NAME);
                const q = query(employeesRef, orderBy('createdAt', 'desc'));

                try {
                    const snapshot = await getDocs(q);
                    console.log('Got employees snapshot with', snapshot.docs.length, 'documents');
                    return snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: (doc.data()['createdAt'] as Timestamp).toDate(),
                        updatedAt: (doc.data()['updatedAt'] as Timestamp).toDate(),
                        hireDate: (doc.data()['hireDate'] as Timestamp).toDate()
                    } as Employee));
                } catch (error: any) {
                    console.error('Error getting employees:', error);
                    if (error.code) {
                        console.error('Firebase error code:', error.code);
                    }
                    throw error;
                }
            }),
            // Convert Promise<Employee[]> to Observable<Employee[]>
            switchMap(promise => from(promise)),
            catchError(error => {
                console.error('Error in getEmployees:', error);
                return throwError(() => error);
            })
        );
    }

    // Actualizar un empleado
    async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
        try {
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
                throw new Error('User must be authenticated to update employees');
            }

            const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
            const updateData = {
                ...employee,
                updatedAt: Timestamp.fromDate(new Date())
            };
            await updateDoc(docRef, updateData);
        } catch (error: any) {
            console.error('Error updating employee:', error);
            if (error.code) {
                console.error('Firebase error code:', error.code);
            }
            throw error;
        }
    }

    // Eliminar un empleado
    async deleteEmployee(id: string): Promise<void> {
        try {
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
                throw new Error('User must be authenticated to delete employees');
            }

            const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            if (error.code) {
                console.error('Firebase error code:', error.code);
            }
            throw error;
        }
    }

    // Obtener un empleado por ID
    async getEmployeeById(id: string): Promise<Employee | null> {
        try {
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
                throw new Error('User must be authenticated to view employee details');
            }

            const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: (data['createdAt'] as Timestamp).toDate(),
                    updatedAt: (data['updatedAt'] as Timestamp).toDate(),
                    hireDate: (data['hireDate'] as Timestamp).toDate()
                } as Employee;
            }
            return null;
        } catch (error: any) {
            console.error('Error getting employee by ID:', error);
            if (error.code) {
                console.error('Firebase error code:', error.code);
            }
            throw error;
        }
    }
} 