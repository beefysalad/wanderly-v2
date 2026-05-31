import { Image, type ImageSource } from "expo-image"
import { useEffect, useState } from "react"
import { View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

const SLIDE_DURATION_MS = 4800
const FADE_DURATION_MS = 900
const KEN_BURNS_DURATION_MS = SLIDE_DURATION_MS * 2

const LANDING_IMAGES: ImageSource[] = [
  require("@/assets/images/auth/airplane-golden-hour.jpg"),
  require("@/assets/images/auth/philippines-palms.jpg"),
  require("@/assets/images/auth/mountain-water.jpg"),
  require("@/assets/images/auth/mt-fuji-japan.jpg"),
  require("@/assets/images/auth/philippines-boat.jpg"),
  require("@/assets/images/auth/philippines-coast.jpg"),
]

function AuthLandingImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Continuous, ping-ponging Ken Burns drift. Because it never resets, the
  // slow zoom/pan glides across the cross-dissolve without any visible pop.
  const scale = useSharedValue(1)
  const drift = useSharedValue(0)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.12, {
        duration: KEN_BURNS_DURATION_MS,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    )
    drift.value = withRepeat(
      withTiming(1, {
        duration: KEN_BURNS_DURATION_MS,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    )

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LANDING_IMAGES.length)
    }, SLIDE_DURATION_MS)

    return () => clearInterval(timer)
  }, [drift, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: -12 + drift.value * 24 },
      { translateY: 8 - drift.value * 16 },
    ],
  }))

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden bg-black"
    >
      <Animated.View
        style={[
          { position: "absolute", inset: 0, height: "100%", width: "100%" },
          animatedStyle,
        ]}
      >
        <Image
          source={LANDING_IMAGES[activeIndex]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={{ duration: FADE_DURATION_MS, effect: "cross-dissolve" }}
          style={{ height: "100%", width: "100%" }}
        />
      </Animated.View>
    </View>
  )
}

export { AuthLandingImageCarousel }
