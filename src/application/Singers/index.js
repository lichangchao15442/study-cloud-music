import React, { useEffect, useRef } from "react";
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
  EnterLoading
} from "./style";
import Horizon from "../../baseUI/horizon-item/index";
import { categoryTypes, alphaTypes } from "../../api/config";
import { connect } from "react-redux";
import {
  changeCategory,
  getHotSingerList,
  changeAlpha,
  changePullUpLoading,
  refreshMoreHotSingerList,
  changeListOffset,
  getSingerList,
  refreshMoreSingerList,
  changeEnterLoading,
  changePullDownLoading
} from "./store/actionCreators";
import LazyLoad, { forceCheck } from "react-lazyload";
import Scroll from "../../baseUI/scroll/index";
import Loading from "../../baseUI/loading/index";
import { renderRoutes } from "react-router-config";

function Singers(props) {
  const scrollRef = useRef(null);
  const {
    category,
    alpha,
    singerList,
    pullUpLoading,
    pullDownLoading,
    pageCount,
    enterLoading
  } = props;
  const {
    updateCategory,
    updateAlpha,
    getHotSinger,
    pullUpRefresh,
    pullDownRefresh
  } = props;

  useEffect(() => {
    if (!singerList.length && !category && !alpha) {
      getHotSinger();
    }
  }, []);

  const enterDetail = id => {
    props.history.push(`/singers/${id}`);
  };

  const handleUpdateCategory = newVal => {
    if (category === newVal) return;
    updateCategory(newVal);
    scrollRef.current.refresh();
  };

  const handleUpdateAlpha = newVal => {
    if (alpha === newVal) return;
    updateAlpha(newVal);
    scrollRef.current.refresh();
  };

  const handlePullUp = () => {
    pullUpRefresh(category === "", pageCount);
  };

  const handlePullDown = () => {
    pullDownRefresh(category, pageCount);
  };

  const renderSingerList = () => {
    const { singerList } = props;
    return (
      <List>
        {singerList.toJS().map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    alt="music"
                    width="100%"
                    height="100%"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      {/**对于better-scroll来讲，其作用的元素外面必须要有一个尺寸确定的容器包裹，因此设置xxxContainer */}
      <NavContainer>
        <Horizon
          title={"分类(默认热门):"}
          list={categoryTypes}
          handleClick={v => {
            handleUpdateCategory(v);
          }}
          oldVal={category}
        ></Horizon>
        <Horizon
          title={"首字母:"}
          list={alphaTypes}
          handleClick={v => {
            handleUpdateAlpha(v);
          }}
          oldVal={alpha}
        ></Horizon>
      </NavContainer>
      <ListContainer play={1}>
        <Scroll
          onScroll={forceCheck}
          ref={scrollRef}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
      {/* 入场加载动画  */}
      {enterLoading && (
        <EnterLoading>
          <Loading></Loading>
        </EnterLoading>
      )}
      {renderRoutes(props.route.routes)}
    </div>
  );
}

const mapStateToProps = state => ({
  category: state.getIn(["singers", "category"]),
  alpha: state.getIn(["singers", "alpha"]),
  singerList: state.getIn(["singers", "singerList"]),
  pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
  pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
  pageCount: state.getIn(["singers", "pageCount"]),
  enterLoading: state.getIn(["singers", "enterLoading"])
});

const mapDispatchToProps = dispatch => {
  return {
    getHotSinger() {
      dispatch(getHotSingerList());
    },
    updateCategory(newVal) {
      dispatch(changeCategory(newVal));
      dispatch(changeListOffset(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    updateAlpha(newVal) {
      dispatch(changeAlpha(newVal));
      dispatch(changeListOffset(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    // 滑到最底部刷新部分的处理
    pullUpRefresh(hot, count) {
      dispatch(changePullUpLoading(true));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList());
      }
    },
    // 顶部下拉刷新
    pullDownRefresh(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changeListOffset(0));
      if (category === "" && alpha === "") {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList());
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Singers);
