import React, { Component } from "react"
import "./tailwind.css"
import { TextField } from "./components/text-field"
import { DatePicker } from "./components/date-picker"
import itLocale from "dayjs/locale/it"
import jaLocale from "dayjs/locale/ja"
import { Select } from "./components/select"

class App extends Component {
  render() {
    return (
      <div className="min-h-screen h-full w-full bg-gray-200 flex items-center">
        <div className="mx-auto w-2/3">
          <div className="flex items-stretch">
            <div className="pr-2 flex-1">
              <TextField
                mainColor="blue"
                placeholder="Nome"
                wrapperClassName="w-full"
                valid={true}
              />
            </div>
            <div className="pl-2 flex-1">
              <TextField
                mainColor="blue"
                placeholder="Cognome"
                wrapperClassName="w-full"
                error={true}
              />
            </div>
          </div>
          <div className="mt-4">
            <TextField
              type="email"
              mainColor="blue"
              placeholder="Email"
              wrapperClassName="w-full"
              icons={{ left: emailIcon }}
            />
          </div>
          <div className="mt-4">
            <Select
              placeholder="Sesso"
              wrapperClassName="w-full"
              mainColor="blue"
              options={[
                {
                  value: "m",
                  label: "Uomo",
                },
                {
                  value: "f",
                  label: "Donna",
                },
              ]}
            />
          </div>
          <div className="mt-4">
            <Select
              placeholder="Select di test"
              wrapperClassName="w-full"
              mainColor="blue"
              options={[
                {
                  value: "1",
                  label: "Label 1 AAA",
                },
                {
                  value: "2",
                  label: "Label 2 BBB",
                },
                {
                  value: "3",
                  label: "Label 3 AAABBBCCC",
                },
                {
                  value: "4",
                  label: "Label 4 DDDAAACCC",
                },
                {
                  value: "5",
                  label: "Label 5 YYYTTTDDD",
                },
              ]}
            />
          </div>
          <div className="mt-4 flex">
            <div className="pr-2 flex-1">
              <DatePicker
                mainColor="blue"
                placeholder="dal"
                wrapperClassName="w-full"
                locale={{ code: "it", config: itLocale }}
              />
            </div>
            <div className="pl-2 flex-1">
              <DatePicker
                mainColor="blue"
                placeholder="al"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          <div />
        </div>
      </div>
    )
  }
}

const emailIcon = (
  <svg
    className="fill-current w-6 h-6 mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
  </svg>
)

export default App
