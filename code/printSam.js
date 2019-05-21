// 1단계 : 출력
// console.log("Hello world");


//2단계 : 변수 사용
// var lastname = "sung uk";
// console.log(lastname);
//
// var arr_name ={ firstname : "haha", secondname : "hhuhu"};
// console.log(arr_name);
//
// var testname = lastname + '15';
// console.log(testname);
//
// var testname = lastname + "15";
// console.log(testname);
//
// var testname = lastname + 15;
// console.log(testname);


//3단계 : 함수
// function sum(p1, p2) {
//   return p1  + p2;
// };
// function mul(p1, p2) {
//     return p1 * p2;
// }
// console.log(sum('1', '4'));//14
// console.log(sum(1, 4));//5
// console.log(sum("Kwon", "SungUk"));//KwonSungUk
// console.log(mul(4, 5));


//4단계 : 클래스 생성
/*
  * 객체 자체도 하나의 변수처럼 취급해서한다.
*/
// var car = {
//   name : "Gicha",
//   owner : "sungUk",
//   color : "blue",
//   wheel_count : "4",
//   start : function() {
//       console.log("출발!!");
//   },
//   stop : function() {
//       console.log("멈춰!!");
//   },
//   // *
//   // * 현재 console.log. 저런식으로 표현이 안됨. 자기 호출 어떻게 하나? 문법 똑같음(this)
//   intro : function() {
//       console.log("차 이름 : ", this.name);
//       console.log("차 주인: ", this.owner);
//       console.log("차 색깔 : ", this.color);
//       console.log("차 바퀴 수 : ", this.wheel_count);
//   }
// }
// car.intro();
// car.start();
// car.stop();


//5단계 : 배열
// var car1 = "Kwon";
// var car2 = "Sung";
// var car3 = "Uk";
//
// //자바스크립트는 같은 배열안에 여러가지 타입 속성이 들어가도 됨
// var fullName = ["Kwon", "Sung", "Uk"];
// console.log(fullName);
// console.log(fullName[0]);
// console.log(fullName[1]);
// console.log(fullName[2]);


//6단계 : 반복문
// var fullname = ["Kwon", "Sung", "Uk"];
// for (var i = 0; i < 3; ++i)
//   console.log(fullname[i]);
//
// for (i = 0; i < fullname.length; ++i)
//   console.log(fullname[i]);


//7단계 : while, if/else
// var mswitch = false;
//
// if (mswitch) {
//     console.log("틀렸어 멍청아");
// }
// else {
//     console.log("맞았어 멍청아");
// }
// var count = 5;
// while (count-- > 0) {
//     console.log(">> 멍청이는 혼나야돼");
// }


//8단계 :
