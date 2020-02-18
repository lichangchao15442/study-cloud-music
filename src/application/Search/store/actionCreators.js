import { SET_ENTER_LOADING, SET_SUGGEST_LIST, SET_RESULT_SONGS_LIST, SET_HOT_KEYWORDS } from './constants';
import { getSuggestListRequest, getResultSongsListRequest, getHotKeywordsRequest } from '../../../api/request';
import { fromJS } from 'immutable';

export const changeEnterLoading = data => ({
	type: SET_ENTER_LOADING,
	data,
});

const changeSuggestList = data => ({
	type: SET_SUGGEST_LIST,
	data: fromJS(data),
});

const changeResultSongs = data => ({
	type: SET_RESULT_SONGS_LIST,
	data: fromJS(data),
});

const changeHotKeywords = data => ({
	type: SET_HOT_KEYWORDS,
	data: fromJS(data),
});

export const getHotKeywords = () => {
	return dispatch => {
		getHotKeywordsRequest().then(data => {
			let res = data.result.hots;
			dispatch(changeHotKeywords(res));
		});
	};
};

export const getSuggestList = query => {
	return dispatch => {
		getSuggestListRequest(query).then(data => {
			if (!data) return;
			let res = data.result || [];
			dispatch(changeSuggestList(res));
		});
		getResultSongsListRequest(query).then(data => {
			if (!data) return;
			let res = data.result.songs || [];
			dispatch(changeResultSongs(res));
			dispatch(changeEnterLoading(false));
		});
	};
};
