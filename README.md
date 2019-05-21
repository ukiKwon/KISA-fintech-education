# KISA_fintechSchool  
#2019. 05. 21
# 둘째날
# 과정
  (1) nodejs 기본문법  
# 일지  
  (1) console.log, 변수, 함수, 객체 생성, 배열, 반복문(for, while),if/else
    - 배열은 여러 타입 동시에 사용 가능하지만 -> 런타임 에러에 취약해짐  
    - 반복문 내 임시 변수 i에 대한 별도의 타입 선언 필요없음;  
      for(i = 0; i < 3; ++i) or for(var i = 0; i < 3; ++i);  
  (2) 동기식/비동기식  
    - 일의 순서가 중요할 때는 동기식, 그렇지 않을 때는 비동기식으로 일 처리 맡겨 버려도 됨; 파일 Read/Write 작업과 같은 경우는 속도차가 나서 문제남  
    - callback 함수로 해결하겠다.  
    *callback hell 문제*  

  (3) NPM
    (3.1) 'npm init'으로 초기화
      ->  'npm install request' 모듈 사용
    - npm에서 쓸 꺼 하나 가져오면 된다.
    - 우리가 이제 request를 날리는 도구(모듈)을 가져왔으니간 API로 보내보자
    - 그런데 이런식이라면 filestream 상으로 매우 괴로워짐

    (3.2) 'xml <-> json'으로 바꾸는 모듈 받아올거임
      - xml로 주는 사이트에 가서 요청을 해야함.
      *금융API 할때도 이걸로 하는거임*  
    (3.3) 금융 API 실습
      - 그냥 바로 사용할 수는 없고, 쿼리 스트링에 내 고유키 값을 넘겨줘야함.  

  (4) DBMS
    `CREATE TABLE user ( uid int AUTO_INCREMENT, uname varchar(255) NOT NULL, ubirthday DATETIME, upwd varchar(255) NOT NULL, uphone varchar(255), PRIMARY KEY(uid));
    `

  (5) 별도  
    - 요즘은 XML 잘 안 쓰는 추세  

# 에러
  (1) console.log : 객체 내 변수 호출 안됨.  -> this 사용하는 것 기존과 동일함.  


# 2019. 05. 20
# 첫날
# 과정
 (1) nodejs, mysql+workbench  
  (TA) 나중에는 docker를 사용해서 container를 통해서 빠른 환경 설정을 하니깐, 배워두시길 바랍니다.  
 (2) slack = https://bit.ly/2EjEjpQ  
 (3) git과 sourcetree(GUI-git 관리 제공)  

# 일지  
  - nodejs 업데이트  
  - workbench(mysql 공부겸 설치 안할 예정), sourcetree(Atom 내 git 연동 기능 그대로 사용 예정)  

# 에러    
 (1) 오픈뱅킹플랫폼 가입 과정 (x) : 회원 가입시 보안 모듈 설치 불가라는 에러 접함  
  - (시도1) 핸드폰으로 가입시도 했으나 마찬가지 에러 메시지  
  - (시도2) 윈도우 플랫폼으로 해볼것  
 (2) slack 방 가입  
