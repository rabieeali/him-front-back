
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

const MyDropdown = ({ items }) => {
    const [toggle, setToggle] = useState(false)


    const languageHandler = (value) => {
        if (value == 1) {
            document.body.dir = "ltr"
        } else {
            document.body.dir = "rtl"
        }
        setToggle(pre => !pre)
    }

    return (
        <>
            <button onClick={() => setToggle(pre => !pre)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Lang / زبان
                <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>

            <div id="dropdown" className={`z-10 ${toggle ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">

                    {items.map(lang => (
                        <li onClick={() => languageHandler(lang.value)} key={lang.id}>
                            <span data-value={lang.value} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{lang.title}</span>
                        </li>
                    ))}



                </ul>
            </div>
        </>

    )
}




MyDropdown.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string || PropTypes.number,
            value: PropTypes.string || PropTypes.number,
            title: PropTypes.string
        })
    )
}

export default MyDropdown