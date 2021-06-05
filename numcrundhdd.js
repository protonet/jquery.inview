// 数当てゲーム
let min = 1;
let max = 100;
let num = Math.floor(Math.random() * (max + 1 - min)) +min;

window.onload = function onload(){

var textbox = document.getElementById('randomNumberI').value;
// console.log(randomNumberI.value);

}

function judge() {

    let flag = 0;
    if(isNaN(randomNumberI.value)){
      flag = 1;
    }

    if(flag){
      window.alert("数字を半角で入力してください。");
    } else {

      var answerJ = document.getElementById("output")


      let inputNumber = document.getElementById('randomNumberI').valueAsNumber;
      if (num == inputNumber) {
        answerJ.innerHTML = "正解！";
      } else if (num < inputNumber) {
        answerJ.innerHTML = "もっと小さな数です";
      } else {
        answerJ.innerHTML = "もっと大きな数です";
      }
    }
  }
