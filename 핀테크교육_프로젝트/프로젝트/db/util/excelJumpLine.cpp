#include <fstream>
#include <vector>
#include <cstring>
#include "stringUtil.hpp"

//var
const uint TEST_NUM = 5;
const string IN_PATH ="/home/uki408/Downloads/Telegram Desktop/fr_category/";
const string OUT_PATH ="/home/uki408/Downloads/Telegram Desktop/fr_category/";
vector_str IN_FILE_LIST = {
                        "fr_category_20190709.csv",
                        "fr_category_20190710.csv",
                        "fr_category_20190711.csv",
                        "fr_category_20190712.csv",
                        "fr_category_20190715.csv"
                        };
vector_str OUT_FILE_LIST= {
                        "fall_rate_by_category_20190709.csv",
                        "fall_rate_by_category_20190710.csv",
                        "fall_rate_by_category_20190711.csv",
                        "fall_rate_by_category_20190712.csv",
                        "fall_rate_by_category_20190715.csv"
                        };
//func
int main()
{
    for (uint i = 0; i < TEST_NUM; ++i)
    {
        ifstream ifs(IN_PATH + IN_FILE_LIST[i]);
        //read file
        if (ifs.fail()) {
            cout << " >> file read failed;" + IN_FILE_LIST[i] << " doesn't exist." << endl;
            return -1;
        }
        string str;
        vector_pair_str file_input;
        while (!ifs.eof()) {
            getline(ifs, str);
            pair_str s = explitStrPair(str);
            if (!s.first.empty() && !s.second.empty())
              file_input.push_back(s);
        }
        ifs.close();
        //write file
        ofstream ofs(OUT_PATH + OUT_FILE_LIST[i]);
        for (uint i = 0; i < file_input.size(); ++i) {
            ofs << file_input[i].first << "," << file_input[i].second << endl;
        }
        ofs.close();
    }
    return 0;
}
