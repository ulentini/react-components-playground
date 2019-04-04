import React, { useState } from "react"
import PropTypes from "prop-types"

export function Button({ children, color, className }) {
  const [bgColor, setBgColor] = useState(`bg-${color}`)
  const [shadow, setShaodw] = useState("shadow")

  return (
    <div className="inline-block">
      <span
        onClick={() => animateClick({ color, setBgColor, setShaodw })}
        className={`cursor-pointer inline-block
          ${shadow} ${bgColor}
          py-2 px-4 font-semibold text-white
          rounded ${className}`}
      >
        {children}
      </span>
    </div>
  )
}

function animateClick({ color, setBgColor, setShaodw, iterations = 1 }) {
  const delay = 150

  ;(async () => {
    for (let i = 0; i < iterations; i++) {
      setBgColor(`bg-${color}-600`)
      setShaodw(`shadow-none`)
      await sleep(delay)
      setBgColor(`bg-${color}-400`)
      setShaodw(`shadow`)
      await sleep(delay)
    }
  })()
}

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
}
