# KISA_fintechSchool  
# 2019. 05. 24
# 과정
  (1) 거래 내역 조회  
  (2) QR 송금/결제  
    - instancescan 오픈 소스 설치  
    - 

# 일지
  (1) 거래내역 조회 기능 추가  
  (2)  
# 정보
  (1) 'Selenium'으로 웹 크롤러 만들기 가능  
    - 웹 크롤러는 python 소스가 많아서 이런 류를 쓴다.  
    - 여기다가 nodejs를 덧붙여서 쓰고 그런 작업의 연속  
# 에러
# 2019. 05. 23
# 과정
# 일지
  (1) (어제 못한) Mysql-token 컬럼 추가
    `ALTER TABLE user ADD COLUMN accessToken varchar(255);
    ALTER TABLE user ADD COLUMN refreshToken varchar(255);`  

    - Database 구조 변경
    `CREATE TABLE user ( unum int AUTO_INCREMENT, uname varchar(255) NOT NULL, upwd varchar(255) NOT NULL, uid varchar(255), ujoinday DATETIME, uphone varchar(255), uemail varchar(255), uaccessToken varchar(2550), urefreshToken varchar(255), PRIMARY KEY(uid));`  

  (2) 로그인 페이지 만들기
    - 'postman' 설치; 현업가서도 자주 쓸 거임.
    - '최근에 로그인한 시간' 컬럼을 꼭 만들어주자. 나중에 관리를 위한 변수값.
    - 'jsonwebtoken' npm 설치
    - cors 사용
    - /views/hf 추가를 했고 header와 footer를 통한 구조화된 하면 구성을 함.  
    -
  (3) 토큰키 풀어내기
  (4) 모바일 같은 경우는 세션타임 관리 어려워서 토큰 받아서 쓰는 것이 좋더라.
  (5) 사용자 정보 조회
    - GET 방식이니깐 form 형식은 쓰지 않고
    -
    *인증이 필요한 정보는 'auth'를 추가시키고 사용하자!*  
  (6) Main 화면 구성
    -
# 정보
  (1) auth : auth-midware는 알아볼 수 있는 정도로 가공해주는 역할  
    - auth에 있는 tokeyKey값과 express.ejs에 있는 Token key값이 같아야한다.
      : 인증하는 사람의 비밀키쯤된다.
  (2) 데이터 세트 추가  
    - 공동플랫폼상의 테스트 데이터와 인증할 당시에 은행'오픈' 설정할때의 계좌랑 같아야함.

# 에러
  (1) 변수 이름 충돌 -> 모두 수정됨
  (2) sql 에러
    `TypeError: Cannot read property 'upwd' of undefined`
      -> 내 디비에 분명하게 선언되어있는 컬럼값인데 안 돌아가네
    [ 원인 ]  
      -> postman에서 테스트할 때, 빈값이 날아가고 있었음.
  (3) 메인 화면에 계좌 정보가 뜨지 않는 문제
    - (단순) 로그로만 찍게해주고, res에 결과 내용을 저장하지 않았음.  

# 2019. 05. 22
# 과정
# 일지
  (1) 환경설정 스스로 해보기 : npm 환경설정, express 세팅  
    - 프로젝트를 하나 만들때마따 'npm init'을 하고 사용할 모듈들을 불러와야함. 혹은 복붙하거나  
    - '/public'은 내가 외부로 공개한 유일한 폴더  
    - '/join' 추가  

  (2) 소비 패턴 - 결제에 대하여 금결원으로 넘겨주기
    - 인증 페이지 만들기가 먼저(인증 부분이 첫단계) -> 금결원과 연동
  (3) Vue.js를 언급 : 이게 대세. ejs랑 양립함.
  (4) ajax : 비동기적으로 부분적으로 데이터를 렌더링을 하기 위하여 사용함.  
    - jquery로 데이터 바인딩 하기 힘들다 해서 나온게 Vue.js, angularjs  
  (5) mysql 코드 적용
    - join 에서 post 기능 추가
    - SQL 코드 추가
      `'INSERT INTO user(uname, upwd,uphone) VALUES (?, ?, ?)'`  
  (6) 프론트에서 서버로 날리는 이벤트 추가
    - join에서 처리 구문 추가  
  (7) 별개  
    - mysql 늘 연결된 상태로 구현하는 것이 아니라 polling 기법으로 구현함.

  (8) 금융결제원
    - CallbackURl : 인증 후에 받을 데이터들이 올 곳을 정하는 곳  
    - Chrome ors 확장 프로그램 추가 설치  
    - [ Outh 조회 ] - 프론트에 인증 추가하기  

# 에러  
  (1) 'ajaxTest' 사용이 안 됨
  (2) 금융API 300004 에러 -> 금융 결제원 앱에 등록해놓은 callback url에 프로토콜 명까지 기입하기   
  (3) XHR 에러
  `XHR failed loading: GET "https://testapi.open-platform.or.kr/oauth/2.0/authorize2?response_type=code&client_id=44c0930fc871461287088ca73882af67&redirect_uri=http://localhost:3000/authResult&scope=login%20inquiry%20transfer&auth_type=0&invoke_type=ajax".`  

  - `<button type="button" id="authBtn" class="button button-full button-m shadow-large button-round-small bg-highlight top-30 bottom-0">AUTHENTICATION</button>`
  - 위 구문에서 class 부분에 'back-button'이 속성때문에 동작이 안 되었음.  
  (4) JSON 타입 에러
  `VM122:1 Uncaught SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at callArsRec:232`
  (5) 인증오류
    `{ rsp_code: 'O0001', rsp_message: '인증요청 거부-인증 파라미터 오류 ([117])' }`
    - 강사님 코드 복사해오면서 내 인증키값/비밀키값 변경안했음
#
# 2019. 05. 21
# 둘째날
# 과정
  (1) nodejs 기본문법  
# 일지  
  (1) console.log, 변수, 함수, 객체 생성, 배열, 반복문(for, while),if/else
    - 배열은 여러 타입 동시에 사용 가능하지만 -> 런타임 에러에 취약해짐  
    - 반복문 내 임시 변수 i에 대한 별도의 타입 선언 필요없음;  
      `for(i = 0; i < 3; ++i) or for(var i = 0; i < 3; ++i);`  

  (2) 동기식/비동기식  
    - 일의 순서가 중요할 때는 동기식, 그렇지 않을 때는 비동기식으로 일 처리 맡겨 버려도 됨;  
      파일 Read/Write 작업과 같은 경우는 속도차가 나서 문제남  
    - callback 함수로 해결하겠다.(단, *callback hell 문제*)

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

  (4) DBMS : DB 세팅  
    `CREATE TABLE user ( uid int AUTO_INCREMENT, uname varchar(255) NOT NULL, ubirthday DATETIME, upwd varchar(255) NOT NULL, uphone varchar(255), PRIMARY KEY(uid));`  

  (5) MYSQL - nodejs
    - npm에 mysql 커넥터가 있는지 확인을 하고,    
      `npm install mysql`

  (6) server 'Express' : NPM 모듈
    - Express 기능 사용  

  (7) EJS 설치 : NPM 모듈
    - 파일을 HTML로 전환시키는 모듈
    - 'views' 폴더를 생성해서 여기다가 관리할 것  

  (8)
  (7) 별도  
    - 요즘은 XML 잘 안 쓰는 추세  

# 에러
  (1) console.log : 객체 내 변수 호출 안됨.  -> this 사용하는 것 기존과 동일함.  
  (2) mysql - npm 에러
    `/home/uki408/Documents/git/KISA_fintechSchool/code/day2/mysqltest.js:12
  if (error) throw error;
             ^
Error: getaddrinfo ENOTFOUND localhost localhost:3306
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:56:26)
    --------------------
    at Protocol._enqueue (/home/uki408/Documents/git/KISA_fintechSchool/code/day2/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Protocol.handshake (/home/uki408/Documents/git/KISA_fintechSchool/code/day2/node_modules/mysql/lib/protocol/Protocol.js:51:23)
    at Connection.connect (/home/uki408/Documents/git/KISA_fintechSchool/code/day2/node_modules/mysql/lib/Connection.js:119:18)
    at Object.<anonymous> (/home/uki408/Documents/git/KISA_fintechSchool/code/day2/mysqltest.js:9:12)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:754:12)`

    -> host : 'localhost' -> '127.0.0.1' 로 변경하면 됨.  
    - ref( https://stackoverflow.com/questions/25521755/errorerror-getaddrinfo-enotfound-mysql)

  (3) EJS와 Views 이해 잘 안됨  

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
  - (시도2) 윈도우 플랫폼으로 해볼것  -> 불분명하게 들어가지기는 함.
 (2) slack 방 가입 -> 주소창에 바로 쳐서 들어가는 거임.
