import { ExpandLess, ExpandMore } from '@mui/icons-material'
import React from 'react'

function PercentageChangeRow({percentChange, hide, hideSm}){
    return <td className={` ${hideSm ? "hidden sm:table-cell" : ""} ${hide ? "hidden lg:table-cell" : ""}  ${percentChange > 0 ? "text-green-500 p-2.5" : "text-red-500 p-2.5"}`}>
        <p className='flex items-center'>
            <span>{percentChange > 0 ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}</span>
            <span>{percentChange.toFixed(2)}%</span>
        </p>
    </td>
}

export default PercentageChangeRow