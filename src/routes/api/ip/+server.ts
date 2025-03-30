import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const forwarded = event.request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : event.getClientAddress();
    
    return json({ ip });
}