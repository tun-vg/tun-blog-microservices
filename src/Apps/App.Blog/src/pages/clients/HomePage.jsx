import PopularPosts from '../../components/home/PopularPosts';
import FeaturedPosts from '../../components/home/FeaturedPosts';
import RecommendedPosts from '../../components/home/RecommendedPosts.jsx';
import TopicsSection from '../../components/home/TopicsSection';
import SubscribeSection from '../../components/home/SubscribeSection.jsx';
import BackToTopButton from '../../components/common/Button/BackToTopButton.jsx';

const HomePage = () => {

  return (
    <div>
      <main className='flex-1 pb-10 h-fit'>
        <div className='container-app'>

          {/* Pho bien tren spiderum */}
          <div className=''>
            <PopularPosts />

            <FeaturedPosts />

            <div>
              <div className='flex gap-x-12'>
                <div className='w-[70%]'>
                  <RecommendedPosts />
                </div>

                <div className='h-32 w-[30%]'>
                  <TopicsSection />

                  <SubscribeSection />
                </div>
              </div>
            </div>
          </div>

          <BackToTopButton />
        </div>
      </main>
    </div>
  );
};

export default HomePage;