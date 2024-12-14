# Summon-s-master
Roll20 api mod to summon creatures

Commands
All command arguments can use dice expressions (e.g., 1d8), random tables (e.g., 1t[Table_Name]), or direct values. Commands are designed to work with both GM and player inputs.

General Commands
!SM --help
Displays general information about the script, including commands and usage.

!SM --menu
Opens the formation menu, where you can manage and summon saved formations.

!SM --config
Opens the configuration menu (GM-only), where you can adjust settings like silentDefault, cellSize, and localization.

Summon Arguments
--count|[Number or Formula]
Default: 1. Specifies the number of creatures to summon. Supports dice rolls (e.g., 1d4).

--position|[Number or Formula]
Default: 1d8. Specifies the position relative to the reference point:

0: Center of the reference token.
1-8: Cardinal directions, where 1 is north, 2 is northeast, and so on clockwise.
Supports dice rolls and manual input.
--radius|[Number or Formula]
Specifies the summoning radius (in feet) around the reference token. Used when position is not specified.
--size|[F/D/T/S/M/L/H/G/C/Number or Formula]
Default: M (Medium). Specifies the creature's size:

F: Fine
D: Diminutive
T: Tiny
S: Small
M: Medium
L: Large
H: Huge
G: Gargantuan
C: Colossal
Alternatively, use a number (e.g., 2) or dice formula (e.g., 1d6), which will be converted to a size code.
--silent
Disables the summoning message and sound effects.

--sound|[Sound_Name]
Plays a sound effect when the summoning is complete. Ignored if --silent is active.

--ids|[Token_ID]
Uses a specific token ID as the reference point. Example: --ids @{target|Select a target|token_id}. Useful when the summoning point is a token the player cannot control.

--sel
Uses the currently selected token as the reference point for the summoning.

Example Commands
Random Monsters with Random Position and Size

css
Копировать код
!SM --summon name|"1t[Random-Monsters]" --count|1d4 --position|1d8 --size|1d6
Summons 1d4 random monsters with random positions and sizes.
Silent Summoning of a Large Pet Dragon

css
Копировать код
!SM --summon name|"Pet Dragon" --size|L --position|?{Number position?} --silent
Summons one large pet dragon, with a position chosen by the user and no announcement.
Summoning Around a Token by ID

scss
Копировать код
!SM --summon name|"Guard" --count|4 --radius|30 --ids @{target|Token|token_id}
Summons 4 guards in a 30-foot radius around a selected token.
Group Summoning
!SM --group|[Formation_Name]
Summons a pre-saved formation by name.

Saving Formations Add --save|[Formation_Name] to any --summon command to save it as a formation. Saved formations can be accessed via the --menu or --group commands.

Example:

css
Копировать код
!SM --summon name|"Skeleton" --count|5 --radius|20 --save|SkeletonGroup
Saves this summoning setup as "SkeletonGroup".
Configuration
Accessible via !SM --config (GM-only).

Settings:
Silent Mode (silentDefault)

Enable or disable silent mode by default:
arduino
Копировать код
!SM --config --silentDefault|true
!SM --config --silentDefault|false
Cell Size (cellSize)

Set the grid cell size (default: 70 pixels):
arduino
Копировать код
!SM --config --cellSize|?{Enter new cell size|70}
Localization (locale)

Switch between Russian (ru) and English (en):
css
Копировать код
!SM --config --locale|ru
!SM --config --locale|en
Formation Menu
Accessible via !SM --menu.

Lists all saved formations with the following options:
Summon: Quickly summon the formation.
Edit: Update the formation's command.
Delete: Remove the formation.
Add New Formation: Save a new formation.
Error Handling
All errors (e.g., invalid commands, no free space) are displayed in styled messages, based on the current localization.
