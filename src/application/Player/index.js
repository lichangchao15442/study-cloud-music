import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
	changeCurrentSong,
	changePlayingState,
	changeSpeed,
	changePlayMode,
	changePlayList,
	changeCurrentIndex,
	changeShowPlayList,
	changeFullScree,
} from './store/actionCreators';
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils';
import { getLyricRequest } from '../../api/request';
import NormalPlayer from './normal-player/index';
import Lyric from '../../api/lyric-parser';
import { playMode } from '../../api/config';
import Toast from '../../baseUI/toast/index';
import PlayList from './play-list/index';
import MiniPlayer from './mini-player/index';

function Player(props) {
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0); // 音乐时长
	const [currentPlayingLyric, setPlayingLyric] = useState('');
	const [modeText, setModeText] = useState('');

	let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

	const {
		currentSong: immutableCurrentSong,
		currentIndex,
		playList: immutablePlayList,
		speed,
		playing,
		mode,
		sequencePlayList: immutableSequencePlayList,
		fullScreen,
	} = props;

	const {
		changeCurrentDispatch,
		togglePlayingDispatch,
		changeSpeedDispatch,
		changeModeDispatch,
		changePlayListDispatch,
		changeCurrentIndexDispatch,
		togglePlayListDispatch,
		toggleFullScreenDispatch,
	} = props;

	const playList = immutablePlayList.toJS();
	const currentSong = immutableCurrentSong.toJS();
	const sequencePlayList = immutableSequencePlayList.toJS();

	const [preSong, setPreSong] = useState({});

	const audioRef = useRef();
	const toastRef = useRef();

	const currentLyric = useRef();
	const currentLineNum = useRef(0);
	const songReady = useRef(true);

	useEffect(() => {
		if (
			!playList.length ||
			currentIndex === -1 ||
			!playList[currentIndex] ||
			playList[currentIndex].id === preSong.id ||
			!songReady.current
		)
			return;
		songReady.current = false;
		let current = playList[currentIndex];
		console.log('current', current);
		changeCurrentDispatch(current);
		setPreSong(current);
		setPlayingLyric('');
		audioRef.current.src = getSongUrl(current.id);
		audioRef.current.autoplay = true;
		// playbackRate---设置或返回音频的播放速度。1为正常速度
		audioRef.current.playbackRate = speed;
		togglePlayingDispatch(true);
		// 获取歌词
		getLyric(current.id);
		setCurrentTime(0);
		setDuration((current.dt / 1000) | 0);
	}, [currentIndex, playList]);

	useEffect(() => {
		playing ? audioRef.current.play() : audioRef.current.pause();
	}, [playing]);

	useEffect(() => {
		if (!fullScreen) return;
		if (currentLyric.current && currentLyric.current.lines.length) {
			handleLyric({
				lineNum: currentLineNum.current,
				txt: currentLyric.current.lines[currentLineNum.current].txt,
			});
		}
	}, [fullScreen]);

	const handleLyric = ({ lineNum, txt }) => {
		if (!currentLyric.current) return;
		currentLineNum.current = lineNum;
		setPlayingLyric(txt);
	};

	const getLyric = id => {
		let lyric = '';
		if (currentLyric.current) {
			currentLyric.current.stop();
		}
		// 避免songReady恒为false的情况
		setTimeout(() => {
			songReady.current = true;
		}, 3000);
		getLyricRequest(id)
			.then(data => {
				lyric = data.lrc.lyric;
				if (!lyric) {
					currentLyric.current = null;
					return;
				}
				currentLyric.current = new Lyric(lyric, handleLyric, speed);
				currentLyric.current.play();
				currentLineNum.current = 0;
				currentLyric.current.seek(0);
			})
			.catch(() => {
				songReady.current = true;
				audioRef.current.play();
			});
	};

	const clickSpeed = newSpeed => {
		changeSpeedDispatch(newSpeed);
		audioRef.current.playbackRate = newSpeed;
		currentLyric.current.changeSpeed(newSpeed);
		currentLyric.current.seek(currentTime * 1000);
	};

	const clickPlaying = (e, state) => {
		e.stopPropagation();
		togglePlayingDispatch(state);
		if (currentLyric.current) {
			currentLyric.current.togglePlay(currentTime * 1000);
		}
	};

	const onProgressChange = curPercent => {
		const newTime = curPercent * duration;
		setCurrentTime(newTime);
		audioRef.current.currentTime = newTime;
		if (!playing) {
			togglePlayingDispatch(true);
		}
		if (currentLyric.current) {
			currentLyric.current.seek(newTime * 1000);
		}
	};

	const updateTime = e => {
		setCurrentTime(e.target.currentTime);
	};

	const handleLoop = () => {
		audioRef.current.currentTime = 0;
		togglePlayingDispatch(true);
		audioRef.current.play();
		if (currentLyric.current) {
			currentLyric.current.seek(0);
		}
	};

	const handlePrev = () => {
		if (playList.length === 1) {
			handleLoop();
			return;
		}
		let index = currentIndex - 1;
		if (index === 0) index = playList.length - 1;
		if (!playing) togglePlayingDispatch(true);
		changeCurrentIndexDispatch(index);
	};

	const handleNext = () => {
		if (playList.length === 1) {
			handleLoop();
			return;
		}
		let index = currentIndex + 1;
		if (index === playList.length) index = 0;
		if (!playing) togglePlayingDispatch(true);
		changeCurrentIndexDispatch(index);
	};

	const handleEnd = () => {
		if (mode === playMode.loop) {
			handleLoop();
		} else {
			handleNext();
		}
	};

	const changeMode = () => {
		let newMode = (mode + 1) % 3;
		if (newMode === 0) {
			//顺序模式
			changePlayListDispatch(sequencePlayList);
			let index = findIndex(currentSong, sequencePlayList);
			changeCurrentIndexDispatch(index);
			setModeText('顺序模式');
		} else if (newMode === 1) {
			// 单曲循环
			changePlayListDispatch(sequencePlayList);
			setModeText('单曲循环');
		} else if (newMode === 2) {
			// 随机播放
			let newList = shuffle(sequencePlayList);
			let index = findIndex(currentSong, newList);
			changePlayListDispatch(newList);
			changeCurrentIndexDispatch(index);
			setModeText('随机播放');
		}
		changeModeDispatch(newMode);
		toastRef.current.show();
	};

	const handleError = () => {
		songReady.current = true;
		handleNext();
		alert('播放出错');
	};
	return (
		<div>
			{isEmptyObject(currentSong) ? null : (
				<NormalPlayer
					song={currentSong}
					playing={playing}
					currentPlayingLyric={currentPlayingLyric}
					speed={speed}
					clickSpeed={clickSpeed}
					currentTime={currentTime}
					duration={duration}
					mode={mode}
					clickPlaying={clickPlaying}
					percent={percent}
					onProgressChange={onProgressChange}
					changeMode={changeMode}
					handlePrev={handlePrev}
					handleNext={handleNext}
					togglePlayListDispatch={togglePlayListDispatch}
					full={fullScreen}
					toggleFullScreenDispatch={toggleFullScreenDispatch}
					currentLyric={currentLyric.current}
					currentLineNum={currentLineNum.current}
				></NormalPlayer>
			)}
			{isEmptyObject(currentSong) ? null : (
				<MiniPlayer
					song={currentSong}
					playing={playing}
					clickPlaying={clickPlaying}
					percent={percent}
					togglePlayListDispatch={togglePlayListDispatch}
					toggleFullScreenDispatch={toggleFullScreenDispatch}
					full={fullScreen}
				></MiniPlayer>
			)}
			<PlayList></PlayList>
			<audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd} onError={handleError}></audio>
			<Toast text={modeText} ref={toastRef}></Toast>
		</div>
	);
}

// 映射Reduce全局的state到组件的props上
const mapStateToProps = state => ({
	currentSong: state.getIn(['player', 'currentSong']),
	currentIndex: state.getIn(['player', 'currentIndex']),
	playList: state.getIn(['player', 'playList']),
	speed: state.getIn(['player', 'speed']),
	playing: state.getIn(['player', 'playing']),
	mode: state.getIn(['player', 'mode']),
	sequencePlayList: state.getIn(['player', 'sequencePlayList']),
	fullScreen: state.getIn(['player', 'fullScreen']),
});

// 映射dispatch到props
const mapDispatchToProps = dispatch => {
	return {
		changeCurrentDispatch(data) {
			dispatch(changeCurrentSong(data));
		},
		togglePlayingDispatch(data) {
			dispatch(changePlayingState(data));
		},
		togglePlayListDispatch(data) {
			dispatch(changeShowPlayList(data));
		},
		changeSpeedDispatch(data) {
			dispatch(changeSpeed(data));
		},
		changeModeDispatch(data) {
			dispatch(changePlayMode(data));
		},
		changePlayListDispatch(data) {
			dispatch(changePlayList(data));
		},
		changeCurrentIndexDispatch(index) {
			dispatch(changeCurrentIndex(index));
		},
		toggleFullScreenDispatch(data) {
			dispatch(changeFullScree(data));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
