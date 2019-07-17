#include <iostream>

using namespace std;
typedef pair <string, string> pair_str;
typedef vector <pair_str> vector_pair_str;
typedef vector <string> vector_str;

pair <string, string> explitStrPair(string _input)
{
    string l, r;
    uint start = 0;
    uint end = _input.find(",");
    l = _input.substr(start, end);
    r = _input.substr(end + 1, _input.size() - 1);
    return make_pair(l, r);
}
