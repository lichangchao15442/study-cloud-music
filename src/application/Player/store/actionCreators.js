import {
	SET_PLAYLIST,
	SET_SEQUENCE_PLAYLIST,
	SET_CURRENT_INDEX,
	SET_CURRENT_SONG,
	SET_PLAYING_STATE,
	CHANGE_SPEED,
	SET_PLAY_MODE,
	SET_SHOW_PLAYLIST,
	DELETE_SONG,
	SET_FULL_SCREEN,
	INSERT_SONG
} from './constants';
import { fromJS } from 'immutable';
import { getSongDetailRequest } from "../../../api/request"

export const changePlayList = data => ({
	type: SET_PLAYLIST,
	data: fromJS(data),
});

export const changeSequencePlayList = data => ({
	type: SET_SEQUENCE_PLAYLIST,
	data: fromJS(data),
});

export const changeCurrentIndex = data => ({
	type: SET_CURRENT_INDEX,
	data,
});

export const changeCurrentSong = data => ({
	type: SET_CURRENT_SONG,
	data: fromJS(data),
});

export const changePlayingState = data => ({
	type: SET_PLAYING_STATE,
	data,
});

export const changeSpeed = data => ({
	type: CHANGE_SPEED,
	data,
});

export const changePlayMode = data => ({
	type: SET_PLAY_MODE,
	data,
});

export const changeShowPlayList = data => ({
	type: SET_SHOW_PLAYLIST,
	data
})

export const deleteSong = data => ({
	type: DELETE_SONG,
	data
})

export const changeFullScree = data => ({
	type: SET_FULL_SCREEN,
	data
})

const insertSong = data => ({
	type: INSERT_SONG,
	data
})

export const getSongDetail = id => {
	return dispatch => {
		getSongDetailRequest(id).then(data => {
			console.log("getSongDetailRequest", data)
			let song = data.songs[0]
			dispatch(insertSong(song))
		})
	}
}