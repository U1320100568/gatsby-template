import React from 'react';
import styled from 'styled-components';

function FixedRatioImage(props) {
  let {
    width,
    ratio,
    children,
    image,
    mode = 'contain',
    extraCss = '',
    rwd = null,
    style = {},
    onClick = () => 0,
  } = props; // ratio = h/w
  if (width) {
    return (
      <div style={{...style, width}} onClick={onClick}>
        <Wrapper
          className="fixed-ratio-image"
          ratio={ratio}
          width={width}
          style={{backgroundImage: `url("${image}")`}}
          mode={mode}
          extraCss={extraCss}
          rwd={rwd}>
          <div className="content">{children}</div>
        </Wrapper>
      </div>
    );
  }

  return (
    <Wrapper
      className="fixed-ratio-image"
      style={{backgroundImage: `url("${image}")`}}
      ratio={ratio}
      width={width}
      image={image}
      mode={mode}
      extraCss={extraCss}
      rwd={rwd}
      onClick={onClick}>
      <div className="content">{children}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  --ratio: ${(props) => props.ratio};

  height: 0;
  ${(props) =>
    props.width
      ? `width: ${
          typeof props.width === 'number'
            ? `${props.width}px`
            : `${props.width}`
        };`
      : ''};
  overflow: hidden;
  padding-top: calc(var(--ratio) * 100%);
  position: relative;
  background-size: ${(props) => props.mode || 'contain'};
  background-position: center;

  & > .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ${(props) =>
    props.rwd &&
    props.rwd.map(
      (r) =>
        `
        @media screen and (max-width: ${r.breakpoint}px) {
          --ratio: ${r.ratio};
        }
        `,
    )}

  ${(props) => props.extraCss}
`;

export default FixedRatioImage;
