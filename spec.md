# QuickMind Assistant

## Current State
App has a Calculator panel (with iframe games behind codes) and an Embedder panel (with quick links). The game picker behind code 6767 only shows 5 sites. The user wants many more games like calcsolver.net.

## Requested Changes (Diff)

### Add
- New `GamesPanel.tsx` component: a full-screen overlay with a searchable, categorized grid of games
- `gamesData.ts`: large curated list of game entries (title, url, category, emoji)
- Gamepad button in the header to open/close the Games panel
- Each game tile opens the game in a clean popup window (no toolbar, no address bar) using existing `openInPopup` pattern
- Categories: IO Games, Arcade, Puzzle, Sports, Action, Strategy, Classics, Platforms
- Search bar to filter games by name
- 200+ individual game entries plus links to portals that collectively host thousands

### Modify
- `App.tsx`: add gamepad icon button in header, add GamesPanel component
- `Calculator.tsx`: expand the game picker (code 6767) to show more games, including link to full games panel

### Remove
- Nothing removed

## Implementation Plan
1. Create `gamesData.ts` with large games list organized by category
2. Create `GamesPanel.tsx` with search, category tabs, grid of game tiles
3. Update `App.tsx` to wire in GamesPanel with header toggle button
4. Update Calculator.tsx game picker to reference more games
