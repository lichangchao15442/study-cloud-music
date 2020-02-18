import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from '../../api/utils';

const ProgressBarWrapper = styled.div`
	height: 30px;
	.bar-inner {
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		height: 4px;
		top: 13px;
		.progress {
			position: absolute;
			background: ${style['theme-color']};
			height: 100%;
		}
		.progress-btn-wrapper {
			width: 30px;
			height: 30px;
			position: absolute;
			top: -13px;
			left: -8px;
			.progress-btn {
				width: 16px;
				height: 16px;
				position: relative;
				top: 7px;
				left: 7px;
				box-sizing: border-box;
				border: 3px solid ${style['border-color']};
				border-radius: 50%;
				background: ${style['theme-color']};
			}
		}
	}
`;

function ProgressBar(props) {
	const progressBar = useRef();
	const progress = useRef();
	const progressBtn = useRef();

	const [touch, setTouch] = useState({});

	const { percent } = props;

	const transform = prefixStyle('transform');

	const progressBtnWidth = 16;

	useEffect(() => {
		if (percent >= 0 && percent <= 1 && !touch.initiated) {
			const barWidth = progressBar.current.clientWidth - progressBtnWidth;
			const offsetWidth = percent * barWidth;
			progress.current.style.width = `${offsetWidth}px`;
			progressBtn.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
		}
	}, [percent]);

	const _offset = offsetWidth => {
		progress.current.style.width = `${offsetWidth}px`;
		progressBtn.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
	};

	const _changePercent = () => {
		const barWidth = progressBar.current.clientWidth - progressBtnWidth;
		const curPercent = progress.current.clientWidth / barWidth;
		props.percentChange(curPercent);
	};

	const progressClick = e => {
		const rect = progressBar.current.getBoundingClientRect();
		const offsetWidth = e.pageX - rect.left;
		_offset(offsetWidth);
		_changePercent();
	};

	const progressTouchStart = e => {
		const startTouch = {};
		startTouch.initiated = true;
		startTouch.startX = e.touches[0].pageX;
		startTouch.left = progress.current.clientWidth;
		setTouch(startTouch);
	};

	const progressTouchMove = e => {
		if (!touch.initiated) return;
		const deltaX = e.touches[0].pageX - touch.startX;
		const barWidth = progressBar.current.clientWidth - progressBtnWidth;
		const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
		_offset(offsetWidth);
	};

	const progressTouchEnd = e => {
		const endTouch = JSON.parse(JSON.stringify(touch));
		endTouch.initiated = false;
		setTouch(endTouch);
		_changePercent();
	};
	return (
		<ProgressBarWrapper>
			<div className="bar-inner" ref={progressBar} onClick={progressClick}>
				<div className="progress" ref={progress}></div>
				<div
					className="progress-btn-wrapper"
					ref={progressBtn}
					// 当按下手指时，触发
					onTouchStart={progressTouchStart}
					// 当移动手指时，触发
					onTouchMove={progressTouchMove}
					// 当移走手指时，触发
					onTouchEnd={progressTouchEnd}
				>
					<div className="progress-btn"></div>
				</div>
			</div>
		</ProgressBarWrapper>
	);
}

export default React.memo(ProgressBar);
