import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
        <div class="login-container">
            <h2>Iniciar Sesión</h2>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input type="email" id="email" formControlName="email" placeholder="Ingrese su correo electrónico"
                        class="form-control">
                    @if (loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched) {
                        <div class="error-message">
                            El correo electrónico es requerido
                        </div>
                    }
                    @if (loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched) {
                        <div class="error-message">
                            Ingrese un correo electrónico válido
                        </div>
                    }
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" formControlName="password" placeholder="Ingrese su contraseña"
                        class="form-control">
                    @if (loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched) {
                        <div class="error-message">
                            La contraseña es requerida
                        </div>
                    }
                </div>

                @if (errorMessage) {
                    <div class="error-message">
                        {{ errorMessage }}
                    </div>
                }

                <button type="submit" [disabled]="!loginForm.valid" class="submit-button">
                    Iniciar Sesión
                </button>

                <div class="register-link">
                    ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .login-container {
            max-width: 400px;
            margin: 2rem auto;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            font-weight: 500;
        }

        .form-control {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
        }

        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
        }

        .submit-button {
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .submit-button:hover {
            background-color: #0056b3;
        }

        .submit-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .register-link {
            text-align: center;
            margin-top: 1rem;
        }

        .register-link a {
            color: #007bff;
            text-decoration: none;
        }

        .register-link a:hover {
            text-decoration: underline;
        }
    `]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';
    returnUrl: string = '/profile';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        // Obtener la URL de retorno de los query params o usar '/profile' por defecto
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';

        // Si ya está autenticado, redirigir
        this.authService.currentUser.subscribe(user => {
            if (user) {
                console.log('Login component - User already logged in:', user.email);
                this.router.navigate([this.returnUrl]);
            }
        });
    }

    async onSubmit() {
        if (this.loginForm.valid) {
            try {
                const { email, password } = this.loginForm.value;
                await this.authService.login(email, password);
                console.log('Login successful, redirecting to:', this.returnUrl);
                this.router.navigate([this.returnUrl]);
            } catch (error: any) {
                console.error('Login error:', error);
                this.errorMessage = error.message;
            }
        }
    }
} 