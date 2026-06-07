import React from 'react'

function CardBox({userName,para="This para is empty"}) {
  // console.log("props",props)
  return (
     <div className="w-[300px] h-[250px] rounded-3xl shadow-md border border-black  overflow-hidden mt-5">
        {/* <img
          src="img/pexels-leefinvrede-32489805.jpg"
          alt=""
          className="object-cover object-center w-full h-[180px] rounded-t-md bg-gray-500"
        /> */}
        <div className="flex flex-col justify-between p-4 space-y-4 h-[220px]">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-wide">{userName}</h2>
            <p className="text-xl text-black line-clamp-3">
              {para}
            </p>
          </div>
          <button
            type="button"
            className="text-sm cursor-pointer hover:bg-blue-300 flex items-center justify-center w-full p-2 font-medium tracking-wide rounded-md bg-gray-800 "
          >
            Read more
          </button>
        </div>
      </div>
  )
}

export default CardBox