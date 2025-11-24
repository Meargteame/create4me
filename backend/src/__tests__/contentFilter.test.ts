import { ContentFilterService } from '../services/contentFilter';

describe('Content Filter Service', () => {
    describe('filterMessage', () => {
        test('should detect and filter Ethiopian phone numbers (09 format)', () => {
            const input = 'Call me at 0911223344 for details';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[📞 PHONE NUMBER REMOVED]');
            expect(result.cleanContent).not.toContain('0911223344');
            expect(result.filteredWords).toContain('0911223344');
        });

        test('should detect and filter Ethiopian phone numbers (+251 format)', () => {
            const input = 'My number is +251911223344';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[📞 PHONE NUMBER REMOVED]');
            expect(result.cleanContent).not.toContain('+251911223344');
        });

        test('should detect and filter email addresses', () => {
            const input = 'Send details to test.user@gmail.com please';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[📧 EMAIL REMOVED]');
            expect(result.cleanContent).not.toContain('test.user@gmail.com');
        });

        test('should detect and filter Telegram links', () => {
            const input = 'Join my channel t.me/awesome_creator';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[💬 EXTERNAL APP REMOVED]');
            expect(result.cleanContent).not.toContain('t.me/awesome_creator');
        });

        test('should detect and filter WhatsApp mentions', () => {
            const input = 'Lets chat on WhatsApp';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[💬 EXTERNAL APP REMOVED]');
        });

        test('should allow safe content without filtering', () => {
            const input = 'Hello, I am interested in your campaign. When is the deadline?';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(false);
            expect(result.cleanContent).toBe(input);
            expect(result.filteredWords).toHaveLength(0);
        });

        test('should handle multiple violations in one message', () => {
            const input = 'Call 0911223344 or email me@test.com';
            const result = ContentFilterService.filterMessage(input);

            expect(result.hasFilteredContent).toBe(true);
            expect(result.cleanContent).toContain('[📞 PHONE NUMBER REMOVED]');
            expect(result.cleanContent).toContain('[📧 EMAIL REMOVED]');
            expect(result.filteredWords.length).toBeGreaterThanOrEqual(2);
        });
    });
});
