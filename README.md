# Access Ally IQ

**Clear answers. Equal access.**

Access Ally IQ is an iPhone and Android app that puts U.S. service dog law in your pocket. It is built for three kinds of people:

- **Handlers**: a full-screen staff screen in English or Spanish, with read-aloud and the dog's profile. Also an incident log, complaint letters, and housing and workplace request letters.
- **Businesses**: a yes-or-no decision guide for when a dog walks in, staff scripts, a 10-question staff quiz, a sample policy, sign wording, and a QR code door poster.
- **Everyone**: 48 place guides, 29 myth-busting answers, laws for all 50 states plus DC and 5 territories, which animals count, and practical guides.

Version 1 has no accounts and no servers. Everything works offline, and personal data stays on the phone.

---

## What you need

- A computer (Mac, Windows, or Linux) with **Node.js 20 or newer** ([nodejs.org](https://nodejs.org))
- A free **Expo account** ([expo.dev](https://expo.dev/signup))
- To publish: an **Apple Developer account** ($99/year) and a **Google Play Console account** ($25 one time)
- To try it on your own phone: the free **Expo Go** app from the App Store or Google Play

## First run (about 10 minutes)

```bash
git clone https://github.com/oasispatiocover-creator/access-ally-iq.git
cd access-ally-iq
npm install
npx expo install --fix      # lines up every library with the installed Expo version
npx expo start
```

Scan the QR code that appears with your phone's camera (iPhone) or the Expo Go app (Android). The app opens on your phone.

> **Note:** This code was written without being able to install the libraries, so it has never been run. Expect a round of small fixes on the first run. `npx expo install --fix` and `npx expo-doctor` catch most version problems. Every file passes a syntax and type check.

## Publishing to the App Store and Google Play

The app uses Expo's build service (EAS), so you don't need Xcode or Android Studio.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all --profile production   # builds both apps in the cloud
eas submit --platform ios                       # uploads to App Store Connect
eas submit --platform android                   # uploads to Google Play Console
```

Before submitting:

1. **Bundle ID:** `app.json` uses `com.accessallyiq.app`. Change it now if you want something else. It can't be changed after the first release.
2. **Store listings:** you'll need screenshots, a description, a support URL, and a privacy policy URL.
3. **Privacy "nutrition label"** (Apple) and **Data safety form** (Google): version 1 collects no data. Everything stays on the device.
4. **Legal review:** have a disability-rights attorney review the content first, and a native speaker review the Spanish staff screen.

## Project layout

```
app/                     Screens (Expo Router: each file is a screen)
  (tabs)/                The five tabs: Home, Places, Q&A, Animals, More
  staff.tsx              Full-screen staff screen (EN/ES, read aloud, keeps screen awake)
  place/[id].tsx         One place guide
  guide/[id].tsx         One guide (veterans, travel, heat, etc.)
  request/[kind].tsx     Housing and workplace request letters
  profile, log, letter, quiz, policy, signs, poster, foodcode, directory,
  search, state, role, help, privacy, about, report
src/
  data/                  All legal content as JSON (generated, see below)
  components/            Shared UI: cards, lists, buttons, icons, state card
  screens/Home.tsx       The three home screens (handler, business, public)
  lib/                   Letter templates, search, sharing
  store.tsx              On-device storage (role, state, profile, log)
  theme.ts               Brand colors, light and dark mode
prototype/index.html     The web prototype: the source of the legal content
scripts/extract-content.mjs  Copies content from the prototype into src/data
assets/                  App icon, splash screen, logos
```

## Updating the legal content

The content lives in `prototype/index.html`, the same file behind the web prototype. To change a state law, a place guide, or a Q&A answer:

1. Edit it in `prototype/index.html`.
2. Run `npm run content` to regenerate the JSON files in `src/data/`.
3. Review the changes, then commit.

Recheck state laws at least once a year. Also watch for rule changes from the Justice Department, the Department of Transportation, and HUD.

## Planned for version 2

- Accounts and cloud backup
- Subscriptions ($6.99/month for handlers, $89.99 per location per year for businesses)
- The trained business directory
- Error reports sent straight to the team (right now they open an email to info@AccessAllyIQ.com)
- Brand fonts (Atkinson Hyperlegible and Bricolage Grotesque) loaded with `expo-font`

## Disclaimer

Access Ally IQ provides general legal information, not legal advice.
