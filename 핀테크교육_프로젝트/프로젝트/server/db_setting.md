#update : 2019. 07. 16
#DB configuration  
  - aws 세팅
  - database : KISEMBLE
    pwd : kisemble

#Table 세팅
>> 테이블 Ref

>> 테이블 단축 (등락률)

CREATE TABLE tb_summary_20190709_00095 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_daybefore FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE tb_summary_20190710_00096 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_daybefore FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE tb_summary_20190711_00097 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_daybefore FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE tb_summary_20190712_00098 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_daybefore FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE tb_summary_20190715_00099 (
    stock_code CHAR(6),
    prior_index SMALLINT,
    stock_daybefore FLOAT DEFAULT '0',
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

>> tb_20190709_00095

CREATE TABLE tb_20190709_00095 (
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

#주식데이터
#Range_partitioning
#Data 건수
(1) 샘플식 예제
6(총 장시간) x 6(10분주기) x 2000(종목수) = 72,000 * 30 (한달) = 216,000
: 한 파티션에 21만 건 * 12(월) = 252만 건

(2) 전체 예제
6(총 장시간) x 3600(1초주기) x 2000(종목수) = 43,200,000 * 30 (한달) = 1,296,000,000
: 한 파티션에 12억 건 * 12(월) = 144억 건

(3) 과거 데이터는 미리 계산해두고 테이블(통계 데이터)에 별도로 저장해둘 것.

#기능
//데이터 주기 10분
(1) 종목에 따른 관련 정보 업로드
(2) 업종에 따른 관련 종목 업로드(https://finance.naver.com/sise/sise_group_detail.nhn?type=upjong&no=136)

#전체 테이블 확인
  >> desc tb_stock_list;desc tb_stock_category;desc tb_today_stock_info_by_category;
    desc tb_exday_stock_info;desc tb_today_stock_info;

#테이블
(1) 이름표 값들; 총 2000개 = 한번에 해도 무리없음.
{종목 코드 : 업종 코드 : 종목 이름}

```
CREATE TABLE tb_stock_list (
    stock_code CHAR(6),
    stock_name VARCHAR(30),
    PRIMARY KEY(stock_code)
);
```

```
CREATE TABLE tb_stock_category (
    stock_category CHAR(6),
    stock_code CHAR(6),
    PRIMARY KEY(stock_category),
    FOREIGN KEY(stock_code) REFERENCES tb_stock_list(stock_code)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```
ALTER DATABASE KISEMBLE DEFAULT CHARACTER SET utf8;

(2) 현재 업종별 정보(통계데이터) -> 10분 간격으로 < 크롤링 & 업데이트 >  
{종목: 전일비 : 등락률}
```
CREATE TABLE tb_today_stock_info_by_category (
  stock_category CHAR(6),
  stock_code CHAR(6),
  stock_daybefore INTEGER DEFAULT '0',
  stock_falling_rate INTEGER DEFAULT '0',
  FOREIGN KEY(stock_category) REFERENCES tb_stock_category(stock_category)
  ON DELETE CASCADECURDATE()
  ON UPDATE CASCADE
  );  
```

(3) 전체 종목별 정보  
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
#샘플 데이터 삽입(0708 ~ 0712)
```
LOAD DATA LOCAL INFILE '~/stock_data/stock_list.csv'
INTO TABLE tb_stock_list
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```
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
#샘플 데이터 확인
SELECT stock_code as '코드', stock_name as '이름', price_highest as '고가', foreigner_hold_stocks as '외국보유수' FROM tb_20190709_00095;

#1차 과제
(1) 기본 종목 정보 : excel -> insert 코드 짤 것
INSERT INTO tb_stock_info (stock_code, stock_category, stock_name) VALUE ();
(2) 업종별 일부 정보 : 네이버 주식 크롤링 -> 10분 주기 update 코드 .sh(데몬 서비스) 짤 것
UPDATE tb_stock_by_category WHERE stock_category='$var_stock_category'
