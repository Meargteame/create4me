/**
 * Content Filter Service
 * 
 * Enforces "Secure Communication" promise by filtering external contact information
 * from chat messages before they are saved to the database.
 * 
 * Features:
 * - Detects and blocks Ethiopian phone numbers (09XXXXXXXX, 07XXXXXXXX, +251XXXXXXXXX)
 * - Filters email addresses
 * - Removes external messaging app mentions (WhatsApp, Telegram, Signal, Viber)
 * - Blocks social media direct contact requests
 * - Preserves original content for moderation/appeals
 */

export interface FilterResult {
    cleanContent: string;
    originalContent: string;
    hasFilteredContent: boolean;
    filteredWords: string[];
    warningMessage?: string;
    riskLevel: 'low' | 'medium' | 'high';
}

export class ContentFilterService {
    /**
     * Regular expression patterns for detecting external contact information
     * Optimized for Ethiopian market context
     */
    private static readonly PATTERNS = {
        // Ethiopian phone numbers: +251XXXXXXXXX, 09XXXXXXXX, 07XXXXXXXX
        ethiopianPhone: /(\+251|0)(9|7)\d{8}/g,

        // International phone numbers
        internationalPhone: /\+\d{10,15}/g,

        // Email addresses (RFC 5322 compliant)
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,

        // Messaging apps (common in Ethiopian market)
        whatsapp: /\b(whatsapp|wa\.me|chat\.whatsapp|watsap|watsapp)\b/gi,
        telegram: /\b(telegram|t\.me|tg:\/\/|tlgrm)\b/gi,
        signal: /\b(signal|signal\.org)\b/gi,
        viber: /\b(viber|vb\.me)\b/gi,

        // Social media direct contact
        instagram: /\b(instagram\.com\/direct|insta dm|ig direct|dm me on ig)\b/gi,
        facebook: /\b(facebook\.com\/messages|fb\.me|m\.me|fb messenger)\b/gi,

        // Generic external contact prompts
        contactExternal: /\b(call me|text me|dm me|contact me at|reach me at|add me on)\b/gi,

        // Payment outside platform (high risk)
        externalPayment: /\b(send money|transfer money|bank account|mobile money|paypal|western union)\b/gi,
    };

    /**
     * Severity weights for different pattern types
     * Used for risk scoring
     */
    private static readonly SEVERITY_WEIGHTS = {
        ethiopianPhone: 3,
        internationalPhone: 3,
        email: 3,
        whatsapp: 2,
        telegram: 2,
        signal: 2,
        viber: 2,
        instagram: 2,
        facebook: 2,
        contactExternal: 1,
        externalPayment: 5, // Highest risk
    };

    /**
     * Main filtering method
     * Scans message content and filters out external contact information
     * 
     * @param content - Original message content
     * @returns FilterResult with clean content and metadata
     */
    static filterMessage(content: string): FilterResult {
        if (!content || typeof content !== 'string') {
            return {
                cleanContent: '',
                originalContent: content || '',
                hasFilteredContent: false,
                filteredWords: [],
                riskLevel: 'low'
            };
        }

        let cleanContent = content;
        const filteredWords: string[] = [];
        let totalRiskScore = 0;
        let hasFilteredContent = false;

        // Apply each pattern
        for (const [type, pattern] of Object.entries(this.PATTERNS)) {
            // Reset regex index
            pattern.lastIndex = 0;

            const matches = content.match(pattern);

            if (matches && matches.length > 0) {
                hasFilteredContent = true;
                filteredWords.push(...matches);

                // Add to risk score
                const weight = this.SEVERITY_WEIGHTS[type as keyof typeof this.SEVERITY_WEIGHTS];
                totalRiskScore += weight * matches.length;

                // Replace with contextual placeholder
                const placeholder = this.getPlaceholder(type);
                cleanContent = cleanContent.replace(pattern, placeholder);
            }
        }

        // Clean up multiple spaces and trim
        cleanContent = cleanContent.replace(/\s+/g, ' ').trim();

        // Determine risk level
        const riskLevel = this.calculateRiskLevel(totalRiskScore);

        return {
            cleanContent,
            originalContent: content,
            hasFilteredContent,
            filteredWords,
            warningMessage: hasFilteredContent
                ? this.getWarningMessage(riskLevel)
                : undefined,
            riskLevel
        };
    }

    /**
     * Get appropriate placeholder for filtered content type
     */
    private static getPlaceholder(type: string): string {
        const placeholders: Record<string, string> = {
            ethiopianPhone: '[📞 PHONE NUMBER REMOVED]',
            internationalPhone: '[📞 PHONE NUMBER REMOVED]',
            email: '[📧 EMAIL REMOVED]',
            whatsapp: '[💬 EXTERNAL APP REMOVED]',
            telegram: '[💬 EXTERNAL APP REMOVED]',
            signal: '[💬 EXTERNAL APP REMOVED]',
            viber: '[💬 EXTERNAL APP REMOVED]',
            instagram: '[🔗 EXTERNAL LINK REMOVED]',
            facebook: '[🔗 EXTERNAL LINK REMOVED]',
            contactExternal: '[📝 CONTACT REQUEST REMOVED]',
            externalPayment: '[⚠️ EXTERNAL PAYMENT REMOVED]'
        };

        return placeholders[type] || '[FILTERED]';
    }

    /**
     * Calculate risk level based on total risk score
     */
    private static calculateRiskLevel(score: number): 'low' | 'medium' | 'high' {
        if (score >= 5) return 'high';
        if (score >= 2) return 'medium';
        return 'low';
    }

    /**
     * Get warning message based on risk level
     */
    private static getWarningMessage(riskLevel: 'low' | 'medium' | 'high'): string {
        const messages = {
            low: '⚠️ External contact info removed. Please keep communication on-platform.',
            medium: '⚠️ Multiple external contact attempts detected. This violates our terms of service.',
            high: '🚨 HIGH RISK: External payment/contact discussion detected. Your account may be flagged for review.'
        };

        return messages[riskLevel];
    }

    /**
     * Analyze message for risk without filtering
     * Used for warnings and moderation
     */
    static analyzeRisk(content: string): {
        riskLevel: 'low' | 'medium' | 'high';
        reasons: string[];
        shouldFlag: boolean;
    } {
        const risks: string[] = [];
        let shouldFlag = false;

        // Check for payment-outside-platform discussion
        if (/\b(send money|transfer|bank account|payment outside)\b/gi.test(content)) {
            risks.push('Payment discussion outside platform');
            shouldFlag = true;
        }

        // Check for urgency + external contact (common scam pattern)
        if (/\b(urgent|asap|immediately|right now)\b/gi.test(content) &&
            /\b(call|text|dm|whatsapp)\b/gi.test(content)) {
            risks.push('Urgency with external contact request (potential scam)');
            shouldFlag = true;
        }

        // Check for multiple platform mentions
        const platformMentions = (content.match(/\b(whatsapp|telegram|signal|viber|instagram|facebook)\b/gi) || []).length;
        if (platformMentions >= 2) {
            risks.push('Multiple external platform mentions');
            shouldFlag = true;
        }

        const result = this.filterMessage(content);

        return {
            riskLevel: result.riskLevel,
            reasons: risks,
            shouldFlag
        };
    }

    /**
     * Batch filter multiple messages
     * Useful for bulk operations or reports
     */
    static filterMessages(messages: string[]): FilterResult[] {
        return messages.map(msg => this.filterMessage(msg));
    }

    /**
     * Check if content is safe (no filtering needed)
     * Quick validation before processing
     */
    static isSafe(content: string): boolean {
        const result = this.filterMessage(content);
        return !result.hasFilteredContent;
    }
}
