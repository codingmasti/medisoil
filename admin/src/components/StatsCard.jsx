

const StatsCard = ({mainText, value, iconColor, iconBgColor, icon}) => {
  return (
    <div className='flex ml-1 h-20 p-2 rounded-lg gap-2 w-55 bg-white shadow-md mt-2'>
        <div 
        style={{background: iconBgColor, color:iconColor}}
        className={`p-1 rounded-full w-12 h-12 flex items-center justify-center `}>
            {icon}
        </div>
        <div>
            <h3 className='font-semibold line-clamp-1'>{mainText}</h3>
            <span className='font-bold text-3xl'>{value}</span>
        </div>
    </div>
  )
}

export default StatsCard