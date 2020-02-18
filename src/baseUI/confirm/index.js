import React, { forwardRef, useState, useImperativeHandle } from 'react';
import styled, { keyframes } from 'styled-components';
import style from '../../assets/global-style';
import { CSSTransition } from 'react-transition-group';

const confirmFadeIn = keyframes`
0% {
	opacity:0;
}
100% {
	opacity: 1
}
`;

const confirmZoom = keyframes`
0% {
	transform: scale(0)
}
50% {
	transform: scale(1.1)
}
100% {
	transform: scale(1)
}
`;

const ConfirmWrapper = styled.div`
	background: ${style['background-color-shadow']};
	position: fixed;
	z-index: 1000;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	&.confirm-fade-enter-active {
		animation: ${confirmFadeIn} 0.3s;
		.confirm_content {
			animation: ${confirmZoom} 0.3s;
		}
	}
	> div {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 100;
		transform: translate3d(-50%, -50%, 0);
		.confirm_content {
			width: 270px;
			border-radius: 13px;
			background: ${style['highlight-background-color']};
		}
		.text {
			padding: 19px 15px;
			line-height: 22px;
			text-align: center;
			font-size: ${style['font-size-l']};
			color: ${style['font-color-desc-v2']};
		}
		.operate {
			display: flex;
			align-items: center;
			text-align: center;
			font-size: ${style['font-size-l']};
			.operate_btn {
				flex: 1;
				line-height: 22px;
				padding: 10px 0;
				border-top: 1px solid ${style['border-color']};
				color: ${style['font-color-desc']};
				&.left {
					border-right: 1px solid ${style['border-color']};
				}
			}
		}
	}
`;

const Confirm = forwardRef((props, ref) => {
	const { text, cancelBtnText, confirmBtnText } = props;
	const { handleConfirm } = props;
	const [show, setShow] = useState(false);
	useImperativeHandle(ref, () => ({
		show() {
			setShow(true);
		},
	}));
	return (
		<CSSTransition classNames="confirm-fade" in={show} unmountOnExit timeout={300} appear={true}>
			<ConfirmWrapper onClick={e => e.stopPropagation()}>
				<div>
					<div className="confirm_content">
						<p className="text">{text}</p>
						<div className="operate">
							<div className="operate_btn left" onClick={() => setShow(false)}>
								{cancelBtnText}
							</div>
							<div
								className="operate_btn"
								onClick={() => {
									setShow(false);
									handleConfirm();
								}}
							>
								{confirmBtnText}
							</div>
						</div>
					</div>
				</div>
			</ConfirmWrapper>
		</CSSTransition>
	);
});

export default React.memo(Confirm);
