import {reactive} from 'vue';
export const flashes = reactive([]) 

export function addFlash(flashText) {
    flashes.push(flashText)
}

export function removeFlash(flashMessage) {
    console.log('removeFlash', flashMessage)
    var index = flashes.indexOf(flashMessage);
    if (index !== -1) {
      flashes.splice(index, 1);
    }
  }

export function flashInstall(app,options) {
   console.log("installed flashes (do nothing)") 
}

export default {
    flashes, 
    addFlash,
    removeFlash,
    install: flashInstall
}