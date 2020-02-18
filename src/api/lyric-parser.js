/**
 * 传入歌词：按照正则表达式解析
 * 解析的数据结构我：
 * {
 *   txt:歌词,
 *   time:ms
 * }
 */

const timeExp = /\[(\d{2,}):(\d{2})(?:(?:\.|:)(\d{2,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

const tagRegMap = {
	title: 'ti',
	artist: 'ar',
	album: 'al',
	offset: 'offset',
	by: 'by',
};

function noop() { }

export default class Lyric {
	constructor(lrc, handler = noop, speed = 1) {
		this.lrc = lrc;
		this.handler = handler;
		this.speed = speed;
		this.tags = {};
		this.lines = [];
		this.state = STATE_PAUSE;
		this.curLineIndex = 0;
		this.offset = 0; // 歌词的时间戳
		this._init();
	}

	_init() {
		this._initTag();
		this._initLines();
	}

	_initTag() {
		for (let tag in tagRegMap) {
			const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'));
			this.tags[tag] = matches && (matches[1] || '');
		}
	}
	_initLines() {
		const lines = this.lrc.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			//返回一个数组，数组的第一项是进行匹配的完整字符串，之后的项是捕获分组的匹配结果。
			//  ["[01:07.87]", "01", "07", "87", index: 0, input: "[01:07.87]原来被催眠 真有意思", groups: undefined]
			let result = timeExp.exec(line);
			if (result) {
				// txt表示只有歌词
				const txt = line.replace(timeExp, '').trim();
				if (txt) {
					// if (result[3].length === 3) {
					// 	result[3] = result[3] / 10;
					// }
					this.lines.push({
						time: result[1] * 60 * 1000 + result[2] * 1000 + (Number(result[3]) || 0),
						txt,
					});
				}
			}
		}
		this.lines.sort((a, b) => {
			return a.time - b.time;
		});
	}

	play(offset = 0, isSeek = false) {
		if (!this.lines.length) {
			return;
		}
		this.state = STATE_PLAYING;
		this.curLineIndex = this._findCurLineIndex(offset);
		// 现在正处于第this.curLineIndex-1行
		this._callHandler(this.curLineIndex - 1);
		this.offset = offset;
		this.startStamp = +new Date() - offset;

		if (this.curLineIndex < this.lines.length) {
			clearTimeout(this.timer);
			this._playRest(isSeek);
		}
	}
	
	_playRest(isSeek = false) {
		let line = this.lines[this.curLineIndex];
		let delay;
		if (isSeek) {
			delay = line.time - (+new Date() - this.startStamp);
		} else {
			// 拿到上一行歌词开始时间，算间隔
			let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;
			delay = line.time - preTime;
		}
		this.timer = setTimeout(() => {
			this._callHandler(this.curLineIndex++);
			if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
				this._playRest();
			}
		}, delay / this.speed);
	}

	_findCurLineIndex(time) {
		for (let i = 0; i < this.lines.length; i++) {
			if (time <= this.lines[i].time) {
				return i;
			}
		}
		return this.lines.length - 1;
	}

	_callHandler(i) {
		if (i < 0) {
			return;
		}
		this.handler({
			txt: this.lines[i].txt,
			lineNum: i,
		});
	}


	seek(offset) {
		this.play(offset, true);
	}

	stop() {
		this.state = STATE_PAUSE;
		this.offset = 0;
		clearTimeout(this.timer);
	}

	changeSpeed(speed) {
		this.speed = speed;
	}

	togglePlay(offset) {
		if (this.state === STATE_PLAYING) {
			this.stop()
			this.offset = offset
		} else {
			this.state = STATE_PLAYING
			this.play(offset, true)
		}
	}
}
