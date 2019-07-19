#include <iostream>
#include <fstream>
#include <vector>
#include <cstring>
#include <sstream>
#include <algorithm>
#include <clocale>

using namespace std;

vector <string> category;
int main()
{
	setlocale(LC_ALL, "");
	ifstream in_put("/home/uki408/Downloads/Telegram Desktop/category/category_stock.csv");
	if (in_put.fail())
	{
		cout << "no file" << endl;
		return -1;
	}
	string str;
	//read
	while (!in_put.eof())
	{
		in_put >> str;
		category.push_back(str);
	}
	sort(category.begin(), category.end());
	category.erase(unique(category.begin(), category.end()), category.end());
	//ouput
	ofstream out_put("./category_list.md");
	unsigned char i = 0;
	for (uint index = 0; index < category.size(); ++index)
	{
			out_put <<  category[index] << endl;
	}
	return 0;
}
