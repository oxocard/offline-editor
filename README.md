# NanoPy Offline Editor

Offline version of the NanoPy Editor. No server needed.

## Installation

To be able to run the Editor, the dependencies need to be installed and the project has to be built.
Alternatively you can start the Editor in development mode. See section Development for more details.

### Prerequisite

This project uses Node.js (at least v16.14). You can install it from [here](https://nodejs.org/).

### Clone, build and run

1. Clone the repository and open the Project in a terminal or IDE
2. Install dependencies with `npm install`
3. Build the project with `npm run build`
4. Start the editor with `npm start`
5. Open http://localhost:1777 in an up to date Chrome or Edge browser

## Development

The Offline version of the NanoPy editor is a [Vite](https://vitejs.dev/), [React](https://beta.reactjs.org/) single page app written in [Typescript](https://www.typescriptlang.org/). The editor communicates via [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) with the Oxocards. It uses [Material UI](https://mui.com/) with [styled-components](https://styled-components.com/) for most of the styling and [Redux Toolkit](https://redux-toolkit.js.org/) as the state manager.

### Run in dev mode

1. Clone the repository and open the Project in a terminal or IDE
2. Install dependencies with `npm install`
3. Run the project in dev mode with `npm run dev`
4. Open http://localhost:1777 in an up to date Chrome or Edge browser

In dev mode the project uses Hot Module Replacement (HMR) to update the current running instance if the code is changed.

### Linting

The project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to check the code quality and formatting.

You can run `npm run lint` and `npm run prettier` to run the checks.
