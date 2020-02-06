import React from "react";
import { SongList,SongItem } from "./style";
import { getName } from "../../api/utils";

const SongsList = React.forwardRef((props, ref) => {
  const { songs, showCollect, collectCount } = props;
  const totalCount = songs.length;

  const collect = count => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count / 1000) / 10}万)</span>
      </div>
    );
  };

  let songList = list => {
    let res = [];
    // 判断页数是否超过总数
    let end = list.length;
    for (let i = 0; i < end; i++) {
      if (i >= list.length) break;
      let item = list[i];
      res.push(
        <li key={item.id}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)}-
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      );
    }
    return res;
  };
  return (
    <SongList showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部
            <span className="sum">(共{totalCount}首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongList>
  );
});

export default React.memo(SongsList);
