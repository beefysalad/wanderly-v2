import { Compass } from "lucide-react-native"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"

import { Aurora } from "./aurora"

type BrandMarkProps = {
  size?: number
}

/** The Wanderly brand mark: an aurora-filled rounded square with a compass. */
function BrandMark({ size = 40 }: BrandMarkProps) {
  return (
    <Aurora
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
      }}
    >
      <Icon as={Compass} size={size * 0.56} className="text-white" />
    </Aurora>
  )
}

export { BrandMark }
