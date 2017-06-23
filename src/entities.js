import Mixins from './mixins'

// Player template
export const PlayerTemplate = {
    chr: '@',
    foreground: 'white',
    background: 'black',
    mixins: [Mixins.Moveable, Mixins.PlayerActor,
             Mixins.SimpleAttacker, Mixins.Destructible]
}

export const FungusTemplate = {
    chr: 'F',
    foreground: 'green',
    mixins: [Mixins.FungusActor, Mixins.Destructible]
}

export const EnemyTemplate = {
    chr: '☹',
    foreground: 'red',
    mixins: [Mixins.Moveable, Mixins.EnemyActor,
             Mixins.SimpleAttacker, Mixins.Destructible]
}
