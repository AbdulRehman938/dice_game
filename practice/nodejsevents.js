import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();



myEmitter.on('waterFull', () => {
  console.log('turn off the motot');
  setTimeout(() => {
    console.log('plz turn off the motor')
  }, 3000);
});

myEmitter.emit('waterFull');

console.log("The script is running");
setTimeout(() => {
  console.log("The script is still running");
}, 2000);





// myEmitter.emit('event');