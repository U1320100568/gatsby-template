import React from 'react';
import styled from 'styled-components';

const SWIPE_STATE = {
  idle: 0,
  trans: 1,
  swipe: 2,
};

function Carousel(props) {
  const {
    width,
    height,
    data = [1, 2, 3],
    renderItem: _renderItem,
    disableSwipe,
    currIdxFromParent,
    style = {},
  } = props;
  const scrollViewRef = React.useRef();
  const swipeState = React.useRef(SWIPE_STATE.idle);
  const swipeOffset = React.useRef(null);
  const controllerRef = React.useRef();
  const dimension = {width, height};

  function goToIndex(idx) {
    if (idx === data.length || idx < 0) {
      idx = 0;
    } else if (idx >= data.length) {
      idx = data.length - 1;
    }

    const curr = scrollViewRef.current.scrollLeft;
    const target = idx * width;
    const steps = 10;
    const diff = (target - curr) / steps;
    let stepCnt = 0;

    function updateScrollLeft() {
      stepCnt++;

      if (stepCnt === steps) {
        scrollViewRef.current.scrollLeft = target;
        controllerRef.current.setCurrIdx(idx);
      } else if (stepCnt < steps) {
        scrollViewRef.current.scrollLeft += diff;
        requestAnimationFrame(updateScrollLeft);
      }
    }

    requestAnimationFrame(updateScrollLeft);
  }

  function finalizeMouseMovement() {
    const idx = Math.round(scrollViewRef.current.scrollLeft / width);
    scrollViewRef.current.scrollLeft = idx * width;
    controllerRef.current.setCurrIdx(idx);
  }

  function onMouseDown() {
    swipeState.current = SWIPE_STATE.trans;
  }

  function onMouseUp() {
    swipeState.current = SWIPE_STATE.idle;
    finalizeMouseMovement();
  }

  function onMouseLeave() {
    swipeState.current = SWIPE_STATE.idle;
    finalizeMouseMovement();
  }

  function onMouseMove(e) {
    if (swipeState.current > SWIPE_STATE.idle) {
      if (swipeState.current === SWIPE_STATE.trans) {
        swipeState.current = SWIPE_STATE.swipe;
      } else {
        let diff = e.nativeEvent.clientX - swipeOffset.current;
        scrollViewRef.current.scrollLeft += diff;
        if (scrollViewRef.current.scrollLeft < 0) {
          scrollViewRef.current.scrollLeft = 0;
        }
      }

      swipeOffset.current = e.nativeEvent.clientX;
    }
  }

  const mouseEventHandlers = disableSwipe
    ? {}
    : {
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
      };

  function ItemComp(props) {
    if (_renderItem) {
      return _renderItem(props);
    }
    return <SimpleItem {...props}>{JSON.stringify(props.item)}</SimpleItem>;
  }

  return (
    <Wrapper {...dimension} data={data} style={style}>
      <div className="placeholder" ref={scrollViewRef} {...mouseEventHandlers}>
        <div className="content">
          {data.map((item, idx) => {
            return (
              <div className="item" key={idx}>
                <ItemComp item={item} dimension={dimension} />
              </div>
            );
          })}
        </div>
      </div>

      <Controller
        {...props}
        goToIndex={goToIndex}
        currIdxFromParent={currIdxFromParent}
        getInstance={(inst) => {
          controllerRef.current = inst;
        }}
      />
    </Wrapper>
  );
}

function Controller(props) {
  const {
    data,
    renderPrev: _renderPrev,
    renderNext: _renderNext,
    renderDots: _renderDots,
    defaultIdx,
    goToIndex,
    getInstance,
    currIdxFromParent,
  } = props;
  let [currIdx, setCurrIdx] = React.useState(defaultIdx || 0);

  if (getInstance) {
    getInstance({
      currIdx,
      setCurrIdx,
    });
  }
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const nextIdx = currIdx + 1;
      goToIndex(nextIdx);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currIdx]);

  React.useEffect(() => {
    goToIndex(currIdxFromParent);
  }, [currIdxFromParent]);

  function goToNext() {
    goToIndex(currIdx + 1);
  }

  function goToPrev() {
    goToIndex(currIdx - 1);
  }

  function PrevComp(props) {
    if (_renderPrev) {
      return _renderPrev(props);
    } else if (_renderPrev === null) {
      return null;
    }
    return <SimplePrev onClick={goToPrev} {...props}>{`<`}</SimplePrev>;
  }

  function NextComp(props) {
    if (_renderNext) {
      return _renderNext(props);
    } else if (_renderNext === null) {
      return null;
    }
    return <SimpleNext onClick={goToNext} {...props}>{`>`}</SimpleNext>;
  }

  function Dots(props) {
    if (_renderDots) {
      return _renderDots(props);
    } else if (_renderDots === null) {
      return null;
    }
    return <SimpleDots>{`${currIdx + 1} / ${data.length}`}</SimpleDots>;
  }

  const commonProps = {currIdx, goToIndex};

  return (
    <>
      <NextComp {...commonProps} />
      <PrevComp {...commonProps} />
      <Dots {...commonProps} />
    </>
  );
}

const Wrapper = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;

  & > .placeholder {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    & > .content {
      width: ${(props) => props.width * props.data.length}px;
      display: flex;

      & > .item {
        flex: 0 0 ${(props) => props.width}px;
        height: ${(props) => props.height}px;
      }
    }
  }
`;

const SimpleItem = styled.div`
  width: ${(props) => props.dimension.width}px;
  height: ${(props) => props.dimension.height}px;
  background-color: pink;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SimpleNext = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  right: 0px;
  top: calc(50% - 16px);
  border: 1px solid black;
  background-color: white;
`;

const SimplePrev = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  left: 0px;
  top: calc(50% - 16px);
  border: 1px solid black;
  background-color: white;
`;

const SimpleDots = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
`;

export default Carousel;
