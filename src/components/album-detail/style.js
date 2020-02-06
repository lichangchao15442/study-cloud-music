import styled from "styled-components";
import style from "../../assets/global-style";

export const TopDesc = styled.div`
  background-size: 100%;
  box-sizing: border-box;
  width: 100%;
  height: 275px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  padding: 5px 20px;
  padding-bottom: 50px;
  margin-bottom: 20px;
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    background: url(${props => props.background}) left top no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    filter: blur(20px);
    .filter {
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .img_wrapper {
    width: 120px;
    height: 120px;
    position: relative;
    .decorate {
      width: 100%;
      height: 35px;
      position: absolute;
      top: 0;
      border-radius: 3px;
      background: linear-gradient(hsla(0, 0%, 43%, 0.4), hsla(0, 0%, 100%, 0));
    }
    img {
      width: 120px;
      height: 120px;
      border-radius: 3px;
    }
    .play_count {
      position: absolute;
      top: 2px;
      right: 2px;
      line-height: 15px;
      font-size: ${style["font-size-s"]};
      color: ${style["font-color-light"]};
      .play {
        vertical-align: top;
      }
    }
  }
  .desc_wrapper {
    flex: 1;
    height: 120px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title {
      max-height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${style["font-color-light"]};
      font-weight: 700;
      line-height: 1.5;
      font-size: ${style["font-size-l"]};
    }
    .person {
      display: flex;
      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc-v2"]};
      }
    }
  }
`;

export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px 20px 30px;
  margin: -100px 0 0 0;
  > div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-s"]};
    color: ${style["font-color-light"]};
    z-index: 1000;
    font-weight: 500;
    .iconfont {
      font-size: 20px;
    }
  }
`;
