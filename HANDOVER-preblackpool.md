# CANNABIN-OID HANDOVER DOCUMENT
## Full Context for Continuation

**Last Updated:** April 17, 2026 — Spannabis Day 1, Bilbao
**Owner:** Christian P Taylor (Chris P Tee / Doc)

---

## SPANNABIS DAY 1 — April 17, 2026

### People Met

**Raymond — The Bulldog Amsterdam** (owner or senior partner)
- Sat next to Chris by chance, hit it off immediately
- Chris informally identified him as undiagnosed ADHD with a touch of OCD
- Raymond said "I don't really want to find out" — Chris told him why he should
- Key message delivered: once you know your ADHD, the tools you've built to cope become *shareable*, and other people's tools become *available to you*. You stop being an island.
- Very switched on. Good energy. Worth following up.

**Katharina Jochum — Storz & Bickel**
- Head of Business Development and Strategy Execution
- katharina.jochum@storz-bickel.com / +49 7461 969707-39
- Showed her Cannabin-Oid. Email pitch drafted and ready to send.
- She was receptive. Follow up after the show.

**Dynavap**
- Rude experience. Rep was dismissive, spoke badly to a staff member Chris believes is AuDHD.
- Chris called it out directly.
- **Crossed off the partnership list.**

**Xose — Spannabis Magazine (Editor/Boss)**
- Email: xose@spannabis.com
- Chris spoke to him at the show. Email pitch drafted.
- **Wait 2 weeks post-show before sending** — let the Spannabis dust settle.

### Key Observations from the Floor
- Almost everyone Chris spoke to would qualify for medical cannabis prescription in the UK
- The industry is dominated by money talk — Chris found it isolating but pushed through
- Validation received: people who listened *got it*
- Medical cannabis is the fastest-growing sector vs recreational — governments are channelling it through pharma/prescribers, which is actually the route *in* for patients
- "You're not smoking a joint, you're inhaling vapour that has the medicine your brain is craving"

### Chris's Mindset / Plan
- Day 2 he goes in prepared, not unknown
- Nomad visa in Spain is the goal — code in the sunshine
- Wants the current apps working properly before building new ones
- Back sore, knee sore — ate, rested, ready for tomorrow

### Emails Drafted (not yet sent — in conversation context, copy manually to Gmail)

**To Katharina Jochum (Storz & Bickel):**
> Subject: Cannabin-Oid — AuDHD-built patient tool, just showed you at Spannabis
> [Full draft in session — send any time]

**To Xose (Spannabis Magazine):**
> Subject: A patient built this. You should see it.
> [Full draft in session — send in ~2 weeks, early May 2026]

---

## TECH WORK — April 17, 2026

Branch: `claude/fix-what3words-locator-pD1ME`

### What3Words Meeting Point Generator — Fixed
- **Removed API entirely** (was using `R7VL7Q93` key for autosuggest + convert-to-3wa)
- "Find My Spot" now uses `navigator.geolocation` → opens `https://what3words.com/map?longitude=${lng}&latitude=${lat}` in new tab
- Geolocation timeout raised to 30s, `enableHighAccuracy: false` for faster mobile acquisition
- Text input now shows the user's own typed address as a single confirmation option (no API autocomplete)

### Patreon Auth — Debug Mode Active
- Fixed creator detection: now checks `identity.data.relationships.campaign` (primary Patreon v2 path) as well as `identity.included`
- Removed invalid `campaign_id` from `fields[member]`
- **Debug output is currently ON** in `netlify/functions/patreon-auth.js` — the response includes a `_debug` block showing exactly what Patreon returns
- Sign-in is still failing — awaiting debug output from a live sign-in attempt to diagnose further

---

**Original session below (February 6, 2026):**

---

**Date:** February 6, 2026
**Session:** Prescription Pathway Rewrite + Amazon Affiliate Integration

---

## WHAT HAPPENED THIS SESSION

### The Problem
Christian had a "compacted Claude" respawn prompt for a dealer recruitment campaign. The entire framing was wrong - Cannabin-Oid was positioned as recruiting "dealers" at £97/year to join a cannabis marketplace/network. This didn't match Christian's actual vision: **helping self-medicators find legal prescription routes**.

### The Fix (3 Tasks Completed)

**Task 1: Rewrote `index.html`** (the live site)
- "Join Us" tab → **"Get Legal"** tab
- Removed ALL dealer tiers, pricing, recruitment language
- Added self-medication recognition card ("We see you. You've been managing your health...")
- Added 4-step prescription pathway (Gather history → Book consultation → Get prescribed → Collect from pharmacy)
- Added Alternaleaf as featured clinic with direct link
- Added clinic directory: Sapphire, Cantourage, Releaf, Integro
- Added "What You'll Need for Consultation" guide
- Added "Conditions That May Qualify" grid (chronic pain, PTSD, ADHD, autism, anxiety, MS, epilepsy, fibromyalgia, etc.)
- Added cost breakdown (consultation ~£50, medication £5-15/g, prescription fee £0-30)
- Added vaporizer requirement section with Amazon affiliate links
- Added UK police guidance section
- Kept villager membership (£27/year, £4.95/mo) as community access
- Added prescription CTA after EVERY strain analysis result
- Added "Doc's Kit" card after results (Solo 2, Solo 3, Dynavap, ISO 99% - all affiliate linked)
- Added Amazon affiliate link parsing from Gemini responses (AMAZON_SEARCH → clickable button)
- Updated header tagline: "Self-Medicating? Get Prescribed."
- Preserved all Supabase auth, broadcast, QR code, admin God Mode functionality

**Task 2: Updated `analyze-image.js`** (Netlify serverless function)
- **Identify mode**: Added "GET PRESCRIBED" section after legal notice - lists Alternaleaf, Sapphire, Cantourage, Releaf with 4-step pathway and encouragement quote
- **Grow critique mode**: Added "PRESCRIPTION REMINDER" - every grow critique ends with nudge toward legal prescriptions
- Added `AMAZON_SEARCH:` instruction - Gemini now ends every identify response with a relevant Amazon search term that the frontend parses into an affiliate link
- Updated file header comments to reflect prescription pathway focus

**Task 3: Rewrote `CANNABINOID-DEALER-CAMPAIGN.md`**
- Title: "Prescription Pathway Campaign" (was "Dealer Recruitment Campaign")
- Goal: "Help 500 Self-Medicators Go Legal by Spannabis" (was "50 Dealers by March 1 = £4,850")
- Revenue model: Villager memberships + clinic referral partnerships (was dealer fees)
- Part 1: Outreach messages for self-medicators + clinic partnership pitches (was dealer recruitment DMs)
- Part 2: Spannabis campaign as education booth (was dealer recruitment at trade show)
- Part 3: Social media posts - all reframed around "Self-medicating? Get prescribed."
- Part 4: Printable prescription pathway card for Spannabis booth (NEW) + vaporizer Amazon links table
- Part 5: Common questions (cost, qualifying conditions, GP, driving, travel) (was dealer objection handlers)
- Part 6: Partnership targets - clinics, advocacy orgs, vaporiser companies (was dealer target list)
- Part 7: Outreach schedule - clinic-first, then community, then Spannabis
- Tracking: Clinic partnerships, Get Legal clicks, community growth (was dealer sign-ups, revenue)

---

## FILE MAP

### Live Site (deployed to cannabin-oid.co.uk)
```
C:\Users\comed\Desktop\a1\cannabin-oid-FINAL\cannabin-oid\
├── index.html                          ← REWRITTEN (prescription pathway focus)
├── cannabin-oid.jpg                    ← Favicon/logo
├── content\
│   └── STRAIN-DATABASE.md             ← 13 strains with full terpene profiles (unchanged)
└── netlify\
    └── functions\
        └── analyze-image.js           ← UPDATED (prescription nudge + AMAZON_SEARCH)
```

### Campaign & Docs
```
C:\Users\comed\Desktop\a1\
├── CANNABINOID-DEALER-CAMPAIGN.md     ← REWRITTEN (prescription pathway campaign)
└── HANDOVER.md                        ← THIS FILE
```

### React Hamlet Version (reference only - NOT the live site)
```
C:\Users\comed\Desktop\a1\cannabin-oid-FINAL\cannabinoid\
├── index.html                          ← React version with rich content (Manifesto, Education Centre, Arsenal, Tea Room, Dispensary, Coffee Shop)
└── SAFE-PORTAL-DEALER-PHILOSOPHY.md   ← Old dealer structure - NOW SUPERSEDED
```

### V3 Version (reference only)
```
C:\Users\comed\Desktop\a1\cannabin-oid-FINAL\New folder\cannabinoid-v3\
├── index.html                          ← React version with Amazon affiliate integration pattern
├── HANDOVER.md                         ← V3 handover with all external links
└── BUILD-SUMMARY.md                    ← V3 build notes
```

### Village Builder Skill (template system for all -Oid villages)
```
C:\Users\comed\Desktop\a1\village-builder-skill\
├── SKILL.md                            ← Complete village builder skill (Worzel Gummidge pattern)
├── CLAUDE-PROMPT.md                    ← Generator prompt for any Claude instance
├── VILLAGE-SPECS.md                    ← Pre-planned specs for 12+ village types
└── templates\
    ├── analyze-image-template.js       ← Netlify function template with {{PLACEHOLDER}} vars
    └── GENERATOR-PROMPT.md             ← 10-question village generation form
```

---

## CRITICAL CONSTANTS

### Supabase (shared across ALL -Oid villages)
```javascript
supabaseUrl: 'https://pdnjeynugptnavkdbmxh.supabase.co'
supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo'
adminEmails: ['chris@chrisptee.co.uk', 'chrisptee@gmail.com']
```

### Amazon Affiliate
```
Tag: chrdocstrcromh-21
Link format: https://www.amazon.co.uk/s?k=[SEARCH TERM]&tag=chrdocstrcromh-21
```

### Stripe Payment Links
```
Villager Annual (£27): https://buy.stripe.com/8x29AT54ngUu7DX1LpfrW06
Villager Monthly (£4.95): https://buy.stripe.com/aFabJ1fJ10Vw6zT89NfrW00
Founder Dealer (OLD - £97): https://buy.stripe.com/3cI28rcwP9s27DX1LpfrW04
```

### Gemini API
```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
Auth: GEMINI_API_KEY env var on Netlify
```

### Contact
```
WhatsApp: wa.me/447976884254
Email: chris@chrisptee.co.uk
Ko-fi: ko-fi.com/zoom
```

### FeelFamous Ecosystem
```
feelfamous.com          - Hub
cannabin-oid.co.uk      - Cannabis (THIS)
magic-oid.co.uk         - Magic
radi-oid.co.uk          - Radio
sail-oid.co.uk          - Sailing
chrisptee.co.uk         - Chris
glowgadgets.com         - Bristol rave
```

---

## DOC'S VAPORIZER KIT

| Device | Role | Amazon Link |
|--------|------|-------------|
| **Arizer Solo 2** | Daily driver | amazon.co.uk/s?k=Arizer+Solo+2+vaporizer&tag=chrdocstrcromh-21 |
| **Arizer Solo 3** | The dream upgrade | amazon.co.uk/s?k=Arizer+Solo+3+vaporizer&tag=chrdocstrcromh-21 |
| Arizer Air SE | Budget option | amazon.co.uk/s?k=Arizer+Air+SE+vaporizer&tag=chrdocstrcromh-21 |
| Dynavap | Travel essential | amazon.co.uk/s?k=Dynavap+vaporizer&tag=chrdocstrcromh-21 |
| ISO 99% | Cleaning | amazon.co.uk/s?k=isopropyl+alcohol+99%25&tag=chrdocstrcromh-21 |
| 18650 batteries + charger | For Air SE | amazon.co.uk/s?k=18650+battery+charger&tag=chrdocstrcromh-21 |

### VapeFiend Links (pending partnership)
```
Main: https://vapefiend.co.uk
Solo 3: https://vapefiend.co.uk/products/arizer-solo-3-vaporizer
Air SE: https://vapefiend.co.uk/products/arizer-air-se-vaporizer-x
Parts: https://vapefiend.co.uk/collections/arizer-parts
Dynavap: https://vapefiend.co.uk/collections/vaporizers/dynavap
Storm: https://vapefiend.co.uk/collections/storm-vaporizers
```

---

## UK PRESCRIPTION CLINICS (featured on site)

| Clinic | Role on Site | Website |
|--------|-------------|---------|
| **Alternaleaf** | Featured / primary (~£50 consultations) | alternaleaf.co.uk |
| Sapphire Medical | Directory + Access Scheme | sapphiremedicalclinics.com |
| Cantourage | Directory (German-backed, wide formulary) | cantourage.com |
| Releaf | Directory (fast-track) | releaf.co.uk |
| Integro | Directory (Grow Open Access Initiative) | integroclinics.com |
| Lyphe Group | Campaign target (UK's largest) | lyphegroup.com |

---

## HOW THE AMAZON AFFILIATE INTEGRATION WORKS

1. **Gemini prompt** (analyze-image.js) instructs the AI to end every identify response with:
   ```
   AMAZON_SEARCH: [2-5 word relevant search term]
   ```

2. **Frontend** (index.html `showResult()` function) parses this line:
   ```javascript
   const amazonMatch = desc.match(/AMAZON_SEARCH:\s*(.+?)(\n|$)/i);
   ```

3. If found, it creates a clickable button:
   ```
   https://www.amazon.co.uk/s?k=[encoded search term]&tag=chrdocstrcromh-21
   ```
   Styled as an amber/gold card: "Find [term] on Amazon - Doc's affiliate link - supports the village"

4. The `AMAZON_SEARCH:` line is stripped from the visible text.

5. Additionally, after every result, a static "Doc's Kit" card shows 4 quick links: Solo 2, Solo 3, Dynavap, ISO 99%.

---

## WHAT'S NOT DONE / NEXT STEPS

### Immediate
- [ ] Deploy updated files to Netlify (git push or drag-drop)
- [ ] Test the AMAZON_SEARCH parsing with a live strain photo
- [ ] Verify all Amazon affiliate links resolve correctly with the tag
- [ ] Check the "Get Legal" tab renders properly on mobile

### Campaign (per the campaign doc schedule)
- [ ] Contact Alternaleaf about referral partnership
- [ ] Contact Sapphire about education collaboration
- [ ] Post LinkedIn Post #1 (The Announcement)
- [ ] Join 3 LinkedIn cannabis groups
- [ ] Design printable prescription pathway card for Spannabis

### Site Enhancements (not started)
- [ ] VapeFiend affiliate partnership (links already in v3 handover, pending agreement)
- [ ] "How Doc Got Prescribed" full story content (exists in React hamlet version)
- [ ] Education Centre content (exists in React hamlet: terpene guide, entourage effect, harm reduction)
- [ ] Music Room / DnB family section (exists in React hamlet)
- [ ] Strain database integration (13 strains documented in content/STRAIN-DATABASE.md)
- [ ] Village Library content (vaporizer guide, dosing guides, cleaning method)

### Superseded Files (can be archived/deleted)
- `cannabinoid/SAFE-PORTAL-DEALER-PHILOSOPHY.md` - old dealer tier structure, now irrelevant
- The old dealer Stripe link (£97 Founder Dealer) is no longer referenced on the site

---

## ARCHITECTURE NOTES

### Worzel Gummidge Pattern
All -Oid villages share the same body (Supabase auth, kudos, badges, QR referrals, admin God Mode, Gemini API integration) with a different head (colours, prompts, niche content). Cannabin-Oid's unique head:
- Green gradient (#16a34a → #15803d)
- Cannabis strain identification + terpene analysis
- Prescription pathway (unique to this village - others don't have this)
- 18+ age verification modal
- Harm reduction emphasis throughout
- Amazon affiliate integration for vaporizers

### Supabase Tables Used
- `profiles` - user profiles with oid_memberships array
- `kudos` - kudos/points system
- `broadcasts` - admin broadcast messages
- Magic link auth (no passwords)

### Netlify Setup
- Static site (index.html at root)
- Serverless function: `netlify/functions/analyze-image.js`
- Env var required: `GEMINI_API_KEY`
- netlify.toml configures build, functions directory, security headers

---

## CHRISTIAN'S STORY (for context)

- 57 years old, late-diagnosed AuDHD
- 25+ years in alternative culture (Bristol rave scene, festivals, world travel)
- Self-medicated with cannabis for decades without knowing why
- Got prescribed through Alternaleaf UK - "took 20 minutes, about £50"
- Wants to help every self-medicator discover the legal route
- "Shamans serving shamans" / "World domination through kindness"
- Member of the Magic Circle
- Building the FeelFamous ecosystem of -Oid villages
- Launching Cannabin-Oid at Spannabis Bilbao, April 17-19, 2026

---

## THE MESSAGE (one line)

**"Self-medicating? You don't have to. Get prescribed."**

---

*Built by Doc, for the village.*
*World domination through kindness.*
