import React, { useState, useEffect, useRef, memo } from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import Scroll from "../scroll/index";
import { PropTypes } from "prop-types";

// 样式部分
const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: center;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`;
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 5px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`;

function Horizon(props) {
  const [refreshCategoryScroll, setRefreshCategoryScroll] = useState(false);
  const Category = useRef(null);
  const { title, list, oldVal } = props;
  const { handleClick } = props;

  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    /**
     * Array.from(arrayLike,mapFn,thisArg)
     * 作用：从一个类似伪数组或者可迭代对象创建一个新的，浅拷贝数组实例。
     * arrayLike：个类似伪数组或者可迭代对象；
     * mapFn：（可选），若指定了该参数，新数组中的每一个元素会执行该回调函数；
     * thisArg：（可选），执行回调函数mapFn时this对象。
     */
    Array.from(tagElems, ele => {
      totalWidth += ele.offsetWidth;
    });
    totalWidth += 2;
    categoryDOM.style.width = `${totalWidth}px`;
    setRefreshCategoryScroll(true);
  }, [refreshCategoryScroll]);

  const clickHandle = item => {
    handleClick(item.key);
  };

  return (
    <Scroll direction="horizontal" refresh={true}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map(item => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? "selected" : ""}`}
                onClick={() => clickHandle(item)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
}

Horizon.defaultProps = {
  list: [],
  handleClick: null
};

Horizon.propTypes = {
  list: PropTypes.array,
  handleClick: PropTypes.func
};

export default memo(Horizon);
