#include <iostream>
#include <algorithm>
#include <fstream>
#include <vector>
#include <cstring>
using namespace std;


int main()
{
    vector < pair <string, string > > input_str;
    //주식 종목에 업종 코드 부여하기
    ifstream in_put1("/home/uki408/Downloads/Telegram Desktop/category/category_stock.csv");
    ifstream in_put2("/home/uki408/Downloads/Telegram Desktop/category/category_list.csv");
    ifstream in_put3("/home/uki408/Downloads/Telegram Desktop/stock_list/stock_list.csv");
    if (in_put1.fail())
    {
        cout << " >> no category.csv" << endl;
        return -1;
    }
    while (!in_put1.eof())
    {
        string str, l, r;
        in_put1 >> str;

        uint start = 0;
        uint end = str.find(",");
        l = str.substr(start, end);
        r = str.substr(end + 1, str.size() - 1);
        input_str.push_back(make_pair(l, r));
        cout << " >> l : " << l << ", r : " << r << endl;
    }
    return 0;
}
