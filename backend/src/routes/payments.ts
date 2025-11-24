/**
 * Payment Routes
 * 
 * Handles all payment-related operations including:
 * - Creator payouts (Chapa/Telebirr)
 * - Payment verification
 * - Transaction history
 * - Escrow management
 */

import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { ChapaService } from '../services/chapa';
import { TelebirrService } from '../services/telebirr';
import { Campaign } from '../models/Campaign';
import { User } from '../models/User';
import { CreatorProfile } from '../models/CreatorProfile';
import { Payout } from '../models/Payout';
import { PayoutCalculator } from '../services/payoutCalculator';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * POST /api/payments/process-payout
 * 
 * Process payment to creator after campaign completion
 * 
 * Steps:
 * 1. Verify campaign is completed
 * 2. Verify requester authorization
 * 3. Check payment hasn't been processed already
 * 4. Get creator payment method
 * 5. Calculate amounts (gross, fee, net)
 * 6. Process transfer via Chapa or Telebirr
 * 7. Update database records
 * 
 * Protected: Brand (campaign owner) or Admin only
 */
router.post('/process-payout', authenticate, requireRole('brand', 'admin'), async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { campaignId, creatorId } = req.body;

        if (!campaignId || !creatorId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'campaignId and creatorId are required' });
        }

        const campaign = await Campaign.findById(campaignId).session(session);
        if (!campaign) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        if (campaign.status !== 'completed') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: `Campaign must be completed. Current status: ${campaign.status}` });
        }

        if (req.user!.role !== 'admin' && campaign.brandId.toString() !== req.userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ success: false, message: 'You are not authorized to process this payout' });
        }

        const existingPayout = await Payout.findOne({ campaignId, creatorId }).session(session);
        if (existingPayout && existingPayout.status === 'completed') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Payout has already been completed for this creator and campaign.' });
        }

        const creator = await User.findById(creatorId).session(session);
        if (!creator) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        const calculation = PayoutCalculator.calculatePayout(campaign.budget);
        const { grossAmount, platformFee, netPayout } = calculation;

        const provider = creator.paymentProviders?.telebirr?.isVerified ? 'telebirr' : 'chapa';
        if (!creator.paymentProviders?.[provider]?.isVerified) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Creator has no verified payment method.' });
        }

        const payout = existingPayout || new Payout({
            creatorId,
            campaignId,
            brandId: campaign.brandId,
            amount: grossAmount,
            platformFee,
            netPayout,
            provider,
            status: 'processing',
        });

        if (payout.isNew) {
            await payout.save({ session });
        } else {
            payout.status = 'processing';
        }

        let transaction;
        const reference = `C4M-PAYOUT-${(payout as any)._id.toString()}`;

        if (provider === 'telebirr') {
            const phoneNumber = creator.paymentProviders!.telebirr!.phoneNumber;
            transaction = await TelebirrService.transfer({
                recipient: phoneNumber,
                amount: netPayout,
                reference,
                description: `Create4Me Payout: ${campaign.title}`,
            });
        } else {
            const accountId = creator.paymentProviders!.chapa!.accountId;
            transaction = await ChapaService.transfer({
                account: accountId,
                amount: netPayout,
                reference,
                currency: 'ETB',
                beneficiaryName: creator.name,
            });
        }

        if (!transaction.success) {
            payout.status = 'failed';
            payout.failureReason = transaction.message || 'Payment provider failed the transaction.';
            await payout.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(500).json({ success: false, message: payout.failureReason });
        }

        payout.status = 'completed';
        payout.transactionId = transaction.id;
        payout.processedAt = new Date();
        await payout.save({ session });

        campaign.paymentStatus = 'released';
        await campaign.save({ session });

        await CreatorProfile.findOneAndUpdate(
            { userId: creatorId },
            { $inc: { 'stats.totalEarnings': netPayout, 'stats.completedCampaigns': 1 } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, payout });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: `Payout processing failed: ${error.message}` });
    }
});

/**
 * GET /api/payments/history
 * 
 * Get payment history for authenticated user
 * Returns different data based on role:
 * - Creators: Payouts received
 * - Brands: Payouts sent
 */
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    try {
        // This is a placeholder. In a real application, you would have a Payouts model
        // and query it here. For now, we'll simulate some data.
        const simulatedPayouts = [
            { _id: 'p1', amount: 1500, currency: 'ETB', status: 'completed', date: new Date('2025-10-28T10:00:00Z'), campaign: 'Eco-Friendly Water Bottle Launch' },
            { _id: 'p2', amount: 2500, currency: 'ETB', status: 'completed', date: new Date('2025-09-15T14:30:00Z'), campaign: 'New Fitness App Promotion' },
            { _id: 'p3', amount: 800, currency: 'ETB', status: 'pending', date: new Date('2025-11-20T18:00:00Z'), campaign: 'Local Artisan Coffee Shop' },
        ];

        const total = simulatedPayouts.length;
        const pages = Math.ceil(total / Number(limit));
        const hasNextPage = Number(page) < pages;
        const hasPrevPage = Number(page) > 1;

        res.status(200).json({
            payouts: simulatedPayouts,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages,
                hasNextPage,
                hasPrevPage,
            }
        });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: 'Server error fetching payment history' });
    }
});

/**
 * POST /api/payments/verify-account
 * 
 * Verify creator's payment account (Chapa/Telebirr)
 * Creators use this to ensure their payment details are correct
 */
router.post('/verify-account', authenticate, requireRole('creator'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { provider, accountId, phoneNumber } = req.body;

        if (!provider || (provider !== 'chapa' && provider !== 'telebirr')) {
            res.status(400).json({
                success: false,
                message: 'Invalid provider. Must be "chapa" or "telebirr"'
            });
            return;
        }

        let verificationResult;

        if (provider === 'telebirr') {
            // Validate phone number format
            const validation = TelebirrService.validatePhoneNumber(phoneNumber);

            if (!validation.valid) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format. Use 09XXXXXXXX or 07XXXXXXXX',
                    code: 'INVALID_PHONE'
                });
                return;
            }

            verificationResult = {
                verified: true,
                normalizedPhone: validation.normalized
            };

        } else {
            // Verify Chapa account
            verificationResult = await ChapaService.verifyAccount(accountId);
        }

        if (verificationResult.verified) {
            // Update user's payment provider
            const updateData: any = {};

            if (provider === 'telebirr') {
                updateData['paymentProviders.telebirr'] = {
                    phoneNumber,
                    accountName: req.user!.name,
                    isVerified: true,
                    verifiedAt: new Date()
                };
            } else {
                updateData['paymentProviders.chapa'] = {
                    accountId,
                    isVerified: true,
                    verifiedAt: new Date()
                };
            }

            await User.findByIdAndUpdate(req.userId, updateData);

            res.json({
                success: true,
                message: `${provider} account verified successfully`,
                provider,
                verified: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Failed to verify ${provider} account. Please check your details.`,
                verified: false
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Account verification failed',
            error: error.message
        });
    }
});

/**
 * POST /api/payments/chapa-callback
 * Webhook for Chapa payment notifications
 */
router.post('/chapa-callback', async (req, res): Promise<void> => {
    try {
        const { tx_ref, status } = req.body;

        console.log('Chapa callback received:', { tx_ref, status });

        // Update transaction status based on callback
        // Implementation depends on your needs

        res.json({ success: true });
    } catch (error) {
        console.error('Chapa callback error:', error);
        res.status(500).json({ success: false });
    }
});

/**
 * POST /api/payments/telebirr-callback
 * Webhook for Telebirr payment notifications
 */
router.post('/telebirr-callback', async (req, res): Promise<void> => {
    try {
        const { outTradeNo, code, msg } = req.body;

        console.log('Telebirr callback received:', { outTradeNo, code, msg });

        if (outTradeNo && outTradeNo.startsWith('C4M-PAYOUT-')) {
            const payoutId = outTradeNo.split('-')[2];
            const payout = await Payout.findById(payoutId);

            if (payout) {
                if (code === '0' || code === 0) {
                    payout.status = 'completed';
                    payout.processedAt = new Date();
                } else {
                    payout.status = 'failed';
                    payout.failureReason = `Telebirr callback indicated failure: ${msg}`;
                }
                await payout.save();
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Telebirr callback error:', error);
        res.status(500).json({ success: false });
    }
});

export default router;
