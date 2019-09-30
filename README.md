# gear-pricer
Hacky utility to perform price comparisons across a couple different used music gear sites

# SUPER BUSTED WARNING
While this is technically functional, it's kind of an embarassing clusterfuck of a code base. Goal is to get a simple deployable heroku app out of it at some point.

# Installation
- NVM: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
- Node 12: `nvm install 12`
- Git Clone: `git clone https://github.com/sam-heller/gear-pricer.git`
- Install Packages: `npm install`

# Usage
As your flobotomist I'd advise against it, but if you really wanna...

## Configure
Currently you have to manually configure your search in the script.
### Basic Search
Modify this entry at the top of gearPricer.js to define your search term

```
//////////////////////
// Put your search term here
let searchTerm = 'maschine mk3';
```

You can add terms to exclude from the search results to weed out accessories or other oddly named things.
```
//////////////////////
// Put an array of words to exclude from the title here
let excluded = ['Mikro', 'Cover', 'Case', 'korg', 'reel', 'komplete'];
```

### Data Sources
Currently I've got profiles to pull from Sweetwater, Guitar Center, and Reverb. Structure for a config entry so far is something like :

```
  {
        name: 'Display Name for the Store',
        slug: 'slug-to-differentiate-the-store',
        api:{
            method: 'GET or POST or WHATEVER here as a string',
            url: 'https://url.to/pull-data-from',
            options: {
                qs: {
                    query: 'query=params&search=###REPLACEME###', 
                    for: 'the request'
                }
            }
        },
        jq:  {
            query: 'JQ Query String, see https://stedolan.github.io/jq/ options below are good defaults',
            options: {input: 'json', output: 'compact'}
        },
        term: {
            type: 'set',
            target: 'api.options.qs.query'
        }
  }      
```

Everything should be fairly obvious with the exception of the term field. That's targeting to define what to replace with your search term in the query. Check out [lodash._get](https://lodash.com/docs#get) for details on how targeting works.


#### Set
there's a specific key in the query or header object that you can directly replace with the search term. Target refers to that location, so in the above example if I wanted to target the `query` field in the api config section I'd configure it as so :

```
        term: {
            type: 'set',
            target: 'api.options.qs.query'
        }
```

#### Term
For messier situations where you need to replace a specific part of a string use term. The targeting is the same as set, and you have an additional `key` value which is used to define the value that you'll replace in the query.
```
    term: {
        type: 'replace',
        target: 'api.options.qs.query',
        key: '###REPLACEME###'
    }
```

## Running

Once you've tweaked the settings, go ahead and run it with

`node gearPricer.js`

It'll output a list of entry names and prices to the console so that you can tweak the exclusions, and dump out a bunch of files in the `output` directory that you can peruse at your leisure.


```
╰─±node gearPricer.js
Used Native Instruments Maschine MK3 MIDI Controller - 449.99
Used Native Instruments Maschine MK3 MIDI Controller - 429.99
Used Native Instruments Maschine MK3 MIDI Controller - 429.99
 ...
 maschine mk3 - 480
Maschine MK3 - 515
 Maschine MK3 - 500
Maschine MK3 - 400
 Maschine Mk3 Drum Controller - 500
Maschine MK3 - 230
Maschine MK3 - 369
╰─± ls -lh output 
total 744
-rw-r--r--  1 sheller  staff   495B Sep 30 04:19 high-level.csv
-rw-r--r--  1 sheller  staff    77K Sep 30 04:19 json-response-guitar-center.json
-rw-r--r--  1 sheller  staff   263K Sep 30 04:19 json-response-reverb.json
-rw-r--r--  1 sheller  staff    14K Sep 30 04:19 json-response-sweetwater.json
-rw-r--r--  1 sheller  staff   6.4K Sep 30 04:19 price-list.txt

```
