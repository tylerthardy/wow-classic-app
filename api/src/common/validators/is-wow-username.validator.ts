import {
  IsString,
  Length,
  Matches,
  NotContains,
  registerDecorator,
  validate,
  ValidationArguments
} from 'class-validator';

class IsWowUsernameValidatorClass {
  constructor(username: string) {
    this.username = username.toLowerCase();
  }
  @IsString()
  @Length(2, 12)
  @Matches('^[a-z_.ßàáâãäåæçèéêëìíîïðòóôõö÷øúûüùýþÿñ]+$')
  @NotContains(' ')
  username: string;
}

export function IsWowUsername() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isWowUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Username is not a valid WoW username'
      },
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const validatorClass: IsWowUsernameValidatorClass = new IsWowUsernameValidatorClass(value);
          const errors = await validate(validatorClass);
          return errors.length === 0;
        }
      }
    });
  };
}
