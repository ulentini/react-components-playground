import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

export function InputPlaceholder({
  placeholder,
  inputValue,
  isFocused,
  mainColor,
  error,
  valid,
  className,
  ...props
}) {
  const [transitionClasses, setTransitionClasses] = useState("")
  useEffect(() => {
    setTimeout(
      () =>
        setTransitionClasses("tr-pt-fs-color tr-timing-ease tr-duration-200"),
      100,
    )
  }, [])

  let py = "pt-3"
  let textColor = "text-gray-400"
  let textSize = "text-base"
  if (isFocused || inputValue.length > 0) {
    py = "pt-1"
    textColor = `text-${mainColor}-500`
    textSize = "text-xs"
  }

  if (!isFocused) {
    textColor = "text-gray-400"
  }

  if (error) {
    textColor = "text-red-500"
  } else if (valid) {
    textColor = "text-green-500"
  }

  return placeholder ? (
    <div
      className={`w-full text-left h-auto
      absolute top-0 left-0 ${transitionClasses}
      ${py} px-3 ${textColor} ${textSize} ${className}`}
      {...props}
    >
      {placeholder}
    </div>
  ) : null
}

InputPlaceholder.propTypes = {
  placeholder: PropTypes.string,
  inputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  mainColor: PropTypes.string,
  error: PropTypes.bool,
  valid: PropTypes.bool,
  className: PropTypes.string,
}
