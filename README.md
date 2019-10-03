# lilynode-api
Express based lilypond converter for nodejs.

Converts a .ly file 

## Convert 
| File format | Media type | Input format | Output format |
|----------|-------------|:------:|:----:|
| ASCII (Lilypond) | Text | x | x |
| MIDI | Music| x | x | 
| PDF | Text | | x |
| SVG | Image | | x |
| PNG | Image | | x |

## Install

### Test server
Server listing on port 3002 and can be changed in index.js
1. npm install 
2. node index.js

### Production with pm2
1. npm install
2. pm2 start index.js --name lilynode-api

## Lilypond directory

**structure:** 
1. Songtitle
2. Partiture name  
   - lilypond.ly: contains lilypond code
   - lilypond.midi: generated midi file from lilypond.ly
   - lilypond.png: generated png file from lilypond.ly
   
Example: /files/Songtitle/Chorus/Chorus.ly
   
## Routes

|HTTP Method | Route | Body | Description  |
|-----|----------------------|------|-----------------|
| GET | /ly-converter | format=png&content={ly code}| Convert ly file to png|
| GET | /ly-converter | format=svg&content={ly code} | Convert ly file to svg|
| GET | /ly-converter | format=midi&content={ly code} | Convert ly file to midi |
| GET | /ly-converter | format=png&content={ly code} | Convert ly file to pdf |
| GET | /midi-converter/ly | midi={binary midi file} | Convert midi to ly file |

## Sources
- 10 Best Practices for Better RESTful API: https://medium.com/@mwaysolutions/10-best-practices-for-better-restful-api-cbe81b06f291
- PM2 Quickstart: http://pm2.keymetrics.io/docs/usage/quick-start/