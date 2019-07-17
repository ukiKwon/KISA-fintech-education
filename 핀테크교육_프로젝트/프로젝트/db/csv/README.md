#category.tar
  (1) category_list.csv   
  - {업종코드 || 업종명}   

  (2) category_stock.csv   
  - {업종명 || 종목명}   

  (3) stock_by_category.csv   
  - {업종코드 || 종목코드}

#fr_category.tar
  (1) fr_category_[날짜].csv   
  - 업종별 등락률 데이터 with 공백값 존재   

  (2) fall_rate_by_category_20190709.csv   
  - 업종별 등락률 데이터 with 공백값 제거

#stock_list.tar
  (1) 날짜_인덱스.csv   
  - 날짜별 {종목코드 || 거래 순위 || 등락률} 리스트

  (2) stock_list.csv   
  - {종목코드 || 종목명} 리스트
