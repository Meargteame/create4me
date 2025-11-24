import { PayoutCalculator } from '../services/payoutCalculator';

describe('Payout Calculator Logic', () => {
    test('should calculate 5% fee correctly for standard amount', () => {
        const grossAmount = 1000;
        const result = PayoutCalculator.calculatePayout(grossAmount);

        expect(result.grossAmount).toBe(1000);
        expect(result.platformFee).toBe(50); // 5% of 1000
        expect(result.netPayout).toBe(950); // 1000 - 50
        expect(result.feePercentage).toBe(0.05);
    });

    test('should handle decimal amounts correctly', () => {
        const grossAmount = 1234.56;
        const result = PayoutCalculator.calculatePayout(grossAmount);

        // 1234.56 * 0.05 = 61.728 -> rounds to 61.73
        expect(result.platformFee).toBe(61.73);

        // 1234.56 - 61.728 = 1172.832 -> rounds to 1172.83
        // Note: The implementation subtracts the raw fee then rounds, or subtracts rounded fee?
        // Let's check implementation: 
        // const platformFee = grossAmount * 0.05;
        // const netPayout = grossAmount - platformFee;
        // const netPayoutRounded = Math.round(netPayout * 100) / 100;

        // 1234.56 - 61.728 = 1172.832 -> 1172.83
        expect(result.netPayout).toBe(1172.83);
    });

    test('should throw error for negative amounts', () => {
        expect(() => {
            PayoutCalculator.calculatePayout(-100);
        }).toThrow('Gross amount cannot be negative');
    });

    test('should handle zero amount', () => {
        const result = PayoutCalculator.calculatePayout(0);
        expect(result.grossAmount).toBe(0);
        expect(result.platformFee).toBe(0);
        expect(result.netPayout).toBe(0);
    });
});
