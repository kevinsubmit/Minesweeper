function $(s, t) {
  if (t == "l") {
    return document.querySelectorAll(s);
  } else {
    return document.querySelector(s);
  }
}
var qipan = $(".qipan"),
  box = $(".box"),
  level = $(".level"),
  leftMines = $(".leftMines"),
  start = $(".start"),
  restart = $(".restart"),
  passTime = $(".passTime");
var row = 10, // 行数
  col = 10, // 列数
  leiNum = 10, // 雷数
  restNum = 10, //剩余的雷数
  flag = false, // 格子是否可以被点击
  time, //计时器的名字
  count = 0, // 计时的秒数
  leiList = [], // 用来存放地雷坐标的数组
  sum = col * row, // 棋盘所有格子的总数
  openGz = 0, // 已经点开的格子的数量
  color = [
    "rgba(0,0,255,.6)",
    "rgba(0,255,0,.6)",
    "red",
    "blue",
    "yellow",
    "pink",
    "auqa",
    "black",
  ];
// window.oncontextmenu = function (e) {
//   e.preventDefault();
//   if (!flag) {
//     alert("请先点开始！");
//     return;
//   }
//   if (e.target.isOpen) {
//     alert("这个格子已经翻过了，换个格子标记");
//     return;
//   }
//   if (e.target.localName == "li") {
//     if (e.target.isMark) {
//       e.target.isMark = false;
//       e.target.innerHTML = "";
//       restNum++;
//     } else {
//       e.target.isMark = true;
//       e.target.innerHTML = "▲";
//       e.target.style.color = "red";
//       restNum--;
//     }
//     leftMines.innerHTML = restNum;
//   }
// };
start.onclick = function () {
  //点击开始游戏
  flag = true; // 棋盘可以被点击
  if (time > 0) {
    // 判断开始键是否已经被点过,防止重复点击
    alert("游戏已经开始了,不要再点开始了");
    return;
  }
  countTime(); //开始计时
};
restart.onclick = function () {
  //点击开始游戏
  flag = false; // flag置为false，棋盘格子变成不可点击状态
  createQp(); // 画棋盘
};

box.onclick = function (e) {
  //点击棋盘的格子
  var t = e.target;
  if (t.localName == "li") {
    // 只有当点击的格子是li的时候才会继续往下判断
    if (!flag) {
      // 如果当前不允许点击，提示先点开始
      alert("请先点开始！");
      return;
    }
    var x = t.dataset.x - 0,
      y = t.dataset.y - 0;
    // console.log(x,y);
    if (t.isOpen) {
      alert("这个格子已经翻过了，换个格子翻");
      return;
    }
    if (t.isMark) {
      alert("这个格子已经标记了，换个格子翻");
      return;
    }
    if (isInArray(x, y, leiList) != -1) {
      flag = false;
      clearInterval(time);
      count = 0;
      passTime.innerHTML = count;
      boom();
      alert("你输了");
    } else {
      testLei(x, y);
      if (leiNum == sum - openGz) {
        flag = false;
        boom();
        clearInterval(time);
        alert("你赢了");
      }
    }
  }
};

level.onchange = function () {
  var v = this.value; //获取改变后的level
  if (v == 1) {
    //改变棋盘规格及雷的数量
    row = 10;
    col = 10;
    leiNum = 10;
  } else if (v == 2) {
    row = 16;
    col = 16;
    leiNum = 40;
  } else if (v == 3) {
    row = 16;
    col = 30;
    leiNum = 99;
  }
  createQp(); // 重新画棋盘
};

function createQp() {
  // 创建棋盘
  var str = "";
  for (var i = 0; i < row; i++) {
    // 行数
    str += '<ul class="row">';
    for (var j = 0; j < col; j++) {
      // 列数
      str += '<li class="col" data-x="' + i + '" data-y="' + j + '"></li>';
    }
    str += "</ul>";
  }
  box.style.width = col * 30 + "px"; //修改box的宽度
  box.style.height = row * 30 + 50 + "px"; // 修改box的高度
  leftMines.innerHTML = leiNum; // 修改剩余雷数
  qipan.innerHTML = str; // 将拼接的棋盘内容添加到棋盘中
  count = 0; // 计时重置为0
  sum = row * col; // 重置格子的总数
  openGz = 0; // 重置已经点开的格子的数量
  passTime.innerHTML = count; // 时间设置为count
  restNum = leiNum; //重置剩余的雷的数量
  leftMines.innerHTML = restNum;
  clearInterval(time); // 清除定时器
  time = 0; // 定时器变量的值置为 0
  createLei();
}

function countTime() {
  // 开始计时
  time = setInterval(function () {
    count++;
    passTime.innerHTML = count;
  }, 1000);
}

function createLei() {
  // 创建地雷
  leiList = []; // 把地雷的坐标先清空
  for (var i = 0; i < leiNum; i++) {
    var x = parseInt(Math.random() * row), //
      y = parseInt(Math.random() * col); //
    if (isInArray(x, y, leiList) == -1) {
      // 如果 x,y组成的坐标[x,y] 不在leiList里
      leiList.push([x, y]); // 把 [x,y] push进 leiList里
    } else {
      // x,y组成的坐标 [x,y] 已经在 leiList里了
      i--; // 重新取一次随机坐标
    }
  }
}

// arr = [[0,0],[1,1],[2,2],...]
function isInArray(x, y, arr) {
  // 判断 x,y 组成的坐标 [x,y] 在不在数组 arr 里
  for (var i = 0; i < arr.length; i++) {
    // 遍历arr的每一个元素
    if (x == arr[i][0] && y == arr[i][1]) {
      // 将 x与arr[i]的第0个元素对比，将 y 与 arr[i]的第1个元素对比，如果能对上，说明 [x,y] 已经存在于 arr 里，
      return i; // 返回[x,y] 在 arr中的索引
    }
  }
  if (i == arr.length) {
    // 当 循环遍历一遍也没在arr中找到与 [x,y] 相同的坐标时，说明 [x,y] 不在arr 里
    return -1; // 返回 -1;
  }
}

function boom() {
  // boom
  var ul = $(".row", "l"); //获取棋盘里所有的行
  for (var i = 0; i < leiList.length; i++) {
    var li = ul[leiList[i][0]].querySelectorAll("li")[leiList[i][1]]; //通过索引去获取行里具体的li
    // li.style.background = "red";
    li.innerText = "💣";
  }
}

function testLei(x, y) {
  var num = 0; // 声明一个num用来累计雷的数量
  for (var i = 0; i < leiList.length; i++) {
    // 遍历所有的雷的坐标
    if (Math.abs(x - leiList[i][0]) < 2 && Math.abs(y - leiList[i][1]) < 2) {
      // 找到在当前点击的格子周围八个格子里的雷
      num++;
    }
  }
  var ul = $(".row", "l");
  var li = ul[x].querySelectorAll("li")[y]; // 通过索引获取当前被点击的格子
  li.innerHTML = num; // 把格子的内容换成雷的数量
  li.isOpen = true; // 给当前格子加一个属性 isOpen,表示当前格子已经被点开了
  openGz++;
  li.style.background = "#fff";
  if (num > 0) {
    li.style.color = color[num - 1]; // 把代表雷的数量的数字换一个颜色
  }
  if (num == 0) {
    // 如果当前格子周围没有雷
    li.innerHTML = ""; //
    for (var a = x - 1; a <= x + 1; a++) {
      //
      for (var b = y - 1; b <= y + 1; b++) {
        // 遍历当前格子周围八个格子
        var ul = $("ul", "l");
        if (a >= 0 && a < row && b >= 0 && b < col) {
          // 保证要遍历的格子坐标在棋盘之内
          var dom = ul[a].querySelectorAll("li")[b]; // 通过坐标获取到具体的 li
          if (!dom.isOpen && !dom.isMark) {
            // 判断当前的li格子是否已经被点开了，如果还没有被点开,递归查询该格子周围有几颗雷
            testLei(a, b);
          }
        }
      }
    }
  }
}

createQp();
