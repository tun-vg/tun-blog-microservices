import { useEffect, useState, useRef } from 'react';
import { viewPost } from '../api/post/post';

const useTrackPostView = (postId, postContainerRef) => {
  const [isTimePassed, setIsTimePassed] = useState(false);
  const[isScrolled, setIsScrolled] = useState(false);
  const [hasCounted, setHasCounted] = useState(false);

  useEffect(() => {
    let timer;
    let timeAccumulated = 0;
    const interval = 1000;

    const checkTime = () => {
      if (!document.hidden) {
        timeAccumulated += interval;
        if (timeAccumulated >= 30000) {
          setIsTimePassed(true);
        }
      }
    };

    if (!isTimePassed) {
      timer = setInterval(checkTime, interval);
    }

    return () => clearInterval(timer);
  },[isTimePassed]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolled) return;

      const container = postContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const elementHeight = container.scrollHeight;
      const windowHeight = window.innerHeight;

      const scrolledDistance = windowHeight - rect.top;
      const scrollPercentage = (scrolledDistance / elementHeight) * 100;

      if (scrollPercentage >= 40) {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled, postContainerRef]);

  useEffect(() => {
    if (isTimePassed && isScrolled && !hasCounted) {
      setHasCounted(true);

      const viewed_post = localStorage.getItem(`viewed_post_${postId}`);
      if (!viewed_post){
        viewPost(postId);
        sessionStorage.setItem(`viewed_post_${postId}`, true)
      }
    }
  },[isTimePassed, isScrolled, hasCounted, postId]);

  return { isTimePassed, isScrolled, hasCounted };
};

export default useTrackPostView;