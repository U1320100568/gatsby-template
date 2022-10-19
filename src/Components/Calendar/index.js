import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './calendar.css';
import Block from '../../CustomTemplates/Plan/PlanBlock';
import usePlans from '../../Hooks/usePlans';

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const MONTH_NAMES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

/*
Date Object
month 0 ~ 11
date 1~ 29, 30, 31
day 0 ~ 6 Sunday ~ Saturday
date is UTC time ,must + 08:00
*/

export default function RevCalendar(props) {
  const {
    startDay = 0, // ex. 第一天為星期天
    minDate = null,
    disablePast = false,
    weekNumbers = false,
    onSelect,
    defaultValue = new Date(),
    year,
    setYear,
    month,
    setMonth,
    onUpdate,
    planMap,
  } = props;
  const date = new Date();

  const [firstOfMonth, setFirstMonth] = useState(new Date(year, month, 1));
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(year, month + 1, 0).getDate(),
  );
  const [selected, setSelected] = useState({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    dt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  });
  const [selectedElement, setSelectedElement] = useState(null);

  const calc = useCallback(
    (year, month) => {
      if (selectedElement) {
        if (selected.month !== month || selected.year !== year) {
          selectedElement.classList.remove('r-selected');
        } else {
          selectedElement.classList.add('r-selected');
        }
      }
      return {
        firstOfMonth: new Date(year, month, 1),
        daysInMonth: new Date(year, month + 1, 0).getDate(),
      };
    },
    [selectedElement, selected],
  );

  useEffect(() => {
    const {firstOfMonth, daysInMonth} = calc(year, month);
    setFirstMonth(firstOfMonth);
    setDaysInMonth(daysInMonth);
  }, [year, month]);

  const getPrev = useCallback((year, month) => {
    if (month > 0) {
      setMonth((prev) => prev - 1);
    } else {
      setMonth(11);
      setYear((prev) => prev - 1);
    }
  }, []);

  const getNext = useCallback((year, month) => {
    if (month < 11) {
      setMonth((prev) => prev + 1);
    } else {
      setMonth(0);
      setYear((prev) => prev + 1);
    }
  }, []);

  const selectDate = useCallback(
    (year, month, date, evt) => {
      if (selectedElement) {
        selectedElement.classList.remove('r-selected');
      }
      evt.target.classList.add('r-selected');
      const selected = {year, month, date, dt: new Date(year, month, date)};
      setSelected(selected);
      onSelect(selected);
      setSelectedElement(evt.target);
    },
    [selectedElement, onSelect],
  );

  useEffect(() => {
    onUpdate();
  }, [onUpdate]);

  return (
    <div className="r-calendar">
      <div className="r-inner">
        <MonthHeader
          monthNames={MONTH_NAMES}
          month={month}
          year={year}
          onPrev={getPrev}
          onNext={getNext}
        />
        <WeekHeader
          dayNames={DAY_NAMES}
          startDay={startDay}
          weekNumbers={weekNumbers}
        />
        <MonthDates
          key={firstOfMonth}
          month={month}
          year={year}
          daysInMonth={daysInMonth}
          firstOfMonth={firstOfMonth}
          startDay={startDay}
          onSelect={selectDate}
          weekNumbers={weekNumbers}
          disablePast={disablePast}
          minDate={minDate}
          defaultValue={defaultValue}
          selectedEle={selectedElement}
          planMap={planMap}
        />
      </div>
    </div>
  );
}

function MonthHeader(props) {
  return (
    <div className="r-row r-head">
      <div
        className="r-cell r-prev"
        onClick={() => props.onPrev(props.year, props.month)}
        role="button"
        tabIndex="0"
      />
      <div className="r-cell r-title">
        {props.year}-{props.monthNames[props.month]}
      </div>
      <div
        className="r-cell r-next"
        onClick={() => props.onNext(props.year, props.month)}
        role="button"
        tabIndex="0"
      />
    </div>
  );
}

function WeekHeader(props) {
  const haystack = Array.from({length: 7}).map(Number.call, Number);
  return (
    <div className="r-row r-weekdays">
      {(() => {
        if (props.weekNumbers) {
          return <div className="r-cell r-weeknum">wn</div>;
        }
      })()}
      {haystack.map((item, i) => {
        return (
          <div key={'' + item + i} className="r-cell">
            {props.dayNames[(props.startDay + i) % 7]}
          </div>
        );
      })}
    </div>
  );
}

function MonthDates(props) {
  const {
    month,
    year,
    daysInMonth,
    firstOfMonth,
    startDay,
    onSelect,
    weekNumbers,
    disablePast,
    minDate,
    defaultValue,
    selectedEle,
    planMap,
  } = props;
  const today = useRef(new Date(new Date().setHours(0, 0, 0, 0))).current;

  const {janOne, rows, haystack, weekStack, day} = useMemo(() => {
    let rows = 5;
    let first = firstOfMonth.getDay(); // 這個月第一天是星期幾
    if (
      (first === 6 && daysInMonth === 31) ||
      (first === 0 && daysInMonth > 29)
    ) {
      rows = 6;
    }

    let day = props.startDay + 1 - first; // 作爲月曆第一天的定位點，ex. -3 = 上個月倒數第三天
    while (day > 1) {
      day -= 7;
    }
    day -= 1;

    return {
      janOne: new Date(year, 0, 1), // year-01-01
      rows,
      haystack: Array.apply(null, {length: rows}).map(Number.call, Number), // weeks of a month
      weekStack: Array.apply(null, {length: 7}).map(Number.call, Number), // 0 ~ 7
      day,
    };
  }, [firstOfMonth, year, daysInMonth, startDay]);

  return (
    <div className={rows === 6 ? 'r-dates' : 'r-dates r-fix'}>
      {haystack.map((item, i) => {
        let firstDateInWeek = day + i * 7; //ex. 第一週第一天 = -3(上個月28號), 第二週第一天 = 4(這個月 5號)
        return (
          <div key={i} className="r-row">
            {(() => {
              if (weekNumbers) {
                var wn = Math.ceil(
                  ((new Date(year, month, firstDateInWeek) - janOne) /
                    86400000 +
                    janOne.getDay() +
                    1) /
                    7,
                );
                return <div className="r-cell r-weeknum">{wn}</div>;
              }
            })()}
            {weekStack.map((item, i) => {
              let className = 'r-cell';
              let d = firstDateInWeek + i + 1; // 每月幾號
              let isDate = d > 0 && d <= daysInMonth; // 有無在當月

              if (isDate) {
                className += ' r-date';

                let current = new Date(year, month, d);
                let isToday = current.getTime() === today.getTime(); // 是否今天
                if (isToday) {
                  className += ' r-today';
                }

                let isSelectable = true; // 可以點選
                if (disablePast && current < today) {
                  isSelectable = false;
                } else if (minDate !== null && current < minDate) {
                  isSelectable = false;
                }

                if (!isSelectable) {
                  className += ' r-past';
                }

                let isSelected = // 被選到
                  year === defaultValue.getFullYear() &&
                  month === defaultValue.getMonth() &&
                  d === defaultValue.getDate() &&
                  !selectedEle;

                if (isSelected) {
                  className += ' r-selected';
                }

                return (
                  <Block
                    key={d}
                    className={className}
                    isDate={isDate}
                    isToday={isToday}
                    isSelectable={isSelectable}
                    isSelected={isSelected}
                    onClick={(e) => {
                      onSelect(
                        current.getFullYear(),
                        current.getMonth(),
                        current.getDate(),
                        e,
                      );
                    }}
                    plans={planMap[d]}
                    date={new Date(year, month, d)}>
                    {d}
                  </Block>
                );
              }

              return <Block key={d} className="r-cell"></Block>;
            })}
          </div>
        );
      })}
    </div>
  );
}
