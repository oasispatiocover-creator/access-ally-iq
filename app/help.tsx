import React from 'react';
import { Text } from 'react-native';
import { useApp } from '../src/store';
import { useColors } from '../src/theme';
import { Screen, Card, Eyebrow, H1, Muted, Rich, LinkRow, openLink } from '../src/components/ui';

function Phone({ n }: { n: string }) {
  const c = useColors();
  return (
    <Text accessibilityRole="link" accessibilityHint="Calls this number" onPress={() => openLink('tel:' + n.replace(/[^0-9]/g, ''))} selectable
      style={{ fontSize: 20, fontWeight: '800', color: c.accent }}>{n}</Text>
  );
}

export default function HelpScreen() {
  const { state } = useApp();
  return (
    <Screen>
      <H1>Free help</H1>
      <Muted>These services are free.</Muted>
      <Card>
        <Eyebrow>ADA National Network</Eyebrow>
        <Rich text="Answers ADA questions by phone for anyone, including businesses. Arizona is covered by the Pacific ADA Center." />
        <Phone n="1-800-949-4232" />
        <LinkRow label="adata.org" url="https://adata.org" />
      </Card>
      <Card>
        <Eyebrow>Protection & Advocacy agencies</Eyebrow>
        <Rich text={'Every state has one. They may give free legal help to people with disabilities.' + (state === 'AZ' ? ' In Arizona, it’s Disability Rights Arizona.' : '')} />
        {state === 'AZ' ? <Phone n="800-927-2260" /> : null}
        <LinkRow label="Find your state’s agency" url="https://www.ndrn.org/about/ndrn-member-agencies/" />
        {state === 'AZ' ? <LinkRow label="Disability Rights Arizona" url="https://disabilityrightsaz.org" /> : null}
      </Card>
      <Card>
        <Eyebrow>Job Accommodation Network</Eyebrow>
        <Rich text="Free advice for workers and employers on service dogs at work." />
        <Phone n="1-800-526-7234" />
        <LinkRow label="askjan.org" url="https://askjan.org" />
      </Card>
      <Card>
        <Eyebrow>ADA Information Line</Eyebrow>
        <Rich text="The Justice Department’s line for ADA questions." />
        <Phone n="800-514-0301" />
        <LinkRow label="ADA.gov service animals" url="https://www.ada.gov/topics/service-animals/" />
      </Card>
      <Card>
        <Eyebrow>Where to file a complaint</Eyebrow>
        <LinkRow label="U.S. Department of Justice" hint="Businesses" url="https://civilrights.justice.gov/" />
        <LinkRow label="U.S. Dept. of Transportation" hint="Airlines" url="https://www.transportation.gov/airconsumer/complaints-alleging-discriminatory-treatment-against-disabled-travelers" />
        <LinkRow label="HUD Fair Housing" hint="Housing" url="https://www.hud.gov/fairhousing" />
        <LinkRow label="EEOC" hint="Workplace" url="https://www.eeoc.gov/filing-charge-discrimination" />
        <LinkRow label="Federal Transit Administration" hint="Buses & trains" url="https://www.transit.dot.gov/regulations-and-guidance/civil-rights-ada/file-complaint-fta" />
        <LinkRow label="Amtrak" hint="Trains" url="https://www.amtrak.com/contact-us" />
        <LinkRow label="Greyhound" hint="Intercity bus" url="https://www.greyhound.com/help-and-info/customers-with-disabilities" />
        <LinkRow label="Uber" hint="Rideshare" url="https://help.uber.com/riders/article/report-a-service-denial-assistance-or-assistance-animal-issue?nodeId=46633035-4796-406f-8569-739b2bee66a8" />
        <LinkRow label="Lyft" hint="Rideshare" url="https://help.lyft.com/hc/en-us/all/articles/5533816871-service-animal-policy-riders" />
        <Muted small>For a city bus, train, or paratransit, file with your local transit agency first, then with the Federal Transit Administration within 180 days (hotline 888-446-4511). For Uber or Lyft, report it in the app from the trip in your ride history.</Muted>
      </Card>
    </Screen>
  );
}
