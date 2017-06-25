import Mixins from './mixins'

// Player template
export const PlayerTemplate = {
    chr: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 40,
    attackValue: "2d6",
    mixins: [Mixins.Moveable, Mixins.PlayerActor,
             Mixins.Attacker, Mixins.Destructible,
             Mixins.MessageRecipient]
}

// Fungus template
export const FungusTemplate = {
    chr: 'F',
    foreground: 'green',
    name: "fungus",
    maxHp: 10,
    mixins: [Mixins.FungusActor, Mixins.Destructible]
}

export const EnemyTemplate = {
    chr: '☹',
    foreground: 'red',
    name: "most evil creature in the world",
    maxHp: 20,
    attackValue: "3d3",
    mixins: [Mixins.Moveable, Mixins.EnemyActor,
             Mixins.Attacker, Mixins.Destructible]
}
