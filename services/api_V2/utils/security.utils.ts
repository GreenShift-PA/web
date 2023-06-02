import * as crypto from 'crypto'

export class SecurityUtils {
    public static toSHA512(str: string): string {
        const hash =  crypto.createHash('sha512')
        hash.update(str)
        return hash.digest('hex')
    }
}