import { FormGroup } from '@angular/forms';

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function NewPasswordValidator(controlName: string) {
    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];
        let numberInPasswordExp = new RegExp('.*[0-9].*');
        let uppercaseInPasswordExp = new RegExp('.*[A-Z].*');
        let lowercaseInPasswordExp = new RegExp('.*[a-z].*');
        let specialCharacterInPasswordExp = new RegExp('.*[!@#$%^&*()-].*');
        var numberInPassword = false;
        var uppercaseInPassword = false;
        var lowercaseInPassword=false;
        var specialCharacterInPassword = false;
        var minLengthInPassword = false;
       
        
        let controlvalue = control.value;
        if (controlvalue && controlvalue.length>0) {
            if(controlvalue && controlvalue.length >= 8) minLengthInPassword = true;
           
            if (numberInPasswordExp.test(controlvalue)) numberInPassword = true;

            if (uppercaseInPasswordExp.test(controlvalue)) uppercaseInPassword = true;
            
            if (lowercaseInPasswordExp.test(controlvalue)) lowercaseInPassword = true;
            
            if (specialCharacterInPasswordExp.test(controlvalue)) specialCharacterInPassword = true;
              
            control.setErrors({ minLengthPasswordValidator: minLengthInPassword, numberInPasswordValidator: numberInPassword, uppercaseInPasswordValidator: uppercaseInPassword, lowercaseInPasswordValidator:lowercaseInPassword, specialCharacterInPasswordValidator:specialCharacterInPassword });   
               if(minLengthInPassword && numberInPassword && uppercaseInPassword && lowercaseInPassword && specialCharacterInPassword) 
                control.setErrors(null);
        }
        
    }
}


