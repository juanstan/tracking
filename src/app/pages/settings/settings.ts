import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {AlertService} from '../../shared/services/alert.service';
import {Interest} from '../../model/interest';


@Component({
  selector: 'page-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
})
export class SettingsPage {
  form: FormGroup;
  submitted = false;
  loading = false;
  interests: Interest[];

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.interests = [
      { name: 'Nautical', value: 'nautical'},
      { name: 'Test', value: 'test' }
    ];
    this.form = this.formBuilder.group({
      latitude: [''],
      longitude: [''],
      mapBoxTemplate: ['', Validators.required],
      mode: ['', Validators.required],
      // interest: this.formBuilder.array([])
    });
  }

  onCheckboxChange(e) {
    const interest: FormArray = this.form.get('interest') as FormArray;
    if (e.target.checked && !interest.value.includes(e.target.value)) {
      interest.push(new FormControl(e.target.value));
    } else if (!e.target.checked) {
      let i = 0;
      interest.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          interest.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ionViewWillEnter() {
    this.storage.get('settings').then(settings => {
      for (const settingKey in settings) {
        if (settings.hasOwnProperty(settingKey)) {
          this.form.controls[settingKey]?.setValue(settings[settingKey]);
        }
      }
    });
  }


  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.storage.set('settings', this.form.value);
  }
}
