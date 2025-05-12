import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="profile-container">
            <h2>Perfil de Usuario</h2>

            @if (user) {
                <div class="profile-info">
                    <div class="info-group">
                        <h3>Información Básica</h3>
                        <p><strong>Email:</strong> {{ user.email }}</p>
                        <p><strong>ID:</strong> {{ user.uid }}</p>
                        <p><strong>Email Verificado:</strong> {{ user.emailVerified ? 'Sí' : 'No' }}</p>
                    </div>

                    <div class="info-group">
                        <h3>Información de la Cuenta</h3>
                        <p><strong>Último inicio de sesión:</strong> {{ user.metadata.lastSignInTime | date:'medium' }}</p>
                        <p><strong>Cuenta creada:</strong> {{ user.metadata.creationTime | date:'medium' }}</p>
                    </div>

                    @if (user.providerData && user.providerData.length > 0) {
                        <div class="info-group">
                            <h3>Proveedores de Autenticación</h3>
                            @for (provider of user.providerData; track provider.providerId) {
                                <p><strong>Proveedor:</strong> {{ provider.providerId }}</p>
                            }
                        </div>
                    }

                    <button (click)="logout()" class="logout-button">
                        Cerrar Sesión
                    </button>
                </div>
            } @else {
                <p>No hay usuario logueado</p>
                <button (click)="goToLogin()" class="login-button">
                    Ir a Login
                </button>
            }
        </div>
    `,
    styles: [`
        .profile-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .profile-info {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .info-group {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .info-group h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        p {
            margin: 0.5rem 0;
            line-height: 1.5;
        }

        strong {
            color: #555;
        }

        .logout-button, .login-button {
            padding: 0.75rem 1.5rem;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 1rem;
        }

        .login-button {
            background-color: #007bff;
        }

        .logout-button:hover {
            background-color: #c82333;
        }

        .login-button:hover {
            background-color: #0056b3;
        }
    `]
})
export class ProfileComponent implements OnInit {
    user: User | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.user = user;
            if (!user) {
                this.router.navigate(['/login']);
            }
        });
    }

    async logout() {
        try {
            await this.authService.logout();
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
} 