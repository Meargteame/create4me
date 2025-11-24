/**
 * Payout Calculator Service
 * Handles financial calculations for creator payouts
 */

export interface PayoutCalculation {
    grossAmount: number;
    platformFee: number;
    netPayout: number;
    feePercentage: number;
}

export class PayoutCalculator {
    private static readonly PLATFORM_FEE_PERCENTAGE = 0.05; // 5%

    /**
     * Calculate payout amounts including platform fee
     * @param grossAmount The total amount allocated for the payment
     * @returns Breakdown of fees and final payout
     */
    static calculatePayout(grossAmount: number): PayoutCalculation {
        if (grossAmount < 0) {
            throw new Error('Gross amount cannot be negative');
        }

        const platformFee = grossAmount * this.PLATFORM_FEE_PERCENTAGE;
        const netPayout = grossAmount - platformFee;

        // Round to 2 decimal places to avoid floating point errors
        const platformFeeRounded = Math.round(platformFee * 100) / 100;
        const netPayoutRounded = Math.round(netPayout * 100) / 100;

        return {
            grossAmount,
            platformFee: platformFeeRounded,
            netPayout: netPayoutRounded,
            feePercentage: this.PLATFORM_FEE_PERCENTAGE
        };
    }
}
