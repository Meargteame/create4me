import otpGenerator from 'otp-generator';

interface OtpRecord {
    code: string;
    expiresAt: number;
}

// In-memory store for OTPs (For MVP/Demo purposes only)
// In production, use Redis
const otpStore = new Map<string, OtpRecord>();

export class OtpService {
    /**
     * Generate a 6-digit numeric OTP
     * @param identifier - Phone number or unique ID
     */
    static generateOtp(identifier: string): string {
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Expires in 5 minutes
        const expiresAt = Date.now() + 5 * 60 * 1000;
        otpStore.set(identifier, { code: otp, expiresAt });

        // MOCK: Print to console for development
        console.log(`[MOCK SMS] OTP for ${identifier}: ${otp}`);

        return otp;
    }

    /**
     * Verify an OTP
     * @param identifier - Phone number or unique ID
     * @param code - Input code
     */
    static verifyOtp(identifier: string, code: string): boolean {
        const record = otpStore.get(identifier);

        if (!record) {
            return false;
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(identifier);
            return false;
        }

        if (record.code === code) {
            otpStore.delete(identifier); // Consume OTP (One-Time Use)
            return true;
        }

        return false;
    }
}
