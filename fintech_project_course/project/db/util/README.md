#소스 설명(source description)
1. excelJumpLine.cpp   
  - 엑셀내 컬럼을 다 충족하지 않은 빈값 제거하고 '업종별 등락률.csv' 생성   
  - return : fall_rate_by_category_[날짜].csv   

2. matchCategory.cpp   
 - '업종명 || 종목명'.csv 형태를 '업종코드 || 종목코드'.csv로 변환   
 - return : stock_category.csv   

3. stringUtil.cpp
  - csv 한행을 "," 지침자를 기준으로 컬럼단위로 쪼갬. 현재는 컬럼 2개만 허용함.   
  - return : pair <string, string>   

4. makeCategory.cpp   
  - '업종명 || 종목명'.csv를 읽어들여서 중복제거하고 '업종코드 || 업종명'.csv 생성   
  - return : category_list.md   

5. convert.cpp   
  - convert.hpp : 이름을 지정된 코드로 변환   

6. config.hpp
  - 공통적으로 사용되는 변수명 정의   

#작성자 : uki408
