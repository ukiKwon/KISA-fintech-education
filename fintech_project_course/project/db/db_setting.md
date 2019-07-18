#update : 2019. 07. 18
#DB configuration  
  - aws 세팅
  - database : kisemble
    pwd : kisemble

#주식데이터
#Data 건수
1. 샘플식 예제
6(총 장시간) x 6(10분주기) x 2000(종목수) = 72,000 * 30 (한달) = 216,000
: 한 파티션에 21만 건 * 12(월) = 252만 건  

2. 전체 예제
6(총 장시간) x 3600(1초주기) x 2000(종목수) = 43,200,000 * 30 (한달) = 1,296,000,000
: 한 파티션에 12억 건 * 12(월) = 144억 건  

3. 과거 데이터는 미리 계산해두고 테이블(통계 데이터)에 별도로 저장해둘 것.

#기능
//데이터 주기 10분
(1) 종목에 따른 관련 정보 업로드
(2) 업종에 따른 관련 종목 업로드(https://finance.naver.com/sise/sise_group_detail.nhn?type=upjong&no=136)

#Table 세팅
@1. 등락률 요약 테이블
(1) 등락률만 보여주는 단축 테이블 - 샘플 날짜별
{종목코드 : 종목순위 : 등락률}
```
CREATE TABLE tb_summary_20190709_00095 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_falling_rate FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   
CREATE TABLE tb_summary_20190710_00096 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_falling_rate FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   
CREATE TABLE tb_summary_20190711_00097 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_falling_rate FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   
CREATE TABLE tb_summary_20190712_00098 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_falling_rate FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   
CREATE TABLE tb_summary_20190715_00099 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_falling_rate FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   
```
(2) 주식 RAW 데이터 테이블
CREATE TABLE tb_[날짜명-인덱스값] (
    prior_index SMALLINT,
    stock_code CHAR(6),
    stock_name VARCHAR(50),
    cur_price VARCHAR(10),
    stock_daybefore INT DEFAULT '0',
    stock_falling_rate INT DEFAULT '0',
    cur_amount INT DEFAULT '0',
    cur_stock_quantity INT DEFAULT '0',
    price_highest INT DEFAULT '0',
    price_lowest INT DEFAULT '0',
    market_capital INT DEFAULT '0',
    market_capital_rate FLOAT DEFAULT '0',
    stock_listed INT DEFAULT '0',
    foreigner_hold_stocks BIGINT,
    foreigner_hold_rate FLOAT,
    num_of_stock SMALLINT
);

@2. 주식 종목 분류
{종목 코드 : 종목명}
```
CREATE TABLE tb_stock_list (
    stock_code CHAR(6),
    stock_name VARCHAR(30),
    PRIMARY KEY(stock_code)
);
```
@3. 주식 업종 분류
{업종코드 : 업종명}
```
CREATE TABLE tb_category_list (
  category_code CHAR(6),
  category_name VARCHAR(100),
  PRIMARY KEY(category_code)
);
```
@4. 업종별 주식 분류
{업종코드 : 종목코드}
```
CREATE TABLE tb_stock_category (
    category_code CHAR(6),
    stock_code CHAR(6),
    FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```
@5. 업종별 등락율 테이블
{업종코드 : 등락률}
```
CREATE TABLE tb_fr_category_20190709 (
  category_code CHAR(6),
  category_falling_rate FLOAT DEFAULT '0',
  FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
CREATE TABLE tb_fr_category_20190710 (
  category_code CHAR(6),
  category_falling_rate FLOAT DEFAULT '0',
  FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
CREATE TABLE tb_fr_category_20190711 (
  category_code CHAR(6),
  category_falling_rate FLOAT DEFAULT '0',
  FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
CREATE TABLE tb_fr_category_20190712 (
  category_code CHAR(6),
  category_falling_rate FLOAT DEFAULT '0',
  FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
CREATE TABLE tb_fr_category_20190715 (
  category_code CHAR(6),
  category_falling_rate FLOAT DEFAULT '0',
  FOREIGN KEY(category_code) REFERENCES tb_category_list(category_code)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);  
```

@00. 전체 종목별 정보 : Ideal 형태  
{날짜 : 종목 코드 : 현재가 : 대비 : 등락률 : 거래량 : 거래 대금 : 고가 : 저가 : 시가총액 : 시가총액 비중 : 상장 주식수}
*이슈 : FOREIGN KEY 추가시 문법 오류 뜨기때문에, 한시적인 테이블임*

  (3.1) 전일 주식 정보
  ```
  CREATE TABLE tb_exday_stock_info (
      reg_date DATE DEFAULT CURDATE(),
      stock_code CHAR(6),
      cur_price VARCHAR(10),
      stock_daybefore INT DEFAULT '0',
      stock_falling_rate INT DEFAULT '0',
      cur_amount INT DEFAULT '0',
      cur_stock_quantity INT DEFAULT '0',
      price_highest INT DEFAULT '0',
      price_lowest INT DEFAULT '0',
      market_capital INT DEFAULT '0',
      market_capital_rate FLOAT DEFAULT '0',
      stock_listed INT DEFAULT '0'
  )
  PARTITION BY RANGE (MONTH(reg_date)) (
    PARTITION p01 VALUES LESS THAN(2),
    PARTITION p02 VALUES LESS THAN(3),
    PARTITION p03 VALUES LESS THAN(4),
    PARTITION p04 VALUES LESS THAN(5),
    PARTITION p05 VALUES LESS THAN(6),
    PARTITION p06 VALUES LESS THAN(7),
    PARTITION p07 VALUES LESS THAN(8),
    PARTITION p08 VALUES LESS THAN(9),
    PARTITION p10 VALUES LESS THAN(10),
    PARTITION p11 VALUES LESS THAN(11),
    PARTITION p12 VALUES LESS THAN maxvalue
  );
  ```

(3.2) 당일 주식 데이터
  ```
  CREATE TABLE tb_today_stock_info (
      reg_date DATETIME DEFAULT NOW(),
      stock_code CHAR(6),
      cur_price VARCHAR(10),
      stock_daybefore INT DEFAULT '0',
      stock_falling_rate INT DEFAULT '0',
      cur_amount INT DEFAULT '0',
      cur_stock_quantity INT DEFAULT '0',
      price_highest INT DEFAULT '0',
      price_lowest INT DEFAULT '0',
      market_capital INT DEFAULT '0',
      market_capital_rate FLOAT DEFAULT '0',
      stock_listed INT DEFAULT '0',
      FOREIGN KEY(stock_code) REFERENCES tb_stock_category(stock_code)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );
  ```
#샘플 데이터 삽입(0709 ~ 0715)
1. 종목 리스트
{종목코드 : 종목명}
```
LOAD DATA LOCAL INFILE '~/stock_data/stock_list.csv'
INTO TABLE tb_stock_list
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```   

2. 종목별 등락률 리스트
{종목코드 : 종목순위 : 등락률}
```
LOAD DATA LOCAL INFILE '~/stock_data/20190709_00095.csv'
INTO TABLE tb_summary_20190709_00095
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
```
LOAD DATA LOCAL INFILE '~/stock_data/20190710_00096.csv'
INTO TABLE tb_summary_20190710_00096
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
```
LOAD DATA LOCAL INFILE '~/stock_data/20190711_00097.csv'
INTO TABLE tb_summary_20190711_00097
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
```
LOAD DATA LOCAL INFILE '~/stock_data/20190712_00098.csv'
INTO TABLE tb_summary_20190712_00098
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
```
LOAD DATA LOCAL INFILE '~/stock_data/20190715_00099.csv'
INTO TABLE tb_summary_20190715_00099
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
3. 업종 리스트
{업종코드 : 업종명}
```
LOAD DATA LOCAL INFILE '~/stock_data/category/category_list.csv'
INTO TABLE tb_category_list
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```
4. 업종별 종목
{업종코드 : 종목코드}
```
LOAD DATA LOCAL INFILE '~/stock_data/category/stock_by_category_on_code.csv'
INTO TABLE tb_stock_category
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```
5. 업종별 등락률
{업종코드 : 등락률}
```
LOAD DATA LOCAL INFILE '~/stock_data/fr_category/fall_rate_by_category_20190709.csv'
INTO TABLE tb_fr_category_20190709
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/stock_data/fr_category/fall_rate_by_category_20190710.csv'
INTO TABLE tb_fr_category_20190710
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/stock_data/fr_category/fall_rate_by_category_20190711.csv'
INTO TABLE tb_fr_category_20190711
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/stock_data/fr_category/fall_rate_by_category_20190712.csv'
INTO TABLE tb_fr_category_20190712
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/stock_data/fr_category/fall_rate_by_category_20190715.csv'
INTO TABLE tb_fr_category_20190715
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```
