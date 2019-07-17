typedef pair <string, string> pair_str;
typedef vector <pair_str> vector_pair_str;
typedef vector <string> vector_str;
typedef map <string, string> map_str;

const uint TEST_NUM = 5;
const string UNDEFINED = "undefined";
const string UNDEFINED_TAG="u";//convert.hpp
const uint UNDEFINED_MAX_COUNT = 5;//convert.hpp
//file
const string STOCK_BY_CATEGORY_ON_CODE = "stock_by_category_on_name.csv";
const string STOCK_BY_CATEGORY_ON_NAME = "stock_by_category_on_code.csv";
const string CATEGORY_LIST = "category_list.csv";
const string STOCK_LIST = "stock_list.csv";
vector_str FALLRATE_FILES_BY_CATE= {
                        "fall_rate_by_category_20190709.csv",
                        "fall_rate_by_category_20190710.csv",
                        "fall_rate_by_category_20190711.csv",
                        "fall_rate_by_category_20190712.csv",
                        "fall_rate_by_category_20190715.csv"
                        };
vector_str FALLRATE_FILES_BY_STOCK= {
                        "20190709_00095.csv",
                        "20190710_00096.csv",
                        "20190711_00097.csv",
                        "20190712_00098.csv",
                        "20190715_00099.csv"
                        };
//path
const string STOCK_PATH ="/home/uki408/Downloads/Telegram Desktop/stock/";
const string CATEGORY_PATH ="/home/uki408/Downloads/Telegram Desktop/category/";
const string FR_CATEGORY_PATH = "/home/uki408/Downloads/Telegram Desktop/fr_category/";
