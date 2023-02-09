export type EventDataType =
  | 'All' // All Events
  | 'Buffs' // Buffs.
  | 'Casts' // Casts.
  | 'CombatantInfo' // Combatant info events (includes gear).
  | 'DamageDone' // Damage done.
  | 'DamageTaken' // Damage taken.
  | 'Deaths' // Deaths.
  | 'Debuffs' // Debuffs.
  | 'Dispels' // Dispels.
  | 'Healing' // Healing done.
  | 'Interrupts' // Interrupts.
  | 'Resources' // Resources.
  | 'Summons' // Summons
  | 'Threat'; // Threat.
