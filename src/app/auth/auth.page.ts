import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLogin = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController
    ) {}

    ngOnInit() {}

    authenticate(email: string, password: string) {
        this.loadingController.create({
            keyboardClose: true,
            message: 'Logging in...'
        }).then(loadingEl => {
            loadingEl.present();
            let authObs: Observable<AuthResponseData>;

            if (this.isLogin) {
                authObs = this.authService.login(email, password);
            } else {
                authObs = this.authService.signup(email, password);
            }

            authObs.subscribe(resData => {
                loadingEl.dismiss();
                this.router.navigateByUrl('/places/tabs/search');
            }, error => {
                loadingEl.dismiss();
                const code = error.error.error.message;
                let message;
                switch (code) {
                    case 'EMAIL_EXISTS':
                        message = 'This email address exists already';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        message = 'Email address could not be found';
                        break;
                    case 'INVALID_PASSWORD':
                        message = 'This password is not correct';
                        break;
                    default:
                        message = 'Could not sign you up, please try again';
                        break;
                }
                if (code === 'EMAIL_EXISTS') {
                }
                this.showAlert(message);
            });
        });
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        this.authenticate(email, password);
    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }

    private showAlert(message: string) {
        return this.alertController.create({
            header: 'Authentication failed',
            message: message,
            buttons: ['Okay']
        }).then(alertEl => {
            alertEl.present();
        });
    }
}
