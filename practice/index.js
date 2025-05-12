// function step1(callback) {
//   setTimeout(() => {
//     console.log('step1');
//     callback();
//   }, 1000);
// }

// function step2(callback) {
//     setTimeout(() => {
//       console.log('step2');
//       callback();
//     }, 2000);
//   }

//   function step3(callback) {
//     setTimeout(() => {
//       console.log('step3');
//       callback();
//     }, 3000);
//   }
  
// step1(() => {
//     step2(() => {
//         step3(() => {
//             console.log('done');
//         })
//     })
// })

// const author =  require('./second.js');
// console.log(author);

console.log(exports, require, module, __filename, __dirname); // {} [Function: require] Module {...} C:\Users\shubham\Desktop\Node\index.js C:\Users\shubham\Desktop\Node