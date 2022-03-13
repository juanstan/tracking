import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
// import Swiper from 'swiper';
import {AlertService} from '../../shared/services/alert.service';
import {Interest} from '../../model/interest';


@Component({
  selector: 'page-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
})
export class SettingsPage implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  interests: Interest[];
  /*showSkip = true;
  private slides: Swiper;*/

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.interests = [
      { name: 'Nautical', value: 'nautical' },
      { name: 'School', value: 'school' },
      { name: 'Test', value: 'test' }
    ];
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      mapTemplate: ['', Validators.required],
      mode: ['', Validators.required],
      interest: this.formBuilder.array([])
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

/*  startApp() {
    this.router
      .navigateByUrl('/app/tabs/map', { replaceUrl: true })
      .then(() => this.storage.set('ion_did_tutorial', true));
  }*/

  /*setSwiperInstance(swiper: Swiper) {
    this.slides = swiper;
  }

  onSlideChangeStart() {
    this.showSkip = !this.slides.isEnd;
    this.cd.detectChanges();
  }*/

  ionViewWillEnter() {
    this.storage.get('settings').then(settings => {
     console.log(settings);
    });

    // this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    // this.menu.enable(true);
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
    console.log(this.form.value);
    debugger;
    /*this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });*/
  }
}
