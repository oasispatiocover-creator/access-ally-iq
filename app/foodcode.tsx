import React from 'react';
import { Screen, Card, Eyebrow, H1, Rich, RuleList, Cite } from '../src/components/ui';

export default function FoodCodeScreen() {
  return (
    <Screen>
      <H1>Restaurants and the health code</H1>
      <Rich text="Many restaurant managers worry a health inspector will cite them for a dog in the dining room. The FDA Food Code, which state and local health departments use as the basis for their rules, says otherwise." />
      <Card>
        <Eyebrow>What the Food Code says</Eyebrow>
        <RuleList items={[
          { text: '**Section 6-501.115:** service animals are allowed in areas not used for food preparation that are usually open to customers, such as dining and sales areas, as long as the handler controls the animal and it causes no health or safety hazard.', mark: 'tick' },
          { text: 'Service animals may not go into kitchens or food prep areas.', mark: 'cross' },
          { text: '**Section 2-403.11:** food employees shouldn’t handle animals, but an employee may care for their own service animal and then wash their hands.', mark: 'tick' },
        ]} />
        <Cite>FDA Food Code 2026, unchanged from 2022 on these sections</Cite>
      </Card>
      <Card>
        <Eyebrow>In practice</Eyebrow>
        <RuleList items={[
          'Seat the handler anywhere other customers can sit. The business doesn’t have to let the dog sit on chairs or eat at the table.',
          'Staff don’t have to feed or water the dog, though offering water is a kind touch.',
          'Service dogs can go through buffet and salad bar lines with the handler.',
          'Your state or county may use an older edition of the Food Code. The service animal rule has been in place for many years.',
        ]} />
      </Card>
    </Screen>
  );
}
