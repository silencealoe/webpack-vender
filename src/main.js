//入口的js文件
import './css/index.scss'

var img = document.querySelectorAll('.drink-img-src');
var drinkname = document.querySelectorAll('.drink-name')
var drinkprice = document.querySelectorAll('.drink-price')
var drinknums = document.querySelectorAll('.drink-nums')
var drinkbtn = document.querySelectorAll('.clickBtn')
var selectnone = document.querySelector('.selectnone')
var selectcontent = document.querySelector('.selectcontent')
var inc = document.querySelector('#inc');
var dec = document.querySelector('#dec');
var aliWx = document.querySelector('#ali-wx');
var alertmask = document.querySelector('.alert-mask')
var selectname = document.querySelector('.selectname');
var selectprice = document.querySelector('.selectprice');
var alertcontent = document.querySelector('.alert-content')
var codeimg = document.querySelector('.paycode')
var payimg = document.querySelector('.payimg');
var cashpay = document.querySelector('.cash');
var paycashblock = document.querySelector('.paycashblock')

var selectnums = document.querySelector('#num');

var wx = document.querySelector('.wechat');
var ali = document.querySelector('.alipay');
var buying = document.querySelector('.buying')
var beforebuy = document.querySelector('.before-buy')
var allprice = document.querySelector('.allprice')

var totalmoney = document.querySelector('#totalmoney');
var givechange = document.querySelector('#givechange');

var paybtnlist = document.querySelector('.paybtnlist');
var waiting = document.querySelector('.waiting');

var drinks = [{ //存放商品信息
    name: '茶π',
    price: 5,
    path: 1,
}, {
    name: '可乐',
    price: 15,
    path: 2,
}, {
    name: '旺仔牛奶',
    price: 10,
    path: 0,
}, {
    name: '红牛',
    price: 12,
    path: 4,
}, {
    name: '柠檬茶',
    price: 6,
    path: 5,
}, {
    name: '小茗同学',
    price: 8,
    path: 3,
}]
var len = drinks.length;
var newarr = []; //随机生成位置的数组

var all = 0; //点击价格的总价

var waitID=null;
function randomDrink() { //在数组的长度之内随机显示六个数
    var index = Math.floor(Math.random() * len);
    if (newarr.indexOf(index) === -1) {
        newarr.push(index)
        if (newarr.length === len) {
            return;
        }
        randomDrink()
    } else {
        randomDrink()
    }
}
randomDrink()
console.log(newarr)
var copyarr = newarr.slice(); //复制一个数组
var numsarr = []; //随机剩余数量
console.log('copy', copyarr)

function createVender() { //根据随机出来的数组，找到存放信息数组中对应的商品信息，放到页面上
    console.log(img.length)
    for (let i = 0; i < newarr.length; i++) {
        console.log(i)
        console.log(drinks[newarr[i]])
        var nums = Math.floor(Math.random() * 4); //随机一个数，作为商品剩余数量
        img[i].src = require(`./images/${drinks[newarr[i]].path}.jpg`) //引入路径使用require()
        drinkname[i].innerHTML = drinks[newarr[i]].name
        drinkprice[i].innerHTML = drinks[newarr[i]].price
        console.log('rnums---------', nums);
        numsarr.push(nums);
        if (nums === 0) { //如果商品剩余为0,则显示售罄
            drinknums[i].innerHTML = nums;
            drinkbtn[i].innerHTML = '已售罄'
            drinkbtn[i].classList.remove('buy-it');
            drinkbtn[i].classList.add('sell-out');
            copyarr[i] = -1; //将已售罄的商品，在复制的数组中赋值为-1
            numsarr.pop(); //随机剩余为0，pop出数组
        } else {
            drinknums[i].innerHTML = nums;

            drinkbtn[i].classList.remove('sell-out');
            drinkbtn[i].classList.add('buy-it');
        }
    }
    console.log('随机剩余', numsarr)
    delArrVal(copyarr, -1); //删除复制的数组中值为-1的数，剩下的数则为未售罄的商品
    console.log('可以购买的', copyarr)
    var buyit = document.querySelectorAll('.buy-it')


    for (let i = 0; i < buyit.length; i++) {

        buyit[i].onclick = function () {
            let that = this;
            console.log('iii', this.parentNode.children[2].children[0])
            initpaycash(); //初始化支付页面
            //点击购买后，所有商品选择数量初始为1
            payimg.style.display='none'
            startBuy('none', 'block')
            console.log('click', copyarr[i])
            selectname.innerHTML = drinks[copyarr[i]].name; //取出复制的数组中的值，找到对应商品信息数组中的值
            selectprice.innerHTML = drinks[copyarr[i]].price;
            allprice.innerHTML = drinks[copyarr[i]].price;

            var selectdigital = document.querySelector('#num').innerHTML;
            var clicknum = parseInt(selectdigital);
            var select_index = copyarr[i]; //做出点击的对应的商品，方便计算价格
            inc.onclick = function () { //点击添加

                console.log('剩余', numsarr[i])
                var olddigital = numsarr[i];
                console.log('old', olddigital)
                console.log('clicknum', clicknum)
                if (clicknum === olddigital) { //如果点击的数量与商品剩余数量相等，显示商品库存不足
                    displayAlert('该商品库存不足')
                    return;
                }
                clicknum++;

                getSumPrice(select_index, clicknum) //计算点击数量的总价
            }
            dec.onclick = function () {
                console.log('dec')
                if (clicknum < 2) {
                    displayAlert('至少选择一个')
                    return;
                }
                clicknum--;
                getSumPrice(select_index, clicknum)
            }
            

    
            paybtnlist.onclick = function (e) { //价格按钮点击
                console.log('wait',waitID)
                if (waitID) {
                    clearTimeout(waitID)
                }
                console.log(typeof e.target.children[0])

                all += parseInt(e.target.children[0].innerHTML); //点击的总价格
                totalmoney.innerHTML = all;
                let allpri = parseInt(allprice.innerHTML); //商品需付价格
                console.log(allpri)
                let content = '你支付的钱不够'
                if (all < allpri) { //如果点击的价格小于商品需要支付价格，显示提示
                    displayAlert(content);
                    waitID = null;
                    return;
                }
                let change = all > allpri ? all - allpri : 0 //计算找零
                givechange.innerHTML = change;
              
                waitID = setTimeout(() => { //2s后显示，正在出货
                    console.log('第一个time')
                    waiting.style.display = 'block'
                    waiting.innerHTML = '正在出货，请稍等。。。'
                    paybtnlist.onclick = null;
                    
                    
                    setTimeout(() => { //4s后显示完成
                        console.log('第2个time')
                        waiting.innerHTML = '出货完成，请拿走'
                        numsarr[i] -= clicknum;
                        if (numsarr[i] === 0) {
                            that.classList.remove('buy-it');
                            that.classList.add('sell-out');
                            that.innerHTML = '已售罄'
                            that.onclick = function () {
                                displayAlert('该商品已售罄')
                            }
    
    
                        }
                        clearTimeout(waitID)
                        console.log('THAT', that.parentNode.children[2].children[1])
                        that.parentNode.children[2].children[1].innerHTML = numsarr[i];
    
                    }, 3000)

                    setTimeout(() => {
                        initpaycash()

                        startBuy('block', 'none')
                        clearTimeout(waitID);
                    }, 6000)

                   
                }, 4000);
     
              
            }

        }
    }
    var sellout = document.querySelectorAll('.sell-out')
    for (let i = 0; i < sellout.length; i++) {
        sellout[i].onclick = function () { //点击售罄
            displayAlert('该商品已售罄')

        }
    }

}
console.log('nums', drinknums[1].innerHTML)
createVender()

function displayAlert(content) { //显示提示框
    alertmask.style.display = "block"
    alertcontent.innerHTML = content
    console.log('-----', alertmask.style.display)
    setTimeout(function () {
        alertmask.style.display = 'none'
    }, 1000)
}
wx.onclick = function () { //微信支付
    displayCode('wexinpay', '微信', payimg)
}
ali.onclick = function () { //支付宝支付
    displayCode('zhifubao', '支付宝', payimg)
}
cashpay.onclick = function () {
    displayCode('', '现金', paycashblock)
}

function displayCode(code, codename, payway) { //显示二维码
    buying.style.display = 'block';
    payway.style.display = 'block';
    beforebuy.style.display = 'none'
    if (code !== '') {
        codeimg.src = require(`./images/${code}.jpg`)
    }
    if (code === 'zhifubao' || code === 'wexinpay') {
        payimg.style.display='block'
        paycashblock.style.display = "none"
    }
    aliWx.innerHTML = codename
}

function delArrVal(arr, val) { //查找数组中对应的值并删除
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1)
            i--;
        }
    }
    return arr;
}

function getSumPrice(index, nums) {
    var sum = 0;
    selectnums.innerHTML = nums;
    sum = nums * drinks[index].price //计算总价格
    selectprice.innerHTML = sum;
    allprice.innerHTML = sum;
}

function initpaycash() { //初始化支付页面
    waiting.style.display = ''
    givechange.innerHTML = '0';
    totalmoney.innerHTML = '0';
    // waitID = null;
    all = 0;
}

function startBuy(show1, show2) {
    selectnums.innerHTML = '1';
    show1 === 'none' ? buying.style.display = show1 : buying.style.display = show2
    show2 === 'block' ? beforebuy.style.display = show2 : beforebuy.style.display = show1
    selectcontent.style.display = show2;

    selectnone.style.display = show1;
}