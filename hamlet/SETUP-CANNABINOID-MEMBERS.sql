-- ============================================================
-- CANNABIN-OID MEMBERS TABLE
-- Covers all three tiers: villager / elder / founder
-- Run this in Supabase SQL editor (pdnjeynugptnavkdbmxh)
-- ============================================================

CREATE TABLE IF NOT EXISTS cannabinoid_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Identity
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    one_liner TEXT,
    story TEXT,

    -- Founder kit (up to 4 items with affiliate links)
    kit JSONB DEFAULT '[]',
    -- Schema: [{ emoji, name, desc, amazon_url, ebay_url }]

    -- Links (ethical alternatives only — no corporate social)
    links JSONB DEFAULT '{}',
    -- Schema: { bluesky, mastodon, upscrolled, spicylister, email, website }

    -- Display
    quote_text TEXT,
    theme TEXT DEFAULT 'apothecary',

    -- Tier
    tier TEXT NOT NULL DEFAULT 'villager',
    -- 'villager' | 'elder' | 'founder'
    member_number INTEGER,

    -- Affiliate (their own tags — defaults to Doc's)
    amazon_tag TEXT DEFAULT 'chrdocstrcromh-21',

    -- Meta
    patreon_id TEXT,
    email TEXT,
    active BOOLEAN DEFAULT TRUE,
    village TEXT DEFAULT 'cannabin-oid'
);

-- Enable Row Level Security
ALTER TABLE cannabinoid_members ENABLE ROW LEVEL SECURITY;

-- Public can read active members
CREATE POLICY "Public read active" ON cannabinoid_members
    FOR SELECT USING (active = true);

-- No direct anon insert — must go via patreon-hamlet-create.js Netlify function
-- which validates Patreon tier before inserting with service role key

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cannabinoid_members_updated_at
    BEFORE UPDATE ON cannabinoid_members
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- SEED: Doc's Den — Founder #1
-- ============================================================
INSERT INTO cannabinoid_members (
    slug, name, one_liner, story, theme, tier, member_number,
    amazon_tag, active, village,
    links,
    quote_text
) VALUES (
    'doc',
    'Doc Strange',
    'Stage hypnotist since 1992 · Legal MC patient · Driving to Bilbao',
    'Doc Strange has been performing stage hypnosis and mentalism since 1992. Diagnosed AuDHD, prescribed cannabis patient, and founder of the Dispensary. Building the cannabin-oid ecosystem one hamlet at a time.',
    'apothecary',
    'founder',
    1,
    'chrdocstrcromh-21',
    true,
    'cannabin-oid',
    '{"bluesky": "", "mastodon": "", "upscrolled": "", "spicylister": "", "email": "chris@chrisptee.co.uk", "website": "https://cannabin-oid.co.uk"}',
    'World domination through kindness. One ember at a time.'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- KUDOS TABLE (reuse existing if present — insert only if not)
-- ============================================================
CREATE TABLE IF NOT EXISTS hamlet_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT,
    email TEXT,
    hamlet TEXT,
    ref TEXT,
    source TEXT,
    village TEXT DEFAULT 'cannabin-oid'
);

ALTER TABLE hamlet_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert signups" ON hamlet_signups
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read signups" ON hamlet_signups
    FOR SELECT USING (true);
