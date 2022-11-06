const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const {hoaTotNghiep} = require('./hoaTotNghiep');
const {hoaTinhYeu} = require('./hoaTinhYeu');
const {hoaSinhNhat} = require('./hoaSinhNhat');
const {hoaKhaiTruong} = require('./hoaKhaiTruong');
const {hoaChucSucKhoe} = require('./hoaChucSucKhoe');
const {hoaChucMung} = require('./hoaChucMung');
const {hoaChiaBuon} = require('./hoaChiaBuon');
const {hoaCamOn} = require('./hoaCamOn');
try {
    let $ = cheerio.load(hoaChiaBuon);
    let arr = null;
    fs.readFile('data.json', 'utf8', function(err, data){
        arr = JSON.parse(data);
    });
    const items = $('.item');
    
    for(i=0; i< items.length; i++){
        let item = $(items[i]);
        let newprice = "";
        let oldprice = "";
        let newitem = false;
        let issale = false;
        let url = item.find('.i > a').attr('href');
        let imageURL = item.find('.i > a > img').attr('src');
        let id = imageURL.split('/')[4].split('.')[0];
        // console.log(imageURL);
        // xử lý phần thông tin
        const name = item.find('.t > a').text().trim();
        if(item.find('.t').find('span').find('em').length == 0){
            newprice = item.find('.t').find('span').text().trim();
        }
        else{
            oldprice = $(item.find('.t').find('span').find('em')[0]).text().trim();
            newprice = $(item.find('.t').find('span').find('em')[1]).text().trim();
        }
        if(item.find('.inew') > 0){
            newitem = true;
        }
        if(item.find('.isale') > 0){
            issale = true;
        }
        const URL = "https://hoayeuthuong.com/"+url; // đường dẫn detail item
        request(URL, function (err, res, body){
            $ = cheerio.load(body);
            let r_item = $('.r_item');
            let tags = [];
            let tag = "Hoa chia buồn"; // với mỗi loại hoa thì thay tag cho đúng
            tags.push(tag);
            let name_title = r_item.find('.r_item > h2').text().split('\n')[1];
            let old_price = r_item.find('.single-price > .old-price').text();
            let  price = r_item.find('.single-price > .price').text();
            let des = r_item.find('.material > li');
            let intro = "";
            if(r_item.find('.pd_summary').length > 0){
                intro = r_item.find('.pd_summary').text();
            }
            let descriptions = [];
            for(i=0; i< des.length ; i++){
                descriptions.push($(des[i]).text());
            }
            let check_id = true; // kiểm tra id đã tồn tại hay chưa
            arr.forEach((item) => {
                if(item.id == id){
                    item.tags.push(tag);
                    check_id = false;
                }
            })
            let obj = {
                id: id,
                nameCard: name,
                imageURL: imageURL,
                newprice: newprice,
                oldprice: oldprice,
                newitem: newitem,
                isale: issale,
                intro: intro,
                detail: {
                    name_title: name_title,
                    old_price: old_price,
                    price: price,
                    descriptions: descriptions
                },
                tags: tags
            };
            if(check_id){
                arr.push(obj);
            }
            fs.writeFile('data.json', JSON.stringify(arr), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                }
            });
        })

     }
} catch (error) {
    console.log(error);
}
