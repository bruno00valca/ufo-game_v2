import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare const Game: any;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
})
export class PlayComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gameZone', { static: false })
  gameZone!: ElementRef<HTMLDivElement>;

  showSaveScore = false;
  finalScore = 0;
  ufos = 0;
  disposedTime = 0;
  isLogged = false;

  message = '';
  alertClass = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLogged = this.authService.isLoggedIn();
  }

  ngAfterViewInit(): void {
    const prefs =
      JSON.parse(localStorage.getItem('gamePreferences') || '{}') || {
        numUfos: 5,
        gameTime: 60,
        doubleSpeed: false,
      };

    Game.init(prefs, {
      gameZone: this.gameZone.nativeElement,
      remainingTimeEl: document.getElementById('remainingTime'),
      scoreEl: document.getElementById('score'),
      statusMsgEl: document.getElementById('statusMsg'),
      stopBtn: document.getElementById('stopGameBtn'),

      onGameEnd: (data: any) => {
        if (this.isLogged) {
          this.finalScore = data.finalScore;
          this.ufos = data.ufos;
          this.disposedTime = data.disposedTime;
          this.showSaveScore = true;
        }
      }
    });

    this.gameZone.nativeElement.addEventListener('click', (e) => {
      const rect = this.gameZone.nativeElement.getBoundingClientRect();
      const yRel = e.clientY - rect.top;
      if (yRel > rect.height - 120 && !Game.missile.launched) {
        Game.launchMissile();
      }
    });
  }

  saveScore(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.message = 'You must be logged in to save scores.';
      this.alertClass = 'alert-warning';
      return;
    }

    console.log(token)


    const url = `${environment.apiBaseUrl}/records`;

    const body = {
      punctuation: this.finalScore,
      ufos: this.ufos,
      disposedTime: this.disposedTime
    };

    this.http.post(url, body, {
      observe: 'response',
      headers: {
        Authorization: token
      }
    }).subscribe({
      next: response => {
        const newToken = response.headers.get('Authorization');
        if (newToken) {
          this.authService.login(newToken);
        }

        this.message = 'Score saved successfully!';
        this.alertClass = 'alert-success';
        this.showSaveScore = false;

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: _err => {
        this.message = 'Error saving score.';
        this.alertClass = 'alert-danger';
      }
    });
  }

  ngOnDestroy(): void {
    if (Game && Game._endGame) {
      Game._endGame();
    }
  }
}
