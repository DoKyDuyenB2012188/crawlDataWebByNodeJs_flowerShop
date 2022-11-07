const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
// load tung doi tuong
// chuDe
 const {hoaTotNghiep, occasion_totnghiep} = require('./chuDe/hoaTotNghiep');
// const {hoaTinhYeu, occasion_tinhyeu} = require('./chuDe/hoaTinhYeu');
// const {hoaSinhNhat, occasion_sinhnhat} = require('./chuDe/hoaSinhNhat');
// const {hoaKhaiTruong, occasion_khaitruong} = require('./chuDe/hoaKhaiTruong');
// const {hoaChucSucKhoe, occasion_suckhoe} = require('./chuDe/hoaChucSucKhoe');
// const {hoaChucMung, occasion_chucmung} = require('./chuDe/hoaChucMung');
// const {hoaChiaBuon, occasion_chiabuon} = require('./chuDe/hoaChiaBuon');
// const {hoaCamOn, occasion_camon} = require('./chuDe/hoaCamOn');
// doiTuong
// const {hoaTangBanBe, object_banbe} = require("./doiTuong/hoaTangBanBe");
// const {hoaTangChoNam, object_nam} = require("./doiTuong/hoaTangChoNam");
// const {hoaTangChoNu, object_nu} = require("./doiTuong/hoaTangChoNu");
// const {hoaTangChong, object_chong} = require("./doiTuong/hoaTangChong");
// const {hoaTangDongNghiep, object_dongnghiep} = require("./doiTuong/hoaTangDongNghiep");
// const {hoaTangMe, object_me} = require("./doiTuong/hoaTangMe");
// const {hoaTangNguoiYeu, object_nguoiyeu} = require("./doiTuong/hoaTangNguoiYeu");
// const {hoaTangXep, object_sep} = require("./doiTuong/hoaTangSep");
// const {hoaTangTreEm, object_treem} = require("./doiTuong/hoaTangTreEm");
// const {hoaTangVo, object_vo} = require("./doiTuong/hoaTangVo");
//kieuDang
// const {boHoaTuoi, style_bo} = require("./kieuDang/boHoaTuoi");
// const {chauLanHoDiep, style_chaulan} = require("./kieuDang/chauLanHoDiep");
// const {gioHoa, style_giohoa} = require("./kieuDang/gioHoa");
// const {hoaBinh, style_hoabinh} = require("./kieuDang/hoaBinh");
// const {hoaThaBinh, style_thabinh} = require("./kieuDang/hoaThaBinh");
// const {hopHoa, style_hop} = require("./kieuDang/hopHoa");
// const {langHoaChiaBuon, style_langHCB} = require("./kieuDang/langHoaChiaBuon");
// const {langHoaChucMung, style_langCM} = require("./kieuDang/langHoaChucMung");
// mauSac
// const {cam, color_cam} = require("./mauSac/cam");
// const {red, color_red} = require("./mauSac/do");
// const {hong, color_hong} = require("./mauSac/hong");
// const {mix, color_mix} = require("./mauSac/mauHonHop");
// const {tim, color_tim} = require("./mauSac/tim");
// const {trang, color_trang} = require("./mauSac/trang");
// const {vang, color_vang} = require("./mauSac/vang");
// const {xanh, color_xanh} = require("./mauSac/xanhLaVaXanhDuong");
try {
    let $ = cheerio.load(hoaTotNghiep); // thay cho nay
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
            let occasion = occasion_totnghiep; // doi cho nay neu co con khong de []
            let object = []; // doi cho nay neu co con khong de []
            let style = []; // doi cho nay neu co con khong de []
            let color = []; // doi cho nay neu co con khong de []
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
                    item.occasion.push(...occasion);
                    item.object.push(...object);
                    item.style.push(...style);
                    item.color.push(...color);
                    check_id = false;
                    check_id = false;
                }
            })

            if(check_id){
                let obj = {
                    id: id,
                    nameCard: name,
                    imageURL: imageURL,
                    newprice: newprice,
                    oldprice: oldprice,
                    newitem: newitem,
                    isale: issale,
                    occasion: occasion,
                    object: object,
                    style: style,
                    color: color,
                    detail: {
                        name_title: name_title,
                        old_price: old_price,
                        price: price,
                        descriptions: descriptions,
                        intro: intro
                    },
                };
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
