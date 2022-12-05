export function validateNameInput(input: string): boolean {
  // Regex would accept alphanumeric and simple spaces
  const regex = /^[\w ]+$/;
  // Regex would check for one to many whitespaces, without alphanumeric
  const regexWhiteChar = /^\s+$/;
  const ret =
    input.length !== 0 && regex.test(input) && !regexWhiteChar.test(input);
  return ret;
}

export function isValidPassLength(password: string) {
  const expectedLength = 32;
  return password.length <= expectedLength;
}

export function isValidNameLength(password: string) {
  const expectedLength = 21;
  return password.length <= expectedLength;
}

export function validatePwdInput(input: string): boolean {
  // Regex would accept alphanumeric and special char: !?@#$%^&*()+./'"" but no space
  const regex = /^[!?@#$%^&*()+.'"/\w\d]+$/;
  const regexWhiteChar = /^\s+$/;
  const ret =
    input.length !== 0 && regex.test(input) && !regexWhiteChar.test(input);
  return ret;
}
