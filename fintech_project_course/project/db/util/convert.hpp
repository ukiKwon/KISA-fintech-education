string numberingStockCode();
void convertNameToCode(vector_str& _src, string _code_file, bool _generate_code);

//convert name to code by code_map
void convertNameToCode(vector_str& _src, string _code_file, bool _generate_code)
{
      //read code_map
      ifstream ifs_code(_code_file);
      if (ifs_code.fail()) {
          cout << "no file :" + _code_file << endl;
          return ;
      }
      string str;
      map_str code_map;
      while (!ifs_code.eof())
      {
          getline(ifs_code, str);
          pair_str s= explitStrPair(str);
          code_map.insert(make_pair(s.second, s.first));
      }
      ifs_code.close();

      for (vector_str::iterator it = _src.begin();
      it != _src.end(); ++it) {
          if (code_map.find(*it) != code_map.end()) { //found
              *it = code_map[*it];
          } else {
              string numbering_tag = _generate_code? numberingStockCode() : UNDEFINED;
              *it = numbering_tag;
          }
      }
}
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
