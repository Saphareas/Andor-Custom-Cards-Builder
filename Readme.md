# Andor Custom Cards Builder

This is a Fan-project for the board game 'The Legends of Andor'. You can write your own campaigns for this game and I thought I'd build something that generates original-looking cards out of plain text.

I plan to upload the generator as NPM package and wrap as an Electron App with a (hopefully) nice GUI.

## Installation

You will need NodeJS, npm and (of course) git. Clone the repo and cd into it. Then install the dependencies with

```bash
cd generator
npm install
```

and you are ready to run.

## Usage

To run the script with the provided example files, run

```bash
npm run test
```

To use it with your own JSON file, use

```bash
node main.js -story=</path/to/your-story.json> -fog=</path/to/your-fog.json>
```
TODO: Update Usage

Your files should be valid JSON and should look like the [example files](generator/examples).

You can use Markdown and/or `<i>`, `<b>` and `<br>` tags in your text to format it _italic_, **bold** or insert a <br>
line break.

To override the background of the story cards, you can add a switch in your JSON, like this:

```json
{
  "index": "A2",
  "content": "*Lorem ipsum dolor sit amet.",
  "background": "/path/to/your-background.png"
}
```

The resulting ready-to-print PDF files will be located in the `generator/out` directory.

## Authors

- **Frederik Werner** - *Inspiration*
- **Fabian Große** - *Initial work* - [Saphareas](https://github.com/Saphareas)

## License

This project, unless otherwise noted, is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
