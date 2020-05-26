import { useEffect } from "react"
import { Router } from "next/router"
import NProgress from 'nprogress'

const ProgressBar = () => {
  let timer: number | null = null

  const routeChangeStart = () => {
    NProgress.set(0.3);
    NProgress.start();
  };

  const routeChangeEnd = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      NProgress.done(true);
    }, 200)
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeEnd);
  }, [])

  return null
}

export default ProgressBar