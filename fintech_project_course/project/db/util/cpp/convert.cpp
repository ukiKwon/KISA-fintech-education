#include <iostream>
#include <iostream>
#include <fstream>
#include <vector>
#include <map>
using namespace std;
#include "config.hpp"
#include "stringUtil.hpp"
#include "convert.hpp"

int main()
{
    cout << "####### File category_name conveting to category_code....\n\n";
    //convert
    for (uint i = 0; i < TEST_NUM; ++i) {
        string _file = FR_CATEGORY_PATH + FALLRATE_FILES_BY_CATE[i];
        cout << " >> file : " <<  _file << endl;
        ifstream ifs(_file);
        if (ifs.fail()) {
            cout <<" >> no file "<< endl;
            return -1;
        }
        //read file
        string str;
        vector_str target_left, target_right;
        vector_pair_str in_put;
        while (!ifs.eof()) {
            getline(ifs, str);
            pair_str s = explitStrPair(str);
            target_left.push_back(s.first);
            target_right.push_back(s.second);
        }
        convertNameToCode(target_left, CATEGORY_PATH + CATEGORY_LIST, false);
        //write-file
        ofstream ofs(CATEGORY_PATH + FALLRATE_FILES_BY_CATE[i]);
        for (uint i = 0; i < target_left.size(); ++i) {
            ofs << target_left[i] << "," << target_right[i] << endl;
        }
        ofs.close();
    }
    cout << "\n.....end #################" << endl;
    return 0;
}
