#include <iostream>
#include <fstream>
#include <vector>
#include <cstring>
#include <map>
using namespace std;

//variables
const string CATEGORY_STOCK_PATH = "/home/uki408/Downloads/Telegram Desktop/category/category_stock.csv";
const string CATEGORY_LIST_PATH = "/home/uki408/Downloads/Telegram Desktop/category/category_list.csv";
const string STOCK_LIST_PATH = "/home/uki408/Downloads/Telegram Desktop/stock_list/stock_list.csv";
const string STOCKS_BY_CATEGORY_PATH = "/home/uki408/Downloads/Telegram Desktop/stock_by_category.csv";
const string UNDEFINED_TAG="u";
const uint UNDEFINED_MAX_COUNT = 5;
//method
string numberingStockCode();
pair <string, string > explitStrPair(string _input);
void convertNameToCode(vector < string >& _input, vector < string >& _output, string _file);

int main()
{
    vector < pair <string, string > > input_str;
    //주식 종목에 업종 코드 부여하기
    ifstream in_put(CATEGORY_STOCK_PATH);
    if (in_put.fail())
    {
        cout << " >> no category.csv" << endl;
        return -1;
    }
    //part1. category_stock'업종명(category_name) || category_stock'종목명(stock_name) 분리(separate)
    while (!in_put.eof())
    {
        string str;
        getline(in_put, str);
        input_str.push_back(explitStrPair(str));

    }
    in_put.close();

    //part2. category_stock'업종명 -> 업종코드
    vector <string> category_name, category_code;
    for (uint i = 0; i < input_str.size(); ++i) category_name.push_back(input_str[i].first);
    convertNameToCode(category_name, category_code, CATEGORY_LIST_PATH);

    //part3. category_stock'종목명 -> 종목코드
    vector < string > stock_name, stock_code;
    for (uint i = 0; i < input_str.size(); ++i) stock_name.push_back(input_str[i].second);
    convertNameToCode(stock_name, stock_code, STOCK_LIST_PATH);

    // cout << category_code.size() << ", " << stock_code.size() << endl;
    //part4. completion {category_name || stock_name} convert to { category_code || stock_code }
    ofstream res_output(STOCKS_BY_CATEGORY_PATH);
    for (uint i = 0; input_str.size() - 1; ++i) {
        res_output << category_code[i] << "," << stock_code[i]  << endl;
    }
    res_output.close();
    return 0;
}
//컬럼 분류
pair <string, string> explitStrPair(string _input)
{
    string l, r;
    uint start = 0;
    uint end = _input.find(",");
    l = _input.substr(start, end);
    r = _input.substr(end + 1, _input.size() - 1);
    return make_pair(l, r);
}
//이름(normal name) match to 고유 코드(unique code)
void convertNameToCode(vector <string>&_input, vector <string>&_output, string _file)
{
    ifstream ifs(_file);
    if (ifs.fail()) {
        cout << ">> convert function failed; no such file";
        return;
    }
    string str;
    map <string, string> code_map;
    //read file
    while (!ifs.eof()) {
        getline(ifs, str);
        pair <string, string> unit = explitStrPair(str);
        code_map.insert(make_pair(unit.second, unit.first));
    }
    //convert
    for (vector < string >::iterator it = _input.begin();
      it != _input.end(); ++it)
      {
          if (code_map.find(*it) != code_map.end()) {
              // cout << *it << ", " << code_map[*it] << endl;
              _output.push_back(code_map[*it]);
              // cout << "name : " << *it << " to_" << code_map[*it] << endl;
          } else {
              try {
                  string numbering_tag = numberingStockCode();
                  _output.push_back(numbering_tag);
              } catch (string e) {
                  cout << " >> (err) numberingStockcode function error; no space. Increase the UNDEFINED_MAX_COUNT variables\n";
              }
          }
      }
}
//numbering undefined stock_name
string numberingStockCode()
{
    /*
      undefined stock code : u + 0 0 0 0 0
    */
    static uint numbering = 1;
    static uint divider = 10;
    static int digit = UNDEFINED_MAX_COUNT - 1;
    //exception
    if (digit < 0) {
        throw (" >> (err) numberingStockcode function error; no space. Increase the UNDEFINED_MAX_COUNT variables\n");
    }
    //set blank digit with zero
    string number_tag = to_string(numbering++), digit_tag;
    for (uint i = 0; i < digit; ++i) {digit_tag += "0";}
    //reconfigure numbering
    if (numbering / divider > 0) {
        digit--;
        divider *= 10;
    }
    return (UNDEFINED_TAG + digit_tag + number_tag);
}
