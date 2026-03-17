import { read, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

// ESM-safe __dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url))

// ------ Paths --------------------------------------------------------------------------------
const INPUT = join(__dirname, 'fakemon.csv')
const OUTPUT = join(__dirname, '../src/data/fakemon.json')

// ------ Read raw CSV -------------------------------------------------------------------------
const raw = readFileSync(INPUT, 'utf-8')

// ------ Parse --------------------------------------------------------------------------------
const { data, errors } = Papa.parse(raw, {
    header: true,               // use first-row as object keys
    skipEmptyLines: true        // drops the ~30 blank rows at the bottom
})

if (errors.length) {
    console.warn('PARSE WARNINGS:', errors)
}

// ------ Helpers ------------------------------------------------------------------------------

// Pads dex number to 3 digits: 1 -> "001", 23 -> "023"
const padDex = (n) => String(Math.round(n)).padStart(3, '0')

// Converts a Pokemon name to a safe filename slug
// "Shardactyl" -> shardactyl"
// "Mr. Mime" -> "mr-mime"
const slugify = (name) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric -> dash
        .replace(/^-+|-+$/g, '')        // strip leading/trailing dashes

// Builds the local sprite path convention:
// Dex #1 "Shardactyl" -> "/sprites/001-shardactyl.png"
const spritePath = (dexNum, name) =>
    `/sprite/${padDex(dexNum)}-${slugify(name)}.png`

// Safely parses a stat float, returns 0 if missing
const parseStat = (val) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : Math.round(n)
}

// Cleans a string field - trims whitespace, returns empty string if null
const clean = (val) => (val ?? '').trim()

// ------ Transform --------------------------------------------------------------------------------
const fakemon = data
    // Drop any rows that slipped through without a name or dex number
    .filter(row => row['Name'] && row['Dex #'])
    .map(row => {
        const dexNum = Math.round(parseFloat(row['Dex #']))
        const name = clean(row['Name'])

        return {
            id: dexNum,
            dexNum: padDex(dexNum),
            name,
            species: clean(row['Species']),

            // Types - Type 2 is optional, store as null if blank
            type1: clean(row['Type 1']),
            type2: clean(row['Type 2']) || null,

            // Abilities - Hidden ability optional
            ability1: clean(row['Ability 1']),
            ability2: clean(row['Ability 2']) || null,
            abilityHidden: clean(row['Ability (Hidden)']) || null,

            // Physical
            height: clean(row['Height']),
            weight: clean(row['Weight']),

            // Stats
            stats: {
                hp: parseStat(row['HP']),
                atk: parseStat(row['ATK']),
                def: parseStat(row['DEF']),
                spAtk: parseStat(row['SP. ATK']),
                spDef: parseStat(row['SP. DEF']),
                spd: parseStat(row['SPD']),
                bst: parseStat(row['BST']),
            },

            // Flavour
            dexEntry: clean(row['Dex Entry']),

            // Sprite - local path convention, matchs public/sprites filenames
            // Rename image files to match: 001-shardactyl.png, 002-umbrisk.png etc.
            sprite: spritePath(dexNum, name),
        }
    })

    // ------ Write output --------------------------------------------------------------------------------
    writeFileSync(OUTPUT, JSON.stringify(fakemon, null, 2), 'utf-8')

    console.log(`SUCCESS! Wrote ${fakemon.length} Fakemon to src/data/fakemon.json`)

    // ------ Sanity Report --------------------------------------------------------------------------------
    const noType1 = fakemon.filter(f => !f.type1)
    const noAbility1 = fakemon.filter(f => !f.ability1)
    const noEntry = fakemon.filter(f => !f.dexEntry)

    if (noType1.length) console.warn(`CAUTION: ${noType1.length} entries missing Type 1`)
    if (noAbility1.length) console.warn(`CAUTION: ${noAbility1.length} entries missing Ability 1`)
    if (noEntry.length) console.warn(`CAUTION: ${noEntry.length} entries missing Dex Entry`)