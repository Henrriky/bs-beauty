import bcrypt from 'bcrypt'

class AuthService {
  static async hashPassword (password: string): Promise<string> {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword (password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}

export { AuthService }
