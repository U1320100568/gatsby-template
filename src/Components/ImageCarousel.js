import React from 'react';
import styled from 'styled-components';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import FixedRatioImage from './FixedRatioImage';
import {navigate} from 'gatsby';

function ImageCarousel(props) {
  const {
    images,
    ratio = 4 / 6,
    thumbRatio = 1,
    itemExtraCss = '',
    showThumbs = true,
    showIndicators = false,
    autoPlay = false,
    interval = 300,
    showArrows = false,
    renderArrowPrev = () => null,
    renderArrowNext = () => null,
    carouselRef,
  } = props;
  return (
    <CarouselWrapper>
      <Carousel
        ref={carouselRef}
        axis={'horizontal'}
        infiniteLoop
        autoPlay={autoPlay}
        interval={interval}
        showIndicators={showIndicators}
        showStatus={false}
        showArrows={showArrows}
        showThumbs={showThumbs}
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
        thumbWidth={100}
        renderThumbs={(thumbs) =>
          images.map((image, idx) => <Thumbs key={idx} image={image.url} />)
        }>
        {images.map((image, idx) => (
          <FixedRatioImage
            key={idx}
            image={image.url}
            ratio={ratio}
            mode={'cover'}
            extraCss={itemExtraCss + `${image.link ? 'cursor: pointer;' : ''}`}
            onClick={() => {
              image.link && navigate(image.link);
            }}
          />
        ))}
      </Carousel>
    </CarouselWrapper>
  );
}

function Thumbs(props) {
  const {image} = props;
  return <ThumbWrapper image={image} />;
}

const ThumbWrapper = styled.div`
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
`;

const IconContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  ${(props) => (props.left ? 'left: 15px;' : '')}
  ${(props) => (props.right ? 'right: 15px;' : '')}

  top: 50%;
  z-index: 1;
  transform: translateY(-50%);

  cursor: pointer;
  border: 0px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  width: 40px;
  height: 40px;

  :focus {
    outline: none;
  }
`;

const CarouselWrapper = styled.div`
  /* overwrite library style */
  & .carousel {
    & > .thumbs-wrapper {
      margin: 10px 0px 0px;
      overflow-x: auto;

      & > .thumbs {
        padding: 0px;
        & > .thumb {
          height: 100px;
          cursor: pointer;
          border: none;
          margin-right: 10px;
        }
        & > .thumb.selected,
        & > .thumb.selected:hover {
          border: none;
        }
      }
    }

    .control-dots {
      text-align: center;
      padding-right: 80px;

      & > .dot {
        opacity: 1;
        background: #fff;
      }

      & > .dot.selected {
        background-color: #9a9a9a;
      }
    }
  }
`;

export default ImageCarousel;
