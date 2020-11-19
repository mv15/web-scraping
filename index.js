 var req = require("request-promise");
 var cheerio = require("cheerio");
 var fs = require("fs");
 var json2csv = require("json2csv").Parser;

    // page which i want to scrape
    const wiki = "https://en.wikipedia.org/wiki/List_of_largest_companies_by_revenue";

    (async () => {
        const response = await req({
            uri: wiki,
            headers: {
                accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true,
        }).then(function (html) {
            let $ = cheerio.load(html);
            let data = [];
            let data2 = [];
            let name, rank, cols, col;
            let rows = $('table.wikitable tbody tr').each((idx, elem) => {
                rank =$(elem).find('th').text().replace(/[\n\r]+/g,'');
                //name = $(elem).find('td a').html();
                data2 = [];
                cols = $(elem).find('td').each((colidx, colelem) => {
                    col = $(colelem).text().replace(/[\n\r]+/g,'');
                    data2.push(col,);    
                });

                data.push({
                    rank,
                    ...data2,
                });
            });

            // exporting to csv
            const j2cp = new json2csv()
            const csv = j2cp.parse(data);

            fs.writeFileSync("./companies.csv", csv, "utf-8");
        }).catch(function (err) {
            console.log(err);
        });

    }
    )();
