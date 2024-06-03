/**
 * 此处用来存放页面上用到的一些dom引用，方便管理
 */
let doms = {
  ul: document.querySelector(".container ul"),
  audio: document.querySelector("audio"),
  container: document.querySelector(".container"),
};

/**
 * 解析歌词字符串，返回歌词对象数组
 * @param {*} lrcStr 歌词字符串
 * @returns 歌词对象数组 [{time:11,text:'第11秒显示的歌词'}]
 */
function parseLrc(lrcStr) {
  let lineList = lrcStr.split("\n");
  let result = [];

  lineList.forEach((line) => {
    let parts = line.split("]");
    let timeStr = parts[0].slice(1);
    // console.log(timeStr);
    result.push({
      time: parseTime(timeStr),
      text: parts[1],
    });
  });

  return result;
}

/**
 * 解析时间字符串，将其转成秒
 * @param {*} timeStr 时间字符串
 * @example
 * parseTime(01:20.90) =====> 80.9
 */
function parseTime(timeStr) {
  let result;
  let parts = timeStr.split(":");
  result = +parts[0] * 60 + +parts[1];
  return result;
  //   console.log(result);
}

/**
 * 传入歌词数组，以及一个时间，返回这个时间下，应当显示的歌词对象的索引
 * @param {*} lrcList 歌词数组
 * @param {*} time  时间
 */
function clacActiveLrcIndex(lrcList, time) {
  for (let i = 0; i < lrcList.length; i++) {
    let lrc = lrcList[i];
    if (time < lrc.time) {
      return i - 1;
    }
  }

  //边界值处理
  return lrcList.length - 1;
}

/**
 * 渲染歌词
 */
function renderLrc(lrcList) {
  let frag = document.createDocumentFragment();
  lrcList.forEach((lrc) => {
    let li = document.createElement("li");
    li.textContent = lrc.text;
    frag.append(li);
  });
  doms.ul.append(frag);
}

/**
 * 传入歌词数组和，一个播放器dom，让播放器高亮当前的那一句歌词
 */
function highlightActiveLrc(lrcList, audioDom) {
  let activeClassName = "active";

  //计算出应该让哪句歌词高亮
  let currentTime = audioDom.currentTime;
  let activeIndex = clacActiveLrcIndex(lrcList, currentTime);

  //让高亮行，滚动到屏幕中间
  let lineHeight = 30;
  let containerHeight = 300;
  let offset = lineHeight / 2 + activeIndex * lineHeight - containerHeight / 2;
  if (offset < 0) {
    offset = 0;
  }
  doms.ul.style.transform = `translateY(-${offset}px)`;

  //取消之前高亮
  doms.ul
    .querySelector(`.${activeClassName}`)
    ?.classList.remove(activeClassName);

  //高亮最新
  let activeLi = doms.ul.children[activeIndex];
  if (activeLi) {
    activeLi.classList.add(activeClassName);
  }
}

//1. 解析歌词
const lrcList = parseLrc(lrc);
console.log(lrcList);

//2. 渲染歌词
renderLrc(lrcList);

//3. 注册播放器事件，高亮歌词
doms.audio.addEventListener("timeupdate", () => {
  highlightActiveLrc(lrcList, doms.audio);
});
