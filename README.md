# Summon-s-master
Roll20 api mod to summon creatures
Commands
All team parts can use dice (1d8) or random tables

!summon --help — General information about the script

!summon --name|[Creature_name] — Basic command to summon a creature. If the creature's name consists of more than one word, then the whole thing should be written "like this".

The following arguments can execute the command above

--count|[number or formula] — Default 1. Number of summoned creatures

--position|[number or formula] — Default is 1d8. Relative to the selected token. Where 0 is the center of the selected token, 1 is north, 2 is northeast and so on clockwise. 

Note: Jumpgate and Legacy versions of the game have different coordinate systems (at least something like that) and because of this the position placement may not work correctly. For medium creatures, summoning medium tokens works stably.

--size|[F/D/T/S/M/L/H/G/C/number/formula] — Default is M. Can use formulas with dice, number will be converted to a size code. F= Fine, D = Diminutive, T= Tiny, L = large, H = Huge, G = Gargantuan, C = Colossal.

--silent — Disables the summoning message.

--ids|[token_id] — Use token ID as reference point. The easiest way to get a token id — --ids @{target|Select a target|token_id}. This option is needed if it is necessary to summon a token next to a token that the Players do not control and cannot select.


--sel — Use selected token as reference point.

Example:
!summon --name|"1t[Random-Monster]" --count|1d4 --position|1d8 --size|1d6

— Summons 1d4 random monsters, with random position and size.

!summon --name|"Pet dragon" --size|L --position|?{Number position?} --silent 

— Summons one large pet dragon with the ability to choose the direction in which it will be summoned.
