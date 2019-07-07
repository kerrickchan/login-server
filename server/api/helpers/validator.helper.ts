export class Validator {
  isValidUsername(value: string) {
    let errors = []

    if (value === '') {
      errors.push({msg: 'password cannot be blank'})
    }

    const testWord = /\w+/
    if (testWord.test(value)) {
      errors.push({msg: 'Username must contain only letters, numbers and underscore'})
    }

    return errors.length == 0
  }
}

export default new Validator()