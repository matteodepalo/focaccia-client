import { GiBubbles, GiWheat, GiWaterDrop, GiSaltShaker, GiCoolSpices } from "react-icons/gi"
import { BsBoxArrowRight, BsPencilSquare, BsBoxArrowUpRight, BsFileEarmarkText, BsTrash, BsPlusCircle, BsFileEarmarkCheck, BsDashCircle, BsThreeDotsVertical, BsPersonSquare, BsBoxArrowInRight, BsExclamationTriangleFill } from "react-icons/bs"
import { CSSProperties } from "react"

export type IconProps = {
  color?: string
  size?: number
  style?: CSSProperties
}

type IconName = "yeast" | "flour" | "water" | "salt" | "misc" | "log-out"
  | "edit" | "share" | "recipe" | "trash" | "add" | "save" | "remove" | "drag-handle"
  | "user" | "log-in" | "warning"

export function icon(name: IconName, props?: IconProps) {
  switch (name) {
    case "yeast":
      return <GiBubbles color="brown" {...props} />
    case "flour":
      return <GiWheat color="brown" {...props} />
    case "water":
      return <GiWaterDrop color="teal" {...props} />
    case "salt":
      return <GiSaltShaker {...props} />
    case "misc":
      return <GiCoolSpices {...props} />
    case "log-out":
      return <BsBoxArrowRight {...props} />
    case "edit":
      return <BsPencilSquare {...props} />
    case "share":
      return <BsBoxArrowUpRight {...props} />
    case "recipe":
      return <BsFileEarmarkText {...props} />
    case "trash":
      return <BsTrash {...props} />
    case "add":
      return <BsPlusCircle {...props} />
    case "save":
      return <BsFileEarmarkCheck {...props} />
    case "remove":
      return <BsDashCircle {...props} />
    case "drag-handle":
      return <BsThreeDotsVertical {...props} />
    case "user":
      return <BsPersonSquare {...props} />
    case "log-in":
      return <BsBoxArrowInRight {...props} />
    case "warning":
      return <BsExclamationTriangleFill {...props} />
    default:
      throw new Error(`No icon for name ${name}`)
  }
}