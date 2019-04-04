import React, { useRef, useState, useImperativeHandle, forwardRef } from "react"
import PropTypes from "prop-types"
import { InputPlaceholder } from "./input-placeholder"

let TextField = function(
  {
    className,
    wrapperClassName,
    mainColor,
    placeholder,
    type = "text",
    value,
    defaultValue,
    error,
    valid,
    onChange,
    onFocus,
    onBlur,
    icons,
    ...props
  },
  ref,
) {
  const inputRef = useRef()
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    },
    blur: () => {
      inputRef.current.blur()
    },
  }))
  const [inputValue, setInputValue] = useState(defaultValue || "")
  const [isFocused, setFocused] = useState(false)
  const textColor = `text-${isFocused ? "gray" : mainColor}-700`

  const currentValue = typeof value === "string" ? value : inputValue

  if (error && valid) {
    console.warn(
      "A field cannot have both properties `error` and `valid` set to true. \n Error has priority",
    )
  }

  const bgColor = error ? "bg-red-100" : valid ? "bg-green-100" : "bg-white"
  const borderColor = error
    ? "border-red-500 focus:border-red-500"
    : valid
    ? "border-green-500 focus:border-green-500"
    : `border-gray-400 focus:border-${mainColor}-500`

  let xPaddingList = ["pl-3", "pr-3"]
  let placeholderMargin = ""
  if (icons && icons.left) {
    xPaddingList[0] = "pl-12"
    placeholderMargin += " pl-12 "
  }
  if (icons && icons.right) {
    xPaddingList[1] = "pr-12"
    placeholderMargin += " pr-12 "
  }

  const xPadding = xPaddingList.join(" ")

  //setTimeout is used because of a bug on macos
  const focusInput = () => setTimeout(() => inputRef.current.focus(), 50)

  return (
    <div className={`relative inline-block ${wrapperClassName}`}>
      {icons && icons.left && (
        <Icon onMouseDown={focusInput} position="left">
          {icons.left}
        </Icon>
      )}
      <input
        aria-label={placeholder}
        ref={inputRef}
        type={type}
        className={`rounded-t ${bgColor} shadow
        border-b-2  ${borderColor}
        pt-5 pb-1 outline-none ${xPadding}
        ${textColor} font-semibold w-full ${className}`}
        value={currentValue}
        onChange={event => {
          const newValue = event.target.value
          setInputValue(newValue)
          onChange && onChange(newValue)
        }}
        onFocus={event => {
          setFocused(true)
          onFocus && onFocus(event)
        }}
        onBlur={event => {
          setFocused(false)
          onBlur && onBlur(event)
        }}
        {...props}
      />
      {icons && icons.right && (
        <Icon onMouseDown={focusInput} position="right">
          {icons.right}
        </Icon>
      )}

      {InputPlaceholder({
        placeholder,
        inputValue: currentValue,
        isFocused,
        mainColor,
        error,
        valid,
        className: placeholderMargin,
        onMouseDown: focusInput,
      })}
    </div>
  )
}

TextField = forwardRef(TextField)

TextField.propTypes = {
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  mainColor: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  error: PropTypes.bool,
  valid: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  icons: PropTypes.object,
}

function Icon({ children, position, ...props }) {
  return (
    <div
      className={`absolute top-0 ${position}-0 z-10 rounded-r overflow-hidden`}
      {...props}
    >
      <span className="flex items-center w-12 h-12 text-gray-400">
        {children}
      </span>
    </div>
  )
}

Icon.propTypes = {
  children: PropTypes.element,
  position: PropTypes.oneOf(["left", "right"]).isRequired,
}

export { TextField }
