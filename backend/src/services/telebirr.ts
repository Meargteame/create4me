/**
 * Telebirr Payment Service
 * Ethiopian Mobile Money Integration
 * 
 * Telebirr is Ethio Telecom's mobile money service.
 * This service handles:
 * - Money transfers to creator phone numbers
 * - Transaction verification
 * - Payment processing
 * 
 * Uses Telebirr H5 Web Integration API
 */

import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

interface TelebirrConfig {
    appId: string;
    appKey: string;
    baseUrl?: string;
    merchantId?: string;
}

interface TransferParams {
    recipient: string;      // Phone number (09XXXXXXXX)
    amount: number;          // Amount in ETB
    reference: string;       // Unique transaction reference
    description: string;     // Payment description
}

interface TransferResponse {
    success: boolean;
    id: string;
    status: 'pending' | 'success' | 'failed';
    message?: string;
}

export class TelebirrService {
    private static instance: TelebirrService;
    private client: AxiosInstance;
    private appId: string;
    private appKey: string;
    private merchantId: string;

    private constructor(config: TelebirrConfig) {
        this.appId = config.appId;
        this.appKey = config.appKey;
        this.merchantId = config.merchantId || '';

        this.client = axios.create({
            baseURL: config.baseUrl || 'https://openapi.et.telebirr.com',
            headers: {
                'Content-Type': 'application/json',
                'X-APP-Key': this.appKey
            },
            timeout: 30000
        });
    }

    /**
     * Get or create Telebirr service instance
     */
    static getInstance(): TelebirrService {
        if (!TelebirrService.instance) {
            const appId = process.env.TELEBIRR_APP_ID;
            const appKey = process.env.TELEBIRR_APP_KEY;

            if (!appId || !appKey) {
                throw new Error('TELEBIRR_APP_ID and TELEBIRR_APP_KEY must be configured');
            }

            TelebirrService.instance = new TelebirrService({
                appId,
                appKey,
                baseUrl: process.env.TELEBIRR_API_URL,
                merchantId: process.env.TELEBIRR_MERCHANT_ID
            });
        }

        return TelebirrService.instance;
    }

    /**
     * Generate signature for Telebirr API requests
     * Required for authentication
     */
    private generateSignature(params: Record<string, any>, timestamp: number): string {
        // Sort parameters alphabetically
        const sortedKeys = Object.keys(params).sort();

        // Build signature string: key1=value1&key2=value2&timestamp=xxx&key=appKey
        const signString = sortedKeys
            .map(key => `${key}=${params[key]}`)
            .join('&') + `&timestamp=${timestamp}&key=${this.appKey}`;

        // SHA-256 hash
        return crypto
            .createHash('sha256')
            .update(signString)
            .digest('hex')
            .toUpperCase();
    }

    /**
     * Transfer money to creator's Telebirr account (phone number)
     * 
     * @param params Transfer parameters
     * @returns Transfer result
     */
    static async transfer(params: TransferParams): Promise<TransferResponse> {
        try {
            const instance = this.getInstance();
            const timestamp = Date.now();
            const nonce = crypto.randomBytes(16).toString('hex');

            // Normalize phone number (remove leading 0 if present)
            let phoneNumber = params.recipient.trim();
            if (phoneNumber.startsWith('0')) {
                phoneNumber = '251' + phoneNumber.substring(1);
            } else if (!phoneNumber.startsWith('251')) {
                phoneNumber = '251' + phoneNumber;
            }

            const requestParams = {
                appId: instance.appId,
                merchantId: instance.merchantId,
                outTradeNo: params.reference,
                subject: params.description,
                totalAmount: params.amount,
                receiverAccount: phoneNumber,
                timestamp,
                nonce
            };

            const signature = instance.generateSignature(requestParams, timestamp);

            const response = await instance.client.post('/transfer', {
                ...requestParams,
                sign: signature,
                notifyUrl: `${process.env.API_BASE_URL}/api/payments/telebirr-callback`
            });

            // Telebirr returns code '0' for success
            const success = response.data.code === '0' || response.data.code === 0;

            return {
                success,
                id: response.data.transId || params.reference,
                status: success ? 'success' : 'pending',
                message: response.data.msg || response.data.message
            };

        } catch (error: any) {
            console.error('Telebirr transfer failed:', error.response?.data || error.message);

            return {
                success: false,
                id: '',
                status: 'failed',
                message: error.response?.data?.msg || 'Transfer failed'
            };
        }
    }

    /**
     * Verify transaction status
     */
    static async verifyTransaction(transactionRef: string): Promise<{
        verified: boolean;
        status: string;
        amount?: number;
    }> {
        try {
            const instance = this.getInstance();
            const timestamp = Date.now();
            const nonce = crypto.randomBytes(16).toString('hex');

            const requestParams = {
                appId: instance.appId,
                outTradeNo: transactionRef,
                timestamp,
                nonce
            };

            const signature = instance.generateSignature(requestParams, timestamp);

            const response = await instance.client.post('/query', {
                ...requestParams,
                sign: signature
            });

            return {
                verified: response.data.code === '0',
                status: response.data.tradeStatus || 'unknown',
                amount: response.data.totalAmount
            };

        } catch (error) {
            console.error('Telebirr verification failed:', error);
            return {
                verified: false,
                status: 'failed'
            };
        }
    }

    /**
     * Validate Ethiopian phone number format
     */
    static validatePhoneNumber(phone: string): {
        valid: boolean;
        normalized?: string;
    } {
        // Remove spaces and dashes
        const cleaned = phone.replace(/[\s-]/g, '');

        // Ethiopian phone: 09XXXXXXXX or 07XXXXXXXX or +251XXXXXXXXX
        const patterns = [
            /^0[97]\d{8}$/,           // 09XXXXXXXX or 07XXXXXXXX
            /^\+2519\d{8}$/,          // +2519XXXXXXXX
            /^\+2517\d{8}$/,          // +2517XXXXXXXX
            /^2519\d{8}$/,            // 2519XXXXXXXX
            /^2517\d{8}$/             // 2517XXXXXXXX
        ];

        const isValid = patterns.some(pattern => pattern.test(cleaned));

        if (!isValid) {
            return { valid: false };
        }

        // Normalize to 251XXXXXXXXX format
        let normalized = cleaned;
        if (normalized.startsWith('0')) {
            normalized = '251' + normalized.substring(1);
        } else if (normalized.startsWith('+')) {
            normalized = normalized.substring(1);
        }

        return {
            valid: true,
            normalized
        };
    }
}
