const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get("https://finance.naver.com/sise/sise_group.nhn?type=upjong");//"https://www.yna.co.kr/sports/all");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    const $bodyList = $("table.type_1").children("tr");
    console.log($bodyList);
    let ulList = [];
    $bodyList.each(function(i, elem) {
        if (i > 2){
        ulList[i] = {
              title : $(this).find('td a').text(),
              daybefore : $(this).find('t   d.number span.tah').text(),
              grows : $(this).find('td.tc span.graph_txt').text()
              // title: $(this).find('strong.news-tl a').text(),
              // url: $(this).find('strong.news-tl a').attr('href'),
              // image_url: $(this).find('p.poto a img').attr('src'),
              // image_alt: $(this).find('p.poto a img').attr('alt'),
              // summary: $(this).find('p.lead').text().slice(0, -11),
              // date: $(this).find('span.p-time').text()
              };
        }
    });
    const data = ulList.filter(n => n.title);
    return data;
  })
  .then(res => log(res));
