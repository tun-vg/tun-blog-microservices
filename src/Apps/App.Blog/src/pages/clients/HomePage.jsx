import PopularPosts from '../../components/home/PopularPosts';
import FeaturedPosts from '../../components/home/FeaturedPosts';
import RecommendedPosts from '../../components/home/RecommendedPosts.jsx';
import TopicsSection from '../../components/home/TopicsSection';
import SubscribeSection from '../../components/home/SubscribeSection.jsx';
import BackToTopButton from '../../components/common/Button/BackToTopButton.jsx';

const HomePage = () => {

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className='flex-1 pb-12'>
        <div className='container-app'>
          <div className='bg-white rounded-2xl shadow-sm px-3 sm:px-6 py-2 mt-4'>
            <PopularPosts />
            <FeaturedPosts />

            <div className='flex flex-col lg:flex-row gap-x-8'>
              <div className='w-full lg:w-[65%]'>
                <RecommendedPosts />
              </div>

              <div className='w-full lg:w-[35%] py-6'>
                <div className="lg:sticky lg:top-20 flex flex-col gap-y-1">
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