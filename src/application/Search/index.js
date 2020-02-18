import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, ShortcutWrapper, HotKey } from './style';
import SearchBox from '../../baseUI/search-box/index';
import { connect } from 'react-redux';
import { changeEnterLoading, getSuggestList, getHotKeywords } from './store/actionCreators';
import { EnterLoading, List, ListItem } from './../Singers/style';
import Loading from './../../baseUI/loading/index';
import Scroll from '../../baseUI/scroll/index';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { getName } from '../../api/utils';
import { SongItem } from '../Album/style';
import MusicNote from '../../baseUI/music-note/index';
import { getSongDetail } from '../Player/store/actionCreators';
import { CSSTransition } from 'react-transition-group';

const Search = props => {
	const [query, setQuery] = useState('');
	const [show, setShow] = useState(false);
	const musicNoteRef = useRef();

	const {
		enterLoading,
		suggestList: immutableSuggestList,
		hotList,
		songsCount,
		songsList: immutableSongsList,
	} = props;
	const { changeEnterLoadingDispatch, getSuggestListDispatch, getHotKeywordsDispatch, getSongDetailDispatch } = props;

	const suggestList = immutableSuggestList.toJS();
	const songsList = immutableSongsList.toJS();

	useEffect(() => {
		setShow(true);
		getHotKeywordsDispatch();
	}, []);

	const selectItem = (e, id) => {
		getSongDetailDispatch(id);
		musicNoteRef.current.startAnimation({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
	};

	const renderHotKey = () => {
		let list = hotList ? hotList.toJS() : [];
		return (
			<ul>
				{list.map(item => {
					return (
						<li className="item" key={item.first} onClick={() => setQuery(item.first)}>
							<span>{item.first}</span>
						</li>
					);
				})}
			</ul>
		);
	};

	const renderSingers = () => {
		let singers = suggestList.artists;
		if (!singers || !singers.length) return;
		return (
			<List>
				<h1 className="title">相关歌手</h1>
				{singers.map((item, index) => {
					return (
						<ListItem
							key={item.accountId + '' + index}
							onClick={() => props.history.push(`/singers/${item.id}`)}
						>
							<div className="img_wrapper">
								<LazyLoad
									placeholder={
										<img src={require('./singer.png')} width="100%" height="100%" alt="singer" />
									}
								>
									<img src={item.picUrl} width="100%" height="100%" alt="music" />
								</LazyLoad>
							</div>
							<span className="name">歌手：{item.name}</span>
						</ListItem>
					);
				})}
			</List>
		);
	};

	const renderAlbum = () => {
		let albums = suggestList.playlists;
		if (!albums || !albums.length) return;
		return (
			<List>
				<h1 className="title">相关歌单</h1>
				{albums.map((item, index) => {
					return (
						<ListItem
							key={item.accountId + '' + index}
							onClick={() => props.history.push(`/album/${item.id}`)}
						>
							<div className="img_wrapper">
								<LazyLoad
									placeholder={
										<img src={require('./music.png')} width="100%" height="100%" alt="music" />
									}
								>
									<img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
								</LazyLoad>
							</div>
							<span className="name">歌单：{item.name}</span>
						</ListItem>
					);
				})}
			</List>
		);
	};

	const renderSongs = () => {
		return (
			<SongItem style={{ paddingLeft: '20px' }}>
				{songsList.map(item => {
					return (
						<li key={item.id} onClick={e => selectItem(e, item.id)}>
							<div className="info">
								<span>{item.name}</span>
								<span>
									{getName(item.artists)}-{item.album.name}
								</span>
							</div>
						</li>
					);
				})}
			</SongItem>
		);
	};

	const handleQuery = q => {
		setQuery(q);
		if (!q) return;
		changeEnterLoadingDispatch(true);
		getSuggestListDispatch(q);
	};

	const searchBack = useCallback(() => {
		setShow(false);
	}, []);
	return (
		<CSSTransition
			classNames="fly"
			timeout={300}
			in={show}
			unmountOnExit
			appear={true}
			onExited={() => props.history.goBack()}
		>
			<Container play={songsCount}>
				<div className="search_box_wrapper">
					<SearchBox back={searchBack} handleQuery={handleQuery} newQuery={query}></SearchBox>
				</div>
				<ShortcutWrapper show={!query}>
					<Scroll>
						<div>
							<HotKey>
								<h1 className="title">热门搜索</h1>
								{renderHotKey()}
							</HotKey>
						</div>
					</Scroll>
				</ShortcutWrapper>
				<ShortcutWrapper show={query}>
					<Scroll onScroll={forceCheck}>
						<div>
							{renderSingers()}
							{renderAlbum()}
							{renderSongs()}
						</div>
					</Scroll>
				</ShortcutWrapper>
				<div></div>
				{enterLoading ? (
					<EnterLoading>
						<Loading></Loading>
					</EnterLoading>
				) : null}
				<MusicNote ref={musicNoteRef}></MusicNote>
			</Container>
		</CSSTransition>
	);
};

// 映射Redux全局的state到组件props上
const mapStateToProps = state => ({
	enterLoading: state.getIn(['search', 'enterLoading']),
	suggestList: state.getIn(['search', 'suggestList']),
	hotList: state.getIn(['search', 'hotList']),
	songsList: state.getIn(['search', 'songsList']),
	songsCount: state.getIn(['player', 'playList']).size,
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
	return {
		getHotKeywordsDispatch() {
			dispatch(getHotKeywords());
		},
		changeEnterLoadingDispatch(data) {
			dispatch(changeEnterLoading(data));
		},
		getSuggestListDispatch(data) {
			dispatch(getSuggestList(data));
		},
		getSongDetailDispatch(data) {
			dispatch(getSongDetail(data));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
