import styled from 'styled-components';
import style from '../../assets/global-style';

export const Container = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: ${props => (props.play > 0 ? '60px' : 0)};
	left: 0;
	width: 100%;
	z-index: 100;
	overflow: hidden;
	background: #f2f3f4;
	transform-origin: right bottom;
	&.fly-appear,
	&.fly-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	&.fly-appear-active,
	&.fly-enter-active {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		transition: all 0.3s;
	}
	&.fly-exit {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
	&.fly-exit-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
		transition: all 0.3s;
	}
`;

export const ShortcutWrapper = styled.div`
	position: absolute;
	width: 100%;
	top: 40px;
	bottom: 0;
	display: ${props => (props.show ? '' : 'none')};
`;

export const HotKey = styled.div`
	margin: 0 20px 20px 20px;
	.title {
		padding-top: 35px;
		margin-bottom: 20px;
		font-size: ${style['font-size-m']};
		color: ${style['font-color-desc-v2']};
	}
	.item {
		display: inline-block;
		padding: 5px 10px;
		margin: 0 20px 10px 0;
		border-radius: 6px;
		background:${style['highlight-background-color']}
		font-size: ${style['font-size-m']};
		color: ${style['font-color-desc']};
	}
`;
