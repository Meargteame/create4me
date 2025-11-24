/**
 * Chapa Payment Service
 * Ethiopian Payment Gateway Integration
 * 
 * Chapa is one of Ethiopia's leading payment gateways.
 * This service handles:
 * - Money transfers to creators
 * - Account verification
 * - Transaction status checking
 * 
 * Docs: https://developer.chapa.co/docs
 */

import axios, { AxiosInstance } from 'axios';

interface ChapaConfig {
    secretKey: string;
    baseUrl?: string;
}

interface TransferParams {
    account: string;           // Chapa account ID or phone number
    amount: number;             // Amount in ETB
    reference: string;          // Unique transaction reference
    currency?: string;          // Currency code (default: ETB)
    beneficiaryName?: string;  // Recipient name
}

interface TransferResponse {
    success: boolean;
    id: string;
    status: 'pending' | 'success' | 'failed';
    message?: string;
}

export class ChapaService {
    private static instance: ChapaService;
    private client: AxiosInstance;
    private secretKey: string;

    private constructor(config: ChapaConfig) {
        this.secretKey = config.secretKey;

        this.client = axios.create({
            baseURL: config.baseUrl || 'https://api.chapa.co/v1',
            headers: {
                'Authorization': `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds
        });
    }

    /**
     * Get or create Chapa service instance
     */
    static getInstance(): ChapaService {
        if (!ChapaService.instance) {
            const secretKey = process.env.CHAPA_SECRET_KEY;

            if (!secretKey) {
                throw new Error('CHAPA_SECRET_KEY not configured in environment variables');
            }

            ChapaService.instance = new ChapaService({
                secretKey,
                baseUrl: process.env.CHAPA_BASE_URL
            });
        }

        return ChapaService.instance;
    }

    /**
     * Transfer money to creator's Chapa account
     * 
     * @param params Transfer parameters
     * @returns Transfer result with transaction ID
     */
    static async transfer(params: TransferParams): Promise<TransferResponse> {
        try {
            const instance = this.getInstance();

            const response = await instance.client.post('/transfers', {
                account_number: params.account,
                amount: params.amount,
                currency: params.currency || 'ETB',
                reference: params.reference,
                beneficiary_name: params.beneficiaryName || 'Create4Me Creator',
                callback_url: `${process.env.API_BASE_URL}/api/payments/chapa-callback`
            });

            return {
                success: true,
                id: response.data.data.id || response.data.data.tx_ref,
                status: response.data.data.status === 'success' ? 'success' : 'pending',
                message: response.data.message
            };

        } catch (error: any) {
            console.error('Chapa transfer failed:', error.response?.data || error.message);

            return {
                success: false,
                id: '',
                status: 'failed',
                message: error.response?.data?.message || 'Transfer failed'
            };
        }
    }

    /**
     * Verify transaction status
     * 
     * @param transactionRef Transaction reference
     * @returns Transaction status
     */
    static async verifyTransaction(transactionRef: string): Promise<{
        verified: boolean;
        status: string;
        amount?: number;
    }> {
        try {
            const instance = this.getInstance();

            const response = await instance.client.get(`/transaction/verify/${transactionRef}`);

            return {
                verified: response.data.status === 'success',
                status: response.data.data.status,
                amount: response.data.data.amount
            };

        } catch (error) {
            console.error('Chapa verification failed:', error);
            return {
                verified: false,
                status: 'failed'
            };
        }
    }

    /**
     * Verify Chapa account exists and is active
     * 
     * @param accountId Chapa account ID
     * @returns Verification result
     */
    static async verifyAccount(accountId: string): Promise<{
        verified: boolean;
        accountName?: string;
    }> {
        try {
            const instance = this.getInstance();

            // This endpoint may vary - check Chapa docs
            const response = await instance.client.post('/account/verify', {
                account_id: accountId
            });

            return {
                verified: response.data.status === 'success',
                accountName: response.data.data?.account_name
            };

        } catch (error) {
            console.error('Chapa account verification failed:', error);
            return {
                verified: false
            };
        }
    }

    /**
     * Get account balance (for platform account)
     */
    static async getBalance(): Promise<number> {
        try {
            const instance = this.getInstance();

            const response = await instance.client.get('/balance');

            return response.data.data.balance || 0;

        } catch (error) {
            console.error('Failed to get Chapa balance:', error);
            return 0;
        }
    }
}
