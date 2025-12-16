import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RecordsService } from './records.service';

@Component({
    selector: 'app-records',
    templateUrl: './records.component.html'
})
export class RecordsComponent implements OnInit {

    globalRecords: any[] = [];
    userRecords: any[] = [];
    isLogged = false;
    errorMessage = '';

    constructor(
        private recordsService: RecordsService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.isLogged = this.authService.isLoggedIn();

        this.recordsService.getGlobalRecords().subscribe({
            next: data => this.globalRecords = data,
            error: err => {
                console.error(err);
                this.errorMessage = 'Could not load records.';
            }
        });

        if (this.isLogged) {
            console.log('specific records:')
            const username = this.authService.getUsername()!;
            this.recordsService.getUserRecords(username).subscribe(r => this.userRecords = r);
        }
    }
}
