import React, { useEffect } from "react";
import Slider from "../../components/slider/";
import RecommendList from "../../components/list";
import Scroll from "../../baseUI/scroll/index";
import { Content } from "./style";
import { forceCheck } from "react-lazyload";
import { EnterLoading } from "../Singers/style";
import Loading from "../../baseUI/loading-v2/index";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import * as actionTypes from "./store/actionCreator";

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
  }, []);
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  return (
    <Content play={60}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
        {enterLoading ? (
          <EnterLoading>
            <Loading></Loading>
          </EnterLoading>
        ) : null}
        {renderRoutes(props.route.routes)}
      </Scroll>
    </Content>
  );
}

// mapStateToProps：建立一个从（外部的）state对象到（UI组件的）props对象的映射关系。
// mapStateToProps接受state作为参数，返回一个对象
// 映射Redux全局的state到组件props上
const mapStateToProps = state => ({
  bannerList: state.getIn(["recommend", "bannerList"]),
  recommendList: state.getIn(["recommend", "recommendList"]),
  enterLoading: state.getIn(["recommend", "enterLoading"])
});

// mapDispatchToProps：用来建立UI组件的参数到store.dispatch方法的映射。
// 也就是说，它定义了哪些用户的操作应当作Action，传给store。可以是一个函数，也可以是一个对象。
// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    }
  };
};

// connect方法生成容器组件后，需让容器组件拿到state对象，才能生成UI组件的参数，
// react-redux提供Provider组件，可让容器组件拿到state
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend));
