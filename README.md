# MemeMaker

## a super simple commandline tool for generating memes using the imgflip API

# Installation

From the root directory of this repo

```
npm i
```

**Update auth credentials** move .env.example to .env and add your _imgflip_ username/password there.

# usage

```meme.js [command]

Commands:
  meme.js fetch                        get 100 most popular meme templates and
                                       write them to a file
  meme.js create <template> <text...>  make a meme using the name of the
                                       template and some text

```

## Example

`node meme.js create "drake" "Making mememes on the web" "using the command line to dodge ads"`
