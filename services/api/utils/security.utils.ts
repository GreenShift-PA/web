import * as crypto from 'crypto'

export class SecurityUtils {
    public static toSHA512(str: string): string {
        const hash =  crypto.createHash('sha512')
        hash.update(str)
        return hash.digest('hex')
    }
    public static verifySHA512(input: string, hashedPassword: string): boolean {
        const hash = crypto.createHash('sha512');
        hash.update(input);
      
        const hashedInput = hash.digest('hex');
      
        return hashedInput === hashedPassword;
      }
}