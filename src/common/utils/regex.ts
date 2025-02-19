/**
 * **Password regex validation**
 * - At least one uppercase letter.
 * - At least one lowercase letter.
 * - At least one number.
 * - At least one special character.
 *
 * @param password
 * @returns true if is valid
 */
export const validatePasswordRegex = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
}

/**
 * **Username regex validation (Instagram rules)**
 * - Between 1 and 30 characters.
 * - Only letters, numbers, dots, and underscores.
 * - Cannot start or end with a dot.
 * - Cannot contain consecutive dots.
 *
 * @param username
 * @returns true if valid
 */
export const validateUsernameRegex = (username: string): boolean => {
  return /^(?!.*\.\.)(?!^\.)[a-zA-Z0-9._]{3,30}(?<!\.)$/.test(username)
}

/**
 * **Email regex validation**
 * - Must follow the standard email format.
 * - Allows letters, numbers, dots, hyphens, and underscores before @.
 * - Must contain exactly one "@" symbol.
 * - Domain must have at least one dot and valid characters.
 * - No spaces allowed.
 *
 * @param email
 * @returns true if valid
 */
export const validateEmailRegex = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}
