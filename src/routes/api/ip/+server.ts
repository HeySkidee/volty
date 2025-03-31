import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    try {
        const forwarded = event.request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : event.getClientAddress();
        
        return json({ ip });
    } catch (error) {
        // fallback value when running in development
        return json({ 
            ip: '127.0.0.1',
            note: 'Running in development mode - actual IP not available'
        });
    }
}