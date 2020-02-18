// 防抖函数
const debounce = (func, delay) => {
	// func是防抖处理的函数，delay是时间间隔
	// 通过闭包缓存一个定时器id
	let timer = null;
	// 将debounce处理结果当作函数返回，触发事件回调时执行这个函数
	return function(...args) {
		// 如果已经设置定时器，就清楚上次设置的定时器
		if (timer) {
			clearTimeout(timer);
		}
		// 开始设置一个新的定时器，定时器结束后执行传入的函数func
		timer = setTimeout(() => {
			func.apply(this, args);
			clearTimeout(timer);
		}, delay);
	};
};

export { debounce };

// 处理歌手列表拼接歌手名字
export const getName = list => {
	let str = '';
	list.map((item, index) => {
		str += index === 0 ? item.name : '/' + item.name;
		return item;
	});
	return str;
};

// 处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
	for (let i = 0; i < rankList.length - 1; i++) {
		if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
			return i + 1;
		}
	}
};

// 判断一个对象是否为空对象
export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;

// 给css3相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement('div').style;

let vendor = (() => {
	//首先通过translation属性判断是何种浏览器
	let transformNames = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		standard: 'Transform',
	};
	for (let key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key;
		}
	}
	return false;
})();

export function prefixStyle(style) {
	if (vendor === false) {
		return false;
	}
	if (vendor === 'standard') {
		return style;
	}
	return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

// 拼接出歌曲的url链接
export const getSongUrl = id => {
	return `https://music.163.com/song/media/outer/url?id=${id}.mp3 `;
};

// 转换歌曲播放时间
export const formatPlayTime = interval => {
	interval = interval | 0;
	const minute = (interval / 60) | 0;
	const second = (interval % 60).toString().padStart(2, '0');
	return `${minute}:${second}`;
};

// 找到当前歌曲索引
export const findIndex = (song, list) => {
	return list.findIndex(item => {
		return song.id === item.id;
	});
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//随机算法
export function shuffle(arr) {
	let new_arr = [];
	arr.forEach(item => {
		new_arr.push(item);
	});
	for (let i = 0; i < 10; i++) {
		let j = getRandomInt(0, i);
		let t = new_arr[i];
		new_arr[i] = new_arr[j];
		new_arr[j] = t;
	}
	return new_arr;
}
