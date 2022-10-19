import React from 'react';

function CountdownTimer(props) {
  const {endTimeMs, renderText, style = {}} = props;
  const [remaining, setRemaining] = React.useState(
    endTimeMs > new Date().getTime() ? endTimeMs - new Date().getTime() : 0,
  );

  React.useEffect(() => {
    let now = new Date().getTime();
    let timer;

    if (now < endTimeMs) {
      timer = setTimeout(() => {
        setRemaining(endTimeMs - now);
      });
    } else {
      setRemaining(0);
    }
  }, [remaining, endTimeMs]);

  if (remaining === 0) {
    return props.children;
  }

  return (
    <div style={style}>
      {typeof renderText === 'function'
        ? renderText(Math.ceil(remaining / 1000))
        : `${Math.ceil(remaining / 1000)}`}
    </div>
  );
}

export default CountdownTimer;
