// Letter and policy templates, ported from the prototype.
import type { LogEntry, Profile } from '../store';
import { STATES } from '../data';

const longDate = (d = new Date()) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const fromIso = (iso?: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '[date]';
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : longDate(d);
};

export function complaintLetter(to: 'business' | 'doj' | 'state', e: LogEntry | undefined, name: string, profile: Profile) {
  const entry = e || ({ date: '', place: '[business]', what: '[what happened]', outcome: '' } as LogEntry);
  const dog = profile.dogName ? `my service dog, ${profile.dogName}` : 'my service dog';
  const d = fromIso(entry.date);
  const who = name.trim() || '[Your name]';
  if (to === 'business') {
    return `${longDate()}

To the manager or owner of ${entry.place}:

On ${d}, I visited ${entry.place} with ${dog}. ${entry.what}

Under the Americans with Disabilities Act, businesses open to the public must allow service animals to accompany people with disabilities (28 CFR §36.302(c)). Staff may ask only whether the dog is required because of a disability and what task it is trained to perform. They may not require documentation, a vest, or a demonstration.

I am asking that you:
1. Confirm in writing that you will allow service animals, as the law requires.
2. Train your staff on the two questions they are allowed to ask.
3. Reply within 14 days.

I would prefer to resolve this directly. If I don’t hear back, I may file a complaint with the U.S. Department of Justice or my state civil rights office.

Sincerely,
${who}`;
  }
  const agency = to === 'doj' ? 'the U.S. Department of Justice, Civil Rights Division' : 'the state civil rights office';
  const how = entry.outcome === 'Denied entry' ? 'denied entry' : entry.outcome === 'Asked to leave' ? 'asked to leave' : entry.outcome === 'Charged a fee' ? 'charged a fee' : 'treated unfairly';
  return `Complaint to ${agency}

Name: ${who}
Business: ${entry.place}
Date of incident: ${d}

I am a person with a disability who uses a trained service dog. On ${d}, at ${entry.place}, I was ${how} because of ${dog}.

What happened: ${entry.what}

[Confirm this is true or delete it:] My dog was under control and housebroken. I believe this violates Title III of the Americans with Disabilities Act and 28 CFR §36.302(c).

I am asking the business to change its policy and train its staff so this doesn’t happen to others.

(Add any witness names, receipts, photos, or recordings.)`;
}

export type RequestFields = { name: string; to: string; address: string; need: string; contact: string };

export function requestLetter(kind: 'housing' | 'work', f: RequestFields, profile: Profile) {
  const dog = profile.dogName || '[dog’s name]';
  const need = f.need.trim() || profile.task || '[what the dog does for you]';
  const name = f.name.trim() || '[Your name]';
  const contact = f.contact.trim() || '[phone or email]';
  if (kind === 'housing') {
    const to = f.to.trim() || '[Landlord or property manager]';
    return `${longDate()}

To ${to}:

I live at ${f.address.trim() || '[your address and unit]'}. I have a disability, and I am asking for a reasonable accommodation under the Fair Housing Act so I can keep my assistance animal, ${dog}, in my home.

${dog} helps me because: ${need}

Please make an exception to the no-pets policy for ${dog}, and waive any pet rent, pet fees, or pet deposit. If my disability or my need for the animal isn’t obvious, I can provide a letter from a provider who knows me.

Please reply in writing within 10 days. I’m happy to talk if you have questions.

Thank you,
${name}
${contact}`;
  }
  const to = f.to.trim() || '[Manager or HR]';
  return `${longDate()}

To ${to}:

I am asking for a reasonable accommodation under the Americans with Disabilities Act. I would like to bring my service dog, ${dog}, to work.

${dog} is trained to help me with my disability: ${need}

${dog} is housebroken and stays under my control. I’m glad to talk through the details, such as where ${dog} will stay during my shift and how we can handle any coworker allergies. If you need documentation of my disability or the dog’s training, please let me know what you need.

Can we set up a time to talk this week?

Thank you,
${name}
${contact}`;
}

export function policyText(bizName: string, stateCode: string) {
  const n = bizName.trim() || '[Business name]';
  const st = STATES[stateCode] ? STATES[stateCode].name : 'our state’s';
  return `${n} Service Animal Policy

${n} welcomes people with disabilities who use service animals. Under the Americans with Disabilities Act, a service animal is a dog individually trained to do work or perform tasks for a person with a disability. In some cases a trained miniature horse may also be allowed.

1. Service animals may go anywhere customers are allowed to go.
2. When it isn’t obvious what the dog does, staff may ask only two questions: (1) Is the dog a service animal required because of a disability? (2) What work or task has the dog been trained to perform?
3. Staff will not ask about a person’s disability, ask for documentation or ID, require a vest, or ask the dog to demonstrate its task.
4. We do not charge fees or deposits for service animals. We may charge for damage a service animal causes, as we would for any customer.
5. Service animals must be leashed, harnessed, or tethered unless that interferes with their work or the person’s disability prevents it. Then the animal must be under voice or signal control.
6. We may ask that a service animal leave if it is out of control and the handler does not take effective action, or if it is not housebroken. If so, we will offer to serve the person without the animal.
7. Allergies and fear of dogs are not reasons to deny access. We will try to give everyone space.
8. Emotional support, comfort, and therapy animals are not service animals and follow our regular pet policy.
9. We are not responsible for the care or supervision of a service animal.
10. Some states also allow service dogs in training. We follow ${st} law.
11. All staff are trained on this policy. Questions go to a manager.

Adopted: ${longDate()}`;
}

export const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
