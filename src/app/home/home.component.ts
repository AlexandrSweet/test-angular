import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormArray, FormControl } from '@angular/forms'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  promotionApplicationForm!: FormGroup;
  promitionApplication!: PromotionApplication;

  constructor(private builderForm: FormBuilder) {
    this.buildForm();
    this.populateForm();
  }

  ngOnInit(): void {

  }

  private buildForm() {
    this.promotionApplicationForm = this.builderForm.group({
      firstName: ['', { validators: [Validators.required, this.validateFirstName], updateOn: 'blur' }],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required],
      reason: new FormArray([]),
    }
    );
  }

  onSubmit() {
    if (!this.promotionApplicationForm.invalid) {
      this.promitionApplication = this.promotionApplicationForm?.value;
      localStorage.setItem('promotionApplication', JSON.stringify(this.promitionApplication));
    }else{
      alert("Try again");
    }
  }

  public isControlInvalid(controlName: string): boolean {
    let control = this.promotionApplicationForm.get(controlName);
    return !control?.valid;
  }

  public isResonInvalid(i: number): boolean {
    let control = this.reason.controls[i];
    return !control?.valid; 
  }

  private populateForm() {
    let formData: PromotionApplication = JSON.parse(localStorage.getItem('promotionApplication')!);

    if (formData) {
      formData.reason.forEach(reson => this.addReason());
      this.promotionApplicationForm.setValue(formData);
    }
  }
  public isErrorExist(nameControl: string, typeError: string): string {
    let control = this.promotionApplicationForm.get(nameControl);
    return control?.errors![typeError];
  }

  public validateFirstName(control: AbstractControl): ValidationErrors {
    if (control.value === 'COM9' || control.value === 'COM8') {
      return { invalidName: `No ${control.value}` }
    }
    return null!;
  }

  public addReason() {
    let control = new FormControl('', Validators.required);
    this.reason.push(control);
  }


  public get reason(): FormArray {
    return this.promotionApplicationForm.get('reason') as FormArray
  }

}

export class PromotionApplication {
  firstName!: string;
  lastName!: string;
  address!: string;
  position!: string;
  salary!: number;
  reason!: Array<string>;
}
