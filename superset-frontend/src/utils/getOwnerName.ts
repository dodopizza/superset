// DODO was here
import Owner from 'src/types/Owner';

export default function getOwnerName(
  owner?: Owner & { label?: string },
): string {
  if (!owner) {
    return '';
  }

  if (owner.label) {
    return owner.label;
  }
  // DODO changed 44211759
  let name = owner.full_name || `${owner.first_name} ${owner.last_name}`;

  // DODO added start 44211759
  if ('country_name' in owner)
    name += ` (${owner.country_name || 'no country'})`;
  if (owner.email) name += ` ${owner.email}`;
  // DODO added stop 44211759

  return name;
}
