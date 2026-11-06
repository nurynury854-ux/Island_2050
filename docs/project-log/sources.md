# Sources, Data & Credits

## 1. Real-world facts used on the Learn page

⚠️ = written from general knowledge and **must be checked against an official source before the
final version**. Replace ⚠️ with ✅ and add the link once verified.

| Topic | Fact as written in the game | Source to check | Status |
|---|---|---|---|
| Net zero target | Taiwan announced a pathway to net-zero emissions by 2050 (2022) | National Development Council (國發會), "Taiwan's Pathway to Net-Zero Emissions in 2050" | ⚠️ |
| Offshore wind | The Taiwan Strait has some of the world's best offshore wind conditions; Formosa 1 was Taiwan's first commercial offshore wind farm (2019) | Energy Administration, MOEA (經濟部能源署); 4C Offshore wind speed rankings | ⚠️ |
| Coal | Taichung Power Plant is one of the largest coal-fired power plants in the world | Taipower (台電) | ⚠️ |
| Carbon fee | Taiwan introduced a carbon fee for large emitters starting with 2025 emissions | Ministry of Environment (環境部) | ⚠️ |
| Drought 2021 | Taiwan's 2021 drought was the worst in over half a century; irrigation was suspended for many farms to keep water for homes and industry | Water Resources Agency (水利署) | ⚠️ |
| Chip industry | Taiwan makes most of the world's most advanced chips; fabs use very large amounts of water and electricity | TSMC sustainability report; industry reports | ⚠️ |
| Typhoons | Several typhoons affect Taiwan each year; Typhoon Morakot (2009) killed around 700 people | Central Weather Administration (中央氣象署) | ⚠️ |
| Wetlands | Taiwan has a Wetland Conservation Act; mangrove reserves exist e.g. along the Tamsui River | Ministry of the Interior / National Park Service | ⚠️ |
| Water recycling | Taiwan has reclaimed-water plants supplying industry (e.g. Fengshan, Kaohsiung) | Water Resources Agency | ⚠️ |
| MRT | Taipei Metro opened in 1996 and is one of Asia's most-used, most reliable metro systems | Taipei Rapid Transit Corporation | ⚠️ |
| Solar | Taiwan has promoted rooftop solar through feed-in tariffs | Energy Administration, MOEA | ⚠️ |
| Battery storage | Taiwan has been adding grid-scale battery storage as solar grows | Taipower; Energy Administration, MOEA | ⚠️ |
| Offshore wind rounds | Taiwan plans offshore wind in several rounds, later ones farther offshore | Energy Administration, MOEA | ⚠️ |
| Scooters | Taiwan has one of the highest scooter ownership rates in the world; e-scooters with battery-swap stations are common | Ministry of Transportation and Communications | ⚠️ |
| Nuclear | Taiwan's last reactor shut down in 2025; restarting has been put to referendums and voters are divided | Central Election Commission (中選會); Taipower | ⚠️ |
| Forests | Forests cover roughly 60% of Taiwan | Forestry and Nature Conservation Agency (林業及自然保育署) | ⚠️ |
| Green buildings | Taiwan's green building label is called EEWH | Architecture and Building Research Institute (建研所) | ⚠️ |
| Fishing | Taiwan has one of the largest distant-water fishing fleets; FAO estimates over a third of global fish stocks are overfished | Fisheries Agency (漁業署); FAO "State of World Fisheries and Aquaculture" | ⚠️ |
| Farm water | Agriculture uses most of Taiwan's water | Water Resources Agency (水利署) | ⚠️ |
| Earthquake | A magnitude 7.4 earthquake struck Hualien in April 2024 | Central Weather Administration | ⚠️ |
| Carbon border tax | The EU has introduced a carbon border tax called CBAM | European Commission | ⚠️ |
| Sea walls | Hard sea walls protect coasts but can damage beaches and habitats; "nature-based" defenses like wetlands are an alternative | IPCC AR6 WGII | ⚠️ |

General SDG definitions: United Nations, https://sdgs.un.org/goals

## 2. How the game numbers were chosen

The simulation is **not** a scientific model. Numbers are tuned so that:
- No single strategy wins everything (economy vs environment vs approval tradeoffs).
- Directions match reality: renewables cut emissions, but take time and money to build; fabs boost the economy but use a lot of water; wetlands help both nature and storm protection.
- A full game takes ~10 minutes and a balanced strategy can reach a "good" ending.

The real values live in `src/game/policies.js`, `src/game/events.js` and `src/game/engine.js`.

## 3. Assets & credits

| Asset | Source |
|---|---|
| Island illustration | Hand-built SVG in code (`src/components/IslandMap.jsx`) |
| Citizen photos | The creator (to be taken) |
| Fonts | Fraunces & DM Sans via Google Fonts (Open Font License) |
| SDG colors | Official UN SDG color palette (numbers and colors only, no UN logos) |

## 4. AI usage (honest disclosure)

- Idea brainstorming, planning and the React/JavaScript implementation were done with help from an AI
  coding assistant (Claude). I didn't know React before this project.
- Game design decisions (topic, fictional island, using my own face, scope) were mine; see `decisions.md`.
- Game text and facts will be reviewed and edited by me; facts are verified against the sources above.
