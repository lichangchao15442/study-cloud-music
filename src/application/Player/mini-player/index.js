import React, { useCallback, useRef } from 'react';
import { MiniPlayerContainer } from './style';
import { getName } from '../../../api/utils';
import ProgressCircle from '../../../baseUI/progress-circle/index';
import { CSSTransition } from 'react-transition-group';

function MiniPlayer(props) {
	const { song, playing, percent, full } = props;
	const { clickPlaying, togglePlayListDispatch, toggleFullScreenDispatch } = props;

	const miniPlayerRef = useRef();

	const handleTogglePlayList = useCallback(
		e => {
			e.stopPropagation();
			togglePlayListDispatch(true);
		},
		[togglePlayListDispatch]
	);
	return (
		<CSSTransition
			classNames="mini"
			in={!full}
			timeout={400}
			onEnter={() => (miniPlayerRef.current.style.display = 'flex')}
			onExited={() => (miniPlayerRef.current.style.display = 'none')}
		>
			<MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreenDispatch(true)}>
				<div className="icon">
					<div className="imgWrapper">
						<img
							className={`play ${playing ? '' : 'pause'}`}
							src={song.al.picUrl}
							alt="img"
							width="40"
							height="40"
						/>
					</div>
				</div>
				<div className="text">
					<h2 className="name">{song.name}</h2>
					<p className="desc">{getName(song.ar)}</p>
				</div>
				<div className="control">
					<ProgressCircle radius={32} percent={percent}>
						{playing ? (
							<i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>
								&#xe650;
							</i>
						) : (
							<i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>
								&#xe61e;
							</i>
						)}
					</ProgressCircle>
				</div>
				<div className="control">
					<i className="iconfont" onClick={handleTogglePlayList}>
						&#xe640;
					</i>
				</div>
			</MiniPlayerContainer>
		</CSSTransition>
	);
}

export default React.memo(MiniPlayer);
