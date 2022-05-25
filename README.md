# Disclaimer
This solution was done 2021-12-30 and added to my repository 2022-05-25 to display some recent code done outside of working hours.

# Pony Challenge (get started)
Type the following in the terminal to get the local development up and running:
1. "npm install"
2. "npm start"

## Tests
Only 1 unit test was implemented due to time limit (angry wife). This project was not implemented
using TDD.
### Execute unit test
npm run test

## Architecture
The data manipulation logic is handled by the MazeService.ts. The view components are using this
service to display the game state. The PonyApiService is the interface between the server
and the application.

RxJS is used to optimize the applications rerenders by only updating the specific square(s) that
has an updated state (domokun and pony changing position). The walls that creates the pyramid are
static after the first fetch and cached. The RxJS broadcast is happening in the MazeService.
The subscription is set in the Domukun and Pony component.

AbortSignal are added to all fetches to avoid memory leaks when component unmounts or the user is
spamming the movement keys.

The user can control the pony character with the keys: "arrow left, right, up, down and enter". It
is also possible to move the pony by clicking on the map. The logic here is that the axis (x or y)
furthest away from the pony will be the direction of the movement.

The maze is created by svg lines and the maze size is controlled by the viewport (height and width).
The user will "only" have 3 alternatives of map size (small: 15 * 15, medium: 20 * 20, larger: 25 * 25).
This means that the viewport only have to take into account 3 scenarios to fit all devices.
## Cross device compatibility
The maze max width is set to 1000px so it will not expand beyond the user's screen when using a pc
at home. It has been tested with firefox and chrome with various simulated devices.

## Production
I have not optimized the build (bundle size, etc).

## Responsiveness
I believe the application responsiveness is pretty good due to the svg map and RxJS implementation.
