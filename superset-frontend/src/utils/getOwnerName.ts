// DODO was here
// DODO created 42727850
import Owner from 'src/types/Owner';

export default function getOwnerName(owner?: Owner): string {
  if (!owner) {
    return '';
  }

  let name = owner.full_name || `${owner.first_name} ${owner.last_name}`;

  if ('country_name' in owner)
    name += ` (${owner.country_name || 'no country'})`;
  if (owner.email) name += ` ${owner.email}`;

  return name;
}
