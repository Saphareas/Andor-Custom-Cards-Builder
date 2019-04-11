***The latest standalone version (commandline tool using puppeteer) is version 0.5.3***

# Andor Custom Cards Builder

This is a Fan-project for the board game 'The Legends of Andor'. You can write your own campaigns for this game and I thought I'd build something that generates original-looking game assets out of plain text.

I plan to upload this generator as NPM package and wrap as an Electron App with a (hopefully) nice GUI.

## Installation

You will need NodeJS, npm and (of course) git. Clone the repo and cd into it. Then install the dependencies with

```bash
npm install
```

and you are ready to run.

## Usage

To run the script with the provided example files, run

```bash
npm run test        # To run it for all example files
npm run test-story  # To run it for just the story cards
npm run test-fog    # To run it for just the fog tiles
npm run test-events # To run it for just the event cards
```

To use it with your own JSON file, use

```bash
node main.js
# or
npm start
# with one or all of the following options
--story=</path/to/your-story.json>
--fog=</path/to/your-fog.json>
--events=</path/to/your-events.json>
```

Your files should be valid JSON and should look like the [example files](generator/examples).

You can use HTML (e.g. `<i>`, `<b>` and `<br>`) tags in your text to format it _italic_, **bold** or insert a <br>
line break.

To override the image used for the story and event cards, you can add a `image` property in your JSON, like this:

```json
{
  "index": "A2",
  "text": "*Lorem ipsum dolor sit amet.",
  "image": "/path/to/your-background.png"
}
```

The resulting ready-to-print PDF files will be located in the `generator/out` directory by default. You can use `--out-dir=</some/folder>` to specify a custom output directory.

## Authors

- **Frederik Werner** - *Inspiration*
- **Fabian Große** - *Initial work* - [Saphareas](https://github.com/Saphareas)

## License

This project, unless otherwise noted, is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
