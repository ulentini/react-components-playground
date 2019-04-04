import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import { TextField } from "./text-field"
import originalDayJs from "dayjs"

//DayJS Plugins
import customParseFormat from "dayjs/plugin/customParseFormat"
import LocalizedFormat from "dayjs/plugin/localizedFormat"

originalDayJs.extend(customParseFormat)
originalDayJs.extend(LocalizedFormat)

export function DatePicker({
  onFocus,
  onBlur,
  onDateChange,
  format,
  locale = null,
  ...props
}) {
  const [overlayIsVisible, setOverlayVisible] = useState(false)
  const [preventHide, setPreventHide] = useState(false)
  const [currentDate, setCurrentDate] = useState(null)
  const inputRef = useRef()
  const date = props.date || currentDate
  const currentFormat = format
    ? format
    : locale
    ? locale.config.formats.L
    : "YYYY-MM-DD"

  const dayjs = localizedDayJs(locale)

  if (preventHide) {
    setTimeout(() => setPreventHide(false), 100)
  }

  let showOverlay = overlayIsVisible || preventHide

  let formattedDate
  let selectedDate
  if (date instanceof Date) {
    formattedDate = dayjs(date).format(currentFormat)
    selectedDate = date
  } else if (typeof date === "string") {
    formattedDate = date
    selectedDate = null
  } else {
    formattedDate = ""
    selectedDate = null
  }

  return (
    <div className="relative">
      <TextField
        ref={inputRef}
        onFocus={event => {
          setOverlayVisible(true)
          onFocus && onFocus(event)
        }}
        onBlur={event => {
          if (preventHide) {
            inputRef.current.focus()
          } else {
            onBlur && onBlur(event)
            setOverlayVisible(false)

            if (typeof date === "string") {
              const newDayJs = dayjs(date, currentFormat)
              if (newDayJs.isValid()) {
                setCurrentDate(newDayJs.toDate())
              } else {
                setCurrentDate(null)
              }
            }
          }
        }}
        value={formattedDate}
        onChange={newValue => {
          setCurrentDate(newValue)
        }}
        {...props}
      />

      {showOverlay && (
        <CalendarOverlay
          date={selectedDate}
          onDateSelect={date => {
            onDateChange && onDateChange(date)
            setCurrentDate(date)
          }}
          onMonthChange={() => {
            setPreventHide(true)
            // setTimeout(() => inputRef.current.focus(), 50)
          }}
          locale={locale}
        />
      )}
    </div>
  )
}

DatePicker.propTypes = {
  date: PropTypes.instanceOf(Date),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onDateChange: PropTypes.func,
  format: PropTypes.string,
  locale: PropTypes.object,
}

function CalendarOverlay({ onDateSelect, date, onMonthChange, locale }) {
  const dayjs = localizedDayJs(locale)
  const currentDate =
    date ||
    dayjs()
      .startOf("day")
      .toDate()

  const [displayDate, setDisplayDate] = useState(currentDate)

  const updateMonthToDisplay = monthToDisplay => {
    setDisplayDate(monthToDisplay)
    onMonthChange && onMonthChange(monthToDisplay)
  }

  const showPrevMonth = () => {
    const monthToDisplay = dayjs(displayDate)
      .subtract(1, "month")
      .toDate()
    updateMonthToDisplay(monthToDisplay)
  }

  const showNextMonth = () => {
    const monthToDisplay = dayjs(displayDate)
      .add(1, "month")
      .toDate()
    updateMonthToDisplay(monthToDisplay)
  }

  return (
    <div className="absolute top-0 left-0 mt-16 rounded bg-white shadow-md p-2 text-gray-800 text-sm z-20">
      <div className="flex justify-between">
        <CalendarCell onClick={() => showPrevMonth()}>
          <svg
            className="w-6 h-6 text-gray-500 fill-current mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
          </svg>
        </CalendarCell>
        <span className="text-xs text-gray-600 flex items-center h-8 px-2 uppercase">
          {dayjs(displayDate).format("MMMM YYYY")}
        </span>
        <CalendarCell onClick={() => showNextMonth()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500 fill-current mx-auto"
            viewBox="0 0 20 20"
          >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
          </svg>
        </CalendarCell>
      </div>
      <WeekRow locale={locale} />
      <MonthGrid
        selectedDate={currentDate}
        displayDate={displayDate}
        onDateSelect={date => {
          onDateSelect && onDateSelect(date)
          setDisplayDate(date)
        }}
        locale={locale}
      />
    </div>
  )
}

CalendarOverlay.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func,
  onMonthChange: PropTypes.func,
  locale: PropTypes.object,
}

function CalendarCell({
  children,
  date = null,
  selected = false,
  onClick = null,
  className = "",
  hover = "blue-100",
}) {
  const bgColor = selected ? "bg-blue-600" : "bg-transparent"
  const hoverColor = selected ? "" : "hover:bg-" + hover
  const textColor = selected ? "text-white" : ""
  return (
    <span
      className={`h-8 w-8 flex items-center rounded ${bgColor} ${textColor} ${hoverColor} cursor-default ${className}`}
      onMouseDown={() => onClick && onClick(date)}
    >
      <span className="block text-center w-full h-auto">{children}</span>
    </span>
  )
}

CalendarCell.propTypes = {
  children: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  hover: PropTypes.string,
}

const WEEK_DATES = [
  new Date("1970-01-05"),
  new Date("1970-01-06"),
  new Date("1970-01-07"),
  new Date("1970-01-08"),
  new Date("1970-01-09"),
  new Date("1970-01-10"),
  new Date("1970-01-11"),
]

function WeekRow({ locale }) {
  const dayjs = localizedDayJs(locale)
  return (
    <div className="flex">
      {WEEK_DATES.map(day => (
        <CalendarCell
          key={`wd-${day.getDay()}`}
          className="text-xs text-gray-600"
          hover="transparent"
        >
          <span className="capitalize">{dayjs(day).format("dd")}</span>
        </CalendarCell>
      ))}
    </div>
  )
}

WeekRow.propTypes = {
  locale: PropTypes.object,
}

function MonthGrid({ displayDate, selectedDate, onDateSelect, locale }) {
  const dayjs = localizedDayJs(locale)

  const firstDayOfMonth = dayjs(displayDate).startOf("month")
  const lastDayOfMonth = dayjs(displayDate).endOf("month")

  const firstDayToShow = firstDayOfMonth.startOf("week")
  const lastDayToShow = lastDayOfMonth.endOf("week")

  const daysToShow = []
  for (
    let currendDay = firstDayToShow;
    currendDay.isBefore(lastDayToShow);
    currendDay = currendDay.add(1, "day")
  ) {
    daysToShow.push(currendDay)
  }

  if (daysToShow.length % 7 !== 0) {
    throw new Error(
      "Somenthing went really wrong while generating days to render",
    )
  }

  const weeks = chunkArray(daysToShow, 7)

  return (
    <div onClick={event => event.stopPropagation()}>
      {weeks.map((week, i) => (
        <div className="flex" key={`w-${i}`}>
          {week.map(day => (
            <CalendarCell
              selected={dayjs(selectedDate).isSame(day)}
              onClick={onDateSelect}
              key={day.date()}
              date={day.toDate()}
              className={`${
                day.isBefore(firstDayOfMonth) || day.isAfter(lastDayOfMonth)
                  ? "text-gray-400"
                  : ""
              }`}
            >
              {day.date()}
            </CalendarCell>
          ))}
        </div>
      ))}
    </div>
  )
}

MonthGrid.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  displayDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func,
  locale: PropTypes.object,
}

function chunkArray(array, size) {
  var sets = [],
    chunks,
    i = 0
  chunks = array.length / size

  while (i < chunks) {
    sets[i] = array.splice(0, size)
    i++
  }

  return sets
}

function localizedDayJs(locale = null) {
  if (!locale) {
    return originalDayJs
  } else {
    const { code, config } = locale
    return (...args) => {
      const d1 = originalDayJs(...args)
      const d2 = d1.locale(code, config)
      return d2
    }
  }
}
