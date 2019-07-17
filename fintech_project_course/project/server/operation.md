#0717 ~ #0718
# 만들 기능   
  - 업종별 데이터 다 넘겨주기   
  - 업종 클릭시 - 해당 종목 데이터 다 넘거주기   

# 일 순서   
  (0) csv 파일   
    >> {업종 코드 || 종목 코드};category_stocks.csv 생성 하기 (v)

  (1) 테이블 생성   
    >> {업종 종목 코드 || 업종 이름} 테이블 생성; tb_category_list (v)
    >> {업종 코드 || 종목 코드} 테이블 생성; tb_category_stocks ()
    >> {업종 코드 || 등락률 } 테이블 생성; tb_category_fr_20190715 ()

  (2) 함수 만들기   
    - 업종별 데이터 다 넘겨주기   
      getStockCategoryAll()
      {
        {
          id :
          name :
          rate :
        },
        ...
      }
    - 업종 클릭시 해당 종목 데이터 다 넘겨주기
      getStockListById/category_id=?()
      {
          {
              id :
              name :
              rate :
          }
          ...
      }
    - 한 종목의 5일치 데이터 (임시)
      getStockDataByOne()/stock_id=?()
      {
          {   
              rate : { "", "", "", "", ""}
          }
      }
  (3) 실시간 데이터 with selenium-standalone   
    - krx 페이지에서 5분 간격으로 csv 파일 다운로드 하는 daemon   
    - 당일 데이터를 테이블에 집어넣는 daemon   
#0716
#참고사항   
- 전일과 일부 항목이 같으면 안 올린다.   
- 같은 날의 상장된 주식은 같은 Index   
#용어   
- daily, : 이전   
- timely, : 오늘   
- ref : 업종명   
