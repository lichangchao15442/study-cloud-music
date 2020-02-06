import React, { useRef, useState, useEffect, useCallback } from "react";
import { Container } from "./style";
import Header from "../../baseUI/header/index";
import AlbumDetail from "../../components/album-detail/index";
import { connect } from "react-redux";
import Loading from "../../baseUI/loading/index";
import { EnterLoading } from "../Singers/style";
import { changeEnterLoading, getAlbumList } from "./store/actionCreators";
import { isEmptyObject } from "../../api/utils";
import { HEADER_HEIGHT } from "../../api/config";
import Scroll from "../../baseUI/scroll/index";
import style from "../../assets/global-style";
import { CSSTransition } from "react-transition-group";

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);
  const headerEl = useRef();

  const id = props.match.params.id;

  const { currentAlbum, enterLoading } = props;
  const { getAlbumDataDispatch } = props;

  let currentAlbumJS = currentAlbum.toJS();

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  const handleScroll = useCallback(
    pos => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbumJS && currentAlbumJS.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbumJS]
  );

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      unmountOnExit
      onExited={props.history.goBack}
      appear={true}
    >
      <Container play={0}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbumJS) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <AlbumDetail currentAlbum={currentAlbumJS}></AlbumDetail>
          </Scroll>
        ) : null}
        {enterLoading ? (
          <EnterLoading>
            <Loading></Loading>
          </EnterLoading>
        ) : null}
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  currentAlbum: state.getIn(["album", "currentAlbum"]),
  enterLoading: state.getIn(["album", "enterLoading"])
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
