import express from 'express';
import { authenticate, requireBrand, requireCreator } from '../middleware/auth';
import { 
    applyToCampaign,
    getCampaignApplicants,
    getMyApplications,
    updateApplicationStatus
} from '../controllers/applicationController';

const router = express.Router();

// Creator-only routes (applying to campaigns and viewing their applications)
router.post('/campaigns/:campaignId/apply', authenticate, requireCreator, applyToCampaign);
router.get('/my-applications', authenticate, requireCreator, getMyApplications);

// Brand-only routes (viewing applicants and updating application status)
router.get('/campaigns/:campaignId/applicants', authenticate, requireBrand, getCampaignApplicants);
router.patch('/applications/:applicationId', authenticate, requireBrand, updateApplicationStatus);


export default router;
