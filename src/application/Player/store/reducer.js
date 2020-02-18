import { fromJS } from 'immutable';
import * as actionTypes from './constants';
import { playMode } from '../../../api/config';
import { findIndex } from '../../../api/utils';

const defaultState = fromJS({
	playList: [],
	sequencePlayList: [],
	currentIndex: -1,
	currentSong: {},
	speed: 1,
	playing: false,
	mode: playMode.sequence,
	showPlayList: false,
	fullScreen: false,
});

const handleDeleteSong = (state, song) => {
	const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
	const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
	let currentIndex = state.get('currentIndex');

	const fpIndex = findIndex(song, playList);
	playList.splice(fpIndex, 1);
	if (fpIndex < currentIndex) currentIndex--;

	const fsIndex = findIndex(song, sequenceList);
	sequenceList.splice(fsIndex, 1);
	return state.merge({
		playList: fromJS(playList),
		sequencePlayList: fromJS(sequenceList),
		currentIndex: fromJS(currentIndex),
	});
};

const handleInsertSong = (state, song) => {
	const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
	const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
	let currentIndex = state.get('currentIndex');

	// 当前播放列表中是否有该歌曲
	let fpIndex = findIndex(song, playList);
	// 如果是当前歌曲，直接不处理
	if (fpIndex === currentIndex && currentIndex !== -1) return state;
	currentIndex++;
	// 把歌曲放入播放曲目的下一个位置(在播放列表中)
	playList.splice(currentIndex, 0, song);
	// 如果列表中已经存在要添加的歌曲，则删除原本存在的歌曲
	if (fpIndex > -1) {
		if (currentIndex > fpIndex) {
			playList.splice(fpIndex, 1);
			currentIndex--;
		} else {
			playList.splice(fpIndex + 1, 1);
		}
	}

	// 把歌曲放入播放曲目的下一个位置(在顺序列表中)
	let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
	let fsIndex = findIndex(song, sequenceList);
	sequenceList.splice(sequenceIndex, 0, song);
	if (fsIndex > -1) {
		if (sequenceIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1);
			sequenceIndex--;
		} else {
			sequenceList.splice(fsIndex + 1, 1);
		}
	}

	return state.merge({
		'playList': fromJS(playList),
		'sequencePlayList': fromJS(sequenceList),
		'currentIndex': fromJS(currentIndex),
	});
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case actionTypes.SET_PLAYLIST:
			return state.set('playList', action.data);
		case actionTypes.SET_SEQUENCE_PLAYLIST:
			return state.set('sequencePlayList', action.data);
		case actionTypes.SET_CURRENT_INDEX:
			return state.set('currentIndex', action.data);
		case actionTypes.SET_CURRENT_SONG:
			return state.set('currentSong', action.data);
		case actionTypes.SET_PLAYING_STATE:
			return state.set('playing', action.data);
		case actionTypes.CHANGE_SPEED:
			return state.set('speed', action.data);
		case actionTypes.SET_PLAY_MODE:
			return state.set('mode', action.data);
		case actionTypes.SET_SHOW_PLAYLIST:
			return state.set('showPlayList', action.data);
		case actionTypes.DELETE_SONG:
			return handleDeleteSong(state, action.data);
		case actionTypes.INSERT_SONG:
			return handleInsertSong(state, action.data);
		case actionTypes.SET_FULL_SCREEN:
			return state.set('fullScreen', action.data);
		default:
			return state;
	}
};
