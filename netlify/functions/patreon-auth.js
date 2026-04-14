exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const code = event.queryStringParameters && event.queryStringParameters.code;
    if (!code) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code parameter' }) };
    }

    const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET, PATREON_REDIRECT_URI, PATREON_CAMPAIGN_ID } = process.env;

    try {
        // Exchange code for access token
        const tokenRes = await fetch('https://www.patreon.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                client_id: PATREON_CLIENT_ID,
                client_secret: PATREON_CLIENT_SECRET,
                redirect_uri: PATREON_REDIRECT_URI
            })
        });

        if (!tokenRes.ok) {
            const err = await tokenRes.text();
            console.error('Token exchange failed:', err);
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'Token exchange failed' }) };
        }

        const { access_token } = await tokenRes.json();

        // Fetch identity with memberships + campaign (campaign = user is a creator)
        const identityUrl = `https://www.patreon.com/api/oauth2/v2/identity?include=memberships,campaign&fields[member]=patron_status,currently_entitled_amount_cents,campaign_id&fields[user]=email,full_name`;
        const identityRes = await fetch(identityUrl, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!identityRes.ok) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'Identity fetch failed' }) };
        }

        const identity = await identityRes.json();

        const memberships = (identity.included || []).filter(item => item.type === 'member');

        let tier = null;
        let isPro = false;

        for (const member of memberships) {
            const attrs = member.attributes || {};
            if (attrs.patron_status !== 'active_patron') continue;
            if (PATREON_CAMPAIGN_ID && member.relationships?.campaign?.data?.id !== PATREON_CAMPAIGN_ID) continue;

            const amountCents = attrs.currently_entitled_amount_cents || 0;

            if (amountCents >= 1500) tier = 'founder';
            else if (amountCents >= 700) tier = 'elder';
            else if (amountCents >= 300) tier = 'villager';

            if (tier) { isPro = true; break; }
        }

        // If no patron tier found, check if this user IS the campaign creator
        if (!isPro) {
            const ownCampaigns = (identity.included || []).filter(item => item.type === 'campaign');
            if (ownCampaigns.length > 0) {
                tier = 'founder';
                isPro = true;
            }
        }

        const userAttrs = identity.data?.attributes || {};
        const email = userAttrs.email || '';
        const name = userAttrs.full_name || '';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ isPro, tier, email, name })
        };

    } catch (err) {
        console.error('patreon-auth error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
    }
};
