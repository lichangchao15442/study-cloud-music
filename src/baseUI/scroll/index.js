import React, { forwardRef, useRef, useMemo, useEffect, useState, useImperativeHandle } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loading from "../loading/index"
import Loading2 from "../loading-v2/index"
import { debounce } from "../../api/utils"
import BScroll from "better-scroll"

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const PullUpLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    width: 60px;
    height: 60px;
    margin: auto;
    z-index: 100;
`

export const PullDownLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    margin: auto;
    z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBScroll] = useState()
    const scrollContainerRef = useRef();
    const { direction, click, refresh, onScroll, pullUpLoading, pullDownLoading, pullUp, pullDown, bounceTop, bounceBottom } = props

    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp])

    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown])

    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === "horizontal",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        })
        setBScroll(scroll)
        return () => {
            setBScroll(null)
        }
    }, [])

    useEffect(() => {
        if (!bScroll || !onScroll) return;
        // on：监听当前实例上的自定义事件
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll)
        })
        return () => {
            // off：移除自定义事件监听器。只会移除这个回调的监听器。
            bScroll.off("scroll")
        }
    }, [bScroll, onScroll])

    useEffect(() => {
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            // 判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce()
            }
        })
        return () => {
            return bScroll.off("scrollEnd")
        }
    }, [pullUp, pullUpDebounce, bScroll])

    useEffect(() => {
        if (!bScroll || !pullDown) return;
        bScroll.on("touchEnd", (pos) => {
            // 判断用户的下拉动作
            if (pos.y > 50) {
                pullDownDebounce()
            }
        })
        return () => {
            bScroll.off("touchEnd")
        }
    }, [pullDown, pullDownDebounce, bScroll])

    useEffect(() => {
        if (refresh && bScroll) {
            // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
            bScroll.refresh()
        }
    })

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh()
                bScroll.scrollTo(0, 0)
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll
            }
        }
    }))



    const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={PullDowndisplayStyle}><Loading2></Loading2></PullDownLoading>
        </ScrollContainer>
    )
})

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
}

Scroll.propTypes = {
    direction: PropTypes.oneOf(["vertical", "horizontal"]),
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullUp: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,
    pullDownLoading: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool
}

export default Scroll