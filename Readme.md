# Andor Custom Cards Builder

This is a Fan-project for the board game 'The Legends of Andor'. You can write your own campaigns for this game and I thought I'd build something that generates original-looking cards out of plain text.

I plan to upload the generator as NPM package and wrap as an Electron App with a (hopefully) nice GUI.

## Installation

Just install the dependencies with

```bash
npm install
```

## Usage

To run the script with the provided example file, run

```bash
npm run test
```

To use it with your own JSON file, use

```bash
node main.js example.json
```

The JSON should look like the example.json/like this

```json
{
  "story_cards": [
    {
      "index": "A1",
      "content": "*Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.*<br><br>**Donec quam felis**, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
    },
    {
      "index": "A2",
      "content": "<i>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. </i><br><br><b>Donec quam felis</b>, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
    },
    {
      "index": "C",
      "content": "<i>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. </i><br><br><b>Donec quam felis</b>, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
    }
  ]
}
```

You can use Markdown and/or `<i>`, `<b>` and `<br>` tags in your text to format it _italic_, **bold** or insert a <br>
linebreak.

## Authors

- **Frederik Werner** - *Inspiration*
- **Fabian Große** - *Initial work* - [Saphareas](https://github.com/Saphareas)

## License

This project, unless otherwise noted, is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
