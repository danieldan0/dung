import Mixins from './mixins.js'
import sprintfjs from 'sprintf-js'

const vsprintf = sprintfjs.vsprintf;
const sprintf = sprintfjs.sprintf;

export function sendMessage(recipient, message, args) {
    // Make sure the recipient can receive the message
    // before doing any work.
    if (recipient.hasMixin(Mixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
}

export function sendMessageNearby(map, centerXY, message, args) {
    // Get the nearby entities
    const entities = map.getEntitiesWithinRadius(centerXY, 5);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (let i = 0; i < entities.length; i++) {
        sendMessage(entities[i], message, args)
    }
}
