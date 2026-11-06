# Island 2050

An SDG simulation game: govern the fictional island of Penglai from 2026 to 2050 and try to reach the
Sustainable Development Goals without losing your people's support.

- Plan: [docs/PLAN.md](docs/PLAN.md)
- Project log (progress, decisions, challenges, sources): [docs/project-log/](docs/project-log/)

## Running it

You need [Node.js](https://nodejs.org) installed.

```bash
npm install      # first time only: downloads the libraries
npm run dev      # starts the site at http://localhost:5173
npm run build    # makes the final website in /dist (for uploading/hosting)
npm run balance  # plays hundreds of games automatically and prints how they end
```

## How the code is organized

```
src/
  game/                ← THE GAME (plain JavaScript, no React)
    constants.js       settings: years, budget, difficulty, starting stats
    policies.js        the policy cards        ← add new policies here
    events.js          random events            ← add new events here
    citizens.js        the 5 citizens + advisor
    story.js           chapters and endings
    sdgs.js            how each SDG score is calculated
    engine.js          the rules: what happens each turn
    storage.js         saving to the browser
    GameContext.jsx    connects the engine to React

  pages/               ← one file per page (URL)
    Home, Setup, Play, Results, Learn, Sdgs, Hall, About

  components/          ← reusable pieces
    IslandMap.jsx      the SVG island that changes with your choices
    CitizenAvatar.jsx  citizen faces (photos or placeholders)
    play/              the pieces of the game screen (HUD, cards, pop-ups)

  styles/global.css    colors, fonts, buttons (the design system)

public/citizens/       ← put the citizen photos here (see the README inside)
```

**The basic idea:** `engine.js` holds the rules. It takes the game state and returns a new state.
The React pages only *display* that state and call engine functions when you click buttons.

## Common changes

| I want to… | Edit |
|---|---|
| Add a policy | Copy a block in `src/game/policies.js` |
| Add an event | Copy a block in `src/game/events.js` |
| Change difficulty / starting values | `src/game/constants.js` |
| Change colors or fonts | `:root` in `src/styles/global.css` |
| Add my photos | Drop `id-mood.jpg` files into `public/citizens/` |
| Change the advisor's name | `name` of `advisor` in `src/game/citizens.js` |
