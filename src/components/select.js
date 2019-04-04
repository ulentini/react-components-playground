import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField } from "./text-field"

export function Select({
  options,
  onChange,
  value,
  dropdownMaxHeight = "8rem",
  ...props
}) {
  const [isFocused, setFocused] = useState(false)

  const currentValue = value
    ? options.find(option => option.value === value)
    : null
  const [activeOption, setActiveOption] = useState(currentValue)
  const [selectedOption, setSelectedOption] = useState(null)

  const [label, setLabel] = useState(currentValue ? currentValue.label : "")

  const updateOption = option => {
    setLabel(option.label)
    setActiveOption(option)
    onChange && onChange(option)
  }

  const searchOption = term => {
    const normalizedTerm = term.toLowerCase()

    //Search by label
    let newOption = options.find(option => {
      return option.label.toLowerCase().indexOf(normalizedTerm) >= 0
    })

    //Search by value
    if (!newOption) {
      newOption = options.find(option => {
        return option.value.toLowerCase().indexOf(normalizedTerm) >= 0
      })
    }

    return newOption
  }

  const normalizedTextValue = label.toLowerCase()
  const displayOptions = options.filter(
    option =>
      option.label.toLowerCase().indexOf(normalizedTextValue) >= 0 ||
      option.value.toLowerCase().indexOf(normalizedTextValue) >= 0,
  )

  const getAdjacentOption = direction => {
    let diff
    switch (direction) {
      case "up":
        diff = -1
        break

      case "down":
        diff = 1
        break

      default:
        diff = null
    }

    let newIndex = 0
    if (diff) {
      if (selectedOption) {
        const foundIndex = displayOptions.findIndex(
          option => option.value === selectedOption.value,
        )
        newIndex =
          (foundIndex + diff + displayOptions.length) % displayOptions.length
      }
    }
    return newIndex
  }

  const selectNewOption = () => {
    setFocused(false)
    if (selectedOption) {
      updateOption(selectedOption)
    } else if (activeOption) {
      setLabel(activeOption.label)
    } else {
      setLabel("")
    }
  }

  return (
    <div className="relative">
      <TextField
        {...props}
        type="text"
        icons={{ right: icon }}
        onFocus={() => {
          setFocused(true)
          setLabel("")
        }}
        onBlur={selectNewOption}
        value={label}
        onChange={newValue => {
          setLabel(newValue)
          if (newValue && newValue.length > 0) {
            const foundOption = searchOption(newValue)
            if (foundOption) {
              setSelectedOption(foundOption)
            }
          } else {
            setSelectedOption(null)
          }
        }}
        onKeyDown={event => {
          switch (event.key) {
            case "ArrowDown":
              setSelectedOption(displayOptions[getAdjacentOption("down")])
              break

            case "ArrowUp":
              setSelectedOption(displayOptions[getAdjacentOption("up")])
              break

            case "Enter":
              selectNewOption()
              break

            default:
              break
          }
        }}
      />
      {isFocused && (
        <div
          className="absolute top-0 mt-14 w-full rounded bg-white shadow z-20 overflow-auto"
          style={{
            maxHeight: dropdownMaxHeight,
          }}
        >
          {displayOptions &&
            displayOptions.map(option => {
              const activeOptionClass =
                activeOption && activeOption.value === option.value
                  ? "text-blue-600 font-bold"
                  : "text-gray-600"

              const selectedOptionClass =
                selectedOption && selectedOption.value === option.value
                  ? "bg-blue-100"
                  : "bg-white"
              return (
                <div
                  className={`text-sm p-2 ${activeOptionClass} ${selectedOptionClass}`}
                  key={`option-${option.value}`}
                  onMouseDown={() => {
                    updateOption(option)
                  }}
                  onMouseOver={() => setSelectedOption(option)}
                >
                  {option.label}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className="w-6 h-6 mx-auto fill-current"
  >
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  </svg>
)

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  dropdownMaxHeight: PropTypes.string,
}
