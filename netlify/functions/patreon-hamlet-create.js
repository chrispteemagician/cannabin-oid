// ============================================================
// patreon-hamlet-create.js
// No npm dependencies — uses Supabase REST API via fetch.
// Validates Patreon tier, checks slug unique, inserts member.
// Returns: { success: true, slug, url, tier }
// ============================================================

const SUPABASE_URL = 'https://pdnjeynugptnavkdbmxh.supabase.co';

const TIER_THRESHOLDS = { founder: 1500, elder: 700, villager: 300 };

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': 'https://cannabin-oid.co.uk',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // ── 1. Parse session cookie ──────────────────────────────
    const cookieHeader = event.headers.cookie || '';
    const sessionMatch = cookieHeader.match(/cannabinoid_patreon_session=([^;]+)/);

    if (!sessionMatch) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Not authenticated — please log in via Patreon' })
        };
    }

    let session;
    try {
        session = JSON.parse(decodeURIComponent(sessionMatch[1]));
    } catch {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid session — please log in again' })
        };
    }

    const amountCents = session.amount_cents || 0;
    const patreonId = session.patreon_id || null;

    // ── 2. Determine tier ────────────────────────────────────
    let tier = null;
    if (amountCents >= TIER_THRESHOLDS.founder) tier = 'founder';
    else if (amountCents >= TIER_THRESHOLDS.elder) tier = 'elder';
    else if (amountCents >= TIER_THRESHOLDS.villager) tier = 'villager';

    if (!tier) {
        return {
            statusCode: 403,
            headers,
            body: JSON.stringify({
                error: 'Patreon tier too low',
                message: 'You need to be at least a Villager (£3/mo) to claim a presence in the Dispensary.',
                upgrade_url: 'https://www.patreon.com/cannabinoid'
            })
        };
    }

    // ── 3. Parse body ────────────────────────────────────────
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { slug, name, one_liner, story, kit, links, quote_text, theme, amazon_tag } = body;

    if (!slug || !name) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'slug and name are required' }) };
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    if (!cleanSlug) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
    }

    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SERVICE_KEY) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server config error' }) };
    }

    const sbHeaders = {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
    };

    // ── 4. Check slug uniqueness ─────────────────────────────
    const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/cannabinoid_members?slug=eq.${encodeURIComponent(cleanSlug)}&select=slug`,
        { headers: sbHeaders }
    );
    const existing = await checkRes.json();

    if (Array.isArray(existing) && existing.length > 0) {
        return {
            statusCode: 409,
            headers,
            body: JSON.stringify({
                error: 'Slug already taken',
                message: `"${cleanSlug}" is already in the Dispensary. Try a different handle.`
            })
        };
    }

    // ── 5. Get next member number for this tier ──────────────
    const countRes = await fetch(
        `${SUPABASE_URL}/rest/v1/cannabinoid_members?tier=eq.${tier}&select=id`,
        { headers: { ...sbHeaders, 'Prefer': 'count=exact' } }
    );
    const countHeader = countRes.headers.get('content-range') || '0/0';
    const total = parseInt(countHeader.split('/')[1] || '0', 10);
    const memberNumber = total + 1;

    // ── 6. Insert ────────────────────────────────────────────
    const record = {
        slug: cleanSlug,
        name: name.trim(),
        one_liner: one_liner ? one_liner.trim() : null,
        story: story ? story.trim() : null,
        kit: (tier === 'founder' && Array.isArray(kit)) ? kit : [],
        links: links || {},
        quote_text: quote_text ? quote_text.trim() : null,
        theme: theme || 'apothecary',
        tier,
        member_number: memberNumber,
        amazon_tag: amazon_tag || 'chrdocstrcromh-21',
        patreon_id: patreonId,
        active: true,
        village: 'cannabin-oid'
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/cannabinoid_members`, {
        method: 'POST',
        headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify(record)
    });

    if (!insertRes.ok) {
        const err = await insertRes.text();
        console.error('Insert error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create your presence — please try again' })
        };
    }

    // ── 7. Return success ────────────────────────────────────
    const urlBase = tier === 'villager' ? 'hut' : 'hamlet';
    const url = `https://cannabin-oid.co.uk/${urlBase}/${cleanSlug}`;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, slug: cleanSlug, tier, member_number: memberNumber, url })
    };
};
