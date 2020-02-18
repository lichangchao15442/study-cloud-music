import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle
} from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import { prefixStyle } from "../../api/utils";

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transform: translate3d(0, 0, 0);
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    > div {
      transition: transform 1s;
    }
  }
`;

const MusicNote = forwardRef((props, ref) => {
  const iconRef = useRef();
  const ICON_NUMBER = 10;

  const transform = prefixStyle("transform");

  const createNode = txt => {
    const template = `<div class="icon_wrapper">${txt}</div>`;
    let tempNode = document.createElement("div");
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  };

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconRef.current.appendChild(node);
    }
    let domArray = [].slice.call(iconRef.current.children);
    domArray.forEach(item => {
      item.running = false;
      //transitionend为过渡事件，在CSS完成过渡后触发
      item.addEventListener(
        "transitionend",
        function() {
          this.style["display"] = "none";
          this.style[transform] = `translate3d(0, 0, 0)`;
          this.running = false;

          let icon = item.querySelector("div");
          icon.style[transform] = `translate3d(0, 0, 0)`;
        },
        false
      );
    });
  }, []);

  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let domArray = [].slice.call(iconRef.current.children);
      let item = domArray[i];
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + "px";
        item.style.top = y + "px";
        item.style.display = "inline-block";
        setTimeout(() => {
          item.running = true;
          item.style[transform] = `translate3d(0,750px,0)`;
          let icon = item.querySelector("div");
          icon.style[transform] = `translate3d(-40px,0,0)`;
        }, 20);
        // 连续点击时，前一个元素未运动完成，使用下一个未运动的元素运动，当运动完后变为false，下次点击时继续使用
        break;
      }
    }
  };

  useImperativeHandle(ref, () => ({
    startAnimation
  }));

  return <Container ref={iconRef}></Container>;
});

export default React.memo(MusicNote);
