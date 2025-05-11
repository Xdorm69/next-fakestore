import React from 'react'
import {motion} from "motion/react"

const Title = ({title, icon}: {title: string, icon: string}) => {
  return (
    <>
      <div className="flex gap-4 items-center my-10">
        <div className="text-5xl mb-4 font-bold bg-gradient-to-b from-primary to-chart-5 bg-clip-text text-transparent ">
          {title}
        </div>
        <motion.div
          className="h-fit w-fit relative bottom-1"
          initial={{ scale: 1 }}
          animate={{ scale: [1.5, 3, 1.5], rotate: [-24, 24, -24, 24, -24] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <div>{icon}</div>
        </motion.div>
      </div>
    </>
  );
}

export default Title