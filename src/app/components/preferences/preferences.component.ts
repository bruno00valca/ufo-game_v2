import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent implements OnInit {

  numUfos: number = 5;
  gameTime: number = 60;
  doubleSpeed: boolean = false;

  statusMsg: string = '';

  ngOnInit(): void {
    const savedPrefs = localStorage.getItem('gamePreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      this.numUfos = prefs.numUfos;
      this.gameTime = prefs.gameTime;
      this.doubleSpeed = prefs.doubleSpeed;
    }
  }

  savePreferences(): void {
    const prefs = {
      numUfos: this.numUfos,
      gameTime: this.gameTime,
      doubleSpeed: this.doubleSpeed
    };

    localStorage.setItem('gamePreferences', JSON.stringify(prefs));

    this.statusMsg = 'Preferences saved successfully!';
    setTimeout(() => this.statusMsg = '', 2500);
  }
}
