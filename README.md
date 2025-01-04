The script allows you to create a standard token from your library with its standard settings next to the selected token or token ID we specify. It also allows you to specify the direction of the token appearance, the number of copies created and their size.

Commands
All team parts can use dice (1d8) or random tables

!SM ...

--help — General information about the script (the move command is not working yet)

--summon

name|[Creature_name] — Basic command to summon a creature. If the creature's name consists of more than one word, then the whole thing should be written "like this". The script supports summoning multiple creatures after one --summon — the separator is name| and the summon parameters will be related to the specified creature

The following arguments can execute the command above

count|[number or formula] — Default 1. Number of summoned creatures

radius|number or formula — The script summons a creature in the specified radius randomly in a free cell. If the radius is not specified, the script tries to "stick" the summoned creatures to the selected token.

overlap|[optional message] - allows you to ignore the setting for summoning in a free cell and display a message if the token summons on another creature, ahem: "Rock to the head, you take 16 damage!"

position|[number or formula] — Default is 1d8. Relative to the selected token. Where 0 is the center of the selected token, 1 is north, 2 is northeast and so on clockwise. 

    Note: Jumpgate and Legacy versions of the game have different coordinate systems (at least something like that) and because of this the position placement may not work correctly. In Legacy for medium creatures, summoning medium tokens works stably.

size|[F/D/T/S/M/L/H/G/C/number/formula] — Default is M. Can use formulas with dice, number will be converted to a size code. F= Fine, D = Diminutive, T= Tiny, L = large, H = Huge, G = Gargantuan, C = Colossal.

silent — Disables the summoning message.

ids|[token_id] — Use token ID as reference point. The easiest way to get a token id — ids|@{target|Select a target|token_id} or NAME of token on the map. The script first searches for IDs, and then names. This option is needed if it is necessary to summon a token next to a token that the Players do not control and cannot select.


sel — Use selected token as reference point.

barX|value(+) — sets the number for bar1-2-3, if you specify + at the end, it adds visibility to players

showname — Makes the name visible to players
sound|sound_name — plays a track from jackbox once

fx|Name-ColorKey — This point requires a little more attention.

After describing the fx, we can write ";" and immediately move on to the next fx or influence the location of the summoned effect.

1) Source - where the fx will "fly" from: Source = 0, -2;

2) Target - where the fx will "fly" to: Target = -5,5;

We calculate the offset in cells (I don't even try to explain the direction of the paths in the jumpgate now, it's better to test it yourself). Also, you can specify both the source and the target as a reference token. A couple of examples:

1) Meteorite - fx|beam-fire; source=2,-10;bomb-fire

2) Summoning beam - fx|beam-acid;source=ref,0,1

--save|[group_name] — add this at the end of the command and in the future you will be able to call the same formation via the command --group|group_name or via --menu (unique for each player)

Example:
!SM --summon name|1t[Random-Monster] count|1d4 position|1d8 size|1d6

— Summons 1d4 random monsters, with random position and size.

!SM --summon name|"Pet dragon" size|L position|?{Number position?} silent 

— Summons one large pet dragon with the ability to choose the direction in which it will be summoned.

!SM --summon name|"Eridanus Head" size|M silent ids|@{target|Select Eridanus|token_id} fx|beam-acid;source=ref,0,1 sound|Hydra-Head radius|5

— Allows the player to cut off the head of the Eridani Hydra, causing it to fall within 5 feet of the monster with a distinctive sound and visual effect.

!SM --summon name|Zombie-Horde size|H position|0 sound|Zombie-scream fx|nova-fire ids|1t[ID-Orcus] silent

— Summons a Horde of zombies in Orcus's lair of enormous size right at the summoning point, which is determined through the ID randomly, since we take the ID of the tokens from the [ID-Orcus] table with a visual flash and the sound of the zombies

!SM --summon name|player-character-1 name|player-character-2 name|player-character-3 name|player-character-4 --save|Sammon-Party

— Allows you to save a Sammon-Party formation and summon your party of adventurers to the map with one click without having to dig through your journal each time.
