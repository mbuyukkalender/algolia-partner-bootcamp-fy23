// This is the homepage, which you see when you first visit the site.
// By default it contains some banners and carousels
import { lazy, Suspense, useRef, useState } from 'react'

// Fetch values from state
import { useRecoilValue } from 'recoil'

// Framer motion
import { AnimatePresence } from 'framer-motion'

//Use Translation
import { useTranslation } from 'react-i18next'

// Slider for recommend
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react'

// styles for Recommend HorizontalSlider
import '@algolia/ui-components-horizontal-slider-theme'

// Import screenShot/ images for the homepage
import homepage_1 from '@/assets/homepage/homepage_1.webp'
import homepage_2 from '@/assets/homepage/homepage_2.webp'

// should carousel be shown or not and config for carousel
import { carouselConfig, isCarouselLoaded } from '@/config/carouselConfig'

import CustomHomeBanners from '@/components/banners/HomeBanners'
import CustomSkeleton from '@/components/skeletons/CustomSkeleton'

//  should federated search be shown or not
import {
  shouldHaveCarousels,
  shouldHaveFederatedSearch,
  shouldHaveTrendingProducts,
} from '@/config/featuresConfig'
import { shouldHaveOpenFederatedSearch } from '@/config/federatedConfig'

import { windowSize } from '@/hooks/useScreenSize'

import { searchClientCreds, mainIndex, recommendClient, mainIndexClient} from '@/config/algoliaEnvConfig';
import algoliarecommend from '@algolia/recommend';
import {TrendingItems} from '@algolia/recommend-react';
import RelatedItem from '@/components/recommend/relatedItems/RelatedProducts';

const FederatedSearch = lazy(() =>
  import('@/components/federatedSearch/FederatedSearch')
)

const HomeCarousel = lazy(() => import('@/components/carousels/HomeCarousel'))

const Trending = lazy(() =>
  import('@/components/recommend/trending/TrendingProducts')
)
// Import scoped SCSS
import './homepage.scss'

const HomePage = ({ query, refine, results }) => {
  const carouselLoaded = useRecoilValue(isCarouselLoaded)

  const [isHomepage1Loaded, setHomepage1Loaded] = useState(false)
  const [isHomepage2Loaded, setHomepage2Loaded] = useState(false)

  // Boolean value which determines if federated search is shown or not, default is false
  const isFederated = useRecoilValue(shouldHaveFederatedSearch)
  const isCarousel = useRecoilValue(shouldHaveCarousels)
  const isFederatedOpen = useRecoilValue(shouldHaveOpenFederatedSearch)
  const HomePage = useRef(false)

  // Boolean value which determines if federated search is shown or not, default is false
  const shouldHaveTrendingProductsValue = useRecoilValue(
    shouldHaveTrendingProducts
  )

  // access the main index from recoil state
  const indexName = useRecoilValue(mainIndex)

  const { mobile } = useRecoilValue(windowSize)

  // Import and use translation
  const { t } = useTranslation('translation', {
    keyPrefix: 'homePage',
  })

  return (
    // Framer motion wrapper
    <div className="homepage" ref={HomePage}>
      {isFederated && isFederatedOpen && (
        <Suspense>
          <AnimatePresence>
            <FederatedSearch query={query} refine={refine} results={results} />
          </AnimatePresence>
        </Suspense>
      )}

      {/* Load custom banners */}
      <CustomHomeBanners />

      {isCarousel &&
        carouselConfig.map((carousel, i) => (
          <HomeCarousel
            key={i}
            context={carousel.context}
            title={t('titleCarousels')[i]}
          />
        ))}

      {/* ==================================================================== */}
      {/*                           PARTNER BOOTCAMP                           */}
      {/* ==================================================================== */}
      
      {/* ________________ RECOMMEND LAB N°3 - TRENDING ITEMS CAROUSEL _________________ */}
      
      {carouselLoaded && (
        <section className="recommend">
          {shouldHaveTrendingProductsValue && (
            <Suspense>
              <h3 className="title">{t('titleTrendingProducts')}</h3>
              {/* IMPLEMENT TRENDING ITEMS CAROUSEL HERE */}
              <TrendingItems
                recommendClient={recommendClient}
                indexName={indexName}
                itemComponent={RelatedItem}
                view={HorizontalSlider}
                maxRecommendations={12}
                queryParameters={{
                  filters: "brand:jordan OR brand:'nike performance'"
                }}
              />
            </Suspense>
          )}
        </section>
      )}
      {/* ____________________________________________________________________ */}

    </div>
  )
}

export default HomePage
