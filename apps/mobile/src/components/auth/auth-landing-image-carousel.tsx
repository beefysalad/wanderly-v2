import { useEffect, useRef } from "react"
import { Animated, type ImageSourcePropType, View } from "react-native"

const SLIDE_DURATION_MS = 4800
const FADE_DURATION_MS = 900

const LANDING_IMAGES: ImageSourcePropType[] = [
  require("@/assets/images/auth/airplane-golden-hour.jpg"),
  require("@/assets/images/auth/philippines-palms.jpg"),
  require("@/assets/images/auth/mountain-water.jpg"),
  require("@/assets/images/auth/mt-fuji-japan.jpg"),
  require("@/assets/images/auth/philippines-boat.jpg"),
  require("@/assets/images/auth/philippines-coast.jpg"),
]

function AuthLandingImageCarousel() {
  const activeIndex = useRef(0)
  const isAnimating = useRef(false)
  const imageOpacities = useRef(
    LANDING_IMAGES.map((_, index) => new Animated.Value(index === 0 ? 1 : 0))
  )

  useEffect(() => {
    let isActive = true
    const timer = setInterval(() => {
      if (isAnimating.current) return

      const currentIndex = activeIndex.current
      const upcomingIndex = (currentIndex + 1) % LANDING_IMAGES.length
      const currentOpacity = imageOpacities.current[currentIndex]
      const upcomingOpacity = imageOpacities.current[upcomingIndex]

      isAnimating.current = true
      upcomingOpacity.setValue(0)
      Animated.parallel([
        Animated.timing(currentOpacity, {
          toValue: 0,
          duration: FADE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(upcomingOpacity, {
          toValue: 1,
          duration: FADE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        isAnimating.current = false
        if (!finished || !isActive) return

        activeIndex.current = upcomingIndex
        imageOpacities.current.forEach((opacity, index) => {
          opacity.setValue(index === upcomingIndex ? 1 : 0)
        })
      })
    }, SLIDE_DURATION_MS)

    return () => {
      isActive = false
      clearInterval(timer)
      isAnimating.current = false
      imageOpacities.current.forEach((opacity) => opacity.stopAnimation())
    }
  }, [])

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden bg-black"
    >
      {LANDING_IMAGES.map((source, index) => {
        return (
          <Animated.Image
            key={index}
            source={source}
            resizeMode="cover"
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              opacity: imageOpacities.current[index],
              width: "100%",
            }}
          />
        )
      })}
    </View>
  )
}

export { AuthLandingImageCarousel }
