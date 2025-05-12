import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser.pipe(
        // Esperar hasta que tengamos una respuesta definitiva (null o user)
        filter(user => user !== undefined),
        take(1),
        map(user => {
            console.log('Auth Guard - User state:', user?.email); // Para debugging
            if (user) {
                return true;
            } else {
                // Guardar la URL a la que intentaba acceder
                router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url }
                });
                return false;
            }
        })
    );
}; 